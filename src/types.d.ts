type Rankings = { server: number; data_center: number; global: number };
type Collection = "ffxivcollect" | "lalachievements";

export type Character = {
  id: string;
  name: string;
  title: string;
  dc_name: string;
  world_name: string;
  avatar: string;
  portrait: string | null;
  achievements: { total: number; score: number } | null;
  minions: number | null;
  mounts: number | null;
  facewear: number | null;
  deliveries: { name: string; completed: boolean }[];
  societies: { name: string; rank: string; reputation: number }[];
  rankings: Record<
    Collection,
    { achievements: Partial<Rankings>; minions: Partial<Rankings>; mounts: Partial<Rankings> }
  >;
  public: boolean;
  verified: boolean;
  parsed_at: Date;
};

export type User = {
  id: string;
  linked: string[];
  api_token: string | null;
  created_at: string;
  updated_at: string;
};
