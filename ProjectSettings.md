# Unity Project Settings for Skyward Skip

## Recommended Unity Settings

### Project Settings

#### Player Settings
- **Company Name**: [Your Company Name]
- **Product Name**: Skyward Skip
- **Default Icon**: Use logo placeholder initially
- **Resolution and Presentation**:
  - Default Orientation: Portrait
  - Allowed Orientations: Portrait, Portrait Upside Down
  - Use 32-bit Display Buffer: Enabled (for better color quality)

#### Quality Settings
- **Mobile Optimized Levels**:
  - Simple: For older devices
  - Good: For mid-range devices  
  - Beautiful: For high-end devices
- **V Sync Count**: Don't Sync (for better performance)
- **Anti Aliasing**: 2x Multi Sampling (balance of quality/performance)

#### Physics 2D Settings
- **Gravity**: (0, -9.81) - Standard gravity for jumping mechanics
- **Default Material**: Create a bouncy material for platforms
- **Velocity Iterations**: 8 (default)
- **Position Iterations**: 3 (default)

#### Input Manager
- **Touch Support**: Enabled
- **Accelerometer Frequency**: 60Hz (for tilt controls)

### Build Settings

#### Target Platforms
1. **Android**
   - Minimum API Level: 21 (Android 5.0)
   - Target API Level: Latest
   - Scripting Backend: IL2CPP
   - Architecture: ARM64

2. **iOS**
   - Target minimum iOS Version: 11.0
   - Architecture: ARM64
   - Scripting Backend: IL2CPP

#### Optimization Settings
- **Stripping Level**: Medium (for smaller build size)
- **Script Call Optimization**: Fast but no Exceptions
- **Vertex Compression**: Mixed (for smaller builds)

### Graphics Settings

#### Built-in Render Pipeline (Recommended for 2D)
- **Color Space**: Gamma (better performance on mobile)
- **Graphics APIs**: 
  - Android: OpenGLES3, OpenGLES2
  - iOS: Metal

#### Texture Settings
- **Max Texture Size**: 2048 (for mobile optimization)
- **Texture Compression**: 
  - Android: ETC2
  - iOS: ASTC

### Audio Settings
- **DSP Buffer Size**: Best Performance
- **Sample Rate Setting**: 22050 Hz (sufficient for casual game audio)
- **Audio Compression**: Vorbis (good quality/size ratio)

## Scene Setup Checklist

### TitleScreen Scene
- [ ] Canvas with Canvas Scaler (Scale With Screen Size)
- [ ] Reference Resolution: 1080x1920 (common mobile resolution)
- [ ] UI Scale Mode: Scale With Screen Size
- [ ] Match: 0.5 (balance between width and height)
- [ ] EventSystem for UI interactions
- [ ] Main Camera with Orthographic projection

### MainGame Scene (Future)
- [ ] Main Camera with Camera2D component
- [ ] Physics 2D settings applied
- [ ] Background elements
- [ ] UI Canvas for HUD elements

## Performance Optimization Tips

1. **Sprite Atlas**: Group related sprites into atlases
2. **Object Pooling**: For platforms and collectibles
3. **Culling**: Disable off-screen objects
4. **Batching**: Use sprite batching for similar objects
5. **Profiler**: Regular performance monitoring

## Testing Devices

### Recommended Test Resolutions
- 1080x1920 (16:9) - Standard
- 1080x2340 (19.5:9) - Modern phones
- 768x1024 (4:3) - Tablets
- 1125x2436 (19.5:9) - iPhone X series

### Performance Targets
- **Frame Rate**: Consistent 60 FPS
- **Memory Usage**: < 100MB RAM
- **Battery Usage**: Minimal drain
- **Load Time**: < 3 seconds
