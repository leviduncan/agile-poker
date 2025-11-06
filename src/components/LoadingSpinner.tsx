import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/logo-variation-2-estimate-card.png';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'spinner' | 'logo';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  variant = 'logo'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (variant === 'logo') {
    return (
      <motion.img
        src={logoImage}
        alt="Loading"
        className={cn(
          sizeClasses[size],
          'object-contain',
          className
        )}
        animate={{
          rotateY: [0, 180, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  return (
    <motion.img
      src={logoImage}
      alt="Loading"
      className={cn(
        sizeClasses[size],
        'object-contain',
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

export default LoadingSpinner;
