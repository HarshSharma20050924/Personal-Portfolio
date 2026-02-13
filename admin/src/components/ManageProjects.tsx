
import React, { useState, useEffect } from 'react';
import type { Project, Service } from '../types';
import { Star, Upload, ImageIcon, Loader2, Briefcase } from 'lucide-react';

interface ManageProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  services: Service[]; // Added services prop
}

const ManageProjects: React.FC<ManageProjectsProps> = ({ projects, setProjects, services }) => {
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
    featured: false,
    showInFreelance: false,
    challenge: '',
    challengeImage: '',
    outcome: '',
    outcomeImage: '',
    serviceId: undefined
  };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Project>(blankForm);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  
  // States for extra image uploads
  const [isUploadingChallengeImg, setIsUploadingChallengeImg] = useState(false);
  const [isUploadingOutcomeImg, setIsUploadingOutcomeImg] = useState(false);

  useEffect(() => {
    if (isEditing !== null) {
      setForm(projects[isEditing]);
    }
  }, [projects, isEditing]);
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let updatedValue: any = value;
    if (name === 'tags') {
        updatedValue = value.split(',').map(tag => tag.trim());
    } else if (type === 'checkbox') {
        updatedValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'serviceId') {
        updatedValue = value ? Number(value) : undefined;
    }

    const newForm = { ...form, [name]: updatedValue };
    setForm(newForm);

    if (isEditing !== null) {
      setProjects(projects.map((p, index) => (index === isEditing ? newForm : p)));
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Project, loadingStateSetter: (v: boolean) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    loadingStateSetter(true);
    setUploadError(null);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Upload failed');
      
      const newForm = { ...form, [fieldName]: result.filePath };
      setForm(newForm);

      if (isEditing !== null) {
        setProjects(projects.map((p, index) => (index === isEditing ? newForm : p)));
      }

    } catch (error) {
      console.error("Upload Error:", error);
      setUploadError((error as Error).message);
    } finally {
      loadingStateSetter(false);
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
      <div className="p-4 md:p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{isEditing !== null ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleAddNew} className="space-y-6">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Project Title</label>
                <input name="title" value={currentForm.title} onChange={handleFormChange} placeholder="Title" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            </div>
            
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-100 dark:border-sky-800 cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="featured" 
                        checked={currentForm.featured || false} 
                        onChange={handleFormChange}
                        className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
                    />
                    <span className="text-sm font-semibold flex items-center gap-2">
                        <div title="Featured"><Star size={16} className={currentForm.featured ? "fill-sky-500 text-sky-500" : "text-slate-400"} /></div>
                        Global Featured
                    </span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="showInFreelance" 
                        checked={currentForm.showInFreelance || false} 
                        onChange={handleFormChange}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-semibold flex items-center gap-2">
                        <div title="Freelance"><Briefcase size={16} className={currentForm.showInFreelance ? "text-purple-500" : "text-slate-400"} /></div>
                        Show in Freelance
                    </span>
                </label>
            </div>

            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Associate with Expertise (Service)</label>
                <select 
                    name="serviceId" 
                    value={currentForm.serviceId || ''} 
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                >
                    <option value="">-- No specific service --</option>
                    {services && services.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">This groups the project under a specific service on the Freelance template work page.</p>
            </div>

            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                <textarea name="description" value={currentForm.description} onChange={handleFormChange} placeholder="Short Description" rows={3} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            </div>

            {/* ... rest of the form (Uploads, Deep Dive, Links) remains the same ... */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-500 mb-1">Main Cover Image</label>
              <div className="flex items-center space-x-4 border p-2 rounded dark:border-slate-600">
                {currentForm.imageUrl && <img src={currentForm.imageUrl} alt="preview" className="w-16 h-10 object-cover rounded" />}
                <label className={`cursor-pointer bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 hover:bg-slate-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    {isUploading ? '...' : 'Upload'}
                    <input type="file" onChange={(e) => handleFileUpload(e, 'imageUrl', setIsUploading)} disabled={isUploading} className="hidden"/>
                </label>
              </div>
            </div>

            <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 mb-1">Project Document (PDF)</label>
                <div className="flex items-center space-x-4 border p-2 rounded dark:border-slate-600">
                    <label className={`cursor-pointer bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 hover:bg-slate-200 ${isUploadingDoc ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isUploadingDoc ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        {isUploadingDoc ? '...' : 'Upload Doc'}
                        <input type="file" onChange={(e) => handleFileUpload(e, 'docUrl', setIsUploadingDoc)} disabled={isUploadingDoc} accept=".pdf,.doc,.docx" className="hidden"/>
                    </label>
                    {currentForm.docUrl && <span className="text-xs text-green-500 font-bold">Doc Attached</span>}
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Tags (Comma Separated)</label>
                <input name="tags" value={currentForm.tags.join(', ')} onChange={handleFormChange} placeholder="React, Three.js, AI" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            </div>
            <input name="liveUrl" value={currentForm.liveUrl || ''} onChange={handleFormChange} placeholder="Live URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            <input name="repoUrl" value={currentForm.repoUrl || ''} onChange={handleFormChange} placeholder="GitHub Repo URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            {isEditing === null ? (
              <button type="submit" className="px-6 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300 w-full md:w-auto">Add Project</button>
            ) : (
              <button type="button" onClick={handleDoneEditing} className="px-6 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg w-full md:w-auto">Done Editing</button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, index) => (
          <div key={index} className={`flex flex-col md:flex-row items-start justify-between p-4 rounded-lg shadow-sm border transition-colors ${isEditing === index ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200' : 'bg-white dark:bg-slate-800/50 border-transparent'}`}>
            <div className="flex items-start space-x-4 mb-4 md:mb-0">
              <img src={project.imageUrl} alt={project.title} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded shadow-inner"/>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm md:text-base">{project.title}</h4>
                    {project.featured && <div title="Featured"><Star size={14} className="fill-yellow-400 text-yellow-400" /></div>}
                    {project.showInFreelance && <div title="Freelance Template"><Briefcase size={14} className="text-purple-500" /></div>}
                </div>
                {project.serviceId && (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded">
                        {services.find(s => s.id === project.serviceId)?.title || 'Unknown Service'}
                    </span>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-xl mb-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
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
