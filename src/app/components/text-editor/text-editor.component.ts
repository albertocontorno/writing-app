import { TextEditorBlock } from './models/text-editor.model';
import { generateUUID } from 'src/app/utils/utils';
import { Component, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { BLOCK_TYPES, getDefaultBlock, GET_HR_MENU, GET_H_MENU, GET_LIST_OL_MENU, GET_LIST_UL_MENU, GET_P_MENU } from './text-editor.contants';
import { TextEditorService } from './text-editor.service';
import { BLOCKS } from 'src/app/utils/mockedData';
import { TextEditorBlockComponent } from './text-editor-block/text-editor-block.component';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [TextEditorService]
})
export class TextEditorComponent implements OnInit {
  BLOCK_TYPES = BLOCK_TYPES;
  currentPageIndex: number = 0;
  @Input() blocks: TextEditorBlock[] = [getDefaultBlock()];
  @Input() id: string = 'te-' + generateUUID();
  @Input() showMenu: boolean = false;
  @Input() editorMenu: MenuItem[] = [];
  items: MenuItem[] = [
    {
        label: 'Edit',
        items: [
          {
            label: 'To OL',
          }
        ]
    },
    {
        label: 'Edit',
        items: [
          {
            label: 'To OL',
          }
        ]
    },
    {
        label: 'Edit',
        items: [
          {
            label: 'To OL',
          }
        ]
    },
    {
        label: 'Edit',
        items: [
          {
            label: 'To OL',
          }
        ]
    },
  ];
  isActionMenuVisibile: boolean = false;
  actionsMenuTop: string = '0px';
  selectedBlockIndex?: number = undefined;
  selection?: Range | null;

  LIST_UL_MENU = GET_LIST_UL_MENU(this);
  LIST_OL_MENU = GET_LIST_OL_MENU(this);
  P_MENU = GET_P_MENU(this);
  H_MENU = GET_H_MENU(this);
  HR_MENU = GET_HR_MENU(this);

  @ViewChild('holder') holderEl;
  @ViewChild('editorActions') editorActions;
  constructor(public textEditorService: TextEditorService) {}

  ngOnInit(): void {
    this.textEditorService.editorId = this.id;
    this.textEditorService.register();
  }

  onBlockInitialized(textEditorBlock: TextEditorBlockComponent<any>){ }

  setCurrentEditor(){
    this.textEditorService.setCurrentEditor(this);
  }

  selectionStart(e){
    this.selection = null;
  }
  selectionEnd(e){
    const sel = window.getSelection()?.rangeCount ? window.getSelection()?.getRangeAt(0) : null;
    if(sel && (sel.startContainer !== sel.endContainer || sel!.startOffset !== sel!.endOffset)){
      this.selection = sel;
    }
  }

  bold(){
    this.textEditorService.makeBold(this.blocks[this.selectedBlockIndex as number], this.selection)
  }

  italic(){
    this.textEditorService.makeItalic(this.blocks[this.selectedBlockIndex as number], this.selection)
  }

  highlight(){
    this.textEditorService.highlight(this.blocks[this.selectedBlockIndex as number], this.selection)
  }

  reference(){
    this.textEditorService.useReference(null, this.selection);
  }

  replaceBlock(index, newBlock){
    this.blocks.splice(index, 1, newBlock);
    this.textEditorService.onChange();
    /* this.textEditorService.replaceBlock(this.selectedBlockIndex!, newBlock); */
  }

  deleteBlock(){
    this.blocks.splice(this.selectedBlockIndex!, 1);
    this.textEditorService.onChange();
  }

