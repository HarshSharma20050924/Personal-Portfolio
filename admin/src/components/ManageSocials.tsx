import React, { useState } from 'react';
import type { SocialLink } from '../types';

interface ManageSocialsProps {
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
}

const ManageSocials: React.FC<ManageSocialsProps> = ({ socialLinks, setSocialLinks }) => {
  const blankForm: SocialLink = { name: '', url: '', icon: 'github' };
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<SocialLink>(blankForm);

  const availableIcons = ['github', 'linkedin', 'twitter'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;

    if (editingIndex !== null) {
      setSocialLinks(socialLinks.map((link, index) => index === editingIndex ? formData : link));
    } else {
      setSocialLinks([...socialLinks, formData]);
    }
    setFormData(blankForm);
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(socialLinks[index]);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData(blankForm);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Social Links</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{editingIndex !== null ? 'Edit Link' : 'Add New Link'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name (e.g., GitHub)" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="url" value={formData.url} onChange={handleChange} placeholder="URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <select name="icon" value={formData.icon} onChange={handleChange} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
            {availableIcons.map(icon => <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>)}
          </select>
          <div className="md:col-span-3 flex items-center space-x-2">
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">{editingIndex !== null ? 'Update Link' : 'Add Link'}</button>
            {editingIndex !== null && <button type="button" onClick={handleCancel} className="px-4 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
            <div>
              <h4 className="font-bold">{link.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{link.url}</p>
            </div>
            <div className="flex-shrink-0 space-x-2">
              <button onClick={() => handleEdit(index)} className="text-sm text-sky-600 dark:text-sky-400">Edit</button>
              <button onClick={() => handleDelete(index)} className="text-sm text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSocials;
