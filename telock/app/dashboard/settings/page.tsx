import { useSession } from "next-auth/react";

const SomeComponent = () => {
  const session = useSession();

  // Ellenőrizzük, hogy a session létezik
  if (!session || !session.data) {
    return <div>Loading or please sign in.</div>;
  }

  return (
    <div>
      <p>Welcome, {session.data.user.short_name}!</p>
    </div>
  );
};

export default SomeComponent;
