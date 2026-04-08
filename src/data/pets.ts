import type { PetId } from "../store/useStore";

export interface PetEntry {
  id: PetId;
  emoji: string;
  name: string;
}

export const PETS: PetEntry[] = [
  { id: "cat",  emoji: "🐱", name: "Cat"  },
  { id: "dog",  emoji: "🐶", name: "Dog"  },
  { id: "bird", emoji: "🐦", name: "Bird" },
  { id: "fish", emoji: "🐠", name: "Fish" },
];

export function getPetById(id: PetId): PetEntry {
  return PETS.find((p) => p.id === id) ?? PETS[0];
}
