/**
 * 🎮 Rootintootin Game SDK
 * 
 * A structured SDK for Rootintootin games to interact with the parent platform.
 * 

 * 
 * // Modern Usage
 * await Rootintootin.init();
 * await Rootintootin.game.end(100);
 * 
 * // Auto Mode (default)
 * - Game start: Automatically called when GAME_INIT is received
 * - Game end: Automatically detected when #game-over element becomes visible
 * 
 * // Legacy Usage (Deprecated but supported)
 * await callGameAPI(...);
 */

class RootintootinSDK {
  constructor() {
    this._initialized = false;
    this._sessionToken = null;
    this._gameId = null;
    this._debug = false;
    this._autoStart = true; // 자동 게임 시작 활성화
    this._autoEnd = false; // 자동 게임 종료 감지 비활성화 (직접 endGame 호출 방식 사용)
    this._initDataPromise = null;
    this._gameEndObserver = null;
    this._gameEnded = false; // 중복 종료 방지
    this._initHandler = null; // GAME_INIT 리스너 참조
    this._gameEndRetryCount = 0; // 게임 종료 감지 재시도 카운트
    
    // Namespaces
    this.game = {
      start: this.startGame.bind(this),
      end: this.endGame.bind(this),
      exit: this.exitGame.bind(this), // 게임 나가기 (부모에게 종료 요청)
      getInitData: this.getInitData.bind(this),
      setupEndDetection: this.setupEndDetection.bind(this) // 수동 게임 종료 감지 설정
    };
    
    this.session = {
      getToken: () => this._sessionToken,
      getId: () => this._gameId
    };
    
    this.utils = {
      on: this.addEventListener.bind(this),
      off: this.removeEventListener.bind(this)
    };
    
    this.config = {
      setAutoStart: (enabled) => { this._autoStart = enabled; },
      setAutoEnd: (enabled) => { this._autoEnd = enabled; },
      setDebug: (enabled) => { this._debug = enabled; }
    };
    
    // 페이지 로드 시 즉시 GAME_INIT 메시지 리스너 등록
    this._setupInitListener();
  }
  
  /**
   * GAME_INIT 메시지 리스너를 미리 설정
   * 페이지 로드 전에 메시지가 올 수 있으므로 즉시 리스너 등록
   */
  _setupInitListener() {
    // 리스너 참조 저장 (나중에 제거하기 위해)
    this._initHandler = async (event) => {
      const messageData = event.data?.data || event.data;
      const messageType = messageData?.type || event.data?.type;
      
      // GAME_INIT 관련 메시지이거나 디버그 모드일 때만 로그
      if (messageType === 'GAME_INIT' || this._debug) {
        console.log('[Rootintootin SDK] _setupInitListener received message', {
          type: messageType,
          data: event.data,
          messageData: messageData,
          origin: event.origin,
          source: event.source === window.parent ? 'parent' : 'other',
          isParent: event.source === window.parent
        });
      }
      
      // 메시지 타입 확인 - event.data가 직접 GAME_INIT인 경우와 중첩된 경우 모두 처리
      if (event.data?.type === 'GAME_INIT' || messageData?.type === 'GAME_INIT') {
        const initData = event.data?.type === 'GAME_INIT' ? event.data : messageData;
        console.log('[Rootintootin SDK] GAME_INIT message received!', initData);
        
        // GAME_INIT 처리 후 리스너 제거 (중복 처리 방지)
        window.removeEventListener('message', this._initHandler);
        console.log('[Rootintootin SDK] GAME_INIT listener removed');
        
        this._gameId = initData.gameId;
        this._sessionToken = initData.sessionToken;
        this._initialized = true;
        this._gameEnded = false; // 새 세션이므로 리셋
        
        // 대기 중인 Promise가 있으면 resolve
        if (this._initDataPromise) {
          const { resolve } = this._initDataPromise;
          resolve({
            gameId: initData.gameId,
            sessionToken: initData.sessionToken,
          });
          this._initDataPromise = null;
        }
        
        // 자동 시작 기능 - sessionToken이 없을 때만 (아직 시작 안 됨)
        if (this._autoStart && !initData.sessionToken) {
          console.log('[Rootintootin SDK] Auto-starting game session...');
          try {
            await this.startGame();
            console.log('[Rootintootin SDK] Game session auto-started successfully');
            
            // DOM 로드 완료 후 게임 종료 감지 설정
            this._initGameEndDetection();
          } catch (e) {
            console.error('[Rootintootin SDK] Auto-start failed:', e);
          }
        } else if (initData.sessionToken) {
          // 이미 세션이 있는 경우에도 게임 종료 감지 설정
          this._initGameEndDetection();
        }
      }
    };
    
    window.addEventListener('message', this._initHandler);
  }

