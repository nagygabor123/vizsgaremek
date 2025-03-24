"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ChangePassword() {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    if (!session?.user?.password) {
      setMessage("Hiba: nincs bejelentkezett felhasználó.");
      return;
    }

    const res = await fetch("https://vizsgaremek-mocha.vercel.app/api/config/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div>
      <input
        type="password"
        placeholder="Régi jelszó"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Új jelszó"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Jelszó módosítása</button>
      {message && <p>{message}</p>}
    </div>
  );
}
