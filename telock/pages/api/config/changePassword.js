import { compare, hash } from "bcrypt";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metódus nem támogatott." });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Nincs bejelentkezve." });
  }

  const { oldPassword, newPassword } = req.body;

  // Hasonlítsuk össze a régi jelszót
  const isMatch = await compare(oldPassword, session.user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Hibás régi jelszó." });
  }

  // Hash-eljük az új jelszót
  const newHashedPassword = await hash(newPassword, 10);

  // Itt kellene az adatbázis frissítése történjen
  // Példa: await prisma.user.update({ where: { id: session.user.id }, data: { password: newHashedPassword } });

  return res.status(200).json({ message: "Jelszó sikeresen módosítva!" });
}
