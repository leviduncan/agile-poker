import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/logo-variation-2-estimate-card.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  animated = true,
  className 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-24 w-24'
  };

  const LogoImage = animated ? motion.img : 'img';

  const animationProps = animated ? {
    whileHover: { 
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 }
    },
    whileTap: { scale: 0.95 },
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <LogoImage
      src={logoImage}
      alt="Agile Poker Logo"
      className={cn(
        sizeClasses[size],
        'object-contain',
        animated && 'cursor-pointer',
        className
      )}
      {...animationProps}
    />
  );
};

export default Logo;
