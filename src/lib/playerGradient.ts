// Generate unique gradient colors based on player name
export const generatePlayerGradient = (name: string): string => {
  // Simple hash function to generate consistent colors from names
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate HSL values for vibrant, consistent colors
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 60) % 360; // Complementary hue
  
  return `linear-gradient(135deg, hsl(${h1}, 70%, 60%), hsl(${h2}, 70%, 50%))`;
};

export const getPlayerInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};
