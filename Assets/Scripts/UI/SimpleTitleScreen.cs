using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// Simple Title Screen manager that works without UI package dependencies.
/// Uses basic Unity components and input detection.
/// </summary>
public class SimpleTitleScreen : MonoBehaviour
{
    [Header("Display Settings")]
    [SerializeField] private string gameTitle = "Skyward Skip";
    [SerializeField] private string startPrompt = "Tap to Start";
    [SerializeField] private string gameSceneName = "MainGame";
    
    [Header("Visual Settings")]
    [SerializeField] private Color backgroundColor = new Color(0.2f, 0.6f, 1.0f); // Sky blue
    [SerializeField] private Color textColor = Color.white;
    
    private Camera mainCamera;
    private bool gameStarted = false;

    /// <summary>
    /// Initialize the title screen
    /// </summary>
    private void Start()
    {
        mainCamera = Camera.main;
        if (mainCamera == null)
        {
            mainCamera = FindObjectOfType<Camera>();
        }
        
        // Set background color
        if (mainCamera != null)
        {
            mainCamera.backgroundColor = backgroundColor;
        }
        
        Debug.Log("SimpleTitleScreen: Title screen initialized. Tap anywhere to start!");
    }

    /// <summary>
    /// Handle input detection
    /// </summary>
    private void Update()
    {
        if (gameStarted) return;
        
        // Check for mouse click or touch input
        bool inputDetected = false;
        
        // Mouse input (for testing in editor)
        if (Input.GetMouseButtonDown(0))
        {
            inputDetected = true;
        }
        
        // Touch input (for mobile)
        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
        {
            inputDetected = true;
        }
        
        // Keyboard input (for testing)
        if (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.Return))
        {
            inputDetected = true;
        }
        
        if (inputDetected)
        {
            StartGame();
        }
    }

    /// <summary>
    /// Start the game
    /// </summary>
    private void StartGame()
    {
        if (gameStarted) return;
        
        gameStarted = true;
        Debug.Log("SimpleTitleScreen: Starting game...");
        
        // Try to load the main game scene
        try
        {
            SceneManager.LoadScene(gameSceneName);
        }
        catch (System.Exception e)
        {
            Debug.LogError($"SimpleTitleScreen: Could not load scene '{gameSceneName}'. Error: {e.Message}");
            Debug.LogWarning("SimpleTitleScreen: Creating a basic game scene instead...");
            CreateBasicGameScene();
        }
    }

    /// <summary>
    /// Create a basic game scene if MainGame scene doesn't exist
    /// </summary>
    private void CreateBasicGameScene()
    {
        // Clear the screen and show a basic game message
        if (mainCamera != null)
        {
            mainCamera.backgroundColor = Color.black;
        }
        
        Debug.Log("Basic Game Scene: Game would start here!");
        Debug.Log("Next step: Implement player controller and platforms");
    }

    /// <summary>
    /// Draw simple UI using OnGUI (works without UI package)
    /// </summary>
    private void OnGUI()
    {
        if (gameStarted) return;
        
        // Set up GUI style
        GUIStyle titleStyle = new GUIStyle(GUI.skin.label);
        titleStyle.fontSize = 48;
        titleStyle.normal.textColor = textColor;
        titleStyle.alignment = TextAnchor.MiddleCenter;
        titleStyle.fontStyle = FontStyle.Bold;
        
        GUIStyle promptStyle = new GUIStyle(GUI.skin.label);
        promptStyle.fontSize = 24;
        promptStyle.normal.textColor = textColor;
        promptStyle.alignment = TextAnchor.MiddleCenter;
        
        // Calculate positions
        float screenWidth = Screen.width;
        float screenHeight = Screen.height;
        
        // Draw title
        Rect titleRect = new Rect(0, screenHeight * 0.3f, screenWidth, 60);
        GUI.Label(titleRect, gameTitle, titleStyle);
        
        // Draw start prompt
        Rect promptRect = new Rect(0, screenHeight * 0.6f, screenWidth, 30);
        GUI.Label(promptRect, startPrompt, promptStyle);
        
        // Draw instructions
        GUIStyle instructionStyle = new GUIStyle(GUI.skin.label);
        instructionStyle.fontSize = 16;
        instructionStyle.normal.textColor = Color.gray;
        instructionStyle.alignment = TextAnchor.MiddleCenter;
        
        Rect instructionRect = new Rect(0, screenHeight * 0.8f, screenWidth, 20);
        GUI.Label(instructionRect, "Mouse, Touch, or Space/Enter to start", instructionStyle);
    }
}
