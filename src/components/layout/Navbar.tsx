import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ui/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { CtaButton } from '../ui/ctaButton';

export function Navbar() {
  const { isLight, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="w-full border-b-4 border-current px-4 md:px-12 py-3 md:py-4 flex justify-between items-center bg-bg-light text-bg-dark dark:bg-bg-dark dark:text-bg-light transition-colors duration-300 z-50 sticky top-0 box-border">
        <Link to="/" className="hidden md:block text-2xl font-black uppercase tracking-tighter hover:text-accent-blood transition-colors shrink-0">
          DR.
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-2xl font-black uppercase tracking-tighter hover:text-accent-blood transition-colors cursor-pointer shrink-0"
        >
          DR.
        </button>
        <div className="flex items-center gap-3 md:gap-8 shrink-0">
          <div className="hidden md:flex items-center gap-6 text-base font-extrabold uppercase tracking-widest">
            <Link to="/#home" className="hover:text-accent-blood transition-colors">Home</Link>
            <Link to="/#project" className="hover:text-accent-blood transition-colors">Project</Link>
            <Link to="/#about" className="hover:text-accent-blood transition-colors">About</Link>
          </div>
          
          <button 
            onClick={toggleTheme}   
            className="p-1.5 md:p-2 hover:bg-bg-light hover:text-bg-dark transition-colors cursor-pointer shrink-0"
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={18} className="md:w-5 md:h-5" /> : <Sun size={18} className="md:w-5 md:h-5" />}
          </button>
          
          <CtaButton />
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] md:top-[76px] z-40 bg-bg-light text-bg-dark dark:bg-bg-dark dark:text-bg-light flex flex-col p-8 border-t-4 border-current md:hidden box-border">
          <div className="flex flex-col gap-8 text-3xl font-black uppercase tracking-widest">
            <Link to="/#home" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent-blood transition-colors">Home</Link>
            <Link to="/#project" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent-blood transition-colors">Project</Link>
            <Link to="/#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent-blood transition-colors">About</Link>
          </div>
        </div>
      )}
    </>
  );
}