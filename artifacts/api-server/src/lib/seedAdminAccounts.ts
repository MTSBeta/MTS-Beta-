import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

export async function seedAdminAccounts() {
  try {
    const academies = await db.execute(
      sql`SELECT id, key, name, access_code FROM academies WHERE access_code IS NOT NULL ORDER BY name`
    );

    let created = 0;
    for (const ac of academies.rows as any[]) {
      const email = `admin@${ac.key}.co.uk`;
      const existing = await db.execute(
        sql`SELECT id FROM academy_staff WHERE email = ${email} LIMIT 1`
      );
      if ((existing.rows as any[]).length > 0) continue;

      const hash = await bcrypt.hash(ac.access_code as string, 10);
      const fullName = `${ac.name} Admin`;
      await db.execute(
        sql`INSERT INTO academy_staff (academy_id, full_name, email, auth_user_id, system_role, is_active)
            VALUES (${ac.id}, ${fullName}, ${email}, ${hash}, 'academy_admin', true)`
      );
      created++;
    }

    if (created > 0) {
      console.log(`[seed] Created ${created} admin account(s)`);
    } else {
      console.log("[seed] Admin accounts already seeded");
    }
  } catch (err) {
    console.error("[seed] Failed to seed admin accounts:", err);
  }
}
