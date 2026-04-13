import React, { useState, useEffect } from 'react';
import type { Testimonial } from '../types';
import { Quote, Briefcase, Monitor } from 'lucide-react';

interface ManageTestimonialsProps {
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

const ManageTestimonials: React.FC<ManageTestimonialsProps> = ({ testimonials, setTestimonials }) => {
  const blankForm: Testimonial = { clientName: '', company: '', text: '', projectUrl: '', showInClient: true, showInFreelance: true };
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Testimonial>(blankForm);

  useEffect(() => {
    if (isEditing !== null) {
      setForm(testimonials[isEditing]);
    }
  }, [testimonials, isEditing]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let newValue: any = value;
    if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
    }

    const newForm = { ...form, [name]: newValue };
    setForm(newForm);

    if (isEditing !== null) {
      setTestimonials(testimonials.map((test, index) => (index === isEditing ? newForm : test)));
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.text) return;
    setTestimonials([...testimonials, form]);
    setForm(blankForm);
  };

  const handleSelectToEdit = (index: number) => {
    setIsEditing(index);
    setForm(testimonials[index]);
  };

  const handleDoneEditing = () => {
    setIsEditing(null);
    setForm(blankForm);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      if (isEditing === index) {
        handleDoneEditing();
      }
      setTestimonials(testimonials.filter((_, i) => i !== index));
    }
  };

  const currentForm = isEditing !== null ? testimonials[isEditing] : form;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Testimonials</h2>
      <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">{isEditing !== null ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
        <form onSubmit={handleAddNew} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
             <label className="block text-xs font-bold text-slate-500 mb-1">Client Name</label>
             <input name="clientName" value={currentForm.clientName} onChange={handleFormChange} placeholder="e.g. John Doe" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>
          <div className="col-span-1">
             <label className="block text-xs font-bold text-slate-500 mb-1">Company / Project Name</label>
             <input name="company" value={currentForm.company || ''} onChange={handleFormChange} placeholder="e.g. System Labs" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>
          <div className="col-span-1 md:col-span-2">
             <label className="block text-xs font-bold text-slate-500 mb-1">Testimonial Text</label>
             <textarea name="text" value={currentForm.text} onChange={handleFormChange} placeholder="They delivered excellent work..." rows={3} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>
          <div className="col-span-1 md:col-span-2">
             <label className="block text-xs font-bold text-slate-500 mb-1">Project Proof URL (Optional)</label>
             <input name="projectUrl" value={currentForm.projectUrl || ''} onChange={handleFormChange} placeholder="https://..." className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
          </div>
          
          {/* Visibility Toggles */}
          <div className="md:col-span-2 mt-2 flex flex-wrap gap-4">
             <label className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 cursor-pointer w-fit">
                <input 
                    type="checkbox" 
                    name="showInFreelance" 
                    checked={currentForm.showInFreelance || false} 
                    onChange={handleFormChange}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase size={16} className={currentForm.showInFreelance ? "text-purple-500" : "text-slate-400"} />
                    Show in Freelance Site
                </span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 cursor-pointer w-fit">
                <input 
                    type="checkbox" 
                    name="showInClient" 
                    checked={currentForm.showInClient !== false} 
                    onChange={handleFormChange}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-semibold flex items-center gap-2">
                    <Monitor size={16} className={currentForm.showInClient !== false ? "text-indigo-500" : "text-slate-400"} />
                    Show in Personal Portfolio
                </span>
            </label>
          </div>

          <div className="md:col-span-2 flex items-center space-x-2 mt-4">
            {isEditing === null ? (
              <button type="submit" className="px-6 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">Add Testimonial</button>
            ) : (
              <button type="button" onClick={handleDoneEditing} className="px-6 py-2 font-semibold bg-slate-200 dark:bg-slate-600 rounded-lg">Done Editing</button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {testimonials.map((test, index) => (
          <div key={index} className={`flex items-start justify-between p-4 rounded-lg shadow-sm border transition-colors ${isEditing === index ? 'bg-sky-50 border-sky-200 dark:bg-sky-900/20' : 'bg-white border-slate-100 dark:bg-slate-800/50 dark:border-slate-700'}`}>
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 mt-1 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  <Quote size={20} />
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{test.clientName}</h4>
                      {test.company && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({test.company})</span>}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-2">"{test.text}"</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                      {test.showInFreelance && (
                          <span className="text-[10px] bg-purple-100 text-purple-600 dark:bg-purple-900/30 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                              Freelance
                          </span>
                      )}
                      {test.showInClient !== false && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                              Portfolio
                          </span>
                      )}
                  </div>
               </div>
            </div>
            <div className="flex-shrink-0 space-x-3 mt-1">
              <button onClick={() => handleSelectToEdit(index)} className="text-sm text-sky-600 dark:text-sky-400 font-medium hover:underline">Edit</button>
              <button onClick={() => handleDelete(index)} className="text-sm text-red-500 font-medium hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-center text-slate-500 italic">No testimonials added.</p>}
      </div>
    </div>
  );
};

export default ManageTestimonials;
