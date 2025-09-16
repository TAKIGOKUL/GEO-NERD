# 🌍 Geo-Nerd Mobile
https://takigokul.github.io/GEO-NERD/

A modern, mobile-first geography guessing game built with React and TypeScript, featuring an ash-colored glassmorphic design system.

## ✨ Features

### 🎮 Game Mode
- **Classic**: Traditional geography challenge with 5 rounds
  - Player ID required before starting
  - Interactive world map with Leaflet.js
  - Progressive hint system with penalty scoring

### 🎯 Core Gameplay
- Interactive world map with Leaflet.js
- One guess per location for strategic gameplay
- Progressive hint system with penalty scoring
- Real-time distance calculation and scoring
- Comprehensive location information and Wikipedia links

### 🎨 Design System
- **Ash-colored glassmorphic UI** with backdrop blur effects
- Mobile-first responsive design
- Smooth animations and micro-interactions
- High contrast accessibility-first approach
- Custom CSS variables for consistent theming

### 📱 Mobile Optimizations
- Touch-friendly interactions
- Optimized for all screen sizes
- Gesture support for map navigation
- Progressive Web App capabilities
- Fast loading and smooth performance

### 🏆 Advanced Features
- Multi-dimensional scoring system
- Achievement badges and milestones
- Performance tracking and statistics
- User progression with XP system
- Cultural context and educational content

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd geo-nerd-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and go to `http://localhost:3000`

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Mapping**: Leaflet.js with React-Leaflet
- **Styling**: CSS3 with custom properties and glassmorphism
- **Build Tool**: Create React App
- **Deployment**: Netlify-ready with automated CI/CD

## 📁 Project Structure

```
src/
├── components/
│   ├── StartScreen.tsx          # Game mode selection
│   ├── Game.tsx                 # Main game logic
│   ├── GameMap.tsx              # Interactive world map
│   ├── ImagePanel.tsx           # Location image and info
│   ├── Results.tsx              # Round results modal
│   └── FinalResults.tsx         # Game completion screen
├── data/
│   └── locations.ts             # Location database and utilities
├── App.tsx                      # Main application component
├── App.css                      # App-specific styles
└── index.css                    # Global styles and design system
```

## 🎨 Design System

### Color Palette
- **Ash Colors**: From `--ash-50` to `--ash-950` for consistent grayscale
- **Glassmorphic Backgrounds**: Semi-transparent with backdrop blur
- **Accent Colors**: Primary blue, secondary purple, success green, warning orange, error red

### Typography
- **Font Stack**: System fonts for optimal performance
- **Scale**: From `--font-size-xs` to `--font-size-4xl`
- **Weights**: Light (300) to Bold (700)

### Spacing & Layout
- **Spacing Scale**: From `--space-xs` to `--space-2xl`
- **Border Radius**: From `--radius-sm` to `--radius-2xl`
- **Shadows**: Multiple levels for depth and hierarchy

## 🎮 Game Mechanics

### Scoring System
- **Base Score**: 100 points minus distance penalty (1 point per 250km)
- **Hint Penalty**: -10 points per hint level used
- **Speed Bonus**: +10 points for quick guesses
- **Minimum Score**: 0 points (no negative scores)

### Hint System
- **Level 1**: Climate zone (-10 points)
- **Level 2**: Continent (-20 points)
- **Level 3**: Country (-30 points)
- **Level 4**: City (-40 points)

### Distance Calculation
Uses the Haversine formula for accurate distance calculation between GPS coordinates.

## 📱 Mobile Features

### Touch Interactions
- Optimized map controls for touch devices
- Swipe gestures for navigation
- Touch-friendly button sizes
- Responsive layout adaptation

### Performance
- Lazy loading for images
- Optimized bundle size
- Smooth 60fps animations
- Progressive enhancement

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

## 🎯 Future Enhancements

- [ ] Multiplayer functionality
- [ ] AI-generated challenges
- [ ] Augmented Reality mode
- [ ] Voice commentary
- [ ] User-generated content
- [ ] Advanced analytics dashboard

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@geonerd.com or create an issue in the repository.

---

**Geo-Nerd Mobile** - Master the World, One Location at a Time 🌍
