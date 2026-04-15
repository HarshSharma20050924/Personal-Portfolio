
import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Project, HeroData } from '../../types';

interface BrochurePreviewProps {
    printRef: React.RefObject<HTMLDivElement>;
    adminConfig: any;
    heroData: HeroData;
    projects: Project[];
    testimonials: any[];
    activeTab: string;
}

const BrochurePreview: React.FC<BrochurePreviewProps> = ({ 
    printRef, 
    adminConfig, 
    heroData, 
    projects, 
    testimonials,
    activeTab
}) => {
    const parseJSON = (val: any) => {
        try {
            return typeof val === 'string' ? JSON.parse(val || '[]') : (val || []);
        } catch(e) { return []; }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden brochure-container">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                @media print {
                    @page { 
                        size: A4; 
                        margin: 0; 
                    }
                    html, body {
                        width: 210mm;
                        height: 297mm;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .brochure-viewer {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .no-break { break-inside: avoid !important; page-break-inside: avoid !important; }
                    
                    .bg-black { background-color: #000000 !important; -webkit-print-color-adjust: exact !important; }
                    .text-white { color: white !important; }
                    .border-blue-600 { border-color: #2563eb !important; }
                }

                .brochure-font {
                    font-family: 'Inter', sans-serif;
                    letter-spacing: -0.01em;
                }
            `}</style>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b flex justify-between items-center no-print">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Minimalist Professional Document</span>
            </div>

            <div ref={printRef} className="brochure-viewer flex-1 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-950 brochure-font">
                <div id="brochure-content" className="max-w-[210mm] mx-auto bg-white text-slate-900 shadow-xl min-h-[297mm] flex flex-col relative">
                    
                    {/* Header: Clean, Structured Identity */}
                    <div className="bg-black text-white p-12 sm:p-16 flex flex-col sm:flex-row justify-between items-center sm:items-start border-b-[12px] border-blue-600">
                        <div className="flex items-center gap-8 z-10">
                            <div className="w-28 h-28 rounded-full border-2 border-white/20 overflow-hidden">
                                <img src={adminConfig.brochurePhoto || 'https://1juvu95fflkay0z2.public.blob.vercel-storage.com/output-fA2itO6uP0asksZbDZ9uVBik0qno64.webp'} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold tracking-tight">{heroData.name}</h2>
                                <p className="text-blue-400 font-medium text-xs tracking-wide">{adminConfig.brochureSubtitle || 'Software builder'}</p>
                                <div className="h-[1px] w-full bg-blue-600 mt-2"></div>
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-0 text-center sm:text-right z-10 flex flex-col items-center sm:items-end gap-4">
                            <div className="w-12 h-12 flex items-center justify-center border border-white/10 rounded">
                                <img src={adminConfig.brochureLogo || '/logo.svg'} className="w-10 h-10 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tighter whitespace-nowrap">{adminConfig.brochureName || 'System Labs'}</h1>
                                <p className="text-blue-500 font-bold text-[10px] tracking-[0.3em] uppercase mt-1 mb-3">{adminConfig.brochureTitle || 'Documentation'}</p>
                                <div className="text-[10px] font-medium text-white/60 space-y-1">
                                    <p>{adminConfig.contactEmail || heroData.email}</p>
                                    <p>{adminConfig.contactPhone || heroData.phone}</p>
                                    <p className="text-blue-400">www.systemlabs.tech</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 sm:p-16 flex-1 space-y-16">
                        {/* Services Section */}
                        <div className="space-y-8 no-break">
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h3 className="text-lg font-bold tracking-tight">{adminConfig.brochureServicesTitle || 'Services'}</h3>
                                <p className="text-[10px] text-slate-400 font-medium">Standard pricing and range</p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {parseJSON(adminConfig.brochurePricing).map((p:any, idx:number) => (
                                    <div key={idx} className="p-6 bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-break hover:bg-slate-100/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {p.image && (
                                                <div className="w-10 h-10 bg-white border border-slate-200 p-2 flex-shrink-0 rounded">
                                                    <img src={p.image} className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800">{p.service}</h4>
                                                <p className="text-[10px] text-slate-500">{p.note || 'Starting range'}</p>
                                            </div>
                                        </div>
                                        <div className="sm:text-right flex-shrink-0 border-l sm:border-l-0 sm:border-r border-slate-200 pl-4 sm:pl-0 sm:pr-4">
                                            <p className="text-lg font-bold text-blue-600 tracking-tight">{p.range}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Est. range</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects Section */}
                        {((parseJSON(adminConfig.brochureProjects).length > 0) || (parseJSON(adminConfig.brochureManualProjects).length > 0)) && (
                            <div className="space-y-8 no-break">
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h3 className="text-lg font-bold tracking-tight">Recent work</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Selection of production projects</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    {projects.filter(p => parseJSON(adminConfig.brochureProjects).includes(p.id)).map((p) => (
                                        <div key={p.id} className="no-break space-y-3">
                                            <div className="aspect-video bg-slate-100 border border-slate-200 overflow-hidden rounded">
                                                <img src={p.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800">{p.title}</h4>
                                                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{p.description}</p>
                                                {p.tags && p.tags[0] && (
                                                    <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold rounded uppercase tracking-tighter">{p.tags[0]}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {parseJSON(adminConfig.brochureManualProjects).map((p: any, idx: number) => (
                                        <div key={`m-${idx}`} className="no-break space-y-3">
                                            <div className="aspect-video bg-slate-100 border border-slate-200 overflow-hidden rounded">
                                                <img src={p.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800">{p.title}</h4>
                                                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{p.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Sections (Trust etc) */}
                        {parseJSON(adminConfig.brochureSections).map((sec: any, idx: number) => (
                            <div key={idx} className="space-y-8 no-break">
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h3 className="text-lg font-bold tracking-tight">{sec.title}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    {sec.items.map((item: any, iIdx: number) => (
                                        <div key={iIdx} className="flex gap-4 items-start no-break">
                                            {item.image && (
                                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center flex-shrink-0 p-1.5 border border-blue-100">
                                                    <img src={item.image} className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer: Action focused, extremely clean */}
                    <div className="mt-auto border-t border-slate-100">
                        <a 
                            href={`https://wa.me/${(adminConfig.contactPhone || heroData.phone).replace(/\D/g, '')}?text=${encodeURIComponent("Hi, I saw your brochure and I'm interested in starting a project.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black text-white p-12 sm:p-14 flex flex-col sm:flex-row justify-between items-center no-underline gap-6"
                        >
                            <div className="text-center sm:text-left">
                                <h3 className="text-2xl font-bold tracking-tight mb-1">Start project</h3>
                                <p className="text-[10px] text-white/50 font-medium">WhatsApp: {adminConfig.contactPhone || heroData.phone}</p>
                            </div>
                            <div className="flex gap-3">
                                {parseJSON(adminConfig.brochureSocials).filter((s:any) => s.url && s.url !== '#').map((s:any, idx:number) => (
                                    <div key={idx} className="px-4 py-2 border border-white/10 rounded text-[9px] font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest">
                                        {s.platform}
                                    </div>
                                ))}
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrochurePreview;
