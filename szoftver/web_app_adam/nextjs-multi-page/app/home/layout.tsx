import '../globals.css';
import Sidebar from '../../components/Sidebar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Next.js Multi-Page App',
  description: 'A sample multi-page app using Next.js with the App Router',
};

const RootLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
