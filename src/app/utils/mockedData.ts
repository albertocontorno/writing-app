import { TextEditorBlock } from "../components/text-editor/models/text-editor.model";
import { BLOCK_TYPES } from "../components/text-editor/text-editor.contants";

export function BLOCKS(): TextEditorBlock[] {
  return [
    {
      id: '5s4ad5asd',
      type: BLOCK_TYPES.P,
      text: 'Text Text Text',
      new: false,
      position: 0,
    },
    {
      id: 'g8gtf2rt56kl5d5hg',
      type: BLOCK_TYPES.UL,
      items: [
        'asadha4558dfhdsd',
        'asdkulsrtl5fhdsd',
        'asaskghkfu5sdas214'
      ],
      new: false,
      position: 1
    }
  ]
};