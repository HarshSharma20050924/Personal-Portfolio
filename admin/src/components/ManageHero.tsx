
import React, { useState } from 'react';
import type { HeroData } from '../types';
import { Loader2 } from 'lucide-react';

interface ManageHeroProps {
  data: HeroData;
  setData: React.Dispatch<React.SetStateAction<HeroData>>;
}

const ManageHero: React.FC<ManageHeroProps> = ({ data, setData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadResumeError, setUploadResumeError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...data, [name]: value };
    setData(updatedFormData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Image upload failed');
      }

      setData({ ...data, profileImageUrl: result.filePath });
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    setUploadResumeError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Resume upload failed');
      }

      setData({ ...data, resumeUrl: result.filePath });
    } catch (error) {
      console.error("Resume Upload Error:", error);
      setUploadResumeError((error as Error).message);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const profileImage = data.profileImageUrl || "https://via.placeholder.com/128";

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Hero Section</h2>
      <div className="p-4 md:p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md space-y-6 max-w-full md:max-w-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:flex-1 space-y-4 order-2 md:order-1">
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

          <div className="order-1 md:order-2 text-center flex flex-col items-center justify-center">
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            <div className="relative mb-4">
              <img 
                src={profileImage} 
                alt="Profile Preview" 
                className="w-32 h-32 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}
            </div>
            <label className={`cursor-pointer px-4 py-2 rounded-full bg-sky-50 text-sky-700 text-sm font-semibold hover:bg-sky-100 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Upload New
                <input 
                  type="file" 
                  id="profileImage" 
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
            </label>
            {uploadError && <p className="text-sm text-red-500 mt-2 max-w-xs mx-auto">{uploadError}</p>}
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

        <div>
          <label htmlFor="quote" className="block text-sm font-medium mb-1">"About Me" Quote</label>
          <textarea
            id="quote"
            name="quote"
            rows={2}
            value={data.quote || ''}
            onChange={handleChange}
            placeholder="e.g., Simplicity is the ultimate sophistication."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <label htmlFor="resume" className="block text-sm font-medium mb-2">Resume (PDF)</label>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${isUploadingResume ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isUploadingResume ? <Loader2 className="animate-spin" size={16} /> : null}
                <span className="text-sm text-slate-700 dark:text-slate-300">{isUploadingResume ? 'Uploading...' : 'Choose PDF'}</span>
                <input 
                  type="file" 
                  id="resume" 
                  name="resume"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  disabled={isUploadingResume}
                  className="hidden"
                />
            </label>
            {data.resumeUrl && data.resumeUrl !== '#' && (
                <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-500 hover:underline">
                    View uploaded resume
                </a>
            )}
          </div>
          {uploadResumeError && <p className="text-sm text-red-500 mt-2">{uploadResumeError}</p>}
        </div>

      </div>
    </div>
  );
};

export default ManageHero;
