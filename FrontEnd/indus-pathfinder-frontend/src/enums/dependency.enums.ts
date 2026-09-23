export const DependencyType = {
  FS: "FS",
  SS: "SS",
  FF: "FF",
  SF: "SF",
} as const;

export type DependencyType =
  (typeof DependencyType)[keyof typeof DependencyType];