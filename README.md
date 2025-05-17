# 3D Helicopter Game

A simple browser-based 3D helicopter game built with Three.js where you pilot a helicopter, shoot missiles, and destroy targets.

## Overview

This game demonstrates basic 3D game development concepts using Three.js, including:
- 3D object manipulation
- Camera controls and smooth transitions
- Collision detection
- User input handling
- Basic physics simulation

## Features

- **Helicopter Controls**:
  - Forward/Backward movement (S/W keys)
  - Left/Right rotation (A/D keys)
  - Vertical movement (Q/E keys)
  - Missile shooting (Spacebar)

- **Camera System**:
  - Dynamic follow camera
  - Smooth camera tilting during turns (25-degree max tilt)
  - Lerp-based camera transitions

- **Game Elements**:
  - Destructible targets
  - Ground platform for reference
  - Missile projectiles
  - Rotating helicopter rotor

- **User Interface**:
  - Controls display in top-left corner
  - Responsive design
  - Clean, minimal HUD

## How to Play

1. Open `index.html` in a modern web browser
2. Use the following controls:
   - `S` - Move Forward
   - `W` - Move Backward
   - `A` - Turn Left
   - `D` - Turn Right
   - `Q` - Rise
   - `E` - Descend
   - `Spacebar` - Shoot Missiles

## Technical Details

- Built with Three.js r128
- Pure JavaScript implementation
- No additional dependencies required

## Changelog

### Version 1.1
- Added ground platform for better spatial reference
- Implemented vertical movement (Q/E keys)
- Added smooth camera tilting during turns
- Fixed inverted W/S controls
- Added controls display to UI
- Improved collision detection with ground
- Adjusted initial object heights
- Added lerp-based camera transitions

### Version 1.0
- Initial release
- Basic helicopter movement
- Missile shooting mechanics
- Destructible objects
- Follow camera
- Basic collision detection

## Future Improvements
- Add score system
- Implement particle effects for explosions
- Add sound effects
- Create more varied destructible objects
- Add difficulty levels
- Implement power-ups
- Add multiplayer support

## Development

To modify the game:
1. Clone the repository
2. Make changes to `game.js` for game logic
3. Modify `index.html` for UI changes
4. Test in a web browser (no build step required)

## Browser Compatibility

Tested and working in:
- Chrome
- Firefox
- Edge
- Safari

## License

This project is open source and available for educational purposes. 