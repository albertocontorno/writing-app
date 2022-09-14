export interface TextEditor {
  id: string;
  blocks: TextEditorBlock[];
}

export interface TextEditorBlock {
  id: string;
  type: string;
  text?: string;
  items?: any[];
  position?: number;
  new?: boolean; //internal
  isNew?: boolean; //internal
  component?: boolean; //internal
  element?: HTMLElement; //internal
}