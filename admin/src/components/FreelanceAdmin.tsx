
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Receipt, ShieldCheck, Download, Users, Briefcase, Plus, Trash2, Printer, Calculator, Info, Layout, Save, IndianRupee, MessageSquare, Bell, Loader2, RotateCw } from 'lucide-react';
import type { HeroData, Service, Project } from '../types';
import { getFCMToken } from '../utils/firebase';
import API_BASE from '../utils/apiBase';

interface FreelanceAdminProps {
    heroData: HeroData;
    services: Service[];
    projects: Project[];
}

interface ClientAccount {
    id: number;
    clientName: string;
    project: string;
    totalAmount: number;
    paidAmount: number;
    notes: string;
    status: 'active' | 'completed' | 'on-hold';
    date: string;
}

interface FreelanceLead {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    company?: string;
    service?: string;
    phone?: string;
}

const ADMIN_KEY = () => sessionStorage.getItem('apiKey') || import.meta.env.VITE_ADMIN_API_KEY;

const FreelanceAdmin: React.FC<FreelanceAdminProps> = ({ heroData, services, projects }) => {
    const [activeTab, setActiveTab] = useState<'brochure' | 'billing' | 'leads' | 'payments'>('brochure');
    const [billItems, setBillItems] = useState<{ desc: string, price: number, qty: number }[]>([
        { desc: 'Website Development', price: 15000, qty: 1 }
    ]);
    const [clientName, setClientName] = useState('John Doe');
    const [clientEmail, setClientEmail] = useState('john@example.com');

    const [accounts, setAccounts] = useState<ClientAccount[]>([]);
    const [leads, setLeads] = useState<FreelanceLead[]>([]);
    const [loading, setLoading] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState<'idle' | 'loading' | 'enabled'>('idle');

    useEffect(() => {
        fetchLedger();
        fetchLeads();
        checkNotificationStatus();
    }, []);

    const fetchLedger = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/ledger`, {
                headers: { 'Authorization': `Bearer ${ADMIN_KEY()}` }
            });
            if (res.ok) setAccounts(await res.json());
        } catch (e) { console.error('Ledger error:', e); }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/messages`, {
                headers: { 'Authorization': `Bearer ${ADMIN_KEY()}` }
            });
            if (res.ok) {
                const allMessages = await res.json();
                setLeads(allMessages.filter((m: any) => m.type === 'freelance'));
            }
        } catch (e) { console.error('Leads error:', e); }
    };

    const checkNotificationStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/notifications/token`, {
                headers: { 'Authorization': `Bearer ${ADMIN_KEY()}` }
            });
            const data = await res.json();
            if (data.token) setNotificationStatus('enabled');
        } catch (e) {}
    };

    const enableNotifications = async () => {
        setNotificationStatus('loading');
        try {
            const token = await getFCMToken();
            if (token) {
                await fetch(`${API_BASE}/api/notifications/token`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ADMIN_KEY()}` 
                    },
                    body: JSON.stringify({ token })
                });
                setNotificationStatus('enabled');
            } else {
                setNotificationStatus('idle');
                alert('Please allow notifications and check if Firebase config is set in `.env`.');
            }
        } catch (e) {
            console.error(e);
            setNotificationStatus('idle');
        }
    };

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (WindowPrt && printContent) {
            WindowPrt.document.write(`
                <html>
                    <head>
                        <title>Service Document</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                            @page { size: A4;  margin: 20mm; }
                            body { background-color: white; color: black; font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
                            .print-container { padding: 0; }
                            .header-bar { background-color: #000; color: white; padding: 40px; }
                            .accent-text { color: #3b82f6; }
                            .border-blue { border-color: #3b82f6; }
                            .bg-blue-accent { background-color: #3b82f6; }
                            table { border-collapse: collapse; width: 100%; }
                            th { background-color: #f8fafc; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; }
                            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
                            h1, h2, h3 { font-weight: 700; text-transform: uppercase; letter-spacing: -0.025em; }
                            * { font-style: normal !important; }
                        </style>
                    </head>
                    <body>
                        <div class="print-container">
                            ${printContent.innerHTML}
                        </div>
                        <script>
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        </script>
                    </body>
                </html>
            `);
            WindowPrt.document.close();
        }
    };

    const addBillItem = () => setBillItems([...billItems, { desc: '', price: 0, qty: 1 }]);
    const removeBillItem = (index: number) => setBillItems(billItems.filter((_, i) => i !== index));
    const updateBillItem = (index: number, field: string, value: any) => {
        const newItems = [...billItems];
        (newItems[index] as any)[field] = value;
        setBillItems(newItems);
    };

    const totalBill = billItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const addAccount = async () => {
        const newAcc = {
            clientName: 'New Client',
            project: 'Web Project',
            totalAmount: 0,
            paidAmount: 0,
            notes: '',
            status: 'active'
        };
        try {
            const res = await fetch(`${API_BASE}/api/ledger`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_KEY()}` 
                },
                body: JSON.stringify(newAcc)
            });
            if (res.ok) fetchLedger();
        } catch (e) {}
    };

    const updateAccount = async (id: number, field: string, value: any) => {
        try {
            await fetch(`${API_BASE}/api/ledger/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_KEY()}` 
                },
                body: JSON.stringify({ [field]: value })
            });
            // Update local state for immediate feedback
            setAccounts(accounts.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
        } catch (e) {}
    };

    const deleteAccount = async (id: number) => {
        if (!confirm('Remove this client?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/ledger/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${ADMIN_KEY()}` }
            });
            if (res.ok) fetchLedger();
        } catch (e) {}
    };

    const deleteLead = async (id: number) => {
        if (!confirm('Discard this lead?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${ADMIN_KEY()}` }
            });
            if (res.ok) fetchLeads();
        } catch (e) {}
    };

    return (
        <div className="space-y-6 animate-fadeIn font-sans pb-20">
            {/* Simple Top Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Freelance Manager</h2>
                    <p className="text-slate-500 text-sm">Manage your clients, bills and leads from the database.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'brochure', label: 'Brochure', icon: FileText },
                        { id: 'leads', label: 'Leads', icon: MessageSquare },
                        { id: 'billing', label: 'Create Bill', icon: Receipt },
                        { id: 'payments', label: 'Payments', icon: IndianRupee },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all text-sm font-semibold ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'}`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls */}
                <div className="lg:col-span-4 space-y-6">
                    {activeTab === 'leads' && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2">
                                <Bell size={18} className="text-blue-500" /> Notifications
                            </h3>
                            <p className="text-xs text-slate-500 mb-6">Enable real-time alerts on your device for new freelance inquiries.</p>
                            <button
                                onClick={enableNotifications}
                                disabled={notificationStatus !== 'idle'}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${notificationStatus === 'enabled' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                {notificationStatus === 'loading' ? <Loader2 className="animate-spin" size={18} /> : notificationStatus === 'enabled' ? <ShieldCheck size={18} /> : <Bell size={18} />}
                                {notificationStatus === 'loading' ? 'Enabling...' : notificationStatus === 'enabled' ? 'Alerts Active' : 'Enable Mobile Alerts'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2">
                                <Users size={18} className="text-blue-500" /> Client Info
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Name</label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2 mt-1 outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                                    <input
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2 mt-1 outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <h3 className="font-bold mt-8 mb-4 flex items-center gap-2 border-b pb-2">
                                <Plus size={18} className="text-blue-500" /> Service Items
                            </h3>
                            <div className="space-y-4">
                                {billItems.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border relative border-slate-100 dark:border-slate-700">
                                        <button
                                            onClick={() => removeBillItem(idx)}
                                            className="absolute top-2 right-2 text-red-500 p-1 rounded-full hover:bg-red-50"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <input
                                            placeholder="What service?"
                                            value={item.desc}
                                            onChange={(e) => updateBillItem(idx, 'desc', e.target.value)}
                                            className="w-full bg-transparent border-b mb-2 py-1 outline-none text-sm font-medium"
                                        />
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase text-slate-400">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => updateBillItem(idx, 'price', parseFloat(e.target.value))}
                                                    className="w-full bg-transparent border-b outline-none text-sm"
                                                />
                                            </div>
                                            <div className="w-12">
                                                <label className="text-[10px] uppercase text-slate-400">Qty</label>
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) => updateBillItem(idx, 'qty', parseInt(e.target.value))}
                                                    className="w-full bg-transparent border-b outline-none text-sm text-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={addBillItem}
                                    className="w-full py-3 border-2 border-dashed rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add New Row
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Info className="text-blue-500" size={20} /> Payment Summary
                            </h3>
                            <div className="space-y-4 font-sans text-xs">
                                <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-400 uppercase font-black tracking-widest text-[9px]">Total Contract Value</span>
                                    <span className="font-bold text-white text-sm">
                                        ₹{accounts.reduce((sum, a) => sum + a.totalAmount, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-400 uppercase font-black tracking-widest text-[9px]">Confirmed Earnings</span>
                                    <span className="font-bold text-emerald-400 text-sm">
                                        ₹{accounts.reduce((sum, a) => sum + a.paidAmount, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <span className="text-blue-200 uppercase font-black tracking-widest text-[9px]">Outstanding Balance</span>
                                    <span className="font-bold text-blue-400 text-sm">
                                        ₹{(accounts.reduce((sum, a) => sum + a.totalAmount, 0) - accounts.reduce((sum, a) => sum + a.paidAmount, 0)).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={addAccount}
                                className="w-full mt-8 bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20"
                            >
                                <Plus size={16} /> Add Client Record
                            </button>
                        </div>
                    )}

                    {(activeTab === 'brochure') && (
                        <div className="bg-blue-600 p-8 rounded-2xl shadow-xl text-white">
                            <h3 className="text-xl font-bold mb-2">Print Document</h3>
                            <p className="text-sm opacity-80 mb-6">Convert the current preview into a professional PDF document for your client.</p>
                            <button
                                onClick={handlePrint}
                                className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Printer size={18} /> Print as PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Preview Side */}
                <div className="lg:col-span-8">
                    {activeTab === 'leads' ? (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full min-h-[500px]">
                            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold">Freelance Leads</h3>
                                <button onClick={fetchLeads} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Refresh Leads">
                                    <RotateCw size={18} className={loading ? "animate-spin" : ""} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {leads.length === 0 ? (
                                    <div className="py-20 text-center text-slate-400">
                                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No new freelance leads yet.</p>
                                    </div>
                                ) : (
                                    leads.map(lead => (
                                        <div key={lead.id} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all hover:border-blue-500/30 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-bold text-lg">{lead.name}</h4>
                                                        <button 
                                                            onClick={() => { navigator.clipboard.writeText(lead.email); alert('Email copied!'); }}
                                                            className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                                                            title="Copy Email"
                                                        >
                                                            <Save size={14} className="rotate-90" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-blue-500 font-mono mt-0.5">{lead.email} {lead.phone && `| ${lead.phone}`}</p>
                                                    {lead.company && <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-[0.2em]">{lead.company}</p>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                                        {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-white/80 dark:bg-black/20 p-5 rounded-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800/50 italic italic-none">
                                                "{lead.message}"
                                            </div>
                                            {lead.service && (
                                                <div className="mt-4 flex gap-2">
                                                    <span className="px-4 py-1.5 bg-blue-500/5 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-500/10 tracking-widest">
                                                        Target: {lead.service}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'payments' ? (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full min-h-[500px]">
                            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold">Client Ledger</h3>
                                <button onClick={fetchLedger} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                    <Save size={18} className="rotate-90" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {accounts.length === 0 ? (
                                    <div className="py-20 text-center text-slate-400">
                                        <p>No client records yet. Everything is synced to the database.</p>
                                    </div>
                                ) : (
                                    accounts.map(acc => (
                                        <div key={acc.id} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 group hover:bg-white transition-all shadow-sm">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="flex-1">
                                                        <input
                                                            value={acc.clientName}
                                                            onChange={(e) => updateAccount(acc.id, 'clientName', e.target.value)}
                                                            className="w-full bg-transparent font-bold text-lg outline-none focus:text-blue-600 transition-colors"
                                                            placeholder="Client Name"
                                                        />
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <input
                                                                value={acc.project}
                                                                onChange={(e) => updateAccount(acc.id, 'project', e.target.value)}
                                                                className="flex-1 bg-transparent text-xs text-slate-400 outline-none"
                                                                placeholder="Project Description"
                                                            />
                                                            <select 
                                                                value={acc.status}
                                                                onChange={(e) => updateAccount(acc.id, 'status', e.target.value)}
                                                                className="text-[10px] font-bold uppercase bg-white dark:bg-slate-800 border-none outline-none text-slate-500"
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="completed">Completed</option>
                                                                <option value="on-hold">On Hold</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4 items-end">
                                                        <div>
                                                            <label className="text-[9px] text-slate-400 uppercase font-black tracking-tighter block mb-1">Total Budget</label>
                                                            <div className="relative">
                                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                                                                <input
                                                                    type="number"
                                                                    value={acc.totalAmount}
                                                                    onChange={(e) => updateAccount(acc.id, 'totalAmount', parseFloat(e.target.value) || 0)}
                                                                    className="w-24 bg-transparent outline-none font-bold text-right py-1 pl-4 border-b border-transparent focus:border-slate-200"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] text-slate-400 uppercase font-black tracking-tighter block mb-1">Paid to Date</label>
                                                            <div className="relative">
                                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold">₹</span>
                                                                <input
                                                                    type="number"
                                                                    value={acc.paidAmount}
                                                                    onChange={(e) => updateAccount(acc.id, 'paidAmount', parseFloat(e.target.value) || 0)}
                                                                    className="w-24 bg-transparent outline-none font-bold text-emerald-500 text-right py-1 pl-4 border-b border-transparent focus:border-slate-200"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button onClick={() => deleteAccount(acc.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors self-center">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                            </div>
                                            <textarea
                                                value={acc.notes || ''}
                                                onChange={(e) => updateAccount(acc.id, 'notes', e.target.value)}
                                                placeholder="Write any project notes here..."
                                                className="w-full bg-white/50 dark:bg-black/20 rounded-xl p-3 text-sm text-slate-500 mt-4 min-h-[60px] outline-none border border-transparent focus:border-blue-500/20"
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document Preview</span>
                                <button className="text-blue-500 p-1 hover:bg-blue-50 rounded" onClick={handlePrint}>
                                    <Printer size={16} />
                                </button>
                            </div>

                            <div ref={printRef} className="bg-white text-slate-900 min-h-[800px]">
                                {activeTab === 'brochure' && (
                                    <div className="animate-fadeIn">
                                        <div className="bg-black text-white p-12 py-16 flex justify-between items-center">
                                            <div>
                                                <h1 className="text-4xl font-bold tracking-tighter">{heroData.name}</h1>
                                                <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-2">Freelance Professional / Engineer</p>
                                            </div>
                                            <div className="text-right text-[10px] uppercase tracking-widest leading-loose opacity-60">
                                                <p>{heroData.email}</p>
                                                <p>{heroData.phone}</p>
                                            </div>
                                        </div>

                                        <div className="p-12 space-y-12">
                                            <div className="grid grid-cols-2 gap-12">
                                                <div className="space-y-6">
                                                    <h2 className="text-lg font-bold border-b-4 border-blue-500 pb-2 w-fit">Services I Provide</h2>
                                                    <div className="space-y-6">
                                                        {services.map((s, idx) => (
                                                            <div key={idx}>
                                                                <h3 className="font-bold text-sm text-black">{s.title}</h3>
                                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.tagline || s.description.substring(0, 150)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <h2 className="text-lg font-bold border-b-4 border-blue-500 pb-2 w-fit">Points of Trust</h2>
                                                    <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-medium">
                                                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                                            <h4 className="font-bold text-black mb-1 uppercase tracking-tight">Safe Data</h4>
                                                            <p>I take data safety very seriously. Your information and project data are always kept private and secure.</p>
                                                        </div>
                                                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                                            <h4 className="font-bold text-black mb-1 uppercase tracking-tight">Solid Code</h4>
                                                            <p>I write clean, high-performance code that can scale with your business needs without breaking.</p>
                                                        </div>
                                                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                                            <h4 className="font-bold text-black mb-1 uppercase tracking-tight">Full Support</h4>
                                                            <p>Working with me means having a technical partner. I don't just build; I help you grow and maintain the solution.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-8">
                                                <h2 className="text-lg font-bold border-b-4 border-blue-500 pb-2 w-fit mb-8">Recent Projects</h2>
                                                <div className="grid grid-cols-3 gap-6">
                                                    {projects.filter(p => p.featured).slice(0, 3).map((p, idx) => (
                                                        <div key={idx} className="p-6 bg-slate-100 rounded-2xl border border-slate-200">
                                                            <h3 className="font-bold text-[10px] uppercase mb-2">{p.title}</h3>
                                                            <p className="text-[10px] text-slate-500 leading-tight">{p.description.substring(0, 100)}...</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center opacity-30 text-[8px] font-bold uppercase tracking-[.5em]">
                                                <span>Work Proposal // {new Date().getFullYear()}</span>
                                                <span>Professional Service</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'billing' && (
                                    <div className="animate-fadeIn">
                                        <div className="bg-blue-600 text-white p-12 flex justify-between items-start">
                                            <div>
                                                <h1 className="text-3xl font-bold tracking-tighter uppercase">{heroData.name}</h1>
                                                <p className="font-bold text-[10px] uppercase tracking-[.4em] mt-1 opacity-80">Project Bill / Invoice</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold tracking-tighter">#BILL-{Math.floor(Math.random() * 90000 + 10000)}</p>
                                                <p className="text-[10px] font-bold opacity-60 mt-1">{new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="p-12">
                                            <div className="grid grid-cols-2 gap-12 text-xs uppercase tracking-widest font-bold">
                                                <div>
                                                    <label className="text-slate-400 block mb-3 pl-1">From</label>
                                                    <div className="border-l-4 border-blue-600 pl-4 space-y-1">
                                                        <p className="text-black">{heroData.name}</p>
                                                        <p className="text-slate-400 font-medium lowercase font-sans">{heroData.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <label className="text-slate-400 block mb-3 pr-1">To Client</label>
                                                    <div className="border-r-4 border-slate-200 pr-4 space-y-1">
                                                        <p className="text-black">{clientName}</p>
                                                        <p className="text-slate-400 font-medium lowercase font-sans">{clientEmail}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-12 overflow-hidden border border-slate-100 rounded-xl">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-slate-500 border-b">
                                                            <th className="p-4">Description of Work</th>
                                                            <th className="p-4 text-center">Qty</th>
                                                            <th className="p-4 text-right">Unit Price</th>
                                                            <th className="p-4 text-right">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {billItems.map((item, idx) => (
                                                            <tr key={idx} className="border-b border-slate-50">
                                                                <td className="p-4 font-semibold text-slate-800">{item.desc}</td>
                                                                <td className="p-4 text-center text-slate-500">x{item.qty}</td>
                                                                <td className="p-4 text-right text-slate-500">₹{item.price.toLocaleString()}</td>
                                                                <td className="p-4 text-right font-bold text-black tabular-nums">₹{(item.price * item.qty).toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="flex justify-end pt-10">
                                                <div className="w-64 space-y-3">
                                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                        <span>Subtotal</span>
                                                        <span>₹{totalBill.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                        <span>Tax (0%)</span>
                                                        <span>₹0</span>
                                                    </div>
                                                    <div className="flex justify-between pt-6 border-t-4 border-black font-bold text-2xl tracking-tighter text-blue-600">
                                                        <span>Grand Total</span>
                                                        <span>₹{totalBill.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-20 p-8 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                                                <p className="mb-2 font-bold uppercase tracking-widest text-black">Payment Information</p>
                                                <p>Please complete the payment within 15 days of receiving this bill. You can pay via Bank Transfer or UPI. Thank you for choosing my services!</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FreelanceAdmin;
