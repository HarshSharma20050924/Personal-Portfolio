
import React from 'react';
import { Download, Trash2, X, Plus, ShieldCheck, Layout, User, Share2, IndianRupee, Briefcase, MessageSquare, PlusCircle } from 'lucide-react';
import type { Project, SocialLink } from '../../types';

interface BrochureEditorProps {
    adminConfig: any;
    updateAdminConfig: (field: string, value: any) => void;
    projects: Project[];
    testimonials: any[];
    handlePrint: () => void;
    socialLinks: SocialLink[];
}

const BrochureEditor: React.FC<BrochureEditorProps> = ({ 
    adminConfig, 
    updateAdminConfig, 
    projects, 
    testimonials, 
    handlePrint,
    socialLinks 
}) => {
    const parseJSON = (data: any, fallback: any = []) => {
        try {
            return typeof data === 'string' ? JSON.parse(data || JSON.stringify(fallback)) : (data || fallback);
        } catch (e) {
            return fallback;
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-10">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
                <div>
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <Layout className="text-blue-600" size={20} /> Brochure Architect
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Design your professional agency document</p>
                </div>
                <button onClick={handlePrint} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10">
                    <Download size={14} /> GENERATE DOCUMENT
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* 1. Identity & Contact */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
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
                        </div>
                    </div>
                </div>

                {/* 1.5 Social Links from Database */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
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

                {/* 2. Services & Pricing */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center border-b pb-4 mb-8">
                        <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-blue-600 tracking-[.2em]">
                            <IndianRupee size={14} /> Service Inventory
                        </h4>
                        <button 
                            onClick={() => {
                                let list = parseJSON(adminConfig.brochurePricing);
                                list.push({ service: 'New Solution', range: '₹10k - ₹20k', note: 'Essential features included' });
                                updateAdminConfig('brochurePricing', JSON.stringify(list));
                            }}
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1">
                            <PlusCircle size={12} /> Add
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parseJSON(adminConfig.brochurePricing).map((p:any, idx:number) => (
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
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Selling Point / Note</label>
                                        <input value={p.note} onChange={(e) => {
                                            let list = parseJSON(adminConfig.brochurePricing);
                                            list[idx].note = e.target.value;
                                            updateAdminConfig('brochurePricing', JSON.stringify(list));
                                        }} className="w-full bg-transparent text-[10px] outline-none text-slate-500" placeholder="Small detail..." />
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
                        ))}
                    </div>
                </div>

                {/* 3. Portfolio Projects */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
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

                    {/* Manual Entry */}
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
                                    <div className="grid grid-cols-1 gap-2">
                                        <input placeholder="Image URL" value={p.image} onChange={(e) => {
                                            let list = parseJSON(adminConfig.brochureManualProjects);
                                            list[idx].image = e.target.value;
                                            updateAdminConfig('brochureManualProjects', JSON.stringify(list));
                                        }} className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-[10px] outline-none shadow-sm" />
                                        <input placeholder="Project Link" value={p.link} onChange={(e) => {
                                            let list = parseJSON(adminConfig.brochureManualProjects);
                                            list[idx].link = e.target.value;
                                            updateAdminConfig('brochureManualProjects', JSON.stringify(list));
                                        }} className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-[10px] outline-none shadow-sm" />
                                    </div>
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
                                    <div className={`absolute inset-0 flex items-center justify-center p-2 text-center text-[8px] font-black uppercase text-white shadow-inner transition-all ${selected ? 'bg-blue-600/40 backdrop-blur-[2px]' : 'bg-black/20 opacity-0 hover:opacity-100'}`}>
                                        {p.title}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {/* Database Project Overrides */}
                    {parseJSON(adminConfig.brochureProjects).length > 0 && (
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customize Selected Portfolio Projects</h5>
                            {projects.filter(p => parseJSON(adminConfig.brochureProjects).includes(p.id)).map(p => {
                                const customData = parseJSON(adminConfig.brochureProjectCustomizations, {})[p.id || 0] || {};
                                return (
                                    <div key={`custom-${p.id}`} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <img src={p.imageUrl} className="w-10 h-10 object-cover rounded-lg" />
                                            <span className="font-bold text-sm">{p.title}</span>
                                        </div>
                                        <input 
                                            placeholder={`Link (Default: ${p.liveUrl || p.repoUrl || 'None'})`} 
                                            value={customData.link !== undefined ? customData.link : ''} 
                                            onChange={(e) => {
                                                const customizations = parseJSON(adminConfig.brochureProjectCustomizations, {});
                                                customizations[p.id!] = { ...customData, link: e.target.value };
                                                updateAdminConfig('brochureProjectCustomizations', JSON.stringify(customizations));
                                            }} 
                                            className="w-full bg-white dark:bg-slate-800 border rounded-xl p-2 text-[10px] outline-none" 
                                        />
                                        <textarea 
                                            placeholder={`Description (Default is from main DB)`} 
                                            value={customData.description !== undefined ? customData.description : (p.description || '')} 
                                            onChange={(e) => {
                                                const customizations = parseJSON(adminConfig.brochureProjectCustomizations, {});
                                                customizations[p.id!] = { ...customData, description: e.target.value };
                                                updateAdminConfig('brochureProjectCustomizations', JSON.stringify(customizations));
                                            }} 
                                            className="w-full bg-white dark:bg-slate-800 border rounded-xl p-2 text-[10px] outline-none resize-none h-16" 
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 4. Custom Sections (Trust & Support) */}
                <div className="bg-slate-900 overflow-hidden rounded-[2.5rem] text-white shadow-2xl border border-white/5">
                    <div className="p-8 pb-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-[.3em]">
                                <MessageSquare size={14} /> Trust & Support
                            </h4>
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

                    <div className="px-8 pb-8 space-y-6">
                        {parseJSON(adminConfig.brochureSections).map((sec:any, sIdx:number) => (
                            <div key={sIdx} className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden group/sec">
                                <div className="flex items-center gap-3 bg-white/[0.03] p-4 border-b border-white/5">
                                    <input value={sec.title} onChange={(e) => {
                                        let list = parseJSON(adminConfig.brochureSections);
                                        list[sIdx].title = e.target.value;
                                        updateAdminConfig('brochureSections', JSON.stringify(list));
                                    }} className="bg-transparent font-black text-[10px] uppercase tracking-[.2em] outline-none text-blue-400 flex-1" placeholder="Category Title (e.g. Policies)" />
                                    <button onClick={() => {
                                        if(!confirm('Delete this entire section?')) return;
                                        let list = parseJSON(adminConfig.brochureSections);
                                        list.splice(sIdx, 1);
                                        updateAdminConfig('brochureSections', JSON.stringify(list));
                                    }} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={12}/></button>
                                </div>
                                
                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        {sec.items.map((item:any, iIdx:number) => (
                                            <div key={iIdx} className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05] relative group/point transition-all hover:bg-white/[0.05] hover:border-white/10">
                                                <button onClick={() => {
                                                    let list = parseJSON(adminConfig.brochureSections);
                                                    list[sIdx].items.splice(iIdx, 1);
                                                    updateAdminConfig('brochureSections', JSON.stringify(list));
                                                }} className="absolute top-4 right-4 text-white/10 hover:text-red-400 opacity-0 group-hover/point:opacity-100 transition-all"><X size={14}/></button>
                                                
                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black uppercase text-blue-400/50 tracking-widest pl-1">Point Title</label>
                                                        <input placeholder="e.g. 24/7 Availability" value={item.title} onChange={(e) => {
                                                            let list = parseJSON(adminConfig.brochureSections);
                                                            list[sIdx].items[iIdx].title = e.target.value;
                                                            updateAdminConfig('brochureSections', JSON.stringify(list));
                                                        }} className="w-full bg-white/[0.05] border border-white/5 p-2 rounded-lg font-bold text-[10px] outline-none text-white focus:border-blue-500/50 transition-all" />
                                                    </div>
                                                    
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black uppercase text-white/20 tracking-widest pl-1">Description</label>
                                                        <textarea placeholder="Supporting details..." value={item.text} onChange={(e) => {
                                                            let list = parseJSON(adminConfig.brochureSections);
                                                            list[sIdx].items[iIdx].text = e.target.value;
                                                            updateAdminConfig('brochureSections', JSON.stringify(list));
                                                        }} className="w-full bg-white/[0.05] border border-white/5 p-2 rounded-lg text-[10px] text-white/60 outline-none resize-none h-16 focus:border-blue-500/50 transition-all" />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black uppercase text-white/20 tracking-widest pl-1">Icon Identifier/URL</label>
                                                        <input placeholder="e.g. Shield, Clock, or https://..." value={item.image} onChange={(e) => {
                                                            let list = parseJSON(adminConfig.brochureSections);
                                                            list[sIdx].items[iIdx].image = e.target.value;
                                                            updateAdminConfig('brochureSections', JSON.stringify(list));
                                                        }} className="w-full bg-white/[0.05] border border-white/5 p-2 rounded-lg text-[9px] text-white/40 outline-none focus:border-blue-500/50 transition-all" />
                                                    </div>
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
                                        className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase text-white/30 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/5 transition-all flex items-center justify-center gap-2">
                                        <PlusCircle size={12} /> Add USP Point
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrochureEditor;
