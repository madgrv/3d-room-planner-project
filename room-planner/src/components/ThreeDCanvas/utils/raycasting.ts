// raycasting.ts: Utility functions for raycasting and selection logic
// Extracted for testability and clarity

import * as THREE from 'three';
import { RoomElementType } from '../types';

export interface FurnitureRaycastHit {
  itemId: string;
  distance: number;
}

export interface RoomElementRaycastHit {
  element: RoomElementType;
  distance: number;
}

/**
 * Given an array of Three.js intersections, extract the closest furniture and room element hits.
 * Returns sorted lists for each type.
 */
export function extractRaycastHits(
  intersects: THREE.Intersection[]
): {
  furniture: FurnitureRaycastHit[];
  roomElements: RoomElementRaycastHit[];
} {
  const furniture: FurnitureRaycastHit[] = [];
  const roomElements: RoomElementRaycastHit[] = [];
  for (const intersect of intersects) {
    let obj: THREE.Object3D | null = intersect.object;
    const distance = intersect.distance;
    while (obj) {
      if (obj.userData && obj.userData.furnitureId) {
        furniture.push({ itemId: obj.userData.furnitureId, distance });
        break;
      }
      if (obj.userData && obj.userData.roomElement) {
        roomElements.push({ element: obj.userData.roomElement as RoomElementType, distance });
        break;
      }
      obj = obj.parent;
    }
  }
  return {
    furniture: furniture.sort((a, b) => a.distance - b.distance),
    roomElements: roomElements.sort((a, b) => a.distance - b.distance),
  };
}

/**
 * Returns the closest hit: prioritises furniture, then room element, otherwise null.
 */
export function getClosestSelection(
  intersects: THREE.Intersection[]
): { itemId: string | null; roomElement: RoomElementType | null } {
  const { furniture, roomElements } = extractRaycastHits(intersects);
  if (furniture.length > 0) {
    return { itemId: furniture[0].itemId, roomElement: null };
  }
  if (roomElements.length > 0) {
    return { itemId: null, roomElement: roomElements[0].element };
  }
  return { itemId: null, roomElement: null };
}
