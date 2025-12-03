import React, { useState } from 'react';
import type { Skill } from '../types';

interface ManageSkillsProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const ManageSkills: React.FC<ManageSkillsProps> = ({ skills, setSkills }) => {
  const blankForm: Skill = { name: '', level: 50 };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Skill>(blankForm);

  // --- Handlers for direct state manipulation ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: name === 'level' ? Number(value) : value };
    setForm(newForm);

    // If editing, update the main skills array in real-time
    if (isEditing !== null) {
      setSkills(skills.map((skill, index) => (index === isEditing ? newForm : skill)));
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSkills([...skills, form]);
    setForm(blankForm);
  };
  
  const handleSelectToEdit = (index: number) => {
    setIsEditing(index);
    setForm(skills[index]);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setForm(blankForm);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      if (isEditing === index) {
        handleCancelEdit();
      }
      setSkills(skills.filter((_, i) => i !== index));
    }
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">{isEditing !== null ? 'Edit Skill' : 'Add New Skill'}</h3>
          <form onSubmit={handleAddNew} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Skill Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-1">Proficiency Level: {form.level}%</label>
              <input
                type="range"
                id="level"
                name="level"
                min="0"
                max="100"
                value={form.level}
                onChange={handleFormChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
              />
            </div>
            <div className="flex items-center space-x-2">
              {isEditing === null && (
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Add Skill
                </button>
              )}
              {isEditing !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                  Done Editing
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Existing Skills</h3>
          <ul className="space-y-3">
            {skills.map((skill, index) => (
              <li key={index} className={`flex items-center justify-between p-3 rounded-md transition-colors ${isEditing === index ? 'bg-sky-100 dark:bg-sky-900/50' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                <span>{skill.name} - {skill.level}%</span>
                <div className="space-x-2">
                  <button onClick={() => handleSelectToEdit(index)} className="text-sm text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300">Edit</button>
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
