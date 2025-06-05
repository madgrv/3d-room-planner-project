// Common types/interfaces for ThreeDCanvas module

export type ObjectType = 'furniture' | 'roomElement';

export interface RaycastHit {
  id: string;
  type: ObjectType;
  threeObject: unknown;
}

// Import RoomElementType from the store so it can be used in utilities
export type { RoomElementType } from '@/store/roomElementStore';
