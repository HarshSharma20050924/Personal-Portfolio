import React from 'react';
import type { HeroData } from '../types';

interface ManageHeroProps {
  data: HeroData;
  setData: React.Dispatch<React.SetStateAction<HeroData>>;
}

const ManageHero: React.FC<ManageHeroProps> = ({ data, setData }) => {
  const imageBaseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...data, [name]: value };
    setData(updatedFormData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const result = await response.json();
      setData({ ...data, profileImageUrl: result.filePath });
    } catch (error) {
      console.error("Upload Error:", error);
      alert('Failed to upload image.');
    }
  };

  const profileImage = data.profileImageUrl ? `${imageBaseUrl}${data.profileImageUrl}` : "https://via.placeholder.com/128";


  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Hero Section</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
             <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
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
                value={data.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
             <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={data.phone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="text-center">
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            <img 
              src={profileImage} 
              alt="Profile Preview" 
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2 border-slate-300 dark:border-slate-600"
            />
            <input 
              type="file" 
              id="profileImage" 
              name="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={data.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ManageHero;