import { useEffect, useState } from 'react';
import { fetchLastUpdate } from '../../lib/sanity';

export function Footer() {
  const [lastDeploy, setLastDeploy] = useState("...");

  useEffect(() => {
    async function getDeployDate() {
      try {
        const dateStr = await fetchLastUpdate();
        if (dateStr) {
          const date = new Date(dateStr);
          const formatted = date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }).toUpperCase();
          setLastDeploy(formatted);
        } else {
          setLastDeploy("UNKNOWN");
        }
      } catch (error) {
        setLastDeploy("ERROR");
      }
    }
    getDeployDate();
  }, []);

  return (
    <footer className="w-full border-t-2 border-static-light px-6 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-static-dark text-static-light">
      <div className="font-sans font-bold text-[10px] md:text-xs tracking-widest mb-4 md:mb-0 whitespace-nowrap">
        © {new Date().getFullYear()} DanisyahRizky. ALL RIGHTS RESERVED.
      </div>
      <div className="flex font-sans font-bold text-[10px] md:text-xs uppercase tracking-widest">
        <span className="bg-accent-blood text-static-light px-3 py-1.5">
          LAST DEPLOY: {lastDeploy}
        </span>
      </div>
    </footer>
  );
}