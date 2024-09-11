'use client';

import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import Layout from './components/Layout';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Chord Panda</h1>
        {user ? (
          <div>
            <p className="mb-4">Hello, {user.email}!</p>
            <p className="mb-4">Get inspired and create beautiful piano melodies!</p>
            <button className="bg-action text-white font-bold py-2 px-4 rounded">
              Generate a Sound Card
            </button>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </Layout>
  );
}
