export const VERTICAL_IDS = ["eats", "hype", "homes", "flix"] as const;

export type VerticalId = (typeof VERTICAL_IDS)[number];

export function isVerticalId(value: string): value is VerticalId {
  return (VERTICAL_IDS as readonly string[]).includes(value);
}
