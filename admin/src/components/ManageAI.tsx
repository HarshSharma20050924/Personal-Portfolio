
import React, { useState } from 'react';
import { BrainCircuit, Download, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

const ManageAI: React.FC = () => {
    const [portfolioData, setPortfolioData] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleExport = async () => {
        const apiKey = sessionStorage.getItem('apiKey');
        try {
            const res = await fetch('/api/data/export', {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            if (res.ok) {
                const text = await res.text();
                setPortfolioData(text);
                setStatusMessage('Data exported from Portfolio successfully. Review below before training.');
            } else {
                throw new Error('Failed to export data.');
            }
        } catch (error) {
            console.error(error);
            setStatusMessage('Error exporting data.');
        }
    };

    const handleTrain = async () => {
        if (!portfolioData) return;
        setStatus('loading');
        
        try {
            // NOTE: The RAG service might be on a different port/proxy in some setups,
            // but based on vite.config.js, /api/rag requests are proxied correctly.
            const res = await fetch('/api/rag/update-knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    content: portfolioData,
                    source: 'portfolio_live' 
                })
            });

            if (res.ok) {
                setStatus('success');
                setStatusMessage('AI Knowledge Base successfully updated!');
                setPortfolioData(''); // Clear to indicate completion
            } else {
                throw new Error('Failed to update knowledge base.');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setStatusMessage('Failed to connect to RAG service. Is the Python service running?');
        } finally {
            if (status !== 'error') setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <BrainCircuit className="text-purple-600" />
                AI Knowledge Base
            </h2>

            <div className="bg-white dark:bg-slate-800/50 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Step 1: Export Portfolio Data</h3>
                    <p className="text-slate-500 text-sm mb-4">
                        Pull the latest data (projects, skills, bio) from your saved portfolio configuration.
                    </p>
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors text-slate-700 dark:text-slate-200"
                    >
                        <Download size={18} />
                        Fetch Latest Data
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Step 2: Review & Train</h3>
                    <p className="text-slate-500 text-sm mb-4">
                        Review the data below. You can edit it manually if you want to add specific instructions for the AI that aren't on the public site. When ready, click "Update Knowledge Base".
                    </p>
                    
                    <textarea 
                        value={portfolioData}
                        onChange={(e) => setPortfolioData(e.target.value)}
                        placeholder="Click 'Fetch Latest Data' to populate this area..."
                        className="w-full h-64 p-4 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none resize-y"
                    />

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleTrain}
                            disabled={!portfolioData || status === 'loading'}
                            className={`
                                flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all
                                ${!portfolioData ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30'}
                            `}
                        >
                            {status === 'loading' ? (
                                'Training...'
                            ) : (
                                <><UploadCloud size={20} /> Update Knowledge Base</>
                            )}
                        </button>

                        {status === 'success' && (
                            <span className="flex items-center gap-2 text-green-600 font-medium animate-pulse">
                                <CheckCircle size={20} /> Updated
                            </span>
                        )}
                        {status === 'error' && (
                            <span className="flex items-center gap-2 text-red-500 font-medium">
                                <AlertCircle size={20} /> Error
                            </span>
                        )}
                    </div>
                    {statusMessage && <p className="mt-3 text-sm text-slate-500">{statusMessage}</p>}
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-lg">
                    <h4 className="font-bold text-purple-700 dark:text-purple-300 text-sm mb-1">Why do I need to do this?</h4>
                    <p className="text-purple-600/80 dark:text-purple-300/70 text-xs">
                        The Chatbot uses a separate database (Vector DB) optimized for AI search. 
                        It does not automatically read your website changes in real-time to save costs and improve performance.
                        You must manually "Train" it here whenever you make significant changes to your portfolio.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManageAI;
