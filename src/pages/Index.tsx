import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Clock, ListTodo } from 'lucide-react';
import Logo from '@/components/Logo';
import FloatingCards from '@/components/FloatingCards';
import heroBackground from '@/assets/hero-background.jpg';
import { fadeIn, staggerContainer } from '@/lib/animations';
const Index = () => {
  return <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background */}
      <main className="flex-1 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${heroBackground})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
        </div>

        {/* Floating Cards Background */}
        <FloatingCards />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl w-full text-center">
            <motion.div initial={{
            opacity: 0,
            y: -30,
            scale: 0.8
          }} animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }} transition={{
            duration: 0.6,
            ease: "easeOut"
          }} className="flex justify-center mb-8">
              <motion.div animate={{
              rotateY: [0, 360],
              scale: [1, 1.05, 1]
            }} transition={{
              rotateY: {
                duration: 2,
                delay: 0.5
              },
              scale: {
                duration: 2,
                delay: 0.5
              }
            }}>
                <Logo size="lg" animated={false} />
              </motion.div>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-7xl md:text-7xl font-bold mb-6 gradient-text leading-relaxed pb-2">
              Agile Poker
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              A beautiful real-time Planning Poker app for development teams to collaboratively estimate task complexity
            </motion.p>
            
            <motion.div variants={fadeIn}>
              <Link to="/create">
                <Button size="lg" className="text-lg px-8 py-6 hover-lift hover-glow animate-glow-pulse">
                  Start a New Game
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
            
            {/* Feature Cards */}
            <motion.div variants={staggerContainer} className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon={<Users className="h-8 w-8" />} title="Real-time Collaboration" description="Synchronize votes across your entire team in real-time, no refreshing needed." />
              <FeatureCard icon={<ListTodo className="h-8 w-8" />} title="Multiple Stories" description="Add and manage multiple user stories within a single planning session." />
              <FeatureCard icon={<Clock className="h-8 w-8" />} title="Voting Timer" description="Keep meetings efficient with an optional countdown timer for voting rounds." />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>;
};
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description
}) => {
  return <motion.div variants={fadeIn} whileHover={{
    y: -5
  }} className="glass p-8 rounded-2xl shadow-lg hover-glow transition-all duration-300 group">
      <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>;
};
export default Index;