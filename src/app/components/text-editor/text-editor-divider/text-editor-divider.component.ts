import { ENTER } from './../../../utils/keyCodes';
import { Component, OnInit } from '@angular/core';
import { fromEvent, debounceTime } from 'rxjs';
import { KEYDOWN } from 'src/app/utils/keyCodes';
import { TextEditorBlockComponent } from '../text-editor-block/text-editor-block.component';

@Component({
  selector: 'app-text-editor-divider',
  templateUrl: './text-editor-divider.component.html',
  styleUrls: ['./text-editor-divider.component.scss']
})
export class TextEditorDividerComponent extends TextEditorBlockComponent<HTMLDivElement> {

  createBlockElement(): HTMLElement {
    this.contentEditable = false;
    const dividerContainerElement = this.render.createElement('div');
    this.render.addClass(dividerContainerElement, 'text-editor-divider-container');
    let hrElement =  this.render.createElement('hr');
    this.render.addClass(hrElement, 'text-editor-divider');
    this.render.listen(hrElement, 'click', () => dividerText.focus())
    this.render.appendChild(dividerContainerElement, hrElement);
    const dividerText: HTMLDivElement = this.render.createElement('div');
    this.render.setAttribute(dividerText, 'contentEditable', 'true');
    this.render.appendChild(dividerContainerElement, dividerText);
    hrElement =  this.render.createElement('hr');
    this.render.addClass(hrElement, 'text-editor-divider');
    this.render.listen(hrElement, 'click', () => dividerText.focus());
    this.render.appendChild(dividerContainerElement, hrElement);

    this.subscriptions.push( fromEvent(dividerText, KEYDOWN)
      .subscribe( (e: any) => {
        if(e.key === ENTER && !e.shiftKey){
          this.createNewBlock.emit();
          e.preventDefault();
          e.stopPropagation();
        }
      })
    );
    
    this.subscriptions.push( fromEvent(dividerText, KEYDOWN)
      .pipe( debounceTime(300) )
      .subscribe( (e: any) => {
        this.block.text = dividerText.innerHTML;
        if(dividerText.textContent?.length){
          this.render.addClass(dividerText, 'mx-1');
        } else {
          this.render.removeClass(dividerText, 'mx-1');
        }
      }) );

    return dividerContainerElement;
  }

}
