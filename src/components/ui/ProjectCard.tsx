import { Link } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  index: number;
}

export function ProjectCard({ title, description, link, index }: ProjectCardProps) {
  return (
    <Link to={link} className="group block h-full">
      <div className="p-6 md:p-8 h-full flex flex-col justify-between transform transition-all duration-300 border-2 relative overflow-hidden bg-bg-light text-bg-dark dark:bg-bg-dark dark:text-bg-light border-transparent hover:border-accent-blood shadow-none md:hover:shadow-[8px_8px_0px_0px_#660000] md:hover:-translate-y-2 md:hover:-translate-x-2 active:shadow-[4px_4px_0px_0px_#660000] active:-translate-y-1 active:-translate-x-1">
        <div className="flex justify-between items-start mb-12 md:mb-16">
          {/* PENAMBAHAN: break-words dan hyphens-auto untuk mencegah teks keluar batas */}
          <h3 className="text-2xl md:text-5xl font-black italic uppercase leading-none whitespace-pre-line break-words max-w-[85%]">
            {title.replace('\\n', '\n')}
          </h3>
          <span className="text-[10px] md:text-xs font-bold border px-2 py-1 border-current shrink-0">
            0{index}
          </span>
        </div>
        <div>
          <p className="opacity-80 text-xs md:text-sm mb-6 leading-relaxed max-w-sm break-words">{description}</p>
          <p className="text-xs opacity-70 font-bold uppercase tracking-tighter group-hover:text-accent-blood transition-colors">
            View Works &rarr;
          </p>
        </div>
      </div>
    </Link>
  );
}