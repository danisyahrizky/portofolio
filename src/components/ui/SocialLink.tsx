
interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function SocialLink({ icon, label, href }: SocialLinkProps) {
  return (
    <a  href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 md:gap-3 border-2 border-accent-blood bg-bg-light text-bg-dark hover:bg-bg-dark hover:text-bg-light dark:bg-bg-dark dark:text-bg-light dark:hover:bg-bg-light dark:hover:text-bg-dark p-3 md:p-4 transition-colors group">
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest truncate">{label}</span>
    </a>
  );
}