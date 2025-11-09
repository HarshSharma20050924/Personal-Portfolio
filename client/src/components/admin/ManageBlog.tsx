import React, { useState } from 'react';
import type { Article } from '../../types';

interface ManageBlogProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

const ManageBlog: React.FC<ManageBlogProps> = ({ articles, setArticles }) => {
  const blankForm: Article = { title: '', excerpt: '', date: '', url: '' };
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Article>(blankForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingIndex !== null) {
      setArticles(articles.map((a, index) => index === editingIndex ? formData : a));
    } else {
      setArticles([...articles, { ...formData, date: formData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) }]);
    }
    setFormData(blankForm);
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(articles[index]);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter((_, i) => i !== index));
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData(blankForm);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Blog Articles</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{editingIndex !== null ? 'Edit Article' : 'Add New Article'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Excerpt" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="url" value={formData.url} onChange={handleChange} placeholder="Article URL" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <input name="date" value={formData.date} onChange={handleChange} placeholder="Date (e.g., October 12, 2023)" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          <div className="md:col-span-2 flex items-center space-x-2">
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">{editingIndex !== null ? 'Update Article' : 'Add Article'}</button>
            {editingIndex !== null && <button type="button" onClick={handleCancel} className="px-4 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
            <div>
              <h4 className="font-bold">{article.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{article.date}</p>
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

export default ManageBlog;
