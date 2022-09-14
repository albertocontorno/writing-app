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

export function GET_LIST_UL_MENU(parent){
  return  [ 
    {
      label: 'To OL',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.OL, items: parent.blocks[parent.selectedBlockIndex!].items, new: true})
    },
    {
      label: 'Bold',
      command: () => parent.bold()
    },
    {
      label: 'Italic',
      command: () => parent.italic()
    },
    {
      label: 'Reference',
      command: () => parent.reference()
    }
  ];
}
export function GET_LIST_OL_MENU(parent){
  return  [ 
    {
      label: 'To UL',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.UL, items: parent.blocks[parent.selectedBlockIndex!].items, new: true})
    },
    {
      label: 'Bold',
      command: () => parent.bold()
    },
    {
      label: 'Italic',
      command: () => parent.italic()
    },
    {
      label: 'Reference',
      command: () => parent.reference()
    }
  ];
}

export function GET_P_MENU(parent){
  return [
    {
      label: 'To H',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.H, text: parent.blocks[parent.selectedBlockIndex!].text, new: true})
    },
    {
      label: 'To OL',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.OL, items: [parent.blocks[parent.selectedBlockIndex!].text], new: true})
    },
    {
      label: 'To UL',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.UL, items: [parent.blocks[parent.selectedBlockIndex!].text], new: true})
    },
    {
      label: 'Bold',
      command: () => parent.bold()
    },
    {
      label: 'Italic',
      command: () => parent.italic()
    },
    {
      label: 'Reference',
      command: () => parent.reference()
    }
  ];
} 
export function GET_H_MENU(parent){
  return [
    {
      label: 'To P',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.P, text: parent.blocks[parent.selectedBlockIndex!].text, new: true})
    },
    {
      label: 'To OL',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.OL, items: [parent.blocks[parent.selectedBlockIndex!].text], new: true})
    },
    {
      label: 'To UL',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.UL, items: [parent.blocks[parent.selectedBlockIndex!].text], new: true})
    },
    {
      label: 'Bold',
      command: () => parent.bold()
    },
    {
      label: 'Italic',
      command: () => parent.italic()
    },
    {
      label: 'Reference',
      command: () => parent.reference()
    }
  ];
} 
export function GET_HR_MENU(parent){
  return [
    {
      label: 'To P',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.H, text: parent.blocks[parent.selectedBlockIndex!].text, new: true})
    },
    {
      label: 'To H',
      command: () => parent.replaceBlock(parent.selectedBlockIndex!, {type: BLOCK_TYPES.H, text: parent.blocks[parent.selectedBlockIndex!].text, new: true})
    },
    {
      label: 'Italic',
      command: () => parent.italic()
    },
    {
      label: 'Reference',
      command: () => parent.reference()
    }
  ];
} 