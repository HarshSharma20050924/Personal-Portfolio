import React, { useState } from 'react';
import { 
    Download, Trash2, X, Plus, ShieldCheck, Layout, User, Share2, 
    IndianRupee, DollarSign, Briefcase, MessageSquare, PlusCircle, 
    ArrowUp, ArrowDown, Settings, CreditCard
} from 'lucide-react';
import type { Project, SocialLink } from '../../types';



interface BrochureEditorProps {
    adminConfig: any;
    updateAdminConfig: (field: string, value: any) => void;
    bulkSaveAdminConfig: (overrides: Record<string, any>) => Promise<void>;
    projects: Project[];
    testimonials: any[];
    handlePrint: () => void;
    socialLinks: SocialLink[];
    showPreview?: boolean;
    setShowPreview?: (v: boolean) => void;
}

type EditorTab = 'identity' | 'socials' | 'services' | 'portfolio' | 'trust';

const BrochureEditor: React.FC<BrochureEditorProps> = ({ 
    adminConfig, 
    updateAdminConfig,
    bulkSaveAdminConfig,
    projects, 
    testimonials, 
    handlePrint,
    socialLinks,
    showPreview = true,
    setShowPreview
}) => {
    // Systematic Tab Navigation State
    const [activeTab, setActiveTab] = useState<EditorTab>('identity');
    const [isTranslating, setIsTranslating] = useState(false);
    const [hasSnapshot, setHasSnapshot] = useState(() => !!localStorage.getItem('brochure_en_snapshot'));

    const parseJSON = (data: any, fallback: any = []) => {
        try {
            return typeof data === 'string' ? JSON.parse(data || JSON.stringify(fallback)) : (data || fallback);
        } catch (e) {
            return fallback;
        }
    };

    // Tab Configuration Metadata
    const tabs = [
        { id: 'identity', label: 'Identity & Info', icon: User },
        { id: 'socials', label: 'Socials Connect', icon: Share2 },
        { id: 'services', label: 'Service Inventory', icon: CreditCard },
        { id: 'portfolio', label: 'Featured Works', icon: Briefcase },
        { id: 'trust', label: 'Trust & Support', icon: MessageSquare },
        
    ] as const;

    return (
        
        <div className="space-y-6 animate-fadeIn pb-10 max-w-7xl mx-auto">
            {/* Header / Actions Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
                <div>
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <Layout className="text-blue-600" size={20} /> Brochure Architect
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Design your professional agency document</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {setShowPreview && (
                        <button 
                            onClick={() => setShowPreview(!showPreview)} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest hover:bg-slate-200 transition-all shadow-sm"
                        >
                            {showPreview ? 'HIDE PREVIEW' : 'SHOW PREVIEW'}
                        </button>
                    )}
                    <button 
                        onClick={async () => {
                            if (!window.confirm("Translate brochure content to Hindi? Your English version will be saved so you can restore it.")) return;
                            setIsTranslating(true);
                            try {
                                // --- Save English snapshot FIRST ---
                                const snapshot: Record<string, any> = {};
                                const snapKeys = [
                                    'brochureName', 'brochureTitle', 'brochureSubtitle', 'brochureServicesTitle',
                                    'brochurePricingNotes', 'brochurePricing', 'brochureSections', 'brochureManualProjects'
                                ];
                                for (const k of snapKeys) snapshot[k] = adminConfig[k];
                                localStorage.setItem('brochure_en_snapshot', JSON.stringify(snapshot));
                                setHasSnapshot(true);

                                // --- Simple, reliable one-at-a-time translator ---
                                const t1 = async (text: string): Promise<string> => {
                                    if (!text?.trim()) return text;
                                    try {
                                        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`);
                                        const data = await res.json();
                                        const out = data?.responseData?.translatedText;
                                        await new Promise(r => setTimeout(r, 200));
                                        return out && !out.includes('MYMEMORY WARNING') ? out : text;
                                    } catch { return text; }
                                };

                                // Identity fields
                                if (adminConfig.brochureTitle) updateAdminConfig('brochureTitle', await t1(adminConfig.brochureTitle));
                                if (adminConfig.brochureSubtitle) updateAdminConfig('brochureSubtitle', await t1(adminConfig.brochureSubtitle));
                                if (adminConfig.brochureServicesTitle) updateAdminConfig('brochureServicesTitle', await t1(adminConfig.brochureServicesTitle));
                                if (adminConfig.brochurePricingNotes) updateAdminConfig('brochurePricingNotes', await t1(adminConfig.brochurePricingNotes));

                                // Pricing items — translate service name + each feature individually
                                try {
                                    let pricing = parseJSON(adminConfig.brochurePricing);
                                    for (let p of pricing) {
                                        if (p.service) p.service = await t1(p.service);
                                        if (Array.isArray(p.features)) {
                                            for (let i = 0; i < p.features.length; i++) {
                                                if (p.features[i]) p.features[i] = await t1(p.features[i]);
                                            }
                                            p.note = p.features.join(', ');
                                        }
                                    }
                                    updateAdminConfig('brochurePricing', JSON.stringify(pricing));
                                } catch (e) {}

                                // Manual projects
                                try {
                                    let manual = parseJSON(adminConfig.brochureManualProjects);
                                    for (let p of manual) {
                                        if (p.title) p.title = await t1(p.title);
                                        if (p.description) p.description = await t1(p.description);
                                    }
                                    updateAdminConfig('brochureManualProjects', JSON.stringify(manual));
                                } catch (e) {}

                                // Custom sections (trust/support)
                                try {
                                    let sections = parseJSON(adminConfig.brochureSections);
                                    for (let s of sections) {
                                        if (s.title) s.title = await t1(s.title);
                                        if (Array.isArray(s.items)) {
                                            for (let i of s.items) {
                                                if (i.title) i.title = await t1(i.title);
                                                if (i.text)  i.text  = await t1(i.text);
                                            }
                                        }
                                    }
                                    updateAdminConfig('brochureSections', JSON.stringify(sections));
                                } catch (e) {}
                                
                                alert("Translation complete! Click 'RESTORE EN' to go back to English.");
                            } catch (e) {
                                console.error(e);
                                alert("Translation failed. Please try again.");
                            } finally {
                                setIsTranslating(false);
                            }
                        }} 
                        disabled={isTranslating}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    >
                        {isTranslating ? 'TRANSLATING...' : 'TRANSLATE (HI)'}
                    </button>

                    {hasSnapshot && (
                        <button 
                            onClick={async () => {
                                if (!window.confirm('Restore the saved English version? This will overwrite all current brochure content.')) return;
                                try {
                                    const snapshot = JSON.parse(localStorage.getItem('brochure_en_snapshot') || '{}');
                                    if (Object.keys(snapshot).length === 0) {
                                        alert('No English snapshot found.');
                                        return;
                                    }
                                    // Single atomic save — no race conditions
                                    await bulkSaveAdminConfig(snapshot);
                                    alert('English version restored and saved to server!');
                                } catch (e) {
                                    alert('Could not restore snapshot.');
                                }
                            }}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-50 text-amber-600 px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                        >
                            RESTORE EN
                        </button>
                    )}
                    <button onClick={handlePrint} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10">
                        <Download size={14} /> GENERATE DOCUMENT
                    </button>
                </div>
            </div>

            {/* Systematic Modular Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* Fixed Structural Sidebar Navigation */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2">Architecture Panels</p>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-xs font-bold transition-all ${
                                    isActive 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                                }`}
                            >
                                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Dynamic Section Viewport */}
                <div className="lg:col-span-3 min-h-[500px]">
                    
                    {/* 1. Identity & Contact Panel */}
                    {activeTab === 'identity' && (
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn">
                            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 tracking-[.2em] mb-8 border-b pb-4">
                                <User size={14} /> Personal Identity
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Full Name / Brand</label>
                                        <input value={adminConfig.brochureName || ''} onChange={(e) => updateAdminConfig('brochureName', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="e.g. SYSTEM LABS" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Expertise Title</label>
                                        <input value={adminConfig.brochureTitle || ''} onChange={(e) => updateAdminConfig('brochureTitle', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="e.g. Software Architect" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Brand Logo URL</label>
                                        <input value={adminConfig.brochureLogo || ''} onChange={(e) => updateAdminConfig('brochureLogo', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="URL to brand logo icon" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Profile Photo URL</label>
                                        <input value={adminConfig.brochurePhoto || ''} onChange={(e) => updateAdminConfig('brochurePhoto', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="URL to profile image" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Website Link</label>
                                        <input value={adminConfig.brochureWebsite || ''} onChange={(e) => updateAdminConfig('brochureWebsite', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="www.yourwebsite.com" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Website Display Title</label>
                                        <input value={adminConfig.brochureWebsiteTitle || ''} onChange={(e) => updateAdminConfig('brochureWebsiteTitle', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="e.g. System Labs" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Contact Email</label>
                                        <input value={adminConfig.contactEmail || ''} onChange={(e) => updateAdminConfig('contactEmail', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="hello@example.com" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Contact Phone</label>
                                        <input value={adminConfig.contactPhone || ''} onChange={(e) => updateAdminConfig('contactPhone', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="+91 XXXX XXX XXX" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Tagline / Bio</label>
                                        <input value={adminConfig.brochureSubtitle || ''} onChange={(e) => updateAdminConfig('brochureSubtitle', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="Fullstack Builder" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-slate-400">Services Section Heading</label>
                                        <input value={adminConfig.brochureServicesTitle || ''} onChange={(e) => updateAdminConfig('brochureServicesTitle', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="Service Solutions" />
                                    </div>
                                    <div className="space-y-1.5 pt-2 flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="hideNamePhoto"
                                            checked={adminConfig.brochureHideNamePhoto || false} 
                                            onChange={(e) => updateAdminConfig('brochureHideNamePhoto', e.target.checked)} 
                                            className="w-4 h-4 cursor-pointer accent-blue-600"
                                        />
                                        <label htmlFor="hideNamePhoto" className="text-[10px] uppercase font-black text-slate-600 dark:text-slate-300 cursor-pointer">Hide Name & Photo in Brochure</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Social Connections Panel */}
                    {activeTab === 'socials' && (
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn">
                            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 tracking-[.2em] mb-4 border-b pb-4">
                                <Share2 size={14} /> Social Connections
                            </h4>
                            <p className="text-[10px] text-slate-400 mb-6">Select which social links to show on your brochure footer.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {socialLinks.map((link) => {
                                    const selectedSocials: string[] = parseJSON(adminConfig.brochureSocials, []);
                                    const isSelected = selectedSocials.some((s: any) => 
                                        typeof s === 'object' ? s.platform === link.name : false  
                                    );
                                    return (
                                        <button
                                            key={link.id || link.name}
                                            onClick={() => {
                                                let list: any[] = parseJSON(adminConfig.brochureSocials, []);
                                                if (isSelected) {
                                                    list = list.filter((s: any) => s.platform !== link.name);
                                                } else {
                                                    list.push({ platform: link.name, url: link.url });
                                                }
                                                updateAdminConfig('brochureSocials', JSON.stringify(list));
                                            }}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                                                isSelected 
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                                                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                                                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                            }`}>
                                                {link.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>{link.name}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                                isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                                            }`}>
                                                {isSelected && <span className="text-white text-[10px]">✓</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {socialLinks.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-6">No social links found in your database. Add them via the "Social Links" section in Main mode.</p>
                            )}
                        </div>
                    )}

                    {/* 3. Services & Pricing Panel */}
                    {activeTab === 'services' && (
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn">
                            <div className="flex justify-between items-center border-b pb-4 mb-8">
                                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 tracking-[.2em]">
                                    <DollarSign size={14} className="mr-[-6px]" /><IndianRupee size={14} /> Service Inventory
                                </h4>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            let list = parseJSON(adminConfig.brochurePricing);
                                            let convertedList = list.map((item: any) => {
                                                let newRange = item.range;
                                                newRange = newRange.replace(/₹\s*(\d+),000/g, (m: any, p1: string) => '$' + (parseInt(p1) * 10));
                                                newRange = newRange.replace(/₹\s*(\d+)k/gi, (m: any, p1: string) => '$' + (parseInt(p1) * 10));
                                                newRange = newRange.replace(/₹/g, '$');
                                                return { ...item, range: newRange };
                                            });
                                            updateAdminConfig('brochurePricing', JSON.stringify(convertedList));
                                        }}
                                        className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1">
                                        Convert to $
                                    </button>
                                    <button 
                                        onClick={() => {
                                            let list = parseJSON(adminConfig.brochurePricing);
                                            list.push({ service: 'New Solution', range: '$100 - $200', note: 'Essential features included', features: ['Feature 1', 'Feature 2'] });
                                            updateAdminConfig('brochurePricing', JSON.stringify(list));
                                        }}
                                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1">
                                        <PlusCircle size={12} /> Add
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {parseJSON(adminConfig.brochurePricing).map((p:any, idx:number) => {
                                    const featureItems: string[] = Array.isArray(p.features) ? p.features : (p.note ? [p.note] : []);
                                    return (
                                        <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 relative group">
                                            <button onClick={() => {
                                                let list = parseJSON(adminConfig.brochurePricing);
                                                list.splice(idx, 1);
                                                updateAdminConfig('brochurePricing', JSON.stringify(list));
                                            }} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-xl"><Trash2 size={14}/></button>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Service Title</label>
                                                    <input value={p.service} onChange={(e) => {
                                                        let list = parseJSON(adminConfig.brochurePricing);
                                                        list[idx].service = e.target.value;
                                                        updateAdminConfig('brochurePricing', JSON.stringify(list));
                                                    }} className="w-full bg-transparent font-black text-sm outline-none text-slate-800 dark:text-white border-b border-transparent focus:border-blue-500" placeholder="Service Name" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Pricing Range</label>
                                                    <input value={p.range} onChange={(e) => {
                                                        let list = parseJSON(adminConfig.brochurePricing);
                                                        list[idx].range = e.target.value;
                                                        updateAdminConfig('brochurePricing', JSON.stringify(list));
                                                    }} className="w-full bg-transparent font-bold text-xs outline-none text-blue-600 border-b border-transparent focus:border-blue-500" placeholder="₹10k - ₹20k" />
                                                </div>

                                                <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">What's Included</label>
                                                        <button 
                                                            onClick={() => {
                                                                let list = parseJSON(adminConfig.brochurePricing);
                                                                if (!Array.isArray(list[idx].features)) {
                                                                    list[idx].features = list[idx].note ? [list[idx].note] : [];
                                                                }
                                                                list[idx].features.push('');
                                                                updateAdminConfig('brochurePricing', JSON.stringify(list));
                                                            }}
                                                            className="text-[9px] font-black text-blue-500 flex items-center gap-0.5 bg-blue-100/50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md hover:bg-blue-500 hover:text-white transition-all"
                                                        >
                                                            <Plus size={10} /> Add Bullet
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                                        {featureItems.map((feat: string, fIdx: number) => (
                                                            <div key={fIdx} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                                                                <span className="text-blue-500 font-bold text-xs select-none">•</span>
                                                                <input 
                                                                    value={feat} 
                                                                    onChange={(e) => {
                                                                        let list = parseJSON(adminConfig.brochurePricing);
                                                                        if (!Array.isArray(list[idx].features)) {
                                                                            list[idx].features = list[idx].note ? [list[idx].note] : [];
                                                                        }
                                                                        list[idx].features[fIdx] = e.target.value;
                                                                        list[idx].note = list[idx].features.join(', ');
                                                                        updateAdminConfig('brochurePricing', JSON.stringify(list));
                                                                    }} 
                                                                    className="w-full bg-transparent text-[11px] font-medium outline-none text-slate-700 dark:text-slate-200" 
                                                                    placeholder="e.g. Mobile Responsive" 
                                                                />
                                                                <button 
                                                                    onClick={() => {
                                                                        let list = parseJSON(adminConfig.brochurePricing);
                                                                        list[idx].features.splice(fIdx, 1);
                                                                        list[idx].note = list[idx].features.join(', ');
                                                                        updateAdminConfig('brochurePricing', JSON.stringify(list));
                                                                    }}
                                                                    className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-1 pt-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Icon / Image URL</label>
                                                    <input value={p.image || ''} onChange={(e) => {
                                                        let list = parseJSON(adminConfig.brochurePricing);
                                                        list[idx].image = e.target.value;
                                                        updateAdminConfig('brochurePricing', JSON.stringify(list));
                                                    }} className="w-full bg-white dark:bg-slate-800 border rounded-xl p-2 text-[10px] outline-none shadow-sm" placeholder="https://..." />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700 w-full mt-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-black text-slate-400">Global Pricing Terms / Notes</label>
                                    <textarea 
                                        value={adminConfig.brochurePricingNotes || 'Starting price applies to standard projects...'} 
                                        onChange={(e) => updateAdminConfig('brochurePricingNotes', e.target.value)} 
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs font-medium focus:border-blue-500 outline-none transition-all h-28 resize-none" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Portfolio Projects Panel */}
                    {activeTab === 'portfolio' && (
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn">
                            <div className="flex justify-between items-center border-b pb-4 mb-8">
                                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 tracking-[.2em]">
                                    <Briefcase size={14} /> Featured Implementations
                                </h4>
                                <button 
                                    onClick={() => {
                                        let list = parseJSON(adminConfig.brochureManualProjects);
                                        list.push({ title: 'New Project', image: '', link: '', description: '' });
                                        updateAdminConfig('brochureManualProjects', JSON.stringify(list));
                                    }}
                                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1">
                                    <PlusCircle size={12} /> Add Manual
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {parseJSON(adminConfig.brochureManualProjects).map((p:any, idx:number) => (
                                    <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 relative group">
                                        <button onClick={() => {
                                            let list = parseJSON(adminConfig.brochureManualProjects);
                                            list.splice(idx, 1);
                                            updateAdminConfig('brochureManualProjects', JSON.stringify(list));
                                        }} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-neutral-100 rounded-xl"><Trash2 size={14}/></button>
                                        <div className="space-y-3">
                                            <input placeholder="Project Name" value={p.title} onChange={(e) => {
                                                let list = parseJSON(adminConfig.brochureManualProjects);
                                                list[idx].title = e.target.value;
                                                updateAdminConfig('brochureManualProjects', JSON.stringify(list));
                                            }} className="w-full bg-transparent font-black text-sm outline-none text-slate-800 dark:text-white" />
                                            <input placeholder="Image URL" value={p.image} onChange={(e) => {
                                                let list = parseJSON(adminConfig.brochureManualProjects);
                                                list[idx].image = e.target.value;
                                                updateAdminConfig('brochureManualProjects', JSON.stringify(list));
                                            }} className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-[10px] outline-none shadow-sm" />
                                            <input placeholder="Project URL (Link)" value={p.link} onChange={(e) => {
                                                let list = parseJSON(adminConfig.brochureManualProjects);
                                                list[idx].link = e.target.value;
                                                updateAdminConfig('brochureManualProjects', JSON.stringify(list));
                                            }} className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-[10px] outline-none shadow-sm" />
                                            <textarea placeholder="Brief description..." value={p.description} onChange={(e) => {
                                                let list = parseJSON(adminConfig.brochureManualProjects);
                                                list[idx].description = e.target.value;
                                                updateAdminConfig('brochureManualProjects', JSON.stringify(list));
                                            }} className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-[10px] outline-none shadow-sm resize-none h-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select from Main Portfolio</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                {projects.map(p => {
                                    const selected = parseJSON(adminConfig.brochureProjects).includes(p.id);
                                    return (
                                        <button 
                                            key={p.id}
                                            onClick={() => {
                                                let list = parseJSON(adminConfig.brochureProjects);
                                                if (selected) list = list.filter((id:number) => id !== p.id);
                                                else list.push(p.id);
                                                updateAdminConfig('brochureProjects', JSON.stringify(list));
                                            }}
                                            className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${selected ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xl' : 'border-slate-100 dark:border-slate-800 grayscale hover:grayscale-0'}`}
                                        >
                                            <img src={p.imageUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[8px] font-black bg-blue-600/40 opacity-0 hover:opacity-100 transition-all text-white">
                                                {p.title}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Customization for Selected Main Portfolio Projects */}
                            {parseJSON(adminConfig.brochureProjects).length > 0 && (
                                <div className="mt-8 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-t pt-6">Customize Selected Main Projects</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {projects.filter(p => parseJSON(adminConfig.brochureProjects).includes(p.id)).map(p => {
                                            const customMap = parseJSON(adminConfig.brochureProjectCustomizations);
                                            const currentCustom = customMap[p.id || 0] || { link: '', description: '' };
                                            return (
                                                <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <img src={p.imageUrl} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                                                        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{p.title}</h5>
                                                    </div>
                                                    <input 
                                                        placeholder="Override URL (optional)" 
                                                        value={currentCustom.link} 
                                                        onChange={(e) => {
                                                            const newMap = { ...customMap, [p.id || 0]: { ...currentCustom, link: e.target.value } };
                                                            updateAdminConfig('brochureProjectCustomizations', JSON.stringify(newMap));
                                                        }} 
                                                        className="w-full bg-white dark:bg-slate-800 border rounded-xl p-2 text-[10px] outline-none shadow-sm" 
                                                    />
                                                    <textarea 
                                                        placeholder="Override description (optional)" 
                                                        value={currentCustom.description} 
                                                        onChange={(e) => {
                                                            const newMap = { ...customMap, [p.id || 0]: { ...currentCustom, description: e.target.value } };
                                                            updateAdminConfig('brochureProjectCustomizations', JSON.stringify(newMap));
                                                        }} 
                                                        className="w-full bg-white dark:bg-slate-800 border rounded-xl p-2 text-[10px] outline-none shadow-sm resize-none h-16" 
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 5. Trust & Support (Custom Sections) Panel */}
                    {activeTab === 'trust' && (
                        <div className="bg-slate-900 overflow-hidden rounded-[2.5rem] text-white shadow-2xl border border-white/5 animate-fadeIn">
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-[.3em]">
                                        <MessageSquare size={14} /> Trust & Support
                                    </h4>
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm('Translate all Trust & Support sections back to English?')) return;
                                            try {
                                                const t1hi = async (text: string): Promise<string> => {
                                                    if (!text?.trim()) return text;
                                                    try {
                                                        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=hi|en`);
                                                        const data = await res.json();
                                                        const out = data?.responseData?.translatedText;
                                                        await new Promise(r => setTimeout(r, 200));
                                                        return out && !out.includes('MYMEMORY WARNING') ? out : text;
                                                    } catch { return text; }
                                                };

                                                let sections = parseJSON(adminConfig.brochureSections);
                                                for (let s of sections) {
                                                    if (s.title) s.title = await t1hi(s.title);
                                                    if (Array.isArray(s.items)) {
                                                        for (let i of s.items) {
                                                            if (i.title) i.title = await t1hi(i.title);
                                                            if (i.text)  i.text  = await t1hi(i.text);
                                                        }
                                                    }
                                                }
                                                updateAdminConfig('brochureSections', JSON.stringify(sections));
                                                alert('Sections reverted to English!');
                                            } catch (e) {
                                                alert('Revert failed. Please try again.');
                                            }
                                        }}
                                        className="ml-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        ↩ REVERT TO EN
                                    </button>
                                </div>
                                    <button 
                                        onClick={() => {
                                            let list = parseJSON(adminConfig.brochureSections);
                                            list.push({ title: 'New Category', items: [{ title: 'Point Title', text: 'Detail description...', image: '' }] });
                                            updateAdminConfig('brochureSections', JSON.stringify(list));
                                        }}
                                        className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 border border-blue-400/20">
                                        <PlusCircle size={12} /> Add Category
                                    </button>
                                </div>
                            </div>
                            <div className="px-8 pb-8 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {parseJSON(adminConfig.brochureSections).map((sec: any, sIdx: number) => (
                                    <div key={sIdx} className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden group/sec">
                                        <div className="flex items-center gap-3 bg-white/[0.03] p-4 border-b border-white/5">
                                            <input 
                                                value={sec.title} 
                                                onChange={(e) => {
                                                    let list = parseJSON(adminConfig.brochureSections);
                                                    list[sIdx].title = e.target.value;
                                                    updateAdminConfig('brochureSections', JSON.stringify(list));
                                                }} 
                                                className="bg-transparent font-black text-[10px] uppercase tracking-[.2em] outline-none text-blue-400 flex-1" 
                                            />
                                            <div className="flex items-center gap-1">
                                                <button disabled={sIdx === 0} onClick={() => {
                                                    let list = parseJSON(adminConfig.brochureSections);
                                                    if (sIdx > 0) {
                                                        const temp = list[sIdx];
                                                        list[sIdx] = list[sIdx - 1];
                                                        list[sIdx - 1] = temp;
                                                        updateAdminConfig('brochureSections', JSON.stringify(list));
                                                    }
                                                }} className="p-1.5 text-white/20 hover:text-blue-400 disabled:opacity-10"><ArrowUp size={12}/></button>
                                                <button disabled={sIdx === parseJSON(adminConfig.brochureSections).length - 1} onClick={() => {
                                                    let list = parseJSON(adminConfig.brochureSections);
                                                    if (sIdx < list.length - 1) {
                                                        const temp = list[sIdx];
                                                        list[sIdx] = list[sIdx + 1];
                                                        list[sIdx + 1] = temp;
                                                        updateAdminConfig('brochureSections', JSON.stringify(list));
                                                    }
                                                }} className="p-1.5 text-white/20 hover:text-blue-400 disabled:opacity-10"><ArrowDown size={12}/></button>
                                                <button onClick={() => {
                                                    let list = parseJSON(adminConfig.brochureSections);
                                                    list.splice(sIdx, 1);
                                                    updateAdminConfig('brochureSections', JSON.stringify(list));
                                                }} className="p-1.5 text-white/20 hover:text-red-400"><Trash2 size={12}/></button>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                {sec.items && sec.items.map((item: any, iIdx: number) => (
                                                    <div key={iIdx} className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05] relative group/point">
                                                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover/point:opacity-100 transition-all bg-slate-900/80 p-1 rounded-lg">
                                                            <button onClick={() => {
                                                                let list = parseJSON(adminConfig.brochureSections);
                                                                list[sIdx].items.splice(iIdx, 1);
                                                                updateAdminConfig('brochureSections', JSON.stringify(list));
                                                            }} className="text-white/40 hover:text-red-500"><X size={12}/></button>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <input value={item.title} onChange={(e) => {
                                                                let list = parseJSON(adminConfig.brochureSections);
                                                                list[sIdx].items[iIdx].title = e.target.value;
                                                                updateAdminConfig('brochureSections', JSON.stringify(list));
                                                            }} className="w-full bg-white/[0.05] p-2 rounded-lg text-white font-bold text-xs" placeholder="Point Title" />
                                                            <textarea value={item.text} onChange={(e) => {
                                                                let list = parseJSON(adminConfig.brochureSections);
                                                                list[sIdx].items[iIdx].text = e.target.value;
                                                                updateAdminConfig('brochureSections', JSON.stringify(list));
                                                            }} className="w-full bg-white/[0.05] p-2 rounded-lg text-white/60 text-xs h-16 resize-none" placeholder="Description" />
                                                            <input value={item.image || ''} onChange={(e) => {
                                                                let list = parseJSON(adminConfig.brochureSections);
                                                                list[sIdx].items[iIdx].image = e.target.value;
                                                                updateAdminConfig('brochureSections', JSON.stringify(list));
                                                            }} className="w-full bg-white/[0.05] p-2 rounded-lg text-white/60 text-xs" placeholder="Image URL (optional)" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    let list = parseJSON(adminConfig.brochureSections);
                                                    list[sIdx].items.push({ title: 'New Point', text: '', image: '' });
                                                    updateAdminConfig('brochureSections', JSON.stringify(list));
                                                }}
                                                className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[9px] text-white/30 hover:text-blue-400 hover:border-blue-400/30 flex items-center justify-center gap-2"
                                            >
                                                <PlusCircle size={12} /> Add USP Point
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BrochureEditor;