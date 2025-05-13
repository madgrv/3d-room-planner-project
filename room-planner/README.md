# 3D Room Planner

A web-based 3D room planning application built with React, TypeScript, and Three.js (via React Three Fiber).

## Features

- Interactive 3D environment showing a customizable room
- Parametric room generation with adjustable dimensions
- Camera controls with preset views and smooth transitions
- Grid system with visual reference
- Basic object placement and manipulation capabilities
- Modern, responsive UI

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **Zustand** - State management
- **Tailwind CSS** - Styling

## Project Structure

```
room-planner/
├── public/                      # Static assets
│   └── assets/                  # Images, textures, etc.
├── src/                         # Source code
│   ├── components/              # React components
│   │   ├── ui/                  # UI components
│   │   ├── room/                # Room-related components
│   │   ├── controls/            # Camera and interaction controls
│   │   └── objects/             # Placeable 3D objects
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # State management
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Entry point
└── README.md                    # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Usage

- Adjust room dimensions using the control panel
- Switch between different camera views
- Place and move furniture by dragging
- Customize the room to your needs

## Development

This project uses Vite for fast development and building. Common commands:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally