
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl font-bold text-poker-text mb-4">
            Agile Poker
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            A real-time Planning Poker app for development teams to collaboratively estimate task complexity
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/create">
              <Button className="text-lg px-6 py-6 bg-poker-primary hover:bg-poker-secondary">
                Start a New Game
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Real-time Collaboration" 
              description="Synchronize votes across your entire team in real-time, no refreshing needed."
            />
            <FeatureCard 
              title="Multiple Stories" 
              description="Add and manage multiple user stories within a single planning session."
            />
            <FeatureCard 
              title="Voting Timer" 
              description="Keep meetings efficient with an optional countdown timer for voting rounds."
            />
          </div>
        </div>
      </main>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
