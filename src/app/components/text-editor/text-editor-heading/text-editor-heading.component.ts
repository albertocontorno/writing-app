import { Component } from '@angular/core';
import { fromEvent, debounceTime } from 'rxjs';
import { KEYDOWN, ENTER } from 'src/app/utils/keyCodes';
import { TextEditorBlockComponent } from '../text-editor-block/text-editor-block.component';

@Component({
  selector: 'app-text-editor-heading',
  templateUrl: './text-editor-heading.component.html',
  styleUrls: ['./text-editor-heading.component.scss']
})
export class TextEditorHeadingComponent extends TextEditorBlockComponent<HTMLHeadingElement>  {

  createBlockElement(): HTMLHeadingElement {
    const headingElement = this.render.createElement('h1');
    this.render.appendChild(headingElement,  this.render.createText(this.block.text));
    headingElement.addEventListener(KEYDOWN, (e) => {
      if(e.key === ENTER && !e.shiftKey){
        this.createNewBlock.emit();
        e.preventDefault();
        e.stopPropagation();
      } else if( e.ctrlKey && !(e.key === 'v' || e.key === 'c') ){
        e.preventDefault();
        e.stopPropagation();
      }
    });

    this.subscriptions.push( fromEvent(headingElement, KEYDOWN)
      .pipe( debounceTime(300) )
      .subscribe( _ => this.block.text = this.container.innerHTML ) );

    return headingElement;
  }

}
