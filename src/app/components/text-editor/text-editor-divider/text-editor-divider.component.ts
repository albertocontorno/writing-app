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
  dividerText: HTMLDivElement;
  createBlockElement(): HTMLElement {
    this.contentEditable = false;
    const dividerContainerElement = this.render.createElement('div');
    this.render.addClass(dividerContainerElement, 'text-editor-divider-container');
    let hrElement =  this.render.createElement('hr');
    this.render.addClass(hrElement, 'text-editor-divider');
    this.render.listen(hrElement, 'click', () => this.dividerText.focus())
    this.render.appendChild(dividerContainerElement, hrElement);
    this.dividerText = this.render.createElement('div');
    this.render.setAttribute(this.dividerText, 'contentEditable', 'true');
    this.render.setProperty(this.dividerText, 'innerHTML', this.block.text);
    if(this.dividerText.textContent?.length){
      this.render.addClass(this.dividerText, 'mx-1');
    } else {
      this.render.removeClass(this.dividerText, 'mx-1');
    }
    this.render.appendChild(dividerContainerElement, this.dividerText);
    hrElement =  this.render.createElement('hr');
    this.render.addClass(hrElement, 'text-editor-divider');
    this.render.listen(hrElement, 'click', () => this.dividerText.focus());
    this.render.appendChild(dividerContainerElement, hrElement);

    this.subscriptions.push( fromEvent(this.dividerText, KEYDOWN)
      .subscribe( (e: any) => {
        if(e.key === ENTER && !e.shiftKey){
          this.createNewBlock.emit();
          e.preventDefault();
          e.stopPropagation();
        }
      })
    );
    
    return dividerContainerElement;
  }

  upadteModel() {
    this.block.text = this.dividerText.innerHTML;
    if(this.dividerText.textContent?.length){
      this.render.addClass(this.dividerText, 'mx-1');
    } else {
      this.render.removeClass(this.dividerText, 'mx-1');
    }
  }

}
