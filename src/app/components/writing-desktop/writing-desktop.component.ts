import { TextEditorService } from './../text-editor/text-editor.service';
import { Project, TextEditoreReference } from './../../models/project.model';
import { generateUUID } from 'src/app/utils/utils';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TextEditorPage } from 'src/app/models/project.model';
import { getDefaultBlock } from '../text-editor/text-editor.contants';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-writing-desktop',
  templateUrl: './writing-desktop.component.html',
  styleUrls: ['./writing-desktop.component.scss']
})
export class WritingDesktopComponent implements OnInit {

  @Input() project: Project = {
    pages: [{id:'', title: '', position: 0, blocks: []}],
    references: [],
    notes: [],
    id: generateUUID(),
  };

  pages: TextEditorPage[] = [];
  currentPageIndex: number = 0;
  
  tabmenu = [
    {label: 'Page 1', icon: 'pi pi-fw pi-home', command: (e) => this.selectPage(e.item.state.index), state:{ index: 0 } }
  ];

  isReferenceCreationVisible: boolean = false;
  newReference?: TextEditoreReference;
  isReferenceChooseVisible: boolean = false;
  currentEditorService?: TextEditorService;

  @ViewChild('tabs') tabs;
  @ViewChild('referenceOP') referenceOP;
  
  constructor(private projectService: ProjectService) {
    this.projectService.createReference$.subscribe( (newReference: TextEditoreReference) => this.openCreateReference(newReference) );
    this.projectService.chooseReference$.subscribe( (service) => this.openChooseReference(service) );
    this.projectService.openReference$.subscribe( (target) => this.openReference(target) );
  }

  ngOnInit(): void {
    this.projectService.currentProject = this.project;
  }

  selectPage(index: number){

  }

  addPage(){
    this.pages.push({
      id: generateUUID(),
      blocks: [getDefaultBlock()],
      position: 0,
      title: 'New Page',
    })
    this.tabmenu = [...this.tabmenu, {label: `Page ${this.tabmenu.length + 1}`, icon: 'pi pi-fw pi-home', command: (e) => this.selectPage(e.item.state.index), state:{index: this.tabmenu.length}}];
    setTimeout( () => this.tabs.updateButtonState(), 100);
  }

  createReference(){
    this.projectService.addReference(this.newReference);
    this.closeCreateReference();
  }

  openCreateReference(newReference){
    this.isReferenceCreationVisible = true;
    this.newReference = newReference;
  }
  closeCreateReference(){
    this.isReferenceCreationVisible = false;
    this.newReference = undefined;
  }

  selectReference(index: number){
    console.log(this.project.references[index]);
    console.log(this.currentEditorService!.sel);
    this.currentEditorService!.addReference(null, this.currentEditorService!.sel, this.project.references[index]);
    this.currentEditorService = undefined;
    this.isReferenceChooseVisible = false;
  }

  openChooseReference(service){
    this.currentEditorService = service;
    this.isReferenceChooseVisible = !!this.project.references.length;
  }
  currentReference;
  openReference(target: HTMLAnchorElement){
    const context = JSON.parse(target.attributes['te-data-context'].nodeValue) as {pointer: string[], id: string};
    // get REFERENCE
    this.currentReference = this.project.references.find( r => r.id = context.id );
    this.referenceOP.toggle({target});
  }

}
