import { useState } from 'react';
import { Send } from 'lucide-react';

export function ContactForm() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('sent');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold tracking-widest">Name</label>
        <input required type="text" className="bg-transparent border-b-2 border-current p-2 font-mono text-sm focus:outline-none focus:border-accent-blood transition-colors" placeholder="Enter your name" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold tracking-widest">Email</label>
        <input required type="email" className="bg-transparent border-b-2 border-current p-2 font-mono text-sm focus:outline-none focus:border-accent-blood transition-colors" placeholder="Enter your email" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold tracking-widest">Message</label>
        <textarea required rows={4} className="bg-transparent border-b-2 border-current p-2 font-mono text-sm focus:outline-none focus:border-accent-blood transition-colors resize-none" placeholder="Enter your message" />
      </div>
      
      <button 
        type="submit" 
        disabled={formStatus !== 'idle'}
        className="mt-4 flex items-center justify-center gap-3 border-2 border-accent-blood bg-bg-light text-bg-dark hover:bg-bg-dark hover:text-bg-light dark:bg-bg-dark dark:text-bg-light dark:hover:bg-bg-light dark:hover:text-bg-dark p-4 transition-colors text-xs font-bold uppercase tracking-widest group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formStatus === 'idle' && <><div className="group-hover:scale-110 transition-transform"><Send size={16} /></div> Send Message</>}
        {formStatus === 'sending' && 'Sending...'}
        {formStatus === 'sent' && 'Message Sent'}
      </button>
    </form>
  );
}