using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// Manages the Title Screen UI, including title text, start button, and logo display.
/// Handles user interactions and scene transitions for the Skyward Skip game.
/// Compatible with both Legacy UI and UI Toolkit systems.
/// </summary>
public class TitleScreenUI : MonoBehaviour
{
    [Header("UI Components")]
    [SerializeField] private GameObject titleTextObject; // Reference to title text GameObject
    [SerializeField] private GameObject startButtonObject; // Reference to start button GameObject
    [SerializeField] private GameObject logoImageObject; // Reference to logo image GameObject
    
    [Header("UI Settings")]
    [SerializeField] private string gameTitle = "Skyward Skip";
    [SerializeField] private int titleFontSize = 48;
    [SerializeField] private Color titleColor = Color.white;
    [SerializeField] private string startButtonText = "Start";
    [SerializeField] private string gameSceneName = "MainGame";

    /// <summary>
    /// Initializes UI components and sets up button listeners on start.
    /// Validates all required components are assigned.
    /// </summary>
    private void Start()
    {
        InitializeUI();
        SetupButtonListeners();
    }

    /// <summary>
    /// Initializes all UI components with default values and validates references.
    /// </summary>
    private void InitializeUI()
    {
        // Validate component references
        if (!ValidateComponents())
        {
            Debug.LogError("TitleScreenUI: Missing UI component references. Please assign all required components in the Inspector.");
            return;
        }

        // Configure title text using TextMesh or UI Text component
        if (titleTextObject != null)
        {
            // Try to get UI Text component first
            var uiText = titleTextObject.GetComponent<UnityEngine.UI.Text>();
            if (uiText != null)
            {
                uiText.text = gameTitle;
                uiText.fontSize = titleFontSize;
                uiText.color = titleColor;
            }
            else
            {
                // Fallback to TextMesh component
                var textMesh = titleTextObject.GetComponent<TextMesh>();
                if (textMesh != null)
                {
                    textMesh.text = gameTitle;
                    textMesh.fontSize = titleFontSize;
                    textMesh.color = titleColor;
                }
            }
        }

        // Configure start button
        if (startButtonObject != null)
        {
            var button = startButtonObject.GetComponent<UnityEngine.UI.Button>();
            if (button != null)
            {
                var buttonText = startButtonObject.GetComponentInChildren<UnityEngine.UI.Text>();
                if (buttonText != null)
                {
                    buttonText.text = startButtonText;
                }
            }
        }

        // Configure logo
        if (logoImageObject != null)
        {
            var image = logoImageObject.GetComponent<UnityEngine.UI.Image>();
            if (image != null)
            {
                image.color = Color.white;
            }
        }

        Debug.Log("TitleScreenUI: UI components initialized successfully.");
    }

    /// <summary>
    /// Sets up button event listeners.
    /// </summary>
    private void SetupButtonListeners()
    {
        if (startButtonObject != null)
        {
            var button = startButtonObject.GetComponent<UnityEngine.UI.Button>();
            if (button != null)
            {
                button.onClick.AddListener(OnStartButtonClicked);
            }
        }
    }

    /// <summary>
    /// Validates that all required UI components are assigned.
    /// </summary>
    /// <returns>True if all components are valid, false otherwise.</returns>
    private bool ValidateComponents()
    {
        bool isValid = true;

        if (titleTextObject == null)
        {
            Debug.LogError("TitleScreenUI: Title Text GameObject is not assigned.");
            isValid = false;
        }

        if (startButtonObject == null)
        {
            Debug.LogError("TitleScreenUI: Start Button GameObject is not assigned.");
            isValid = false;
        }

        if (logoImageObject == null)
        {
            Debug.LogWarning("TitleScreenUI: Logo Image GameObject is not assigned (optional).");
        }

        return isValid;
    }

    /// <summary>
    /// Handles the Start button click event.
    /// Plays sound effect (placeholder) and loads the main game scene.
    /// </summary>
    private void OnStartButtonClicked()
    {
        Debug.Log("TitleScreenUI: Start button clicked.");
        
        // Placeholder for sound effect - to be implemented with audio system
        PlayButtonClickSound();
        
        // Load main game scene
        LoadGameScene();
    }

    /// <summary>
    /// Placeholder method for playing button click sound effect.
    /// To be implemented when audio system is added.
    /// </summary>
    private void PlayButtonClickSound()
    {
        // TODO: Implement sound effect
        Debug.Log("TitleScreenUI: Playing button click sound (placeholder).");
    }

    /// <summary>
    /// Loads the main game scene.
    /// Includes error handling for missing scenes.
    /// </summary>
    private void LoadGameScene()
    {
        try
        {
            Debug.Log($"TitleScreenUI: Loading scene '{gameSceneName}'.");
            SceneManager.LoadScene(gameSceneName);
        }
        catch (System.Exception e)
        {
            Debug.LogError($"TitleScreenUI: Failed to load scene '{gameSceneName}'. Error: {e.Message}");
            Debug.LogWarning("TitleScreenUI: Make sure the MainGame scene is added to Build Settings.");
        }
    }

    /// <summary>
    /// Cleanup method called when the object is destroyed.
    /// Removes button listeners to prevent memory leaks.
    /// </summary>
    private void OnDestroy()
    {
        if (startButtonObject != null)
        {
            var button = startButtonObject.GetComponent<UnityEngine.UI.Button>();
            if (button != null)
            {
                button.onClick.RemoveListener(OnStartButtonClicked);
            }
        }
    }

    /// <summary>
    /// Editor-only method to validate setup in the Inspector.
    /// </summary>
    private void OnValidate()
    {
        #if UNITY_EDITOR
        if (titleFontSize <= 0)
        {
            titleFontSize = 48;
        }
        #endif
    }
}
