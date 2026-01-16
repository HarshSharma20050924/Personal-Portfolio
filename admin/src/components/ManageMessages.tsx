
import React, { useEffect, useState } from 'react';
import { Message } from '../types';
import { Trash2, Mail } from 'lucide-react';

const ManageMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

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

  if (loading) return <div>Loading inbox...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Inbox</h2>
      {messages.length === 0 ? (
        <div className="p-8 bg-white dark:bg-slate-800/50 rounded-lg text-center text-slate-500">
          No messages received yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{msg.name}</h3>
                  <a href={`mailto:${msg.email}`} className="text-sky-500 hover:underline text-sm flex items-center gap-1">
                    <Mail size={14} /> {msg.email}
                  </a>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block mb-2">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => deleteMessage(msg.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">
                {msg.message}
              </div>
              <div className="mt-4 flex justify-end">
                 <a href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry&body=Hi ${msg.name},\n\nThank you for reaching out...`} className="px-4 py-2 bg-sky-500 text-white rounded text-sm hover:bg-sky-600 transition-colors">
                    Reply
                 </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
