import { useState, lazy, Suspense } from 'react';
const CtaLiquidEffect = lazy(() => import('./CtaLiquidEffect'));

export function CtaButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const whatsappNumber = "62895396017225";
  const whatsappMessage = encodeURIComponent("Halo Danis, saya tertarik untuk mendiskusikan proyek baru.");

  const handleClick = () => {
    if (isClicked) return; 
    
    setIsClicked(true);

    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
      setIsClicked(false);
      setIsHovered(false);
    }, 800);
  };

  return (
    <div
      className="relative inline-flex items-center justify-center border-2 border-bg-dark dark:border-bg-light cursor-pointer overflow-hidden px-4 py-2 md:px-8 md:py-3 group bg-transparent shrink-0 touch-none transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <CtaLiquidEffect isHovered={isHovered} isClicked={isClicked} />
        </Suspense>
      </div>
      
      <span className="relative z-10 font-sans font-extrabold uppercase text-bg-dark dark:text-bg-light group-hover:text-static-light transition-colors duration-300 tracking-wider pointer-events-none select-none text-[10px] md:text-base">
        Let's Talk
      </span>
    </div>
  );
}