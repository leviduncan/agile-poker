import confetti from 'canvas-confetti';

/**
 * Trigger confetti for perfect consensus (100% agreement)
 * Massive celebration with confetti from both sides
 */
export const triggerPerfectConsensus = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { 
    startVelocity: 30, 
    spread: 360, 
    ticks: 60, 
    zIndex: 9999,
    colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#10B981']
  };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left side
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });

    // Right side
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

/**
 * Trigger confetti for strong consensus (75%+ agreement)
 * Moderate celebration with confetti burst from center
 */
export const triggerStrongConsensus = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4'],
    zIndex: 9999,
    startVelocity: 45,
    gravity: 1.2,
    ticks: 200
  });
};

/**
 * Trigger confetti when estimate is finalized
 * Cannon effect from bottom with gold/green theme
 */
export const triggerEstimateFinalized = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
    colors: ['#10B981', '#059669', '#FBBF24', '#F59E0B']
  };

  const fire = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  };

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

/**
 * Trigger custom confetti with specific options
 */
export const triggerCustomConfetti = (options: confetti.Options) => {
  confetti({
    zIndex: 9999,
    ...options
  });
};
