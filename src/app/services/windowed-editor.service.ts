import { Injectable } from '@angular/core';
import { clamp } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class WindowedEditorService {

  prevSelected?: HTMLElement | null;
  selected?: HTMLElement | null;
  offsetY!: number;

  private _initialPosition: { x: number, y: number };

  constructor() { }

  moveWindow(e: MouseEvent, windowdEditor: HTMLDivElement){
    this.selectWindow(windowdEditor);

    this._initialPosition = { 
      x: e.clientX - 6 - Number(this.selected!.style.left.replace('px', '')), 
      y: e.clientY - this.offsetY - Number(this.selected!.style.top.replace('px', ''))
    };
    this._initialPosition.y = this._initialPosition.y < 0 ? 0 : this._initialPosition.y;
    this._initialPosition.x = this._initialPosition.x < 0 ? 0 : this._initialPosition.x;

    window.onmouseup = () => {
      this.prevSelected = this.selected;
      this.selected = null;
      window.onmouseup = null;
      window.onmousemove = null;
    }

    window.onmousemove = (e) => {
      let top = e.clientY - this._initialPosition.y - this.offsetY;
      let left = e.clientX - this._initialPosition.x - 6;
      top = clamp(top, 8, window.innerHeight - this.offsetY - this.selected!.clientHeight);
      left = clamp(left, 6, window.innerWidth - this.selected!.clientWidth - 8);
      this.selected!.style.top = top + 'px';
      this.selected!.style.left = left + 'px';
    }
  }

  selectWindow(windowdEditor: HTMLDivElement){
    this.selected = windowdEditor;
    this.prevSelected ? this.prevSelected.style.zIndex = '1' : null;

    this.selected!.style.zIndex = '2';    
  }
}
