import { db, eq, Characters } from "astro:db";
import { Lodestone, XIVCollect, Lalachievements } from "nodecollect";

const parser = new Lodestone();
const xivparser = new XIVCollect();
const lalaparser = new Lalachievements();

export async function refresh(id: string) {
  const result: any = await parser.getCharacter(id);
  if (!result) null;

  result.id = result.id.toString();

  const xivdata: any = await xivparser.getCharacter(result.id, { latest: true });
  const laladata = await lalaparser.getCharacter(result.id, { latest: true });

  result.rankings = {
    ffxivcollect: xivdata?.rankings,
    lalachievements: laladata
      ? {
          achievements: {
            server: parseInt(laladata.achievementRank),
            global: parseInt(laladata.globalAchievementRank),
          },
          minions: {
            server: parseInt(laladata.mountRank),
            global: parseInt(laladata.globalMinionRank),
          },
          mounts: {
            server: parseInt(laladata.mountRank),
            global: parseInt(laladata.globalMountRank),
          },
        }
      : undefined,
  };

  const existing = await db.select().from(Characters).where(eq(Characters.id, id)).get();

  console.log(existing ? `Updating character ${id}` : `Inserting character ${id}`);
  if (existing) await db.update(Characters).set({ ...result, parsed_at: new Date() });
  else await db.insert(Characters).values([result]);

  return db.select().from(Characters).where(eq(Characters.id, id)).get();
}
