
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Check, FileText, Plus } from 'lucide-react';
import { Story } from '@/context/GameContext';

const StoryList: React.FC = () => {
  const { game, isHost, addStory, selectStory, currentStory } = useGame();
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryDescription, setNewStoryDescription] = useState('');
  
  if (!game) return null;
  
  const handleAddStory = () => {
    if (newStoryTitle.trim()) {
      addStory(newStoryTitle, newStoryDescription);
      setNewStoryTitle('');
      setNewStoryDescription('');
    }
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="mb-4">
          <FileText className="mr-2 h-4 w-4" />
          Stories {game.stories.length > 0 && `(${game.stories.length})`}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Stories</SheetTitle>
        </SheetHeader>
        
        <div className="my-6 space-y-4">
          {game.stories.length === 0 ? (
            <div className="text-center text-gray-500 my-8">
              No stories added yet
            </div>
          ) : (
            <div className="space-y-2">
              {game.stories.map((story) => (
                <StoryItem 
                  key={story.id} 
                  story={story} 
                  isActive={story.id === currentStory?.id}
                  isHost={isHost}
                  onSelect={() => selectStory(story.id)}
                />
              ))}
            </div>
          )}
        </div>
        
        {isHost && (
          <div className="mt-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Story
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new story</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input
                      id="title"
                      value={newStoryTitle}
                      onChange={(e) => setNewStoryTitle(e.target.value)}
                      placeholder="Enter story title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
                    <Textarea
                      id="description"
                      value={newStoryDescription}
                      onChange={(e) => setNewStoryDescription(e.target.value)}
                      placeholder="Enter story description"
                      rows={4}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddStory}>Add Story</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

interface StoryItemProps {
  story: Story;
  isActive: boolean;
  isHost: boolean;
  onSelect: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, isActive, isHost, onSelect }) => {
  let statusBadge = null;
  
  switch (story.status) {
    case 'pending':
      statusBadge = (
        <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</div>
      );
      break;
    case 'voting':
      statusBadge = (
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Voting</div>
      );
      break;
    case 'revealed':
      statusBadge = (
        <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Revealed</div>
      );
      break;
    case 'completed':
      statusBadge = (
        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
          <Check className="mr-1 h-3 w-3" />
          <span>{story.finalEstimate}</span>
        </div>
      );
      break;
  }
  
  return (
    <div 
      className={`
        p-3 rounded-md border 
        ${isActive ? 'border-poker-primary bg-poker-primary/5' : 'border-gray-200'}
        ${isHost && story.status !== 'completed' ? 'cursor-pointer hover:bg-gray-50' : ''}
      `}
      onClick={isHost && story.status !== 'completed' ? onSelect : undefined}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium">{story.title}</h3>
        {statusBadge}
      </div>
      
      {story.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{story.description}</p>
      )}
    </div>
  );
};

export default StoryList;
