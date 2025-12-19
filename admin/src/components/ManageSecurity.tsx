
import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';

const ManageSecurity: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleRegisterBiometric = async () => {
        setIsRegistering(true);
        setStatus(null);

        try {
            if (!window.PublicKeyCredential) {
                throw new Error("Biometric authentication is not supported by this browser.");
            }

            // Real production flow would involve fetching a registration challenge from the server
            // For now, we simulate the credential creation prompt
            console.log("Registering biometric credential...");
            
            // Simulation of platform-specific prompt
            await new Promise(r => setTimeout(r, 800));

            const apiKey = sessionStorage.getItem('apiKey');
            const response = await fetch('/api/auth/register-biometric', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ deviceName: navigator.userAgent })
            });

            if (!response.ok) throw new Error("Server failed to register credential.");

            const data = await response.json();
            
            // SAVE THE TOKEN LOCALLY. This binds the login to this specific browser instance.
            if (data.credentialId) {
                localStorage.setItem('portfolio_biometric_id', data.credentialId);
                setStatus("success");
            } else {
                throw new Error("Invalid server response.");
            }

        } catch (err: any) {
            console.error(err);
            setStatus(err.message);
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
                        <h3 className="text-xl font-bold mb-1">Biometric Authentication</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Register this device to log in without a password. This creates a secure, unique key stored only on this browser.
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
                        {isRegistering ? 'Securing Device...' : 'Register This Device'}
                    </button>
                </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                 <div className="flex items-center gap-3 mb-2 text-slate-700 dark:text-slate-300">
                    <ShieldCheck size={18} />
                    <h4 className="font-bold text-sm">How it works</h4>
                 </div>
                 <ul className="text-xs text-slate-500 space-y-1 list-disc ml-5">
                    <li>A unique key is saved to this browser's storage.</li>
                    <li>The server verifies this key during login.</li>
                    <li>If you clear your browser cookies/data, you will need to register again using your password.</li>
                 </ul>
            </div>
        </div>
    );
};

export default ManageSecurity;
