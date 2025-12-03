import React from 'react';
import type { PlaygroundConfig } from '../types';

interface ManagePlaygroundProps {
  config: PlaygroundConfig;
  setConfig: React.Dispatch<React.SetStateAction<PlaygroundConfig>>;
}

const ManagePlayground: React.FC<ManagePlaygroundProps> = ({ config, setConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let newValue: any = value;
    if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
        newValue = parseFloat(value);
    }

    setConfig((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <div>
      <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600">
         <p className="text-yellow-700 dark:text-yellow-200 text-sm">
            <strong>Note:</strong> These settings only apply when the "Playground / Experimental" template is selected in the "Template" tab.
         </p>
      </div>

      <h2 className="text-3xl font-bold mb-6">Playground Experimentation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Colors & Background --- */}
        <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Visual Style</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Background Type</label>
                    <select name="bgType" value={config.bgType} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
                        <option value="solid">Solid Color</option>
                        <option value="gradient">Gradient</option>
                        <option value="mesh">Mesh Grid</option>
                        <option value="stars">Starry Night</option>
                        <option value="particles">Particles (Experimental)</option>
                        <option value="floatingLines">Floating Lines (New)</option>
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium mb-1">Card Style</label>
                     <select name="cardStyle" value={config.cardStyle} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
                        <option value="solid">Solid</option>
                        <option value="glass">Glassmorphism</option>
                        <option value="outline">Outline</option>
                        <option value="neobrutalism">Neo-Brutalism</option>
                     </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                        <input type="color" name="primaryColor" value={config.primaryColor} onChange={handleChange} className="h-10 w-10 rounded cursor-pointer" />
                        <span className="text-xs opacity-70">{config.primaryColor}</span>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                        <input type="color" name="textColor" value={config.textColor} onChange={handleChange} className="h-10 w-10 rounded cursor-pointer" />
                        <span className="text-xs opacity-70">{config.textColor}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">BG Color 1</label>
                    <div className="flex items-center gap-2">
                        <input type="color" name="bgColor1" value={config.bgColor1} onChange={handleChange} className="h-10 w-10 rounded cursor-pointer" />
                        <span className="text-xs opacity-70">{config.bgColor1}</span>
                    </div>
                </div>
                {config.bgType !== 'solid' && (
                    <div>
                        <label className="block text-sm font-medium mb-1">BG Color 2</label>
                        <div className="flex items-center gap-2">
                            <input type="color" name="bgColor2" value={config.bgColor2} onChange={handleChange} className="h-10 w-10 rounded cursor-pointer" />
                            <span className="text-xs opacity-70">{config.bgColor2}</span>
                        </div>
                    </div>
                )}
            </div>
            
            <div>
                <label className="block text-sm font-medium mb-1">Border Radius</label>
                <select name="borderRadius" value={config.borderRadius} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
                    <option value="rounded-none">None (Square)</option>
                    <option value="rounded-lg">Small (Rounded LG)</option>
                    <option value="rounded-2xl">Medium (Rounded 2XL)</option>
                    <option value="rounded-full">Extreme (Full)</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Animation Speed</label>
                <select name="animationSpeed" value={config.animationSpeed} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
                    <option value="slow">Slow & Relaxed</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast & Snappy</option>
                </select>
            </div>
        </div>

        <div className="space-y-8">
            {/* --- Content Controls --- */}
            <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md space-y-4">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Content Override</h3>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Playground Hero Title</label>
                    <input type="text" name="heroTitle" value={config.heroTitle} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Playground Hero Subtitle</label>
                    <input type="text" name="heroSubtitle" value={config.heroSubtitle} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-4 border-b pb-2">Section Visibility</h3>
                
                <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                        <input type="checkbox" name="showHero" checked={config.showHero} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                        <span>Show Hero Section</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                        <input type="checkbox" name="showSkills" checked={config.showSkills} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                        <span>Show Skills Section</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                        <input type="checkbox" name="showProjects" checked={config.showProjects} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                        <span>Show Projects Section</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                        <input type="checkbox" name="showContact" checked={config.showContact} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                        <span>Show Contact Section</span>
                    </label>
                </div>
            </div>

             {/* --- Particles Configuration --- */}
            {config.bgType === 'particles' && (
                 <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md space-y-4 border-2 border-sky-500">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Particles Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Particle Count</label>
                            <input type="number" name="particleCount" value={config.particleCount || 200} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" min="50" max="1000" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Spread</label>
                            <input type="number" name="particleSpread" value={config.particleSpread || 10} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" min="1" max="50" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">Base Size</label>
                             <input type="number" name="particleBaseSize" value={config.particleBaseSize || 100} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" min="10" max="500" />
                        </div>
                         <div>
                             <label className="block text-sm font-medium mb-1">Speed</label>
                             <input type="number" name="particleSpeed" value={config.particleSpeed || 0.1} onChange={handleChange} step="0.1" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                         <label className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                            <input type="checkbox" name="moveParticlesOnHover" checked={config.moveParticlesOnHover ?? true} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                            <span>Move on Hover</span>
                        </label>
                         <label className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                            <input type="checkbox" name="disableRotation" checked={config.disableRotation ?? false} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                            <span>Disable Rotation</span>
                        </label>
                    </div>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        * Uses BG Color 1, BG Color 2, and Primary Color for particle colors.
                     </p>
                 </div>
            )}

            {/* --- Floating Lines Configuration --- */}
            {config.bgType === 'floatingLines' && (
                 <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md space-y-4 border-2 border-sky-500">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Floating Lines Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Line Count</label>
                            <input type="number" name="flLineCount" value={config.flLineCount || 10} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" min="1" max="50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Distance</label>
                            <input type="number" name="flLineDistance" value={config.flLineDistance || 5.0} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" min="1" step="0.5" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">Bend Radius</label>
                             <input type="number" name="flBendRadius" value={config.flBendRadius || 5.0} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" min="1" step="0.1" />
                        </div>
                         <div>
                             <label className="block text-sm font-medium mb-1">Bend Strength</label>
                             <input type="number" name="flBendStrength" value={config.flBendStrength || -0.5} onChange={handleChange} step="0.1" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                         <label className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                            <input type="checkbox" name="flParallax" checked={config.flParallax ?? true} onChange={handleChange} className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500" />
                            <span>Enable Parallax</span>
                        </label>
                    </div>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        * Uses BG Color 1, BG Color 2, and Primary Color for gradient lines.
                     </p>
                 </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default ManagePlayground;
