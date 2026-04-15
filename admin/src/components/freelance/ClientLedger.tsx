
import React, { useState } from 'react';
import { Save, IndianRupee, Trash2, Plus, ArchiveRestore } from 'lucide-react';

interface ClientAccount {
    id: number;
    clientName: string;
    project: string;
    totalAmount: number;
    paidAmount: number;
    notes: string;
    status: 'active' | 'completed' | 'on-hold' | 'archived';
    emiDetails?: string;
}

interface ClientLedgerProps {
    accounts: ClientAccount[];
    fetchLedger: () => void;
    updateAccount: (id: number, field: string, value: any) => void;
    deleteAccount: (id: number) => void;
    addAccount: () => void;
}

const ClientLedger: React.FC<ClientLedgerProps> = ({
    accounts, fetchLedger, updateAccount, deleteAccount, addAccount
}) => {
    const [showArchived, setShowArchived] = useState(false);

    const filteredAccounts = accounts.filter(acc => showArchived ? acc.status === 'archived' : acc.status !== 'archived');

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-8 border-b flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-xl font-black tracking-tight">Client Ledger</h3>
                        <p className="text-xs text-slate-500 mt-1">Status of all active and completed contracts.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowArchived(!showArchived)} className={`p-3 border rounded-2xl transition-all flex items-center gap-2 text-xs font-bold ${showArchived ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900'}`}>
                            <ArchiveRestore size={16} />
                            {showArchived ? 'Showing Archived' : 'Show Archived'}
                        </button>
                        <button onClick={fetchLedger} className="p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 text-blue-600 rounded-2xl hover:shadow-lg transition-all">
                            <Save size={20} className="rotate-90" />
                        </button>
                        <button onClick={addAccount} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition-all">
                            <Plus size={16} /> NEW ACCOUNT
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {filteredAccounts.length === 0 ? (
                        <div className="py-20 text-center text-slate-400">
                            <p className="text-sm font-medium">No client records found. Start by adding a new account.</p>
                        </div>
                    ) : (
                        filteredAccounts.map(acc => (
                            <div key={acc.id} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all duration-500">
                                <div className="flex flex-col lg:row-span-1 lg:flex-row justify-between gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div className="relative group/input">
                                            <input
                                                value={acc.clientName}
                                                onChange={(e) => updateAccount(acc.id, 'clientName', e.target.value)}
                                                className="w-full bg-transparent font-black text-2xl outline-none text-slate-900 dark:text-white group-hover/input:text-blue-600 transition-colors"
                                                placeholder="Client Name"
                                            />
                                            <div className="h-[2px] w-0 group-hover/input:w-full bg-blue-600 transition-all duration-500"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm">
                                                        <IndianRupee size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[10px] uppercase font-black tracking-widest block mb-1">Total Contract Value</label>
                                                        <input
                                                            type="number"
                                                            value={acc.totalAmount}
                                                            onChange={(e) => updateAccount(acc.id, 'totalAmount', parseFloat(e.target.value))}
                                                            className="w-full bg-transparent font-bold text-lg outline-none text-slate-800 dark:text-slate-100"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-emerald-500">
                                                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/20 shadow-sm">
                                                        <Save size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[10px] uppercase font-black tracking-widest block mb-1">Total Paid</label>
                                                        <input
                                                            type="number"
                                                            value={acc.paidAmount}
                                                            onChange={(e) => updateAccount(acc.id, 'paidAmount', parseFloat(e.target.value))}
                                                            className="w-full bg-transparent font-bold text-lg outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2.5xl border border-slate-100 dark:border-slate-700 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transaction Notes</h4>
                                                </div>
                                                <textarea
                                                    value={acc.notes}
                                                    onChange={(e) => updateAccount(acc.id, 'notes', e.target.value)}
                                                    className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none h-20"
                                                    placeholder="Add important details here..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:w-72 space-y-6">
                                        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Remaining Balance</p>
                                            <p className="text-3xl font-black">₹{(acc.totalAmount - acc.paidAmount).toLocaleString()}</p>
                                            <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-white transition-all duration-1000" 
                                                    style={{ width: `${Math.min(100, (acc.paidAmount/acc.totalAmount)*100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button 
                                                onClick={() => acc.status === 'archived' ? updateAccount(acc.id, 'status', 'active') : updateAccount(acc.id, 'status', 'archived')}
                                                className="w-full py-3 bg-red-50 dark:bg-red-900/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100 dark:border-red-900/20 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                {acc.status === 'archived' ? 'RESTORE' : 'ARCHIVE'}
                                            </button>
                                            {acc.status === 'archived' && (
                                                <button 
                                                    onClick={() => deleteAccount(acc.id)}
                                                    className="w-full py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg"
                                                >
                                                    DELETE
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientLedger;
