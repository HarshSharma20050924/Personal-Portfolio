
import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint, Lock, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (apiKey: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasRegisteredDevice, setHasRegisteredDevice] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if we have a stored credential for this device
    const credentialId = localStorage.getItem('portfolio_biometric_id');
    if (credentialId) {
      setHasRegisteredDevice(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.apiKey);
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to convert base64 string to Uint8Array
  const base64ToUint8Array = (base64: string): Uint8Array => {
      const binaryString = window.atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
  };

  const handleBiometricLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // 1. Retrieve the stored Credential ID
      const storedCredentialId = localStorage.getItem('portfolio_biometric_id');

      if (!storedCredentialId) {
          throw new Error("This device is not registered. Please log in with a password and register it in the Security tab.");
      }

      if (!window.PublicKeyCredential) {
          throw new Error("WebAuthn is not supported on this browser.");
      }

      console.log("Starting WebAuthn login...");

      // 2. Prepare the challenge (Generated locally for this implementation)
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Convert stored base64 credential ID to buffer
      let credentialIdBuffer: Uint8Array;
      try {
          credentialIdBuffer = base64ToUint8Array(storedCredentialId);
      } catch (e) {
          // Fallback if the ID was stored raw (unlikely with standard API, but safe to handle)
          credentialIdBuffer = Uint8Array.from(storedCredentialId, c => c.charCodeAt(0));
      }

      const publicKey: PublicKeyCredentialRequestOptions = {
          challenge: challenge,
          rpId: window.location.hostname,
          allowCredentials: [{
              id: credentialIdBuffer,
              type: 'public-key',
              transports: ['internal', 'hybrid'] 
          }],
          userVerification: "required",
          timeout: 60000,
      };

      // 3. Trigger the browser prompt (TouchID/FaceID)
      const assertion = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;

      if (!assertion) {
          throw new Error("Authentication failed.");
      }

      console.log("Biometric assertion received. ID:", assertion.id);

      // 4. Send the ID to server for verification (The server checks if this ID exists in DB)
      const response = await fetch('/api/auth/biometric', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credentialId: assertion.id })
      });
      
      const data = await response.json();
      
      if (response.ok) {
          onLogin(data.apiKey);
      } else {
          setError(data.message || "Authentication failed.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.name === 'NotAllowedError') {
          setError("Login canceled.");
      } else {
          setError(err.message || 'Biometric authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-center">Admin Access</h1>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials or use a registered device.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium">Username</label>
            <input
              id="username"
              type="text"
              ref={usernameRef}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" id="password-label" className="block mb-2 text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            />
          </div>
          
          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-all disabled:bg-sky-400"
          >
            {isLoading ? 'Verifying...' : <><Lock size={18} /> Sign In</>}
          </button>
        </form>

        {hasRegisteredDevice && (
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-800 px-2 text-slate-500">Quick Access</span></div>
            </div>
        )}

        {hasRegisteredDevice && (
            <button
                onClick={handleBiometricLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 bg-white border border-slate-200 dark:bg-slate-700 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            >
                <Fingerprint size={20} className="text-sky-500" />
                Biometric Login
            </button>
        )}
      </div>
    </div>
  );
};

export default Login;
