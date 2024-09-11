import React, { useState } from 'react';
import { auth } from '../lib/firebase/clientApp';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const isPasswordStrong = (password: string) => {
  // Implement password strength check logic
  return password.length >= 8;
};

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Error with email auth:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      console.error('Error with Google auth:', error);
      if (error instanceof Error && 'code' in error && error.code === 'auth/network-request-failed') {
        alert('There was a temporary issue with Google authentication. Please try again in a few seconds.');
      } else {
        alert('An error occurred during Google authentication. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setHasStartedTyping(true);
          }}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        {isSignUp && hasStartedTyping && !isPasswordStrong(password) && (
          <p className="text-error text-sm">Password must be at least 8 characters long</p>
        )}
        {error && <p className="text-error">{error}</p>}
        <button 
          type="submit" 
          className="w-full p-2 bg-action text-white rounded"
          disabled={isLoading || (isSignUp && !isPasswordStrong(password))}
        >
          {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>
      <button
        onClick={handleGoogleAuth}
        className="w-full p-2 mt-4 bg-red-500 text-white rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      <p className="mt-4 text-center">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="ml-2 text-action"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
      <button
        onClick={handleForgotPassword}
        className="w-full p-2 mt-4 bg-gray-300 text-gray-700 rounded"
      >
        Forgot Password
      </button>
      {resetEmailSent && (
        <p className="mt-2 text-green-500 text-center">
          Password reset email sent. Please check your inbox.
        </p>
      )}
    </div>
  );
};

export default AuthForm;
