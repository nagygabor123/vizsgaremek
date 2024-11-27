import Link from 'next/link';
// import './Sidebar.css'; // CSS a stílusokhoz
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"



const Sidebar2: React.FC = () => {
  return (
    <Sidebar>
    <aside className="sidebar">
      <ul>
        <li>
          <Link href="/home">Home</Link>
        </li>
        <li>
          <Link href="/home/about">About</Link>
        </li>
        <li>
          <Link href="/home/contact">Contact</Link>
        </li>
      </ul>
    </aside>
    </Sidebar>
  );
};

export default Sidebar2;


