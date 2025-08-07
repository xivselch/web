import { column, defineDb, defineTable, NOW } from "astro:db";

const Characters = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    title: column.text(),
    dc_name: column.text(),
    world_name: column.text(),
    avatar: column.text({ optional: true }),
    portrait: column.text({ optional: true }),
    achievements: column.json({ optional: true, default: {} }), // { total: number; points: number; }
    minions: column.number({ optional: true }),
    mounts: column.number({ optional: true }),
    facewear: column.number({ optional: true }),
    deliveries: column.json({ default: [] }), // { name: string; completed: boolean }[]
    societies: column.json({ default: [] }), // { name: string; rank: string; reputation: number }[]
    rankings: column.json({ optional: true, default: {} }),
    public: column.boolean({ default: false }),
    verified: column.boolean({ default: false }),
    parsed_at: column.date({ default: NOW }),
  },
});

const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    characters: column.json({ default: [] }), // { id: string; main: boolean; verified: boolean; }[]
    api_token: column.text({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: { Characters, Users },
});
