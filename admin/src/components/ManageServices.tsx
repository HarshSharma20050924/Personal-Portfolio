
import React, { useState } from 'react';
import type { Service } from '../types';
import { Briefcase, Trash2, Edit2, Plus } from 'lucide-react';

interface ManageServicesProps {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

const ManageServices: React.FC<ManageServicesProps> = ({ services, setServices }) => {
  const blankForm: Service = { title: '', tagline: '', description: '', icon: 'Globe' };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Service>(blankForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setServices([...services, { ...form, id: Date.now() }]); // Temp ID for UI
    setForm(blankForm);
  };

  const handleUpdate = () => {
    if (isEditing === null) return;
    const updated = services.map((s, i) => i === isEditing ? form : s);
    setServices(updated);
    setIsEditing(null);
    setForm(blankForm);
  };

  const handleEdit = (index: number) => {
    setIsEditing(index);
    setForm(services[index]);
  };

  const handleDelete = (index: number) => {
    if (confirm('Delete this service?')) {
        setServices(services.filter((_, i) => i !== index));
        if (isEditing === index) {
            setIsEditing(null);
            setForm(blankForm);
        }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Side */}
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md h-fit">
        <h3 className="text-xl font-bold mb-4">{isEditing !== null ? 'Edit Expertise' : 'Add New Expertise'}</h3>
        <form onSubmit={isEditing !== null ? (e) => { e.preventDefault(); handleUpdate(); } : handleAdd} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Website Engineering" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tagline</label>
                <input name="tagline" value={form.tagline || ''} onChange={handleChange} placeholder="e.g. Speed. Authority. Conversion." className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the service..." className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Icon (Lucide Name)</label>
                <select name="icon" value={form.icon} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
                    <option value="Globe">Globe</option>
                    <option value="Zap">Zap</option>
                    <option value="Bot">Bot (AI)</option>
                    <option value="Cpu">Cpu</option>
                    <option value="BarChart3">BarChart3</option>
                    <option value="Code">Code</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Server">Server</option>
                </select>
            </div>
            <button type="submit" className="w-full py-2 bg-sky-500 text-white rounded hover:bg-sky-600 font-bold flex justify-center items-center gap-2">
                {isEditing !== null ? <><Edit2 size={16}/> Update Service</> : <><Plus size={16}/> Add Service</>}
            </button>
            {isEditing !== null && (
                <button type="button" onClick={() => { setIsEditing(null); setForm(blankForm); }} className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded hover:bg-slate-300 font-bold">
                    Cancel
                </button>
            )}
        </form>
      </div>

      {/* List Side */}
      <div className="space-y-4">
        {services.length === 0 && <p className="text-slate-500 italic">No expertise added yet.</p>}
        {services.map((service, index) => (
            <div key={index} className={`p-4 border rounded-lg flex justify-between items-start ${isEditing === index ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                <div>
                    <h4 className="font-bold text-lg">{service.title}</h4>
                    <p className="text-xs text-purple-500 font-mono mb-2">{service.tagline}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{service.description}</p>
                    <span className="inline-block mt-2 text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">Icon: {service.icon}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={() => handleEdit(index)} className="p-2 text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"><Trash2 size={16} /></button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ManageServices;
