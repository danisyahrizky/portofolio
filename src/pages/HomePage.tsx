import { lazy, Suspense } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import { BehanceIcon } from '../assets/behance';

import { ProjectCard } from '../components/ui/ProjectCard';
import { SocialLink } from '../components/ui/SocialLink';
import { ContactForm } from '../components/ui/ContactForm';

const HomeScene = lazy(() => import('../components/3d/HomeScene'));

export function HomePage() {
  const { hash } = useLocation();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

return (
    <div className="w-full relative bg-transparent text-static-light">
      
      <section id="home" className="relative h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden px-6 md:px-12 bg-transparent" style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
        
        <Suspense fallback={<div className="w-full h-full bg-bg-dark animate-pulse"></div>}>
          <HomeScene />
        </Suspense>

        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12 z-10 pointer-events-none">
          <div className="flex flex-col">
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11vw] sm:text-[12vw] md:text-[100px] lg:text-[120px] leading-[0.8] font-black tracking-tighter uppercase whitespace-nowrap text-bg-dark dark:text-bg-light mix-blend-difference"
            >
              PORTOFOLIO
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-[10px] md:text-[12px] tracking-[0.5em] opacity-80 mt-4 text-bg-dark dark:text-bg-light"
            >
              by DANISYAH RIZKY
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="max-w-md border-l-4 border-accent-blood pl-6 py-4 bg-accent-maroon/10 text-sm italic leading-relaxed opacity-90 text-bg-dark dark:text-bg-light mix-blend-difference pointer-events-auto backdrop-blur-sm"
          >
            The work presented here functions as a repository for experiments in digital architecture. The approach is grounded in the belief that the creative process is a site of structural investigation rather than static display.
          </motion.div>
        </div>
      </section>

      <section id="project" className="w-full py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto border-b-2 border-accent-blood pb-16">
          <h2 className="text-xs md:text-sm uppercase tracking-widest font-bold mb-12 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-accent-blood"></span> Selected Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <ProjectCard 
              title="FrontEnd\nDevelopment"
              description="Solving interface challenges through clean, deliberate architecture. Crafting seamless user journeys from intricate requirements."
              link="/project/Frontend%20Development"
              index={1}
            />
            <ProjectCard 
              title="Visual\nGraphics"
              description="Developing cohesive visual systems, posters, and brand identities. Leveraging typography as the primary voice to create impactful, clear communication."
              link="/project/Visual%20Graphics"
              index={2}
            />
          </div>
        </div>
      </section>

      <section id="about" className="w-full flex justify-center py-24 px-6 md:px-12 relative overflow-hidden z-10">
        <motion.div style={{ y }} className="absolute text-[20vw] font-black opacity-5 whitespace-nowrap top-1/4 -z-10 pointer-events-none">
          DANISYAH RIZKY
        </motion.div>
        <div className="w-full max-w-7xl relative z-10 border-4 border-current flex flex-col md:flex-row bg-bg-dark text-bg-light dark:bg-bg-light dark:text-bg-dark shadow-2xl">
          
          <div className="p-8 md:p-12 lg:p-16 md:w-[55%] border-b-4 md:border-b-0 md:border-r-4 border-current flex flex-col justify-between">
            <div>
              <h2 className="text-xs md:text-sm uppercase tracking-widest font-bold mb-8 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-accent-blood"></span> Hey, It's Me
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-12 lg:mb-20">
                <span className="text-accent-blood font-bold">Danisyah Rizky.</span> 7.25° S, 112.76° E. Dedicated to translating complex data into fluid, rhythmic digital experiences. Focus on the intersection of technical precision and visual clarity, transforming raw components into stable, expressive interfaces.
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 opacity-70">Social Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <SocialLink icon={<Instagram size={20} />} label="Instagram" href="https://www.instagram.com/kucing_berdiri/" />
                <SocialLink icon={<Twitter size={20} />} label="Twitter" href="https://x.com/kucingberdiri_" />
                <SocialLink icon={<Linkedin size={20} />} label="LinkedIn" href="https://www.linkedin.com/in/danisyah-rizky-42bb41226" />
                <SocialLink icon={<BehanceIcon size={20} />} label="Behance" href="https://www.behance.net/danisyahrizky" />
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 lg:p-16 md:w-[45%] bg-accent-maroon/5 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
              Contact Me
            </h2>
            <p className="text-xs opacity-70 uppercase tracking-widest mb-10 font-bold">
              Let's create something together
            </p>
            
            <ContactForm />

          </div>
        </div>
      </section>
    </div>
  );
}