  ngAfterViewInit(){
    this.holderEl.nativeElement.addEventListener('keyup', (e) => {
      if(e.key === 'l' && e.ctrlKey){
        this.print();
      }
      if(e.key === 'b' && e.ctrlKey && this.selection && this.selectedBlockIndex !== undefined && this.selectedBlockIndex > -1){
        this.textEditorService.makeBold(this.blocks[this.selectedBlockIndex], this.selection)
        e.preventDefault();
        e.stopPropagation();
      }
      if(e.key === 'i' && e.ctrlKey && this.selection && this.selectedBlockIndex !== undefined && this.selectedBlockIndex > -1){
        this.textEditorService.makeItalic(this.blocks[this.selectedBlockIndex], this.selection)
        e.preventDefault();
        e.stopPropagation();
      }
      if(e.key === 'h' && e.ctrlKey && this.selection && this.selectedBlockIndex !== undefined && this.selectedBlockIndex > -1){
        this.textEditorService.highlight(this.blocks[this.selectedBlockIndex], this.selection)
        e.preventDefault();
        e.stopPropagation();
      }
      if(e.key === 'l' && e.ctrlKey && this.selection && this.selectedBlockIndex !== undefined && this.selectedBlockIndex > -1){
        this.textEditorService.useReference(null, this.selection)
        e.preventDefault();
        e.stopPropagation();
      }
      if(e.key === 's' && e.ctrlKey){
        console.log('SAVE');
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  addH(){
    this.blocks.splice(
      this.selectedBlockIndex! + 1,
      0,
      {
        id: generateUUID(),
        type: BLOCK_TYPES.H,
        text: '',
        new: true,
      }
    );
    this.editorActions.hide();
    this.textEditorService.onChange();
  }

  addP(){
    this.blocks.splice(
      this.selectedBlockIndex! + 1,
      0,
      {
        id: generateUUID(),
        type: BLOCK_TYPES.P,
        text: '',
        new: true,
      }
    );
    this.editorActions.hide();
  }

  addUL(){
    this.blocks.splice(
      this.selectedBlockIndex! + 1,
      0,
      {
        id: generateUUID(),
        type: BLOCK_TYPES.UL,
        new: true,
        items: [''],
      }
    );
    this.editorActions.hide();
  }

  addOL(){
    this.blocks.splice(
      this.selectedBlockIndex! + 1,
      0,
      {
        id: generateUUID(),
        type: BLOCK_TYPES.OL,
        new: true,
        items: [''],
      }
    );
    this.editorActions.hide();
  }

  addHR(){
    this.blocks.splice(
      this.selectedBlockIndex! + 1,
      0,
      {
        id: generateUUID(),
        type: BLOCK_TYPES.HR,
        new: true,
        text: '',
      }
    );
    this.editorActions.hide();
    this.textEditorService.onChange();
  }
  
  selectBlock(index: number, component: any){
    this.isActionMenuVisibile = true;
    if(this.selectedBlockIndex != index){
      setTimeout( () => this.editorActions.hide(), 10 );
    }
    this.actionsMenuTop = (component.container.offsetTop /* + (component.container.scrollHeight/2) - 9.5 */ ) + 'px';
    this.selectedBlockIndex = index;
  }

  hideActionsMenu(e){
    const toElement: HTMLElement = e.toElement;
    if(toElement?.firstElementChild?.firstElementChild?.classList.contains('text-editor-actions')
      || toElement?.firstElementChild?.classList.contains('text-editor-actions')){
      return;
    }
    setTimeout( () => this.editorActions.hide(), 10 );
    this.isActionMenuVisibile = false;
  }

  onCreateNewBlock(index: number){
    console.log('onCreateNewBlock');
    this.blocks.splice(index + 1, 0, {
      id: generateUUID(),
      type: BLOCK_TYPES.P,
      text: '',
      new: true
    });
  }

  onNewBlockCreated(component: any){
    component.block.isNew = false;
    component.isNew = false;
    setTimeout( () => {
      component.container.focus();
      this.actionsMenuTop = (component.container.offsetTop - 11) + 'px';
    })
  }

  onContextMenuShow(e, c){
    console.log(e, c, this.blocks[this.selectedBlockIndex!]);
    setTimeout( () => {
      const style = c.el.nativeElement.firstElementChild?.style;
      if(style){
        style.top = (Number(style.top.replace('px', '')) - 100) + 'px';
      }
    });
    if(this.blocks[this.selectedBlockIndex!]){
      if(this.blocks[this.selectedBlockIndex!].type === BLOCK_TYPES.UL){
        this.items = this.LIST_UL_MENU;
      } else if(this.blocks[this.selectedBlockIndex!].type === BLOCK_TYPES.OL){
        this.items = this.LIST_OL_MENU;
      } else if(this.blocks[this.selectedBlockIndex!].type === BLOCK_TYPES.P) {
        this.items = this.P_MENU;
      } else if(this.blocks[this.selectedBlockIndex!].type === BLOCK_TYPES.H) {
        this.items = this.H_MENU;
      } else if(this.blocks[this.selectedBlockIndex!].type === BLOCK_TYPES.HR) {
        this.items = this.HR_MENU;
      }
    }
  }

  moveUp(){
    const prevIndex = this.selectedBlockIndex! - 1;
    if(prevIndex >= 0){
      const temp = this.blocks[prevIndex];
      this.blocks[prevIndex] = this.blocks[this.selectedBlockIndex!];
      this.blocks[this.selectedBlockIndex!] = temp;
      this.textEditorService.onChange();
    }
  }

  moveDown(){
    const nextIndex = this.selectedBlockIndex! + 1;
    if(nextIndex < this.blocks.length){
      const temp = this.blocks[nextIndex];
      this.blocks[nextIndex] = this.blocks[this.selectedBlockIndex!];
      this.blocks[this.selectedBlockIndex!] = temp;
      this.textEditorService.onChange();
    }
  }

  scrollTo(block: TextEditorBlock){
    block.element!.scrollIntoView({behavior: 'smooth'});
  }

  print(){
    console.log(this.blocks)
  }
  
}
