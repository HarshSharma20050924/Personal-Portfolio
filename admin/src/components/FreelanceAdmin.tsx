
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Receipt, Download, Layout, Save, MessageSquare, Bell, Printer, Calculator, RotateCw } from 'lucide-react';
import type { HeroData, Service, Project } from '../types';
import { getFCMToken } from '../utils/firebase';
import API_BASE from '../utils/apiBase';

import BrochureEditor from './freelance/BrochureEditor';
import BrochurePreview from './freelance/BrochurePreview';
import LeadManager from './freelance/LeadManager';
import BillingEditor from './freelance/BillingEditor';
import ClientLedger from './freelance/ClientLedger';

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
    emiDetails?: string;
}

interface FreelanceLead {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: string;
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
    const [adminConfig, setAdminConfig] = useState<any>({
        brochureLogo: '/logo.svg',
        brochureName: 'SYSTEM LABS',
        brochureTitle: 'Premium Software Solutions',
        brochureSubtitle: 'Builder • Harsh Sharma',
        brochurePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop',
        brochureServicesTitle: 'Service Solutions',
        brochureSections: JSON.stringify([]),
        brochurePricing: JSON.stringify([
            { service: 'Landing Page', range: '₹10,000 - ₹20,000', note: 'Conversion optimized, Mobile ready' },
            { service: 'Business System', range: '₹30,000 - ₹40,000', note: 'Custom ERP/CRM, Multi-role access' },
            { service: 'Automation', range: '₹20,000 - ₹30,000', note: 'Workflow & API integration' },
            { service: 'AI Integration', range: '₹30,000 - ₹40,000', note: 'LLM agents, Data processing' }
        ]),
        brochureSocials: JSON.stringify([
            { platform: 'LinkedIn', url: '#' },
            { platform: 'Github', url: '#' }
        ]),
        brochureProjects: '[]',
        brochureManualProjects: '[]',
        brochureTestimonials: '[]'
    });
    
    const [notificationStatus, setNotificationStatus] = useState<'idle' | 'loading' | 'enabled'>('idle');
    const [testimonials, setTestimonials] = useState<any[]>([]);

