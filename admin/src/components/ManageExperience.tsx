
import React, { useState } from 'react';
import type { Experience, Education } from '../types';
import { Briefcase } from 'lucide-react';

interface ManageExperienceProps {
  experience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
}

const ManageExperience: React.FC<ManageExperienceProps> = ({ experience, setExperience, education, setEducation }) => {
  // Experience State
  const blankExp: Experience = { position: '', company: '', period: '', description: '', showInFreelance: false };
  const [isEditingExp, setIsEditingExp] = useState<number | null>(null);
  const [formExp, setFormExp] = useState<Experience>(blankExp);

  // Education State
  const blankEdu: Education = { degree: '', institution: '', period: '', showInFreelance: false };
  const [isEditingEdu, setIsEditingEdu] = useState<number | null>(null);
  const [formEdu, setFormEdu] = useState<Education>(blankEdu);

  // --- Handlers for Experience ---
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
    }
    const newForm = { ...formExp, [name]: newValue };
    setFormExp(newForm);
    if (isEditingExp !== null) {
      setExperience(experience.map((exp, i) => (i === isEditingExp ? newForm : exp)));
    }
  };

  const handleAddExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formExp.position) return;
    setExperience([...experience, formExp]);
    setFormExp(blankExp);
  };

  const handleEditExp = (index: number) => {
    setIsEditingExp(index);
    setFormExp(experience[index]);
  };

  const handleDeleteExp = (index: number) => {
    if (window.confirm('Delete this experience?')) {
        if (isEditingExp === index) { setIsEditingExp(null); setFormExp(blankExp); }
        setExperience(experience.filter((_, i) => i !== index));
    }
  };

  // --- Handlers for Education ---
  const handleEduChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
    }
    const newForm = { ...formEdu, [name]: newValue };
    setFormEdu(newForm);
    if (isEditingEdu !== null) {
      setEducation(education.map((edu, i) => (i === isEditingEdu ? newForm : edu)));
    }
  };

  const handleAddEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEdu.degree) return;
    setEducation([...education, formEdu]);
    setFormEdu(blankEdu);
  };

  const handleEditEdu = (index: number) => {
    setIsEditingEdu(index);
    setFormEdu(education[index]);
  };

  const handleDeleteEdu = (index: number) => {
    if (window.confirm('Delete this education?')) {
        if (isEditingEdu === index) { setIsEditingEdu(null); setFormEdu(blankEdu); }
        setEducation(education.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-12">
      {/* Experience Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Work Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">{isEditingExp !== null ? 'Edit Experience' : 'Add Experience'}</h3>
                <form onSubmit={handleAddExp} className="space-y-4">
                    <input name="position" value={formExp.position} onChange={handleExpChange} placeholder="Position (e.g. Senior Dev)" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                    <input name="company" value={formExp.company} onChange={handleExpChange} placeholder="Company" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                    <input name="period" value={formExp.period} onChange={handleExpChange} placeholder="Period (e.g. 2020 - Present)" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                    <textarea name="description" value={formExp.description} onChange={handleExpChange} placeholder="Description" rows={3} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                    
                    <label className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-800 cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="showInFreelance" 
                            checked={formExp.showInFreelance || false} 
                            onChange={handleExpChange}
                            className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-xs font-semibold flex items-center gap-2">
                            <Briefcase size={14} className={formExp.showInFreelance ? "text-purple-500" : "text-slate-400"} />
                            Show in Freelance
                        </span>
                    </label>

                    <div className="flex gap-2">
                        {isEditingExp === null ? (
                            <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Add</button>
                        ) : (
                            <button type="button" onClick={() => { setIsEditingExp(null); setFormExp(blankExp); }} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded">Done</button>
                        )}
                    </div>
                </form>
            </div>
            <div className="space-y-3">
                {experience.map((exp, i) => (
                    <div key={i} className={`p-4 rounded border ${isEditingExp === i ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold">{exp.position}</h4>
                                <span className="text-xs text-slate-500">{exp.period}</span>
                            </div>
                            {exp.showInFreelance && <Briefcase size={16} className="text-purple-500" title="Visible in Freelance" />}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{exp.company}</p>
                        <div className="mt-2 flex gap-2">
                            <button onClick={() => handleEditExp(i)} className="text-xs text-sky-500 hover:underline">Edit</button>
                            <button onClick={() => handleDeleteExp(i)} className="text-xs text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Education Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">{isEditingEdu !== null ? 'Edit Education' : 'Add Education'}</h3>
                <form onSubmit={handleAddEdu} className="space-y-4">
                    <input name="degree" value={formEdu.degree} onChange={handleEduChange} placeholder="Degree" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                    <input name="institution" value={formEdu.institution} onChange={handleEduChange} placeholder="Institution" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                    <input name="period" value={formEdu.period} onChange={handleEduChange} placeholder="Period" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                    
                    <label className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-800 cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="showInFreelance" 
                            checked={formEdu.showInFreelance || false} 
                            onChange={handleEduChange}
                            className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-xs font-semibold flex items-center gap-2">
                            <Briefcase size={14} className={formEdu.showInFreelance ? "text-purple-500" : "text-slate-400"} />
                            Show in Freelance
                        </span>
                    </label>

                    <div className="flex gap-2">
                        {isEditingEdu === null ? (
                            <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Add</button>
                        ) : (
                            <button type="button" onClick={() => { setIsEditingEdu(null); setFormEdu(blankEdu); }} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded">Done</button>
                        )}
                    </div>
                </form>
            </div>
            <div className="space-y-3">
                {education.map((edu, i) => (
                    <div key={i} className={`p-4 rounded border ${isEditingEdu === i ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold">{edu.degree}</h4>
                                <span className="text-xs text-slate-500">{edu.period}</span>
                            </div>
                            {edu.showInFreelance && <Briefcase size={16} className="text-purple-500" title="Visible in Freelance" />}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{edu.institution}</p>
                        <div className="mt-2 flex gap-2">
                            <button onClick={() => handleEditEdu(i)} className="text-xs text-sky-500 hover:underline">Edit</button>
                            <button onClick={() => handleDeleteEdu(i)} className="text-xs text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageExperience;
