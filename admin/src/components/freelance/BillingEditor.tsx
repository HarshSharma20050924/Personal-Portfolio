
import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';

interface BillingEditorProps {
    clientName: string;
    setClientName: (v: string) => void;
    clientEmail: string;
    setClientEmail: (v: string) => void;
    billItems: { desc: string, price: number, qty: number }[];
    addBillItem: () => void;
    removeBillItem: (idx: number) => void;
    updateBillItem: (idx: number, field: string, value: any) => void;
}

const BillingEditor: React.FC<BillingEditorProps> = ({
    clientName, setClientName, clientEmail, setClientEmail,
    billItems, addBillItem, removeBillItem, updateBillItem
}) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
                <h3 className="font-bold mb-6 flex items-center gap-2 border-b pb-4">
                    <Users size={20} className="text-blue-500" /> Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Client Name</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 outline-none focus:border-blue-500 transition-all font-medium"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Email Address</label>
                        <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 outline-none focus:border-blue-500 transition-all font-medium"
                            placeholder="client@example.com"
                        />
                    </div>
                </div>

                <h3 className="font-bold mt-12 mb-6 flex items-center gap-2 border-b pb-4">
                    <Plus size={20} className="text-blue-500" /> Billable Line Items
                </h3>
                <div className="space-y-4">
                    {billItems.map((item, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 relative group hover:border-blue-200 transition-all">
                            <button
                                onClick={() => removeBillItem(idx)}
                                className="absolute top-4 right-4 text-red-400 p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[10px] uppercase font-black text-slate-400">Description</label>
                                    <input
                                        placeholder="Service or Product name"
                                        value={item.desc}
                                        onChange={(e) => updateBillItem(idx, 'desc', e.target.value)}
                                        className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 outline-none font-bold text-slate-800 dark:text-white"
                                    />
                                </div>
                                <div className="md:col-span-1 space-y-2">
                                    <label className="text-[10px] uppercase font-black text-slate-400">Unit Price</label>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => updateBillItem(idx, 'price', parseFloat(e.target.value))}
                                        className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 outline-none font-bold text-blue-600"
                                    />
                                </div>
                                <div className="md:col-span-1 space-y-2">
                                    <label className="text-[10px] uppercase font-black text-slate-400">Qty</label>
                                    <input
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => updateBillItem(idx, 'qty', parseInt(e.target.value))}
                                        className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 outline-none font-bold text-center"
                                    />
                                </div>
                                <div className="md:col-span-1 text-right pb-1">
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Total</p>
                                    <p className="font-black text-slate-900 dark:text-white">₹{(item.price * item.qty).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addBillItem}
                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest"
                    >
                        <Plus size={16} /> Add New Row
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingEditor;
