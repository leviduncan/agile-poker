import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface EmptyStateProps {
  image: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  image, 
  title, 
  description, 
  action 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <img 
        src={image} 
        alt={title}
        className="w-64 h-48 object-cover rounded-lg mb-6 opacity-80"
      />
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action}
    </motion.div>
  );
};

export default EmptyState;
