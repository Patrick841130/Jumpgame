# Placeholder Assets

This folder contains temporary placeholder assets for the Skyward Skip game development.

## Asset List

### Sprites Needed

1. **player_sprite.png** (32x32px)
   - Simple colored rectangle or circle
   - Bright color (e.g., blue, green)
   - Will represent the jumping character

2. **platform_sprite.png** (64x16px)
   - Rectangular platform sprite
   - Contrasting color (e.g., brown, gray)
   - Will be used for jumping platforms

3. **logo_sprite.png** (128x128px)
   - Simple logo placeholder
   - Can be text-based or geometric shape
   - Will be displayed on title screen

## Creating Placeholder Assets

### Option 1: Unity Built-in Sprites
- Use Unity's built-in sprites (white square, circle, etc.)
- Apply different colors via SpriteRenderer component
- No external files needed

### Option 2: Simple Image Files
- Create simple colored rectangles in any image editor
- Save as PNG with transparency
- Import into Unity and set Texture Type to "Sprite (2D and UI)"

## Replacement Guidelines

When replacing placeholders with final art:
1. Maintain the same dimensions for consistency
2. Update all prefabs that reference these sprites
3. Test on multiple screen resolutions
4. Ensure sprites work well with Unity's sprite packing

## Technical Specifications

- **Format**: PNG with transparency
- **Pixel Perfect**: Use pixel-perfect sprites for crisp mobile display
- **Compression**: Use appropriate compression settings for mobile
- **Pivot Point**: Set to center for most sprites, bottom for platforms if needed
