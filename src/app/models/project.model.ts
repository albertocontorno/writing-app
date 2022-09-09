import { TextEditorBlock } from "../components/text-editor/models/text-editor.model";

export interface Project {
  id: string;
  pages: TextEditorPage[];
  notes: TextEditorNote[];
  references: TextEditoreReference[];
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
}
export interface TextEditorIndex {
  id: string;
}

