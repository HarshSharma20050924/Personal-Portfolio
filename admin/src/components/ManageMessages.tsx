
import React, { useEffect, useState } from 'react';
import { Message } from '../types';
import { Trash2, Mail, Phone, Briefcase, User, Star, Bell } from 'lucide-react';

interface ManageMessagesProps {
    refreshTrigger?: number;
}

const ManageMessages: React.FC<ManageMessagesProps> = ({ refreshTrigger = 0 }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'freelance' | 'general'>('all');

  useEffect(() => {
    fetchMessages();
    requestNotificationPermission();
  }, [refreshTrigger]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  const fetchMessages = async () => {
    const apiKey = sessionStorage.getItem('apiKey');
    try {
      const res = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    const apiKey = sessionStorage.getItem('apiKey');
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMessages = messages.filter(m => {
      if (filter === 'all') return true;
      const type = m.type || 'general';
      return type === filter;
  });

  const getCardStyle = (type: string) => {
      if (type === 'freelance') {
          return "border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10";
      }
      return "border-l-4 border-l-slate-300 dark:border-l-slate-600 bg-white dark:bg-slate-800";
  };

  if (loading && messages.length === 0) return <div className="p-8 text-center">Loading inbox...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-2">
              Inbox <span className="text-sm font-normal text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">{messages.length}</span>
          </h2>
          <div className="flex gap-2 text-sm bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'}`}
              >
                  All
              </button>
              <button 
                onClick={() => setFilter('freelance')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${filter === 'freelance' ? 'bg-white dark:bg-slate-600 shadow-sm text-yellow-600 dark:text-yellow-400' : 'hover:text-slate-900 dark:hover:text-white'}`}
              >
                  <Star size={12} fill="currentColor" /> Freelance Leads
              </button>
              <button 
                onClick={() => setFilter('general')}
                className={`px-3 py-1 rounded-md transition-colors ${filter === 'general' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'}`}
              >
                  General
              </button>
          </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-800/50 rounded-lg text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-700">
          <Mail className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p>No messages found in this category.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredMessages.map((msg) => {
            const isFreelance = msg.type === 'freelance';
            return (
                <div key={msg.id} className={`rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 animate-fadeIn ${getCardStyle(msg.type || 'general')}`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            {isFreelance && (
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> Freelance Lead
                                    </span>
                                    {msg.service && (
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded">
                                            {msg.service}
                                        </span>
                                    )}
                                </div>
                            )}
                            
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                {msg.name}
                                {msg.company && <span className="text-slate-400 font-normal text-sm">@ {msg.company}</span>}
                            </h3>
                            
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                <a href={`mailto:${msg.email}`} className="hover:text-sky-500 flex items-center gap-1">
                                    <Mail size={14} /> {msg.email}
                                </a>
                                {msg.phone && (
                                    <a href={`tel:${msg.phone}`} className="hover:text-sky-500 flex items-center gap-1">
                                        <Phone size={14} /> {msg.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <span className="text-xs text-slate-400 block mb-2 font-mono">
                                {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                            <button 
                                onClick={() => deleteMessage(msg.id)} 
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors" 
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-700/50">
                        {msg.message}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <a 
                            href={`mailto:${msg.email}?subject=${isFreelance ? `Re: Project Inquiry - ${msg.service || 'Collaboration'}` : 'Re: Portfolio Inquiry'}&body=Hi ${msg.name.split(' ')[0]},\n\nThank you for reaching out regarding ${msg.service ? `the ${msg.service} project` : 'your inquiry'}...`} 
                            className="px-4 py-2 bg-sky-500 text-white rounded text-sm hover:bg-sky-600 transition-colors font-medium shadow-sm"
                        >
                            Reply via Email
                        </a>
                    </div>
                </div>
                </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
