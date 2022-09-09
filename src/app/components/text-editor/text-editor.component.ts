import { TextEditorBlock } from './models/text-editor.model';
import { generateUUID } from 'src/app/utils/utils';
import { Component, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { BLOCK_TYPES, getDefaultBlock } from './text-editor.contants';
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
  @Input() showMenu: boolean = false;
  editorMenu: MenuItem[] = [
    {
      label: 'Save',
      command: () => {
        this.textEditorService.save()
      }
    },
    {
      label: 'Add Reference',
      command: () => {
        this.textEditorService.createReference()
      }
    }
  ]
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

  @ViewChild('holder') holder;
  @ViewChild('editorActions') editorActions;
  constructor(private textEditorService: TextEditorService) { }

  ngOnInit(): void {
    console.log(this.blocks)
  }

  onBlockInitialized(textEditorBlock: TextEditorBlockComponent<any>){
    setTimeout( () => {
      textEditorBlock.container.querySelectorAll('a[te-data="te-REF"]').forEach( el => 
        el.addEventListener( 'click', this.textEditorService.openReference.bind(this.textEditorService) )
      );
    });
  }

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
    this.textEditorService.addReference(this.blocks[this.selectedBlockIndex as number], this.selection, null);
  }

  ngAfterViewInit(){
    this.holder.nativeElement.addEventListener('keyup', (e) => {
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
        /* this.textEditorService.addReference(this.blocks[this.selectedBlockIndex], this.selection)
        this.textEditorService.createReference(this.blocks[this.selectedBlockIndex], this.selection) */
        /* this.textEditorService.addReference(this.blocks[this.selectedBlockIndex], this.selection) */
        // save selection
        // choose reference to use
        // call this.textEditorService.addReference(this.blocks[this.selectedBlockIndex], this.selection)
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
    if(toElement.firstElementChild?.firstElementChild?.classList.contains('text-editor-actions')
      || toElement.firstElementChild?.classList.contains('text-editor-actions')){
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
      }
    }
  }

  moveUp(){
    const prevIndex = this.selectedBlockIndex! - 1;
    if(prevIndex >= 0){
      const temp = this.blocks[prevIndex];
      this.blocks[prevIndex] = this.blocks[this.selectedBlockIndex!];
      this.blocks[this.selectedBlockIndex!] = temp;
    }
  }

  moveDown(){
    const nextIndex = this.selectedBlockIndex! + 1;
    if(nextIndex < this.blocks.length){
      const temp = this.blocks[nextIndex];
      this.blocks[nextIndex] = this.blocks[this.selectedBlockIndex!];
      this.blocks[this.selectedBlockIndex!] = temp;
    }
  }

  print(){
    console.log(this.blocks)
  }
  
  LIST_UL_MENU = [ 
    {
      label: 'To OL',
      command: () => this.textEditorService.replaceBlock(this.selectedBlockIndex!, {type: BLOCK_TYPES.OL, items: this.blocks[this.selectedBlockIndex!].items, new: true})
    },
    {
      label: 'Bold',
      command: () => this.bold()
    },
    {
      label: 'Italic',
      command: () => this.italic()
    }
  ];
  LIST_OL_MENU = [
    {
      label: 'To OL',
      command: () => this.textEditorService.replaceBlock(this.selectedBlockIndex!, {type: BLOCK_TYPES.UL, items: this.blocks[this.selectedBlockIndex!].items, new: true})
    },
    {
      label: 'Bold',
      command: () => this.bold()
    },
    {
      label: 'Italic',
      command: () => this.italic()
    }
  ];
  P_MENU = [
    {
      label: 'To H',
      command: () => this.textEditorService.replaceBlock(this.selectedBlockIndex!, {type: BLOCK_TYPES.H, text: this.blocks[this.selectedBlockIndex!].text, new: true})
    },
    {
      label: 'To OL',
      command: () => this.textEditorService.replaceBlock(this.selectedBlockIndex!, {type: BLOCK_TYPES.OL, items: [this.blocks[this.selectedBlockIndex!].text], new: true})
    },
    {
      label: 'To UL',
      command: () => this.textEditorService.replaceBlock(this.selectedBlockIndex!, {type: BLOCK_TYPES.UL, items: [this.blocks[this.selectedBlockIndex!].text], new: true})
    },
    {
      label: 'Bold',
      command: () => this.bold()
    },
    {
      label: 'Italic',
      command: () => this.italic()
    }
  ];
  H_MENU = [
    {
      label: 'To p',
      command: () => this.textEditorService.replaceBlock(this.selectedBlockIndex!, {type: BLOCK_TYPES.P, text: this.blocks[this.selectedBlockIndex!].text, new: true})
    },
    {
      label: 'To OL',
      command: () => this.textEditorService.replaceBlock(this.selectedBlockIndex!, {type: BLOCK_TYPES.OL, items: [this.blocks[this.selectedBlockIndex!].text], new: true})
    },
    {
      label: 'To UL',
      command: () => this.textEditorService.replaceBlock(this.selectedBlockIndex!, {type: BLOCK_TYPES.UL, items: [this.blocks[this.selectedBlockIndex!].text], new: true})
    },
    {
      label: 'Bold',
      command: () => this.bold()
    },
    {
      label: 'Italic',
      command: () => this.italic()
    }
  ];
}
