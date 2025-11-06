import React from 'react';
import { motion } from 'framer-motion';

const FloatingCards: React.FC = () => {
  const cardValues = ['1', '2', '3', '5', '8', '13', '21', '?'];
  
  const cards = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    value: cardValues[i % cardValues.length],
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5,
    scale: 0.7 + Math.random() * 0.4,
    rotation: Math.random() * 360
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          className="absolute glass rounded-xl shadow-xl border border-primary/30"
          style={{
            left: `${card.initialX}%`,
            top: `${card.initialY}%`,
            width: '100px',
            height: '140px',
            transform: `rotate(${card.rotation}deg) scale(${card.scale})`
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [card.rotation, card.rotation + 360],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: card.duration,
            repeat: Infinity,
            delay: card.delay,
            ease: "easeInOut"
          }}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-3xl font-bold gradient-text">
              {card.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingCards;
