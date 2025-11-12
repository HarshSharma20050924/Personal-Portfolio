import React, { useState, useEffect } from 'react';
import type { Project } from '../types';

interface ManageProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ManageProjects: React.FC<ManageProjectsProps> = ({ projects, setProjects }) => {
  const blankForm: Project = { title: '', description: '', imageUrl: '', tags: [], liveUrl: '', repoUrl: '' };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Project>(blankForm);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync parent state changes to the form if editing
  useEffect(() => {
    if (isEditing !== null) {
      setForm(projects[isEditing]);
    }
  }, [projects, isEditing]);
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'tags' ? value.split(',').map(tag => tag.trim()) : value;

    // Update form state for direct UI feedback
    const newForm = { ...form, [name]: updatedValue };
    setForm(newForm);

    // If editing, sync with parent state immediately
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
            <input name="title" value={currentForm.title} onChange={handleFormChange} placeholder="Title" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            <div className="flex flex-col">
              <div className="flex items-center space-x-4">
                {currentForm.imageUrl && <img src={currentForm.imageUrl} alt="preview" className="w-16 h-10 object-cover rounded" />}
                <input type="file" name="image" onChange={handleImageUpload} disabled={isUploading} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 disabled:opacity-50"/>
              </div>
              {isUploading && <p className="text-sm text-slate-500 mt-1 pl-2">Uploading...</p>}
              {uploadError && <p className="text-sm text-red-500 mt-1 pl-2 max-w-xs">{uploadError}</p>}
            </div>
          </div>
          <textarea name="description" value={currentForm.description} onChange={handleFormChange} placeholder="Description" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="tags" value={currentForm.tags.join(', ')} onChange={handleFormChange} placeholder="Tags (comma-separated)" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="liveUrl" value={currentForm.liveUrl || ''} onChange={handleFormChange} placeholder="Live URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="repoUrl" value={currentForm.repoUrl || ''} onChange={handleFormChange} placeholder="Repo URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <div className="md:col-span-2 flex items-center space-x-2">
            {isEditing === null ? (
              <button type="submit" disabled={isUploading} className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300">Add Project</button>
            ) : (
              <button type="button" onClick={handleDoneEditing} className="px-4 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Done Editing</button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className={`flex items-start justify-between p-4 rounded-lg shadow-md transition-colors ${isEditing === index ? 'bg-sky-100 dark:bg-sky-900/50' : 'bg-white dark:bg-slate-800/50'}`}>
            <div className="flex items-start space-x-4">
              <img src={project.imageUrl} alt={project.title} className="w-24 h-16 object-cover rounded"/>
              <div>
                <h4 className="font-bold">{project.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{project.description}</p>
              </div>
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

export default ManageProjects;
