// ViewIcons: SVG icons for the view controls in the 3D room planner
// Team note: These icons represent standard views in 3D software

import React from 'react';

// Top view (looking down from above)
export const TopViewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <line x1="3" y1="3" x2="5" y2="5" />
    <line x1="21" y1="3" x2="19" y2="5" />
    <line x1="3" y1="21" x2="5" y2="19" />
    <line x1="21" y1="21" x2="19" y2="19" />
  </svg>
);

// Front view (looking at the front of the room)
export const FrontViewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

// Side view (looking at the side of the room)
export const SideViewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 12 L20 12" />
    <path d="M4 8 L20 8" />
    <path d="M4 16 L20 16" />
  </svg>
);

// Corner/Perspective view (isometric view of the room)
export const CornerViewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 5 L17 5 L17 15 L7 15 Z" />
    <path d="M17 5 L20 2 L20 12 L17 15" />
    <path d="M7 15 L4 18 L4 8 L7 5" />
    <path d="M4 18 L14 18 L17 15" />
    <path d="M20 2 L14 2 L7 5" />
  </svg>
);
