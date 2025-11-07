-- Create story status enum
CREATE TYPE story_status AS ENUM ('pending', 'voting', 'revealed', 'completed');

-- Create games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  current_story_id UUID,
  reveal_cards BOOLEAN DEFAULT false,
  timer_enabled BOOLEAN DEFAULT false,
  timer_duration INTEGER DEFAULT 45,
  timer_end_time BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Policies for games (open access for MVP)
CREATE POLICY "Anyone can read games"
  ON public.games FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create games"
  ON public.games FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update games"
  ON public.games FOR UPDATE
  USING (true);

-- Add index for invite code lookups
CREATE INDEX games_invite_code_idx ON public.games(invite_code);

-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  is_host BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  current_vote TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on players
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Policies for players (open access for MVP)
CREATE POLICY "Anyone can read players"
  ON public.players FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create players"
  ON public.players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update players"
  ON public.players FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete players"
  ON public.players FOR DELETE
  USING (true);

-- Add index for game lookups
CREATE INDEX players_game_id_idx ON public.players(game_id);

-- Create stories table
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status story_status DEFAULT 'pending',
  final_estimate TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on stories
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Policies for stories (open access for MVP)
CREATE POLICY "Anyone can read stories"
  ON public.stories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create stories"
  ON public.stories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update stories"
  ON public.stories FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete stories"
  ON public.stories FOR DELETE
  USING (true);

-- Add index for game lookups
CREATE INDEX stories_game_id_idx ON public.stories(game_id);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER TABLE public.games REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER TABLE public.players REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
ALTER TABLE public.stories REPLICA IDENTITY FULL;