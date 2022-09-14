import { TextEditorBlock } from "../components/text-editor/models/text-editor.model";

/* export interface Project {
  id: string;
  name: string;
  pages: TextEditorPage[];
  notes: TextEditorNote[];
  references: TextEditoreReference[];
} */

export interface Project{
  id: string;
  name: string;
  extras?: any;
  notes: TextEditorNote[];
  files: ProjectFile[];
  references: TextEditoreReference[];
}

export interface ProjectFile{
  id: string;
  name: string;
  type: 'FOLDER' | 'FILE';
  path:  string;
  collapsed?: boolean;
  icon?: string;
  children?: ProjectFile[];
  blocks?: TextEditorBlock[];
  isEditing?: boolean;// internal
}
export interface TextEditorPage {
  id: string;
  title: string;
  position: number;
  blocks: TextEditorBlock[];
}
export interface TextEditoreReference {
  id: string;
  type: string; // PROJECT, PAGE, BLOCK
  pointer: any; // editor -> page -> block ???
  blocks?: TextEditorBlock[];
  title: string;
}
export interface TextEditorNote {
  id: string;
  title: string;
  blocks?: TextEditorBlock[];
}
export interface TextEditorIndex {
  id: string;
}