  /**
   * 게임 종료 감지 초기화
   */
  _initGameEndDetection() {
    console.log('[Rootintootin SDK] 🔍 _initGameEndDetection called', {
      autoEnd: this._autoEnd,
      readyState: document.readyState,
      sessionToken: this._sessionToken ? 'exists' : 'null',
      gameEnded: this._gameEnded
    });
    
    if (!this._autoEnd) {
      console.log('[Rootintootin SDK] ⚠️ autoEnd is disabled, skipping');
      return;
    }
    
    if (document.readyState === 'complete') {
      console.log('[Rootintootin SDK] 📄 Document ready, setting up detection now');
      this._setupGameEndDetection();
    } else {
      console.log('[Rootintootin SDK] ⏳ Document not ready, waiting for load event');
      window.addEventListener('load', () => {
        console.log('[Rootintootin SDK] 📄 Load event fired, setting up detection');
        this._setupGameEndDetection();
      });
    }
  }

  /**
   * 게임 종료 자동 감지 설정 (MutationObserver 사용)
   */
  _setupGameEndDetection() {
    console.log('[Rootintootin SDK] 🔧 _setupGameEndDetection called', {
      hasObserver: !!this._gameEndObserver,
      retryCount: this._gameEndRetryCount
    });
    
    // 이미 설정되어 있으면 스킵
    if (this._gameEndObserver) {
      console.log('[Rootintootin SDK] ⚠️ Observer already exists, skipping');
      return;
    }
    
    // game-over 요소 찾기 (여러 가능한 선택자 시도)
    const gameOverSelectors = ['#game-over', '.game-over', '[data-game-over]'];
    let gameOverElement = null;
    let foundSelector = null;
    
    for (const selector of gameOverSelectors) {
      gameOverElement = document.querySelector(selector);
      if (gameOverElement) {
        foundSelector = selector;
        break;
      }
    }
    
    console.log('[Rootintootin SDK] 🔍 Searching for game-over element', {
      selectors: gameOverSelectors,
      found: !!gameOverElement,
      foundSelector: foundSelector,
      element: gameOverElement
    });
    
    if (!gameOverElement) {
      // 요소가 없으면 재시도 (React 렌더링 대기)
      if (!this._gameEndRetryCount) this._gameEndRetryCount = 0;
      this._gameEndRetryCount++;
      
      if (this._gameEndRetryCount < 10) {
        console.log(`[Rootintootin SDK] ⏳ game-over element not found, retrying... (${this._gameEndRetryCount}/10)`);
        setTimeout(() => this._setupGameEndDetection(), 500);
        return;
      }
      
      console.log('[Rootintootin SDK] ❌ No game-over element found after retries, skipping auto-end detection');
      return;
    }
    
    this._gameEndRetryCount = 0; // 성공 시 리셋
    
    // 현재 요소 상태 확인
    const currentClasses = gameOverElement.className;
    const isCurrentlyHidden = gameOverElement.classList.contains('hidden');
    console.log('[Rootintootin SDK] ✅ game-over element found!', {
      selector: foundSelector,
      classes: currentClasses,
      isHidden: isCurrentlyHidden,
      display: gameOverElement.style.display,
      visibility: gameOverElement.style.visibility
    });
    
    console.log('[Rootintootin SDK] 👀 Setting up MutationObserver for game-end detection');
    
    // MutationObserver로 hidden 클래스 제거 감지
    this._gameEndObserver = new MutationObserver((mutations) => {
      console.log('[Rootintootin SDK] 🔔 MutationObserver triggered!', {
        mutationCount: mutations.length
      });
      
      for (const mutation of mutations) {
        const element = mutation.target;
        const hasHidden = element.classList.contains('hidden');
        const displayStyle = element.style.display;
        const visibilityStyle = element.style.visibility;
        const isVisible = !hasHidden && displayStyle !== 'none' && visibilityStyle !== 'hidden';
        
        console.log('[Rootintootin SDK] 📝 Mutation details', {
          type: mutation.type,
          attributeName: mutation.attributeName,
          oldValue: mutation.oldValue,
          newClasses: element.className,
          hasHidden: hasHidden,
          display: displayStyle,
          visibility: visibilityStyle,
          isVisible: isVisible,
          sessionToken: this._sessionToken ? 'exists' : 'null',
          gameEnded: this._gameEnded
        });
        
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
          
          if (isVisible && this._sessionToken && !this._gameEnded) {
            console.log('[Rootintootin SDK] 🎯 Game over detected! Calling _handleGameEnd()');
            this._handleGameEnd();
          } else {
            console.log('[Rootintootin SDK] ⏸️ Not triggering game end', {
              reason: !isVisible ? 'element not visible' : !this._sessionToken ? 'no session token' : 'game already ended'
            });
          }
        }
      }
    });
    
