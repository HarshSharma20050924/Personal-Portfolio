import React, { useState } from 'react';
import type { Project } from '../types';

interface ManageProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ManageProjects: React.FC<ManageProjectsProps> = ({ projects, setProjects }) => {
  const blankForm: Project = { title: '', description: '', imageUrl: '', tags: [], liveUrl: '', repoUrl: '' };
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Project>(blankForm);
  const [isUploading, setIsUploading] = useState(false);
  
  const imageBaseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setFormData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    setIsUploading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) throw new Error('Image upload failed');

      const result = await response.json();
      setFormData({ ...formData, imageUrl: result.filePath });
    } catch (error) {
      console.error("Upload Error:", error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingIndex !== null) {
      setProjects(projects.map((p, index) => index === editingIndex ? formData : p));
    } else {
      setProjects([...projects, formData]);
    }
    setFormData(blankForm);
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(projects[index]);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };
  
  const handleCancel = () => {
    setEditingIndex(null);
    setFormData(blankForm);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Projects</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            <div className="flex items-center space-x-4">
              {formData.imageUrl && <img src={`${imageBaseUrl}${formData.imageUrl}`} alt="preview" className="w-16 h-10 object-cover rounded" />}
              <input type="file" name="image" onChange={handleImageUpload} disabled={isUploading} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
            </div>
          </div>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="tags" value={formData.tags.join(', ')} onChange={handleChange} placeholder="Tags (comma-separated)" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="Live URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="repoUrl" value={formData.repoUrl} onChange={handleChange} placeholder="Repo URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <div className="md:col-span-2 flex items-center space-x-2">
            <button type="submit" disabled={isUploading} className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300">{editingIndex !== null ? 'Update Project' : 'Add Project'}</button>
            {editingIndex !== null && <button type="button" onClick={handleCancel} className="px-4 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="flex items-start justify-between p-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
            <div className="flex items-start space-x-4">
              <img src={`${imageBaseUrl}${project.imageUrl}`} alt={project.title} className="w-24 h-16 object-cover rounded"/>
              <div>
                <h4 className="font-bold">{project.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{project.description}</p>
              </div>
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

export default ManageProjects;