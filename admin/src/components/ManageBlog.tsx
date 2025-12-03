import React, { useState, useEffect } from 'react';
import type { Article } from '../types';

interface ManageBlogProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

const ManageBlog: React.FC<ManageBlogProps> = ({ articles, setArticles }) => {
  const blankForm: Article = { title: '', excerpt: '', date: '', url: '' };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Article>(blankForm);

  useEffect(() => {
    if (isEditing !== null) {
      setForm(articles[isEditing]);
    }
  }, [articles, isEditing]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
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

  const currentForm = isEditing !== null ? articles[isEditing] : form;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Blog Articles</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{isEditing !== null ? 'Edit Article' : 'Add New Article'}</h3>
        <form onSubmit={handleAddNew} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={currentForm.title} onChange={handleFormChange} placeholder="Title" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <textarea name="excerpt" value={currentForm.excerpt} onChange={handleFormChange} placeholder="Excerpt" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="url" value={currentForm.url} onChange={handleFormChange} placeholder="Article URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="date" value={currentForm.date} onChange={handleFormChange} placeholder="Date (e.g., October 12, 2023)" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <div className="md:col-span-2 flex items-center space-x-2">
            {isEditing === null ? (
              <button type="submit" className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">Add Article</button>
            ): (
              <button type="button" onClick={handleDoneEditing} className="px-4 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Done Editing</button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-colors ${isEditing === index ? 'bg-sky-100 dark:bg-sky-900/50' : 'bg-white dark:bg-slate-800/50'}`}>
            <div>
              <h4 className="font-bold">{article.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{article.date}</p>
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

export default ManageBlog;
