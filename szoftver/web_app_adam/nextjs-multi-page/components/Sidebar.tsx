import Link from 'next/link';
import './Sidebar.css'; // CSS a stílusokhoz

const Sidebar: React.FC = () => {
  return (
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
  );
};

export default Sidebar;
