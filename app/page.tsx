'use client';

import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import Layout from './components/Layout';
import { SoundCardGenerator } from './components/SoundCardGenerator';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Let's create some music!</h1>
          {user ? (
            <div>
              <SoundCardGenerator />
            </div>
          ) : (
            <AuthForm />
          )}
        </div>
      </div>
    </Layout>
  );
}
