
import React from 'react';
import { Bell, Loader2, ShieldCheck, Trash2 } from 'lucide-react';

interface LeadManagerProps {
    leads: any[];
    notificationStatus: 'idle' | 'loading' | 'enabled';
    enableNotifications: () => void;
    deleteLead: (id: number) => void;
}

const LeadManager: React.FC<LeadManagerProps> = ({
    leads, notificationStatus, enableNotifications, deleteLead
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black tracking-tight">Recent Leads</h3>
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black">{leads.length} TOTAL</span>
                </div>
                <div className="space-y-4">
                    {leads.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 p-20 rounded-3xl border border-slate-200 dark:border-slate-700 text-center text-slate-400">
                            <p className="font-medium text-sm">No leads found in the database.</p>
                        </div>
                    ) : (
                        leads.map(lead => (
                            <div key={lead.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">{lead.name}</h4>
                                        <p className="text-sm text-blue-500 font-bold">{lead.email} <span className="mx-2 text-slate-300">|</span> {lead.phone || 'No phone'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800">
                                            {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800/50">
                                    "{lead.message}"
                                </div>
                                {lead.service && (
                                    <div className="mt-6 flex gap-2">
                                        <span className="px-5 py-2 bg-blue-600/5 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-600/10 tracking-widest shadow-sm">
                                            Inquiry Module: {lead.service}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600">
                            <Bell size={24} />
                        </div>
                        <h3 className="font-black text-lg">Push Alerts</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-8">Enable real-time OS-level alerts to notify you immediately when a new high-value lead is captured.</p>
                    <button
                        onClick={enableNotifications}
                        disabled={notificationStatus !== 'idle'}
                        className={`w-full py-4 rounded-2.5xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${notificationStatus === 'enabled' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]'}`}
                    >
                        {notificationStatus === 'loading' ? <Loader2 className="animate-spin" size={18} /> : notificationStatus === 'enabled' ? <ShieldCheck size={18} /> : <Bell size={18} />}
                        {notificationStatus === 'loading' ? 'Establishing Tunnel...' : notificationStatus === 'enabled' ? 'Alerts Verified' : 'Activate Live Alerts'}
                    </button>
                    {notificationStatus === 'enabled' && (
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest text-center mt-4 flex items-center justify-center gap-1">
                            <ShieldCheck size={12} /> Sync active with node server
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadManager;