    this._gameEndObserver.observe(gameOverElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      attributeOldValue: true
    });
    
    console.log('[Rootintootin SDK] ✅ MutationObserver attached successfully');
  }
  
  /**
   * 게임 종료 감지 수동 설정 (공개 메서드)
   * 게임 페이지가 로드된 후 호출하여 game-over 요소 감지를 설정
   */
  setupEndDetection() {
    console.log('[Rootintootin SDK] 🎮 setupEndDetection() called manually');
    
    // 기존 Observer가 있으면 정리
    if (this._gameEndObserver) {
      console.log('[Rootintootin SDK] 🧹 Cleaning up existing observer');
      this._gameEndObserver.disconnect();
      this._gameEndObserver = null;
    }
    
    // 재시도 카운트 리셋
    this._gameEndRetryCount = 0;
    
    // 게임 종료 감지 설정
    this._setupGameEndDetection();
  }
  
  /**
   * 게임 종료 자동 처리
   */
  async _handleGameEnd() {
    console.log('[Rootintootin SDK] 🏁 _handleGameEnd called', {
      autoEnd: this._autoEnd,
      sessionToken: this._sessionToken ? 'exists' : 'null',
      gameEnded: this._gameEnded
    });
    
    if (!this._autoEnd || !this._sessionToken || this._gameEnded) {
      console.log('[Rootintootin SDK] ⚠️ _handleGameEnd skipped', {
        reason: !this._autoEnd ? 'autoEnd disabled' : !this._sessionToken ? 'no session token' : 'game already ended'
      });
      return;
    }
    
    this._gameEnded = true; // 중복 호출 방지
    console.log('[Rootintootin SDK] 🔒 Set _gameEnded = true (prevent duplicate calls)');
    
    // 점수 읽기 (여러 가능한 선택자 시도)
    const scoreSelectors = ['#final-score', '#score', '.final-score', '.score', '[data-score]'];
    let score = 0;
    let foundSelector = null;
    
    console.log('[Rootintootin SDK] 🔍 Searching for score element...');
    
    for (const selector of scoreSelectors) {
      const scoreElement = document.querySelector(selector);
      if (scoreElement) {
        const text = scoreElement.textContent || '0';
        const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
        console.log('[Rootintootin SDK] 📊 Score element found', {
          selector: selector,
          rawText: text,
          parsed: parsed
        });
        if (!isNaN(parsed)) {
          score = parsed;
          foundSelector = selector;
          break;
        }
      }
    }
    
    console.log('[Rootintootin SDK] 🎮 Game end detected!', {
      score: score,
      foundSelector: foundSelector,
      gameId: this._gameId,
      sessionToken: this._sessionToken ? this._sessionToken.substring(0, 10) + '...' : 'null'
    });
    
    try {
      console.log('[Rootintootin SDK] 📤 Calling endGame API...');
      await this.endGame(score);
      console.log('[Rootintootin SDK] ✅ Game session auto-ended successfully');
    } catch (e) {
      console.error('[Rootintootin SDK] ❌ Auto-end failed:', e);
    }
  }

  /**
   * Initialize the SDK
   * Waits for GAME_INIT message from parent
   * @param {Object} options - { debug: boolean, timeout: number, autoStart: boolean, autoEnd: boolean }
   */
  async init(options = {}) {
    console.log('[Rootintootin SDK] init called', options);
    if (this._initialized) return true;
    
    this._debug = options.debug || false;
    if (options.autoStart !== undefined) this._autoStart = options.autoStart;
    if (options.autoEnd !== undefined) this._autoEnd = options.autoEnd;
    
    try {
      const data = await this.getInitData(options.timeout || 5000);
      console.log('[Rootintootin SDK] init data', data);
      if (data) {
        this._gameId = data.gameId;
        this._sessionToken = data.sessionToken;
        this._initialized = true;
        this._log('SDK Initialized', data);
        return true;
      }
    } catch (e) {
      console.error('[Rootintootin SDK] Initialization failed:', e);
      throw e;
    }
    return false;
  }

  /**
   * Internal logger
   */
  _log(...args) {
    if (this._debug) {
      console.log('[Rootintootin SDK]', ...args);
    }
  }

  /**
   * Call API via parent window
   * @param {string} endpoint 
   * @param {object} options 
   */
  async call(endpoint, options = {}) {
    console.log('[Rootintootin SDK] call called', endpoint, options);
    return new Promise((resolve, reject) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const handleResponse = (event) => {
        if (event.data?.type === 'GAME_API_RESPONSE' && event.data?.requestId === requestId) {
          window.removeEventListener('message', handleResponse);
          
          // Success or 409 (Conflict - Game already started) should be treated as success for data retrieval
          if (event.data.success || event.data.status === 409 || event.data.httpStatus === 409) {
            resolve(event.data.data);
          } else {
            reject(new Error(event.data.error || 'API request failed'));
          }
        }
      };
      
      window.addEventListener('message', handleResponse);
      
      if (window.parent) {
        // Auto-inject session token if available and not present
        const body = options.body || {};
        if (this._sessionToken && !body.sessionToken) {
          body.sessionToken = this._sessionToken;
        }
        window.parent.postMessage({
          type: 'GAME_API_REQUEST',
          requestId,
          endpoint,
          method: options.method || 'GET',
          body: body,
        }, '*');
      } else {
        window.removeEventListener('message', handleResponse);
        reject(new Error('Parent window not available'));
      }
      
      setTimeout(() => {
        window.removeEventListener('message', handleResponse);
        reject(new Error('API request timeout'));
      }, 30000);
    });
  }

  /**
   * Get game initialization data
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   */
  getInitData(timeout = 5000) {
    console.log('[Rootintootin SDK] getInitData called', timeout);
    return new Promise((resolve, reject) => {
      // Return cached if already initialized
      console.log('[Rootintootin SDK] getInitData cached', this._initialized, this._gameId, this._sessionToken);
      if (this._initialized && this._gameId && this._sessionToken) {
        resolve({
          gameId: this._gameId,
          sessionToken: this._sessionToken
        });
        return;
      }
      
      // Timeout 설정
      const timeoutId = setTimeout(() => {
        if (this._initDataPromise && this._initDataPromise.resolve === resolve) {
          this._initDataPromise = null;
          console.warn('[Rootintootin SDK] getInitData timeout - GAME_INIT message not received');
          reject(new Error('GAME_INIT message timeout. Make sure the parent window sends GAME_INIT message.'));
        }
      }, timeout);
      
      // 이미 초기화 리스너가 설정되어 있으므로, Promise만 저장하고 대기
      // resolve 시 timeout 정리
      const wrappedResolve = (value) => {
        clearTimeout(timeoutId);
        if (this._initDataPromise && this._initDataPromise.resolve === resolve) {
          this._initDataPromise = null;
        }
        resolve(value);
      };
      
      this._initDataPromise = { resolve: wrappedResolve, reject };
    });
  }

  /**
   * Start the game session
   * Note: Usually called automatically when autoStart is enabled
   */
  async startGame() {
    console.log('[Rootintootin SDK] startGame called');
    if (!this._gameId) throw new Error('SDK not initialized');
    
    try {
      const response = await this.call(`/games/${this._gameId}/play/start`, {
        method: 'POST',
        body: {}
      });
      // Update session token if present in response (even from 409)
      if (response && response.sessionToken) {
        this._sessionToken = response.sessionToken;
        this._gameEnded = false; // 새 세션 시작
        this._log('Session Token Updated via startGame', this._sessionToken);
      }
      return response;
    } catch (e) {
      console.error('[Rootintootin SDK] startGame failed:', e);
      throw e;
    }
  }

  /**
   * End the game session
   * Note: Usually called automatically when autoEnd is enabled and game-over element becomes visible
   * @param {number} score 
   * @param {Object} extraData 
   */
  async endGame(score, extraData = {}) {
    console.log('[Rootintootin SDK] endGame called', score, extraData);
    if (!this._gameId) throw new Error('SDK not initialized');
    if (!this._sessionToken) {
      console.warn('[Rootintootin SDK] No session token, skipping endGame');
      return null;
    }
    
    this._gameEnded = true;
    
    const result = await this.call(`/games/${this._gameId}/play/end`, {
      method: 'POST',
      body: {
        score: score,
        ...extraData
      }
    });
    
    console.log('[Rootintootin SDK] ✅ Game ended successfully');
    
    return result;
  }

  /**
   * Exit the game (request parent to close the game)
   * 게임 나가기 - 부모 프레임에 종료 요청
   */
  exitGame() {
    console.log('[Rootintootin SDK] 🚪 Requesting game exit...');
    
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'GAME_EXIT',
      }, '*');
    } else {
      // 부모가 없으면 홈으로 이동
      console.log('[Rootintootin SDK] No parent frame, redirecting to home');
      window.location.href = '/';
    }
  }

  /**
   * Reset game state for replay
   */
  reset() {
    this._gameEnded = false;
    this._sessionToken = null;
    this._initialized = false;
    this._gameId = null;
    this._gameEndRetryCount = 0;
    
    // 기존 게임 종료 Observer 정리
    if (this._gameEndObserver) {
      this._gameEndObserver.disconnect();
      this._gameEndObserver = null;
    }
    
    // 리스너는 계속 유지됨 (제거하지 않음)
    console.log('[Rootintootin SDK] Reset complete, ready for next GAME_INIT');
  }

  addEventListener(event, callback) {
    window.addEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    window.removeEventListener(event, callback);
  }
}

