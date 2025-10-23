# Skyward Skip - Doodle Jump Clone

A mobile-friendly Doodle Jump clone built with Unity, targeting American casual gamers with simple, addictive gameplay featuring short sessions and high replay value.

## 🎮 Game Overview

**Genre**: Hyper-Casual  
**Platform**: Mobile (iOS/Android)  
**Target Audience**: American Casual Gamers, 18–45 years old  
**Session Length**: 30–60 seconds  
**Core Mechanic**: Tap-or-tilt-based jumping game

## 🎯 Key Features

- **One-Touch/Two-Tap Controls**: Simple tap left/right or tilt device to steer
- **Fast Sessions**: Quick 30-60 second gameplay sessions
- **High Replay Value**: High-score tracking and random platform layouts
- **Mobile Optimized**: Responsive UI for various screen ratios (16:9, 19.5:9)
- **Bright & Playful**: Flat 2D design with vibrant color palette

## 🏗️ Project Structure

```
/SkywardSkip
├── Assets/
│   ├── Placeholders/          # Temporary sprites and assets
│   │   ├── player_sprite.png
│   │   ├── platform_sprite.png
│   │   └── logo_sprite.png
│   ├── Scenes/               # Unity scenes
│   │   └── TitleScreen.unity
│   ├── Scripts/              # C# scripts organized by functionality
│   │   ├── UI/              # User interface scripts
│   │   │   └── TitleScreenUI.cs
│   │   ├── GameLogic/       # Core game mechanics
│   │   └── Utilities/       # Helper scripts and utilities
│   ├── Prefabs/             # Reusable game objects
│   └── Materials/           # Unity materials
├── .gitignore               # Unity-specific gitignore
└── README.md               # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Unity 2022.3 LTS or later
- Git for version control

### Initial Setup

1. **Clone/Download Project**
   ```bash
   git clone <repository-url>
   cd SkywardSkip
   ```

2. **Open in Unity**
   - Launch Unity Hub
   - Click "Open" and select the SkywardSkip folder
   - Unity will import the project and generate necessary files

3. **Title Screen Setup**
   - Open `Assets/Scenes/TitleScreen.unity`
   - Create a Canvas (UI > Canvas)
   - Set Canvas Scaler to "Scale With Screen Size" for mobile responsiveness
   - Add UI elements:
     - **Text**: "Skyward Skip" title (center, top)
     - **Button**: "Start" button (center, middle)  
     - **Image**: Logo placeholder (center, below title)
   - Attach `TitleScreenUI.cs` to the Canvas
   - Assign UI elements to script's serialized fields in Inspector

4. **Build Settings**
   - Add TitleScreen scene to Build Settings
   - Create MainGame scene (placeholder for core game loop)
   - Add MainGame scene to Build Settings

## 🎨 Design Guidelines

### Visual Style
- **Art Style**: Flat 2D with clean, simple shapes
- **Color Palette**: Bright, vibrant colors
- **UI/UX**: Simple and intuitive, optimized for one-handed play

### Technical Requirements
- **Framework**: Unity 2D with C#
- **Physics**: Unity's 2D physics system
- **Input**: Touch input with tilt support
- **Performance**: Optimized for mobile devices

## 📱 Mobile Optimization

- Responsive Canvas scaling for different screen ratios
- Touch-optimized UI elements with appropriate sizing
- Performance optimization for smooth 60fps gameplay
- Battery-efficient rendering and physics

## 🔧 Development Phases

### Phase 1: MVP Foundation ✅
- [x] Project structure setup
- [x] Title Screen UI implementation
- [x] Basic navigation framework

### Phase 2: Core Gameplay (Next)
- [ ] Player character controller
- [ ] Platform spawning system
- [ ] Basic physics and collision detection
- [ ] Camera following system

### Phase 3: Game Systems
- [ ] Score tracking and display
- [ ] Game Over screen
- [ ] High score persistence
- [ ] Basic sound effects

### Phase 4: Polish & Enhancement
- [ ] Power-ups and collectibles
- [ ] Character skins system
- [ ] Particle effects
- [ ] Background music and sound design

## 🧪 Testing Strategy

- **Unit Tests**: Core game mechanics (player movement, platform spawning)
- **Device Testing**: Various screen sizes and input methods
- **Performance Testing**: Frame rate and memory usage optimization

## 📝 Code Standards

- **Clean Code**: Clear variable names and comprehensive XML documentation
- **Modularity**: Separate concerns (UI, game logic, utilities)
- **Error Handling**: Robust error checking and user feedback
- **Performance**: Efficient algorithms and memory management

## 🎵 Audio Placeholder Functions

The project includes placeholder functions for:
- Button click sounds
- Jump sound effects
- Background music
- Game over sounds

These will be implemented in later development phases.

## 🤝 Contributing

This project follows Unity best practices and clean code principles. When contributing:

1. Follow the established folder structure
2. Use XML documentation for all public methods
3. Test on multiple screen resolutions
4. Ensure mobile-friendly performance

## 📄 License

[Add your license information here]

---

**Development Environment**: Windsurf AI Editor with Cascade Agent  
**Last Updated**: October 2024
