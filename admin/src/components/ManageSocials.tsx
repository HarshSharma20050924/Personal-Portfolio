
import React, { useState, useEffect } from 'react';
import type { SocialLink } from '../types';
import { Link, Globe } from 'lucide-react';

interface ManageSocialsProps {
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
}

const ManageSocials: React.FC<ManageSocialsProps> = ({ socialLinks, setSocialLinks }) => {
  const blankForm: SocialLink = { name: '', url: '', icon: '' };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<SocialLink>(blankForm);

  useEffect(() => {
    if (isEditing !== null) {
      setForm(socialLinks[isEditing]);
    }
  }, [socialLinks, isEditing]);

  const detectPlatform = (url: string): string => {
    try {
        const hostname = new URL(url).hostname;
        // Remove 'www.' and get the main domain part
        const parts = hostname.replace('www.', '').split('.');
        // Usually the part before the TLD (com, org) is the platform name
        if (parts.length >= 2) {
            return parts[0].toLowerCase();
        }
        return '';
    } catch (e) {
        return '';
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    // Auto-detect icon if URL changes and icon is empty or matches previous auto-detection
    if (name === 'url') {
        const detected = detectPlatform(value);
        // If icon is empty OR the current icon looks like it was auto-generated from the old URL
        if (!form.icon || (form.url && form.icon === detectPlatform(form.url))) {
             newForm.icon = detected;
        }
    }

    setForm(newForm);

    if (isEditing !== null) {
      setSocialLinks(socialLinks.map((link, index) => (index === isEditing ? newForm : link)));
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) return;
    // Fallback: If no icon specified, use the name as the icon key
    const finalForm = {
        ...form,
        icon: form.icon || form.name.toLowerCase()
    };
    setSocialLinks([...socialLinks, finalForm]);
    setForm(blankForm);
  };

  const handleSelectToEdit = (index: number) => {
    setIsEditing(index);
    setForm(socialLinks[index]);
  };

  const handleDoneEditing = () => {
    setIsEditing(null);
    setForm(blankForm);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      if (isEditing === index) {
        handleDoneEditing();
      }
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
    }
  };

  const currentForm = isEditing !== null ? socialLinks[isEditing] : form;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Social Links</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{isEditing !== null ? 'Edit Link' : 'Add New Link'}</h3>
        <form onSubmit={handleAddNew} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1">
             <label className="block text-xs font-bold text-slate-500 mb-1">Display Name</label>
             <input name="name" value={currentForm.name} onChange={handleFormChange} placeholder="e.g. My GitHub" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>
          <div className="col-span-1 md:col-span-2">
             <label className="block text-xs font-bold text-slate-500 mb-1">URL</label>
             <input name="url" value={currentForm.url} onChange={handleFormChange} placeholder="https://..." className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>
          <div className="col-span-1">
             <label className="block text-xs font-bold text-slate-500 mb-1">Platform ID (Icon)</label>
             <input name="icon" value={currentForm.icon} onChange={handleFormChange} placeholder="Auto-detected..." className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 bg-slate-50 dark:bg-slate-800" />
          </div>
          
          <div className="md:col-span-4 flex items-center space-x-2 mt-2">
            {isEditing === null ? (
              <button type="submit" className="px-6 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">Add Link</button>
            ) : (
              <button type="button" onClick={handleDoneEditing} className="px-6 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Done Editing</button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {socialLinks.map((link, index) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-lg shadow-sm border transition-colors ${isEditing === index ? 'bg-sky-50 border-sky-200 dark:bg-sky-900/20' : 'bg-white border-slate-100 dark:bg-slate-800/50 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  {/* Visual placeholder since we don't have the icon map in Admin, just show generic or text */}
                  <Globe size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{link.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Link size={12} />
                      <span className="truncate max-w-[200px]">{link.url}</span>
                      <span className="bg-slate-200 dark:bg-slate-600 px-1.5 rounded text-[10px] uppercase">{link.icon}</span>
                  </div>
               </div>
            </div>
            <div className="flex-shrink-0 space-x-3">
              <button onClick={() => handleSelectToEdit(index)} className="text-sm text-sky-600 dark:text-sky-400 font-medium hover:underline">Edit</button>
              <button onClick={() => handleDelete(index)} className="text-sm text-red-500 font-medium hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {socialLinks.length === 0 && <p className="text-center text-slate-500 italic">No social links added.</p>}
      </div>
    </div>
  );
};

export default ManageSocials;
