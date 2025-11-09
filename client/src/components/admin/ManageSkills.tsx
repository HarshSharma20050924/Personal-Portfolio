import React, { useState } from 'react';
import type { Skill } from '../../types';

interface ManageSkillsProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const ManageSkills: React.FC<ManageSkillsProps> = ({ skills, setSkills }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Skill>({ name: '', level: 50 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'level' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingIndex !== null) {
      setSkills(skills.map((skill, index) => index === editingIndex ? formData : skill));
    } else {
      setSkills([...skills, formData]);
    }
    setFormData({ name: '', level: 50 });
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(skills[index]);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ name: '', level: 50 });
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">{editingIndex !== null ? 'Edit Skill' : 'Add New Skill'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Skill Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-1">Proficiency Level: {formData.level}%</label>
              <input
                type="range"
                id="level"
                name="level"
                min="0"
                max="100"
                value={formData.level}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
              >
                {editingIndex !== null ? 'Update Skill' : 'Add Skill'}
              </button>
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Existing Skills</h3>
          <ul className="space-y-3">
            {skills.map((skill, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                <span>{skill.name} - {skill.level}%</span>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(index)} className="text-sm text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300">Edit</button>
                  <button onClick={() => handleDelete(index)} className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageSkills;
