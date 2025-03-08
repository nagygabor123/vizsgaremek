import { useSession } from 'next-auth/react';

const AppSidebar = () => {
  const { data: session } = useSession();

  return (
      <div>
          <h1>Sidebar</h1>
          {session?.user?.short_name ? (
    <p>Üdvözöllek, {session.user.short_name}!</p>
) : (
    <p>Nincs bejelentkezve felhasználó.</p>
)}
      </div>
  );
};

export default AppSidebar;