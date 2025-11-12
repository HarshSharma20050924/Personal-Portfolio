import React, { useState, useEffect } from 'react';
import type { SocialLink } from '../types';

interface ManageSocialsProps {
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
}

const ManageSocials: React.FC<ManageSocialsProps> = ({ socialLinks, setSocialLinks }) => {
  const blankForm: SocialLink = { name: '', url: '', icon: 'github' };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<SocialLink>(blankForm);

  const availableIcons = ['github', 'linkedin', 'twitter', 'instagram'];

  useEffect(() => {
    if (isEditing !== null) {
      setForm(socialLinks[isEditing]);
    }
  }, [socialLinks, isEditing]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    if (isEditing !== null) {
      setSocialLinks(socialLinks.map((link, index) => (index === isEditing ? newForm : link)));
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) return;
    setSocialLinks([...socialLinks, form]);
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
        <form onSubmit={handleAddNew} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="name" value={currentForm.name} onChange={handleFormChange} placeholder="Name (e.g., GitHub)" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="url" value={currentForm.url} onChange={handleFormChange} placeholder="URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <select name="icon" value={currentForm.icon} onChange={handleFormChange} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
            {availableIcons.map(icon => <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>)}
          </select>
          <div className="md:col-span-3 flex items-center space-x-2">
            {isEditing === null ? (
              <button type="submit" className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">Add Link</button>
            ) : (
              <button type="button" onClick={handleDoneEditing} className="px-4 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Done Editing</button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-colors ${isEditing === index ? 'bg-sky-100 dark:bg-sky-900/50' : 'bg-white dark:bg-slate-800/50'}`}>
            <div>
              <h4 className="font-bold">{link.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{link.url}</p>
            </div>
            <div className="flex-shrink-0 space-x-2">
              <button onClick={() => handleSelectToEdit(index)} className="text-sm text-sky-600 dark:text-sky-400">Edit</button>
              <button onClick={() => handleDelete(index)} className="text-sm text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSocials;
