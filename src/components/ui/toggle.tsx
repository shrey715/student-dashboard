"use client";
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  className?: string;
  size: number;
}

const Toggle = ({ className, size }: ToggleProps) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <motion.div 
        key={theme} 
        initial={{ rotate: 0 }} 
        animate={{ rotate: 360 }} 
        transition={{ duration: 1, type: 'spring', stiffness: 260 }}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={cn('cursor-pointer', className)}
      >
        {theme === 'dark' ?        
            <Sun size={size} />
        :      
            <Moon size={size} />
        }
      </motion.div>
  )
}

export default Toggle;