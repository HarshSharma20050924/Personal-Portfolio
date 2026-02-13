
import React, { useState, useEffect } from 'react';
import type { Article } from '../types';
import { Upload, Image as ImageIcon, Star, Loader2, Briefcase } from 'lucide-react';

interface ManageBlogProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

const ManageBlog: React.FC<ManageBlogProps> = ({ articles, setArticles }) => {
  const blankForm: Article = { title: '', excerpt: '', content: '', date: '', url: '', imageUrl: '', featured: false, showInFreelance: false };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Article>(blankForm);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEditing !== null) {
      setForm(articles[isEditing]);
    }
  }, [articles, isEditing]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let updatedValue: any = value;
    if (type === 'checkbox') {
        updatedValue = (e.target as HTMLInputElement).checked;
    }

    const newForm = { ...form, [name]: updatedValue };
    setForm(newForm);

    if (isEditing !== null) {
      setArticles(articles.map((a, index) => (index === isEditing ? newForm : a)));
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    const newArticle = {
      ...form,
      date: form.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})
    };
    setArticles([...articles, newArticle]);
    setForm(blankForm);
  };

  const handleSelectToEdit = (index: number) => {
    setIsEditing(index);
    setForm(articles[index]);
  };

  const handleDoneEditing = () => {
    setIsEditing(null);
    setForm(blankForm);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      if (isEditing === index) {
        handleDoneEditing();
      }
      setArticles(articles.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'imageUrl' | 'content') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const result = await response.json();
        
        if (targetField === 'imageUrl') {
            const newForm = { ...form, imageUrl: result.filePath };
            setForm(newForm);
            if (isEditing !== null) setArticles(articles.map((a, i) => i === isEditing ? newForm : a));
        } else {
            // Append markdown image to content
            const mdImage = `\n![Image](${result.filePath})\n`;
            const newForm = { ...form, content: (form.content || '') + mdImage };
            setForm(newForm);
            if (isEditing !== null) setArticles(articles.map((a, i) => i === isEditing ? newForm : a));
        }
    } catch (error) {
        console.error("Upload failed", error);
    } finally {
        setIsUploading(false);
    }
  };

  const currentForm = isEditing !== null ? articles[isEditing] : form;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Blog Articles</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{isEditing !== null ? 'Edit Article' : 'Write New Article'}</h3>
        <form onSubmit={handleAddNew} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                <input name="title" value={currentForm.title} onChange={handleFormChange} placeholder="Article Title" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
             </div>
             
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Short Excerpt</label>
                <textarea name="excerpt" value={currentForm.excerpt} onChange={handleFormChange} placeholder="Brief summary for the card view..." rows={2} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
             </div>

             {/* Toggles */}
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
                        <Briefcase size={16} className={currentForm.showInFreelance ? "text-purple-500" : "text-slate-400"} />
                        Show in Freelance
                    </span>
                </label>
             </div>

             {/* Main Content Area */}
             <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-500">Full Content (Markdown Supported)</label>
                    <label className={`cursor-pointer flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                        Insert Image
                        <input type="file" onChange={(e) => handleImageUpload(e, 'content')} disabled={isUploading} className="hidden" />
                    </label>
                </div>
                <textarea 
                    name="content" 
                    value={currentForm.content || ''} 
                    onChange={handleFormChange} 
                    placeholder="# Heading 1&#10;Write your philosophy here...&#10;&#10;## Subheading&#10;- Point 1&#10;- Point 2" 
                    rows={12} 
                    className="w-full p-4 border rounded dark:bg-slate-700 dark:border-slate-600 font-mono text-sm leading-relaxed" 
                />
             </div>

             <div className="flex flex-col">
                <label className="block text-xs font-bold text-slate-500 mb-1">Cover Image</label>
                <div className="flex items-center gap-4">
                    <input name="imageUrl" value={currentForm.imageUrl || ''} onChange={handleFormChange} placeholder="Image URL" className="flex-1 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                    <label className={`cursor-pointer bg-slate-100 dark:bg-slate-700 p-2 rounded hover:bg-slate-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <input type="file" onChange={(e) => handleImageUpload(e, 'imageUrl')} disabled={isUploading} className="hidden" />
                    </label>
                </div>
                {currentForm.imageUrl && <img src={currentForm.imageUrl} className="h-20 w-auto object-cover mt-2 rounded" />}
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Date</label>
                <input name="date" value={currentForm.date} onChange={handleFormChange} placeholder="e.g., October 12, 2023" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
             </div>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            {isEditing === null ? (
              <button type="submit" disabled={isUploading} className="px-6 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300">Publish Article</button>
            ): (
              <button type="button" onClick={handleDoneEditing} className="px-6 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Done Editing</button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-colors ${isEditing === index ? 'bg-sky-100 dark:bg-sky-900/50' : 'bg-white dark:bg-slate-800/50'}`}>
            <div className="flex items-center gap-4">
               {article.imageUrl && <img src={article.imageUrl} className="w-12 h-12 rounded object-cover" />}
               <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{article.title}</h4>
                    {article.featured && <Star size={12} className="fill-sky-500 text-sky-500" />}
                    {article.showInFreelance && <Briefcase size={12} className="text-purple-500" title="Visible in Freelance" />}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{article.date}</p>
               </div>
            </div>
            <div className="flex-shrink-0 space-x-2">
              <button onClick={() => handleSelectToEdit(index)} className="text-sm text-sky-600 dark:text-sky-400 hover:underline">Edit</button>
              <button onClick={() => handleDelete(index)} className="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBlog;
