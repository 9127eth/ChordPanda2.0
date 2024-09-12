import React from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Chord Panda' }) => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background text-text">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-background p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chord Panda</h1>
          {user && (
            <button
              onClick={signOut}
              className="bg-action text-white font-bold py-2 px-4 rounded"
            >
              Log Out
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
