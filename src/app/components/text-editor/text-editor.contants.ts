import { TextEditorBlock } from './models/text-editor.model';
import { generateUUID } from "src/app/utils/utils"

export const BLOCK_TYPES = {
  P: 'P',
  OL: 'OL',
  UL: 'UL',
  H: 'H',
  HR: 'HR'
}

export function getDefaultBlock(): TextEditorBlock{
  return  {
    id: generateUUID(),
    type: BLOCK_TYPES.P,
    text: '',
    new: true,
    position: 0
  }
}