
import React, { useState, useEffect } from 'react';
import type { Project } from '../types';
import { Star } from 'lucide-react';

interface ManageProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ManageProjects: React.FC<ManageProjectsProps> = ({ projects, setProjects }) => {
  const blankForm: Project = { 
    title: '', 
    description: '', 
    imageUrl: '', 
    videoUrl: '', 
    docUrl: '', 
    huggingFaceUrl: '', 
    tags: [], 
    liveUrl: '', 
    repoUrl: '',
    featured: false
  };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Project>(blankForm);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadDocError, setUploadDocError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing !== null) {
      setForm(projects[isEditing]);
    }
  }, [projects, isEditing]);
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let updatedValue: any = value;
    if (name === 'tags') {
        updatedValue = value.split(',').map(tag => tag.trim());
    } else if (type === 'checkbox') {
        updatedValue = (e.target as HTMLInputElement).checked;
    }

    const newForm = { ...form, [name]: updatedValue };
    setForm(newForm);

    if (isEditing !== null) {
      setProjects(projects.map((p, index) => (index === isEditing ? newForm : p)));
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Image upload failed');
      
      const newForm = { ...form, imageUrl: result.filePath };
      setForm(newForm);

      if (isEditing !== null) {
        setProjects(projects.map((p, index) => (index === isEditing ? newForm : p)));
      }

    } catch (error) {
      console.error("Upload Error:", error);
      setUploadError((error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    setIsUploadingDoc(true);
    setUploadDocError(null);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Doc upload failed');
      
      const newForm = { ...form, docUrl: result.filePath };
      setForm(newForm);

      if (isEditing !== null) {
        setProjects(projects.map((p, index) => (index === isEditing ? newForm : p)));
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadDocError((error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setProjects([...projects, form]);
    setForm(blankForm);
  };

  const handleSelectToEdit = (index: number) => {
    setIsEditing(index);
    setForm(projects[index]);
  };

  const handleDoneEditing = () => {
    setIsEditing(null);
    setForm(blankForm);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      if (isEditing === index) {
        handleDoneEditing();
      }
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const currentForm = isEditing !== null ? projects[isEditing] : form;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Projects</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{isEditing !== null ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleAddNew} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Project Title</label>
                <input name="title" value={currentForm.title} onChange={handleFormChange} placeholder="Title" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Cover Image</label>
              <div className="flex items-center space-x-4">
                {currentForm.imageUrl && <img src={currentForm.imageUrl} alt="preview" className="w-16 h-10 object-cover rounded" />}
                <input type="file" name="image" onChange={handleImageUpload} disabled={isUploading} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 disabled:opacity-50"/>
              </div>
              {isUploading && <p className="text-sm text-slate-500 mt-1 pl-2">Uploading...</p>}
            </div>
          </div>
          
          <div className="md:col-span-2">
             <label className="flex items-center gap-2 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-100 dark:border-sky-800 cursor-pointer">
                <input 
                    type="checkbox" 
                    name="featured" 
                    checked={currentForm.featured || false} 
                    onChange={handleFormChange}
                    className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
                />
                <span className="text-sm font-semibold flex items-center gap-2">
                    <Star size={16} className={currentForm.featured ? "fill-sky-500 text-sky-500" : "text-slate-400"} />
                    Highlight as "Featured Project" on Main Portfolio Page
                </span>
             </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Description</label>
            <textarea name="description" value={currentForm.description} onChange={handleFormChange} placeholder="Description" rows={3} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Tags (Comma Separated)</label>
            <input name="tags" value={currentForm.tags.join(', ')} onChange={handleFormChange} placeholder="React, Three.js, AI" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>
          
          <input name="liveUrl" value={currentForm.liveUrl || ''} onChange={handleFormChange} placeholder="Live URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="repoUrl" value={currentForm.repoUrl || ''} onChange={handleFormChange} placeholder="GitHub Repo URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="huggingFaceUrl" value={currentForm.huggingFaceUrl || ''} onChange={handleFormChange} placeholder="Hugging Face URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="videoUrl" value={currentForm.videoUrl || ''} onChange={handleFormChange} placeholder="Video Showcase URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          
          <div className="md:col-span-2 flex flex-col">
             <label className="text-xs text-slate-500 mb-1">Project Document (PDF)</label>
             <div className="flex items-center space-x-4">
                <input type="file" onChange={handleDocUpload} disabled={isUploadingDoc} accept=".pdf,.doc,.docx" className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 disabled:opacity-50"/>
                 {currentForm.docUrl && <span className="text-xs text-green-500">Doc Attached</span>}
             </div>
          </div>

          <div className="md:col-span-2 flex items-center space-x-2">
            {isEditing === null ? (
              <button type="submit" disabled={isUploading || isUploadingDoc} className="px-6 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300">Add Project</button>
            ) : (
              <button type="button" onClick={handleDoneEditing} className="px-6 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Done Editing</button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, index) => (
          <div key={index} className={`flex items-start justify-between p-4 rounded-lg shadow-sm border transition-colors ${isEditing === index ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200' : 'bg-white dark:bg-slate-800/50 border-transparent'}`}>
            <div className="flex items-start space-x-4">
              <img src={project.imageUrl} alt={project.title} className="w-20 h-20 object-cover rounded shadow-inner"/>
              <div>
                <div className="flex items-center gap-2">
                    <h4 className="font-bold">{project.title}</h4>
                    {project.featured && <Star size={14} className="fill-yellow-400 text-yellow-400" title="Featured" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-xl">{project.description}</p>
                <div className="flex gap-2 mt-2">
                   {project.videoUrl && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">Video</span>}
                   {project.docUrl && <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded">Doc</span>}
                   {project.featured && <span className="text-[10px] bg-sky-100 text-sky-600 px-1 rounded font-bold">Featured</span>}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 space-x-4">
              <button onClick={() => handleSelectToEdit(index)} className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline">Edit</button>
              <button onClick={() => handleDelete(index)} className="text-sm font-medium text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
