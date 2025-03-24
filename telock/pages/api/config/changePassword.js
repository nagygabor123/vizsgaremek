import { compare, hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"; // Helyes import útvonal

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metódus nem támogatott." });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Nincs bejelentkezve." });
  }

  const { oldPassword, newPassword } = req.body;

  // Ellenőrizzük a régi jelszót
  const isMatch = await compare(oldPassword, session.user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Hibás régi jelszó." });
  }

  // Hash-eljük az új jelszót
  const newHashedPassword = await hash(newPassword, 10);

  // Itt frissítsd az adatbázist
  return res.status(200).json({ message: "Jelszó sikeresen módosítva!" });
}
