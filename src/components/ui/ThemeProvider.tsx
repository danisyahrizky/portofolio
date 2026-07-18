import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  isLight: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Status default dikunci ke false (Mode Gelap)
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Hanya periksa memori peramban
    const savedTheme = localStorage.getItem('theme');
    
    // Jika pengguna sebelumnya secara eksplisit mengubah ke mode terang, hormati pilihannya
    if (savedTheme === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light');
    } else {
      // Jika ini kunjungan pertama (null) atau tersimpan sebagai 'dark', paksa mode gelap
      setIsLight(false);
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsLight((prev) => {
      const nextTheme = !prev;
      if (nextTheme) {
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      }
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme harus dieksekusi di dalam ThemeProvider");
  return context;
};