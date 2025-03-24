import { compare, hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  console.log("📩 Jelszóváltoztatás API hívva...");

  if (req.method !== "POST") {
    console.log("❌ Hibás HTTP metódus:", req.method);
    return res.status(405).json({ message: "Metódus nem támogatott." });
  }

  const sql = neon(`${process.env.DATABASE_URL}`);

  // Session lekérése
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    console.log("❌ Hiba: Nincs bejelentkezve!");
    return res.status(401).json({ message: "Nincs bejelentkezve." });
  }

  console.log("✅ Bejelentkezett felhasználó:", session.user.short_name);

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    console.log("❌ Hiányzó adatok:", { oldPassword, newPassword });
    return res.status(400).json({ message: "Minden mezőt ki kell tölteni." });
  }

  // Ellenőrizzük a régi jelszót
  console.log("🔍 Régi jelszó ellenőrzése...");
  const isMatch = await compare(oldPassword, session.user.password);
  if (!isMatch) {
    console.log("❌ Hibás régi jelszó!");
    return res.status(400).json({ message: "Hibás régi jelszó." });
  }
  console.log("✅ Régi jelszó helyes.");

  // Új jelszó hash-elése
  console.log("🔐 Új jelszó hash-elése...");
  const newHashedPassword = await hash(newPassword, 10);

  try {
    console.log("📡 Adatbázis frissítése...");
    await sql(
      "UPDATE admins SET password = $1 WHERE short_name = $2",
      [newHashedPassword, session.user.short_name]
    );
    console.log("✅ Jelszó sikeresen módosítva!");
    return res.status(200).json({ message: "Jelszó sikeresen módosítva!" });
  } catch (error) {
    console.log("❌ Hiba az adatbázis frissítésekor:", error.message);
    return res.status(500).json({ message: "Hiba a jelszó módosítása során.", error: error.message });
  }
}
