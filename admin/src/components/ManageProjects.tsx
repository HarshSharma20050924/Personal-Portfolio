
import React, { useState, useEffect } from 'react';
import type { Project, Service } from '../types';
import { Star, Upload, ImageIcon, Loader2, Briefcase, Monitor, Trash2, Plus } from 'lucide-react';
import API_BASE from '../utils/apiBase';

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
    showInClient: true,
    showInFreelance: false,
    challenge: '',
    challengeImage: '',
    outcome: '',
    outcomeImage: '',
    serviceId: undefined,
    serviceIds: [],
    media: [] // Added media array
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
    } else if (name === 'serviceIds') {
        const id = Number(value);
        const currentIds = currentForm.serviceIds || [];
        if (currentIds.includes(id)) {
            updatedValue = currentIds.filter(i => i !== id);
        } else {
            updatedValue = [...currentIds, id];
        }
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
      const response = await fetch(`${API_BASE}/api/upload`, {
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

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    setUploadError(null);

    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Upload failed');
      
      const newMedia = [...(currentForm.media || [])];
      newMedia[index].url = result.filePath;
      // Auto-detect type
      if (file.type.startsWith('video/')) newMedia[index].type = 'video';
      else if (file.type.startsWith('image/')) newMedia[index].type = 'image';

      const newForm = { ...currentForm, media: newMedia };
      setForm(newForm);

      if (isEditing !== null) {
        setProjects(projects.map((p, i) => (i === isEditing ? newForm : p)));
      }

    } catch (error) {
      console.error("Media Upload Error:", error);
      setUploadError((error as Error).message);
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
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        Freelance Page
                    </span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="showInClient" 
                        checked={currentForm.showInClient !== false} 
                        onChange={handleFormChange}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold flex items-center gap-2">
                        <div title="Portfolio Site"><Monitor size={16} className={currentForm.showInClient !== false ? "text-indigo-500" : "text-slate-400"} /></div>
                        Portfolio Site
                    </span>
                </label>
            </div>

            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-3">Group with Services (Multi-select)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {services && services.map(s => (
                        <label key={s.id} className="flex items-center gap-2 p-2 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <input 
                                type="checkbox" 
                                name="serviceIds" 
                                value={s.id}
                                checked={(currentForm.serviceIds || []).includes(s.id!)}
                                onChange={handleFormChange}
                                className="w-4 h-4 text-sky-600 rounded"
                            />
                            <span className="text-xs font-medium truncate">{s.title}</span>
                        </label>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Selecting multiple services will show this project across all of them in the Freelance template.</p>
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

          {/* Project Media Gallery */}
          <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold mb-4">Project Proofs (Media Gallery)</h4>
            <div className="space-y-4">
                {(currentForm.media || []).map((media, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 items-start p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 relative">
                        <button type="button" onClick={() => {
                            const newMedia = (currentForm.media || []).filter((_, i) => i !== idx);
                            const newForm = { ...currentForm, media: newMedia };
                            setForm(newForm);
                            if (isEditing !== null) setProjects(projects.map((p, i) => i === isEditing ? newForm : p));
                        }} className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full"><Trash2 size={16}/></button>

                        <div className="w-full md:w-1/3">
                            {media.url ? (
                                media.type === 'video' ? 
                                    <video src={media.url} className="w-full h-24 object-cover rounded bg-black" /> :
                                    <img src={media.url} className="w-full h-24 object-cover rounded bg-black" />
                            ) : (
                                <div className="w-full h-24 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-slate-400 text-xs">No media</div>
                            )}
                        </div>
                        <div className="w-full md:w-2/3 space-y-3">
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase">Title / Name</label>
                                <input value={media.title || ''} onChange={(e) => {
                                    const newMedia = [...(currentForm.media || [])];
                                    newMedia[idx].title = e.target.value;
                                    const newForm = { ...currentForm, media: newMedia };
                                    setForm(newForm);
                                    if (isEditing !== null) setProjects(projects.map((p, i) => i === isEditing ? newForm : p));
                                }} placeholder="e.g. Landing Page" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm" />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" name={`media_${idx}_type`} checked={media.type === 'image'} onChange={() => {
                                        const newMedia = [...(currentForm.media || [])];
                                        newMedia[idx].type = 'image';
                                        const newForm = { ...currentForm, media: newMedia };
                                        setForm(newForm);
                                        if (isEditing !== null) setProjects(projects.map((p, i) => i === isEditing ? newForm : p));
                                    }} /> Image
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" name={`media_${idx}_type`} checked={media.type === 'video'} onChange={() => {
                                        const newMedia = [...(currentForm.media || [])];
                                        newMedia[idx].type = 'video';
                                        const newForm = { ...currentForm, media: newMedia };
                                        setForm(newForm);
                                        if (isEditing !== null) setProjects(projects.map((p, i) => i === isEditing ? newForm : p));
                                    }} /> Video
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <input value={media.url} onChange={(e) => {
                                    const newMedia = [...(currentForm.media || [])];
                                    newMedia[idx].url = e.target.value;
                                    const newForm = { ...currentForm, media: newMedia };
                                    setForm(newForm);
                                    if (isEditing !== null) setProjects(projects.map((p, i) => i === isEditing ? newForm : p));
                                }} placeholder="https://..." className="flex-1 p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                <label className="cursor-pointer bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 hover:bg-slate-200">
                                    <Upload size={12}/>
                                    Upload
                                    <input type="file" onChange={(e) => handleMediaUpload(e, idx)} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={() => {
                    const newForm = { ...currentForm, media: [...(currentForm.media || []), { url: '', type: 'image', title: '' }] };
                    setForm(newForm);
                    if (isEditing !== null) setProjects(projects.map((p, i) => i === isEditing ? newForm : p));
                }} className="text-sm font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1"><Plus size={16}/> Add New Proof</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
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
                    {project.showInClient !== false && <div title="Portfolio Site"><Monitor size={14} className="text-indigo-500" /></div>}
                </div>
                {((project.serviceIds && project.serviceIds.length > 0) || project.serviceId) && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {(project.serviceIds || (project.serviceId ? [project.serviceId] : [])).map(sid => (
                            <span key={sid} className="text-[10px] bg-sky-100 dark:bg-sky-900/30 text-sky-600 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                                {services.find(s => s.id === sid)?.title || sid}
                            </span>
                        ))}
                    </div>
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
