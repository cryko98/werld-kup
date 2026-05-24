export interface RoadmapItem {
  id: number;
  stage: string;
  title: string;
  desc: string;
  funnyIcon: string;
  status: 'done' | 'doing' | 'planned';
}

export interface MemeCard {
  id: number;
  url: string;
  caption: string;
}

export interface SoccerFact {
  id: number;
  time: string;
  text: string;
  player: string;
  avatar: string;
}

export interface FaqItem {
  id: number;
  q: string;
  a: string;
}
