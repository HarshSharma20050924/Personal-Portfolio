
import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';

const ManageSecurity: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    // Helper to convert base64url to Uint8Array (needed for WebAuthn challenges if we were doing strict verification, 
    // but here mainly to ensure we have data buffers)
    const strToBin = (str: string) => Uint8Array.from(str, c => c.charCodeAt(0));

    const handleRegisterBiometric = async () => {
        setIsRegistering(true);
        setStatus(null);

        try {
            if (!window.PublicKeyCredential) {
                throw new Error("Biometric authentication is not supported by this browser.");
            }

            console.log("Starting WebAuthn registration...");

            // 1. Create the challenge and user info
            // In a full production app, the challenge comes from the server to prevent replay attacks.
            // For this implementation, we generate it locally to trigger the hardware prompt.
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            const userId = new Uint8Array(16);
            window.crypto.getRandomValues(userId);

            const publicKey: PublicKeyCredentialCreationOptions = {
                challenge: challenge,
                rp: {
                    name: "Portfolio Admin",
                    id: window.location.hostname // Must match the current domain
                },
                user: {
                    id: userId,
                    name: "admin",
                    displayName: "Portfolio Admin",
                },
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" }, // ES256
                    { alg: -257, type: "public-key" }, // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // Forces built-in authenticator (TouchID/FaceID)
                    userVerification: "required",
                    requireResidentKey: false
                },
                timeout: 60000,
                attestation: "none"
            };

            // 2. Call the browser API - This triggers the FaceID/TouchID prompt
            const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;

            if (!credential) {
                throw new Error("Credential creation failed.");
            }

            console.log("Biometric challenge passed. Credential ID:", credential.id);

            // 3. Register the credential ID with the server
            const apiKey = sessionStorage.getItem('apiKey');
            const response = await fetch('/api/auth/register-biometric', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                // We send the credential.id (base64url string) to the server
                body: JSON.stringify({ 
                    deviceName: navigator.userAgent,
                    credentialId: credential.id 
                })
            });

            if (!response.ok) throw new Error("Server failed to register credential.");

            const data = await response.json();
            
            // 4. Save the Credential ID locally to identify this device later
            if (data.credentialId) {
                localStorage.setItem('portfolio_biometric_id', data.credentialId);
                setStatus("success");
            } else {
                throw new Error("Invalid server response.");
            }

        } catch (err: any) {
            console.error(err);
            // Handle specific WebAuthn errors
            if (err.name === 'NotAllowedError') {
                setStatus("Registration canceled or timed out.");
            } else if (err.name === 'SecurityError') {
                setStatus("Security error: Domain mismatch or insecure context.");
            } else {
                setStatus(err.message || "Registration failed.");
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">Account Security</h2>
            
            <div className="p-8 bg-white dark:bg-slate-800/50 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center shrink-0">
                        <Fingerprint size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-1">Passkey Authentication</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Register this device (FaceID/TouchID) to log in securely without typing your password.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">Current Browser</span>
                            <span className="text-[10px] uppercase font-mono bg-sky-100 text-sky-600 px-2 py-0.5 rounded">Active Session</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <Smartphone size={14} />
                            {navigator.userAgent.split(')')[0].split('(')[1] || 'Unknown Device'}
                        </div>
                    </div>

                    {status === 'success' ? (
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl border border-green-100 dark:border-green-900/30">
                            <CheckCircle2 size={20} />
                            <span className="text-sm font-medium">Device registered! You can now log in here biometrically.</span>
                        </div>
                    ) : status ? (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 text-sm">
                            {status}
                        </div>
                    ) : null}

                    <button
                        onClick={handleRegisterBiometric}
                        disabled={isRegistering}
                        className="w-full md:w-auto px-6 py-3 font-semibold text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50"
                    >
                        {isRegistering ? 'Activating Sensor...' : 'Register This Device'}
                    </button>
                </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                 <div className="flex items-center gap-3 mb-2 text-slate-700 dark:text-slate-300">
                    <ShieldCheck size={18} />
                    <h4 className="font-bold text-sm">WebAuthn Secure</h4>
                 </div>
                 <ul className="text-xs text-slate-500 space-y-1 list-disc ml-5">
                    <li>Uses standard WebAuthn API (FIDO2).</li>
                    <li>Biometric data never leaves your device.</li>
                    <li>Requires HTTPS or localhost context.</li>
                 </ul>
            </div>
        </div>
    );
};

export default ManageSecurity;
