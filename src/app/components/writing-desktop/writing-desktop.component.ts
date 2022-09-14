import { HierarchyMenuService } from './../hierarchy-menu/hierarchy-menu.service';
import { TextEditorBlock } from './../text-editor/models/text-editor.model';
import { TextEditorService } from './../text-editor/text-editor.service';
import { Project, TextEditoreReference, TextEditorNote, ProjectFile } from './../../models/project.model';
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
    name: 'New Project',
    files: [{id:'', name: 'Page 1', blocks: [], type: 'FILE', path: '/page_1', }],
    references: [],
    notes: [],
    id: generateUUID(),
  };

  currentPageIndex: number = 0;
  
  tabmenu = [
    {label: 'Page 1', icon: 'pi pi-fw pi-home', command: (e) => this.selectPage(e.item.state.index), state:{ index: 0 } }
  ];

  editorMenu = [
    {
      label: 'Save',
      command: () => {
        this.projectService.save()
      }
    },
    {
      label: 'Add Reference',
      command: () => {
        this.projectService.createReference();
      }
    },
    {
      label: 'Add Note',
      command: () => {
        this.openCreateNote();
      }
    }
  ]

  isReferenceCreationVisible: boolean = false;
  newReference?: TextEditoreReference;
  isReferenceChooseVisible: boolean = false;
  currentEditorService?: TextEditorService;
  currentReference;

  isNoteCreationVisible: boolean = false;
  newNote?: TextEditorNote;

  hierarchyMenuService: HierarchyMenuService;

  @ViewChild('tabs') tabs;
  @ViewChild('referenceOP') referenceOP;
  
  constructor(private projectService: ProjectService) {
    this.projectService.createReference$.subscribe( (newReference: TextEditoreReference) => this.openCreateReference(newReference) );
    this.projectService.chooseReference$.subscribe( (service) => this.openChooseReference(service) );
    this.projectService.openReference$.subscribe( (target) => this.openReference(target) );
  }

  ngOnInit(): void {
    this.projectService.setCurrentProject(this.project);
    this.tabmenu = [];
    /* this.project.pages.forEach( (p, i) => {
      this.tabmenu.push({label: p.title, icon: 'pi pi-fw pi-home', command: (e) => this.selectPage(e.item.state.index), state:{ index: i } });
    }) */
  }

  selectPage(index: number){
    this.currentPageIndex = index;
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
    this.currentEditorService!.addReference(null, this.currentEditorService!.sel, this.project.references[index]);
    this.currentEditorService = undefined;
    this.isReferenceChooseVisible = false;
  }

  openChooseReference(service){
    this.currentEditorService = service;
    this.isReferenceChooseVisible = !!this.project.references.length;
  }
  
  openReference(target: HTMLAnchorElement){
    const context = JSON.parse(target.attributes['te-data-context'].nodeValue) as {pointer: string[], id: string};
    // get REFERENCE
    this.currentReference = this.project.references.find( r => r.id = context.id );
    this.referenceOP.toggle({target});
  }

  openCreateNote(){
    this.isNoteCreationVisible = true;
    this.newNote = {id: generateUUID(), title: 'New Note Title', blocks: [getDefaultBlock()]};
  }
  createNote(){
    this.project.notes.push(this.newNote!);
    this.closeCreateNote();
  }
  closeCreateNote(){
    this.newNote = undefined;
    this.isNoteCreationVisible = false;
  }

  onNodeSelected(node){
    this.projectService.scrollTo(node.data);
  }

  updateReferenceTitle(e, ref){
    ref.title = ref.title + e.key;
    e.preventDefault();
    e.stopPropagation();
  }

  onHierarchyMenuInit(hierarchyMenuService: HierarchyMenuService){
    this.hierarchyMenuService = hierarchyMenuService;
  }

  onCreateFile(selectedItem: ProjectFile){
    let newItem;
    if(!selectedItem){
      newItem = {
        name: 'New File',
        id: generateUUID(),
        type: 'FILE',
        path:  '/new_file',
        blocks: [getDefaultBlock()],
      }
      this.project.files.push(newItem);
    } else if(selectedItem.type === 'FOLDER'){
      newItem = {
        name: 'New File',
        id: generateUUID(),
        type: 'FILE',
        path:  `${selectedItem.path}/new_file`,
        blocks: [getDefaultBlock()],
      };
      selectedItem.children?.push(newItem);
      selectedItem.collapsed = false;
    } else if(selectedItem.type === 'FILE'){
      
    } 
    setTimeout( () => this.hierarchyMenuService.edit(newItem) );
  }
  
  onCreateFolder(selectedItem: ProjectFile){
    let newItem;
    if(!selectedItem){
      newItem = {
        name: 'New Folder',
        id: generateUUID(),
        type: 'FOLDER',
        path:  '/new_folder',
        collapsed: true,
        children: [],
      }
      this.project.files.push(newItem);
    } else if(selectedItem.type === 'FOLDER'){
      newItem = {
        name: 'New Folder',
        id: generateUUID(),
        type: 'FOLDER',
        path:  `${selectedItem.path}/new_folder`,
        collapsed: true,
        children: [],
      }
      selectedItem.children?.push(newItem);
      selectedItem.collapsed = false;
    } else if(selectedItem.type === 'FILE'){

    }
    setTimeout( () => this.hierarchyMenuService.edit(newItem) );
    
  }

  openItem(item: ProjectFile){
    console.log('open', item)
  }

  onDeleteItem(item: ProjectFile){
    console.log('asd', item);
    //ask confirm?
    //delete item
    this.projectService.deleteFile(item);
    //close all opened children in text editor
  }

  /**
   * {
   *  characters: {
   *    naga: {FILE}
   *    enemies: {
   *      jolly: {jolly}
   *    }
   *  }
   * }
   */

}
