
export interface Position {
  x: number;
  y: number;
}

export interface Media {
  type: 'image' | 'video' | 'iframe' | 'demo';
  url: string;
  caption?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'portrait'; // video = 16:9
}

export interface NodeData {
  id: string;
  title: string;
  type: 'bio' | 'project' | 'skill' | 'contact' | 'experience' | 'project-hub' | 'experience-hub';
  content: string; // Markdown-ish content
  position: Position;
  width?: number;
  media?: Media;
  gallery?: string[]; // Array of additional image URLs
  tags?: string[];
  links?: { label: string; url: string }[];
  hidden?: boolean; // If true, node is not rendered until opened
  figmaEmbed?: string;
  figmaEmbeds?: string[];
  likes?: number;
}

export interface CanvasState {
  x: number;
  y: number;
  scale: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

// Helper type for the file explorer structure
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  nodeId?: string; // Links to the canvas node ID
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category?: string;
  linkedNodeId?: string; // If it exists as a spatial node
  link?: string; // External link if no spatial node
  linkLabel?: string;
  showLink?: boolean;
  thumbnail?: string; // Previews for the list
  images?: string[]; // Additional gallery assets
  year?: string;
  service?: string;
  tools?: string[];
  fullDescription?: string;
  figmaEmbed?: string;
  figmaEmbedLabel?: string;
  showEmbedLink?: boolean;
  figmaEmbeds?: string[];
  likes?: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}