    useEffect(() => {
        fetchLedger();
        fetchLeads();
        checkNotificationStatus();
        fetchAdminConfig();
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/testimonials`);
            if (res.ok) setTestimonials(await res.json());
        } catch (e) {}
    };

    const fetchLedger = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/ledger`, {
                headers: { 'Authorization': `Bearer ${ADMIN_KEY()}` }
            });
            if (res.ok) setAccounts(await res.json());
        } catch (e) {}
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
        } catch (e) {}
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

    const fetchAdminConfig = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/data/export`);
            const data = await res.json();
            if (data.adminConfig) setAdminConfig(data.adminConfig);
        } catch (e) {}
    };

    const updateAdminConfig = async (field: string, value: any) => {
        const newConfig = { ...adminConfig, [field]: value };
        setAdminConfig(newConfig);
        try {
            await fetch(`${API_BASE}/api/data/config`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_KEY()}` 
                },
                body: JSON.stringify(newConfig)
            });
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
            setAccounts(accounts.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
        } catch (e) {}
    };

    const deleteAccount = async (id: number) => {
        if (!confirm('Archive this account?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/ledger/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${ADMIN_KEY()}` }
            });
            if (res.ok) fetchLedger();
        } catch (e) {}
    };

    const addAccount = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/ledger`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_KEY()}` 
                },
                body: JSON.stringify({
                    clientName: 'New Client',
                    project: 'Project Details',
                    totalAmount: 0,
                    paidAmount: 0,
                    notes: '',
                    status: 'active',
                    date: new Date().toISOString()
                })
            });
            if (res.ok) fetchLedger();
        } catch (e) {}
    };

    const deleteLead = async (id: number) => {
        if (!confirm('Delete lead?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${ADMIN_KEY()}` }
            });
            if (res.ok) fetchLeads();
        } catch (e) {}
    };

    const enableNotifications = async () => {
        setNotificationStatus('loading');
        try {
            const token = await getFCMToken();
            if (token) {
                await fetch(`${API_BASE}/api/notifications/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_KEY()}` },
                    body: JSON.stringify({ token })
                });
                setNotificationStatus('enabled');
            } else {
                setNotificationStatus('idle');
                alert('FCM Token generation failed.');
            }
        } catch (e) {
            setNotificationStatus('idle');
        }
    };

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;
        const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        if (WindowPrt) {
            WindowPrt.document.write(`
                <html>
                    <head>
                        <title>Professional Service Document</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                            @page { size: A4; margin: 0; }
                            body { 
                                font-family: 'Inter', sans-serif; 
                                -webkit-print-color-adjust: exact !important; 
                                print-color-adjust: exact !important;
                                margin: 0; 
                                padding: 0; 
                                background: white;
                                letter-spacing: -0.01em;
                            }
                            .print-container { 
                                width: 210mm; 
                                margin: 0 auto;
                                background: white;
                            }
                            .bg-black { background-color: #000000 !important; -webkit-print-color-adjust: exact !important; }
                            @media print { 
                                .no-print { display: none !important; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-container">${printContent.innerHTML}</div>
                        <script>
                            setTimeout(() => { 
                                window.print(); 
                            }, 1000);
                        </script>
                    </body>
                </html>
            `);
            WindowPrt.document.close();
        }
    };

    const tabs = [
        { id: 'brochure', name: 'Document Hub', icon: FileText, color: 'text-blue-500' },
        { id: 'billing', name: 'Fast Billing', icon: Receipt, color: 'text-amber-500' },
        { id: 'leads', name: 'Inquiries', icon: MessageSquare, color: 'text-indigo-500' },
        { id: 'payments', name: 'Ledger', icon: Calculator, color: 'text-rose-500' }
    ];

    return (
        <div className="space-y-6 animate-fadeIn font-sans pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Freelance Manager</h2>
                    <p className="text-slate-500 text-sm">Automated business operations & document design.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl scale-[1.05]' : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-white' : tab.color} />
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {activeTab === 'brochure' ? (
                    <>
                        <div className="lg:col-span-4 h-fit">
                            <BrochureEditor 
                                adminConfig={adminConfig} 
                                updateAdminConfig={updateAdminConfig}
                                projects={projects}
                                testimonials={testimonials}
                                handlePrint={handlePrint}
                            />
                        </div>
                        <div className="lg:col-span-8">
                            <BrochurePreview 
                                printRef={printRef}
                                adminConfig={adminConfig}
                                heroData={heroData}
                                projects={projects}
                                testimonials={testimonials}
                                activeTab={activeTab}
                            />
                        </div>
                    </>
                ) : activeTab === 'leads' ? (
                    <div className="lg:col-span-12">
                        <LeadManager 
                            leads={leads}
                            notificationStatus={notificationStatus}
                            enableNotifications={enableNotifications}
                            deleteLead={deleteLead}
                        />
                    </div>
                ) : activeTab === 'billing' ? (
                    <>
                        <div className="lg:col-span-4 h-fit">
                            <BillingEditor 
                                clientName={clientName}
                                setClientName={setClientName}
                                clientEmail={clientEmail}
                                setClientEmail={setClientEmail}
                                billItems={billItems}
                                addBillItem={() => setBillItems([...billItems, { desc: '', price: 0, qty: 1 }])}
                                removeBillItem={(idx) => setBillItems(billItems.filter((_, i) => i !== idx))}
                                updateBillItem={(idx, field, value) => {
                                    const newList = [...billItems];
                                    (newList[idx] as any)[field] = value;
                                    setBillItems(newList);
                                }}
                            />
                        </div>
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice Preview</span>
                                    <button onClick={handlePrint} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Printer size={16} /></button>
                                </div>
                                <div ref={printRef}>
                                    <div className="bg-black text-white p-12 border-b-8 border-blue-600">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-6">
                                                <img src="/logo.svg" className="w-12 h-12" />
                                                <div>
                                                    <h1 className="text-3xl font-black">{adminConfig.brochureName || heroData.name}</h1>
                                                    <p className="text-[10px] uppercase font-bold tracking-[.4em] opacity-60">Service Invoice</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black">#INV-{new Date().getFullYear()}-{accounts.length + 1}</p>
                                                <p className="text-[10px] font-bold opacity-60 mt-1">{new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-12 space-y-12">
                                        <div className="grid grid-cols-2 gap-12 text-xs uppercase tracking-widest font-black">
                                            <div className="border-l-4 border-blue-600 pl-4">
                                                <p className="text-slate-400 mb-2">From</p>
                                                <p className="text-slate-900">{heroData.name}</p>
                                                <p className="text-slate-400 lowercase font-medium">{heroData.email}</p>
                                            </div>
                                            <div className="text-right border-r-4 border-slate-100 pr-4">
                                                <p className="text-slate-400 mb-2">Billing To</p>
                                                <p className="text-slate-900">{clientName}</p>
                                                <p className="text-slate-400 lowercase font-medium">{clientEmail}</p>
                                            </div>
                                        </div>
                                        <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                                                    <tr>
                                                        <th className="p-6">Description</th>
                                                        <th className="p-6 text-center">Qty</th>
                                                        <th className="p-6 text-right">Unit Price</th>
                                                        <th className="p-6 text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs">
                                                    {billItems.map((item, idx) => (
                                                        <tr key={idx} className="border-t border-slate-50">
                                                            <td className="p-6 font-bold">{item.desc}</td>
                                                            <td className="p-6 text-center">{item.qty}</td>
                                                            <td className="p-6 text-right">₹{item.price.toLocaleString()}</td>
                                                            <td className="p-6 text-right font-black">₹{(item.price * item.qty).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="bg-slate-50 p-8 flex justify-end gap-12 border-t text-blue-600">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Amount Due</p>
                                                    <p className="text-4xl font-black">₹{billItems.reduce((s, i) => s + (i.price * i.qty), 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end pt-8 border-t">
                                            <div className="text-[10px] font-black uppercase text-slate-400 leading-relaxed">
                                                <p>Contact: {adminConfig.contactPhone || heroData.phone}</p>
                                                <p>Email: {adminConfig.contactEmail || heroData.email}</p>
                                            </div>
                                            <div className="text-center px-10 border-t pt-4">
                                                <p className="text-[10px] font-black uppercase text-slate-400">Authorized Signature</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="lg:col-span-12">
                        <ClientLedger 
                            accounts={accounts}
                            fetchLedger={fetchLedger}
                            updateAccount={updateAccount}
                            deleteAccount={deleteAccount}
                            addAccount={addAccount}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreelanceAdmin;
