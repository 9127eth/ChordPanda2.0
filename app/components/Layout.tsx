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
    <div className="min-h-screen flex flex-col bg-background text-text w-full">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-background p-4 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chord Panda</h1>
          {user && (
            <div className="flex items-center">
              <span className="mr-4 text-sm">Signed in as: {user.email}</span>
              <button
                onClick={signOut}
                className="bg-action text-white font-bold py-2 px-4 rounded"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
