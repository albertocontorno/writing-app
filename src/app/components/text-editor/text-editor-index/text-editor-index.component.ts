import { ProjectService } from 'src/app/services/project.service';
import { BLOCK_TYPES } from './../text-editor.contants';
import { TextEditorBlock } from './../models/text-editor.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { TextEditoreReference } from 'src/app/models/project.model';

@Component({
  selector: 'app-text-editor-index',
  templateUrl: './text-editor-index.component.html',
  styleUrls: ['./text-editor-index.component.scss'],
  providers: [ConfirmationService]
})
export class TextEditorIndexComponent {
  _blocks: TextEditorBlock[] = [];
  @Input() set blocks(v: TextEditorBlock[]){
    this._blocks = v;
    this.compute();
  }
  @Input() references: TextEditoreReference[] = [];
  @Output() nodeSelected: EventEmitter<TextEditorBlock> = new EventEmitter();

  index: TreeNode[]= [];
  selected: TreeNode;
  referenceSelected?: TextEditoreReference;

  constructor(private projectService: ProjectService, private confirmationService: ConfirmationService) {
    this.projectService.onChange$.subscribe( _ => {
      this.compute();
    });
  }

  compute(){
    this.index = [];
    this._blocks?.forEach( block => {
      if(block.type === BLOCK_TYPES.H || block.type === BLOCK_TYPES.HR && block.text){
        this.index.push({
          label: block.text?.replace(/<([^<]*)>|<(\/[^<]*)>/g, ''),
          data: block
        });
      }
    });
  }

  onSelection(e){
    this.nodeSelected.emit(e.node);
  }

  openReference(index: number){
    console.log(this.references[index]);
    this.referenceSelected = this.references[index];
  }

  deleteReference(index: number){
    this.references.splice(index, 1);
  }

  confirm(event: Event, index: number) {
    this.confirmationService.confirm({
        target: event!.target!,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteReference(index);
        }
    });
}

}
