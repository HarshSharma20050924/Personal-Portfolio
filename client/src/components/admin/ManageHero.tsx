import React, { useState, useEffect } from 'react';
import type { HeroData } from '../../types';

interface ManageHeroProps {
  data: HeroData;
  setData: React.Dispatch<React.SetStateAction<HeroData>>;
}

const ManageHero: React.FC<ManageHeroProps> = ({ data, setData }) => {
  const [formData, setFormData] = useState<HeroData>(data);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Hero Section</h2>
      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md space-y-4 max-w-2xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Save Changes
          </button>
          {isSaved && <p className="text-sm text-green-500">Successfully saved!</p>}
        </div>
      </form>
    </div>
  );
};

export default ManageHero;
