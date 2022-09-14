import { Component } from '@angular/core';
import { BACKSPACE, ENTER, KEYDOWN } from 'src/app/utils/keyCodes';
import { getCurrentItem } from 'src/app/utils/utils';
import { TextEditorBlockComponent } from '../text-editor-block/text-editor-block.component';
import { BLOCK_TYPES } from '../text-editor.contants';

@Component({
  selector: 'app-text-editor-list',
  templateUrl: './text-editor-list.component.html',
  styleUrls: ['./text-editor-list.component.scss']
})
export class TextEditorListComponent extends TextEditorBlockComponent<HTMLParagraphElement> {
  createBlockElement(): HTMLParagraphElement {
    const listElement = this.block.type === BLOCK_TYPES.OL
      ? this.render.createElement('ol')
      : this.render.createElement('ul');
    this.block.items.forEach( el => {
      const liElement = this.render.createElement('li');
      this.render.setProperty(liElement, 'innerHTML', el);
      this.render.appendChild(listElement, liElement);
    });


    listElement.addEventListener( KEYDOWN, (e) => {
      if(e.key === ENTER){
        const currentItem = getCurrentItem();
        if(!currentItem?.textContent?.trim().length && (!currentItem?.nextSibling || currentItem.nextSibling!.nodeName !== 'LI')){
          this.createNewBlock.emit();
          listElement.lastChild?.remove();
          e.preventDefault();
          e.stopPropagation();
        }
      } else if(e.key === BACKSPACE){
        if(listElement.childNodes.length === 1 && !listElement.firstChild?.textContent?.trim().length){
          console.log('DELETE BLOCK');
          e.preventDefault();
          e.stopPropagation();
        }
      } else if( e.ctrlKey && !(e.key === 'v' || e.key === 'c')){
        e.preventDefault();
        e.stopPropagation();
      }
    });

    return listElement;
  }

  upadteModel() {
    const lis = this.container.querySelectorAll('li')
    this.block.items.splice(lis.length-1, this.block.items.length - lis.length );
    lis.forEach( (li,i) => this.block.items[i] = li.innerHTML );
  }

  trackByFn(i: number, item: {id: string, text: string}){
    return item.id;
  }

}
