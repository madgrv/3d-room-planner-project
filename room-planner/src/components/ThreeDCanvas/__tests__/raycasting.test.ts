// Jest tests for raycasting and selection logic in ThreeDCanvas
import * as THREE from 'three';
import { extractRaycastHits, getClosestSelection } from '../utils/raycasting';
import type { RoomElementType } from '../types';

// Helper to create a mock intersection for furniture
function mockFurnitureIntersection(id: string, distance: number): THREE.Intersection {
  const object = new THREE.Object3D();
  object.userData = { furnitureId: id };
  return { object, distance } as THREE.Intersection;
}

// Helper to create a mock intersection for a room element (e.g. wall)
function mockRoomElementIntersection(element: RoomElementType, distance: number): THREE.Intersection {
  const object = new THREE.Object3D();
  object.userData = { roomElement: element };
  return { object, distance } as THREE.Intersection;
}

describe('extractRaycastHits', () => {
  it('extracts and sorts furniture and room elements by distance', () => {
    const intersections = [
      mockFurnitureIntersection('chair', 4),
      mockRoomElementIntersection('wall-front', 2),
      mockFurnitureIntersection('table', 1),
      mockRoomElementIntersection('wall-back', 3),
    ];
    const { furniture, roomElements } = extractRaycastHits(intersections);
    expect(furniture.map(f => f.itemId)).toEqual(['table', 'chair']);
    expect(roomElements.map(r => r.element)).toEqual(['wall-front', 'wall-back']);
  });

  it('returns empty arrays if no matches', () => {
    const intersections: THREE.Intersection[] = [];
    const { furniture, roomElements } = extractRaycastHits(intersections);
    expect(furniture).toHaveLength(0);
    expect(roomElements).toHaveLength(0);
  });
});

describe('getClosestSelection', () => {
  it('returns closest furniture if present', () => {
    const intersections = [
      mockFurnitureIntersection('lamp', 2),
      mockFurnitureIntersection('sofa', 5),
      mockRoomElementIntersection('wall-left', 1),
    ];
    // Furniture with distance 2 is closer than sofa (5), and takes priority over wall
    const result = getClosestSelection(intersections);
    expect(result).toEqual({ itemId: 'lamp', roomElement: null });
  });

  it('returns closest room element if no furniture', () => {
    const intersections = [
      mockRoomElementIntersection('floor', 1),
      mockRoomElementIntersection('wall-right', 3),
    ];
    const result = getClosestSelection(intersections);
    expect(result).toEqual({ itemId: null, roomElement: 'floor' });
  });

  it('returns nulls if nothing is hit', () => {
    const result = getClosestSelection([]);
    expect(result).toEqual({ itemId: null, roomElement: null });
  });
});
