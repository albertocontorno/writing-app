import { TextEditorBlockComponent } from './../text-editor-block/text-editor-block.component';
import { Component } from '@angular/core';
import { ENTER, KEYDOWN } from 'src/app/utils/keyCodes';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-text-editor-paragraph',
  templateUrl: './text-editor-paragraph.component.html',
  styleUrls: ['./text-editor-paragraph.component.scss']
})
export class TextEditorParagraphComponent extends TextEditorBlockComponent<HTMLParagraphElement>{

  createBlockElement(): HTMLParagraphElement {
    const paragraphElement: HTMLParagraphElement = this.render.createElement('p');
    this.render.setProperty(paragraphElement, 'innerHTML', this.block.text);

    paragraphElement.addEventListener(KEYDOWN, (e) => {
      if(e.key === ENTER && !e.shiftKey){
        this.createNewBlock.emit();
        e.preventDefault();
        e.stopPropagation();
      } else if( e.ctrlKey && !(e.key === 'v' || e.key === 'c') ){
        e.preventDefault();
        e.stopPropagation();
      }
    });

    this.subscriptions.push( fromEvent(paragraphElement, KEYDOWN)
      .pipe( debounceTime(300) )
      .subscribe( _ => this.block.text = this.container.innerHTML ) );

    return paragraphElement;
  }

  

/*   ngAfterViewInit(){
    const paragraphElement: HTMLParagraphElement = this.render.createElement('p')
    this.render.setAttribute(paragraphElement, 'contentEditable', 'true');
    this.render.appendChild(paragraphElement,  this.render.createText(this.block.text));
   
    this.container = paragraphElement;

    this.block.component = this;
    this.block.element = paragraphElement;

    this.container.addEventListener(KEYDOWN, (e) => {
      if(e.key === ENTER && !e.shiftKey){
        this.createNewBlock.emit();
        e.preventDefault();
        e.stopPropagation();
      } else if( e.ctrlKey && !(e.key === 'v' || e.key === 'c') ){
        e.preventDefault();
        e.stopPropagation();
      }
    });

    if(this.isNew){
      this.newBlockCreated.emit(this);
    }

    this.render.appendChild(this.hostElement.element.nativeElement, paragraphElement);
  } */

}