// Create Global Instance
const rootintootin = new RootintootinSDK();

// Export to window
if (typeof window !== 'undefined') {
  window.Rootintootin = rootintootin;
  
  // Legacy alias for backward compatibility
  window.ArcadeFi = rootintootin;
  
  // -----------------------------------------------------------
  // Backward Compatibility Layer
  // -----------------------------------------------------------
  
  /**
   * @deprecated Use Rootintootin.call() instead
   */
  window.callGameAPI = async (endpoint, options) => {
    console.log('[Rootintootin SDK] global callGameAPI called', endpoint, options);
    console.warn('[Deprecation] callGameAPI is deprecated. Use Rootintootin.call() instead.');
    return rootintootin.call(endpoint, options);
  };

  /**
   * @deprecated Use Rootintootin.game.getInitData() instead
   */
  window.getGameInitData = async () => {
    console.log('[Rootintootin SDK] global getGameInitData called');
    console.warn('[Deprecation] getGameInitData is deprecated. Use Rootintootin.game.getInitData() instead.');
    return rootintootin.getInitData();
  };

  /**
   * @deprecated Use Rootintootin.game.end() instead
   */
  window.endGameSession = async (gameId, score, sessionToken) => {
    console.log('[Rootintootin SDK] global endGameSession called', gameId, score, sessionToken);
    console.warn('[Deprecation] endGameSession is deprecated. Use Rootintootin.game.end() instead.');
    // For legacy calls, we respect the passed arguments even if they differ from internal state
    return rootintootin.call(`/games/${gameId}/play/end`, {
      method: 'POST',
      body: {
        score: score,
        sessionToken: sessionToken
      }
    });
  };
}
