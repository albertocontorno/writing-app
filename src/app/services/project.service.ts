import { ProjectFile } from 'src/app/models/project.model';
import { TextEditorService } from './../components/text-editor/text-editor.service';
import { TextEditorBlock } from './../components/text-editor/models/text-editor.model';
import { generateUUID } from 'src/app/utils/utils';
import { Project, TextEditoreReference } from './../models/project.model';
import { Injectable } from '@angular/core';
import { getDefaultBlock } from '../components/text-editor/text-editor.contants';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  createReference$: Subject<any> = new Subject();
  chooseReference$: Subject<any> = new Subject();
  openReference$: Subject<any> = new Subject();
  onChange$: Subject<void> = new Subject();

  currentProject: Project;
  currentEditor;

  editorsServices: {[key: string]: TextEditorService} = {};

  filesIndex: any/* {[key: string]: ProjectFile} */ = {};
  
  constructor() { }

  registerEditorService(key: string, service: TextEditorService){
    this.editorsServices[key] = service;
  }

  onChange(editorId: string){
    this.onChange$.next();
  }

  setCurrentEditor(editor){
    this.currentEditor = editor;
  }

  setCurrentProject(project: Project){
    this.currentProject = project;
    //create files index 
    this.createFileIndex(project.files, this.filesIndex);
    /* this.createFileIndex(project.files); */
    
    console.log(this.filesIndex);
  }

  /* createFileIndex(items: ProjectFile[]){
    items.forEach( item => {
      this.filesIndex[item.path] = item;
      if(item.children){
        this.createFileIndex(item.children);
      }
    });
  } */

  createFileIndex(items, index){
    items.forEach( item => {
      /* index[item.path] = item; */
      if(item.type === 'FOLDER'){
        const newSubIndex = {item: item};
        index[this.getItemPathName(item.name)] = newSubIndex;
        this.createFileIndex(item.children, newSubIndex);
      } else {
        index[this.getItemPathName(item.name)] = {item};
      }
    })
  }
  getItemPathName(name: string){
    return name.toLowerCase().replace(' ', '_');
  }

    

  deleteFile(item: ProjectFile){
    const parentPath = item.path.substring(0, item.path.lastIndexOf('/'));
    let parent = this.filesIndex;
    let parentOfParent  = this.filesIndex;
    parentPath.split('/').forEach( (p: string, i: number, arr: string[]) => {
      if(p){
        if(i < arr.length - 1){
          parentOfParent = parentOfParent[p];
        }
        parent = parent[p]
      }
      
    });
    console.log(parentOfParent)

    if(!parent){
      const index = this.currentProject.files?.findIndex( el => el === item ) || -1 ;
      if(index !== null && index > -1){
        this.currentProject.files.splice(index, 1);
      }
    } else {
      if(parent === this.filesIndex){
        if(parent[item.name.toLowerCase().replace(' ', '_')]){
          delete this.currentProject.files[item.name.toLowerCase().replace(' ', '_')];
        }
      } else {
        const index = parent.item.children?.findIndex( el => el === item );
        if(index !== null && index > -1){
          parent.item.children?.splice(index, 1);
        }
      }
      console.log(parent);
    }
    //update index
    delete parent[item.name.toLowerCase().replace(' ', '_')];
    console.log(this.filesIndex)
  }

  save(){
    const toSave:any = {...this.currentProject};
    toSave.files = this.currentProject.files.map( file => {
      const pageCopy: any = {...file};
      pageCopy.blocks = file.blocks?.map( b => {
        const copy = {...b};
        delete copy.component;
        delete copy.element;
        delete copy.new;
        delete copy.isNew;
        return copy;
      })
      return pageCopy;
    });
    toSave.references = this.currentProject.references.map( ref => {
      const refCopy: any = {...ref};
      refCopy.blocks = ref.blocks?.map( b => {
        const copy = {...b};
        delete copy.component;
        delete copy.element;
        delete copy.new;
        delete copy.isNew;
        return copy;
      })
      return refCopy; 
    });
    toSave.notes = this.currentProject.notes.map( note => {
      const noteCopy: any = {...note};
      noteCopy.blocks = note.blocks?.map( b => {
        const copy = {...b};
        delete copy.component;
        delete copy.element;
        delete copy.new;
        delete copy.isNew;
        return copy;
      })
      return noteCopy;
    });

    console.log(JSON.stringify(toSave));
    console.log(JSON.parse(JSON.stringify(toSave)));
    localStorage.setItem('project', JSON.stringify(toSave))
  }

  onEvent(target: HTMLElement){
    if(target.attributes['te-data'].value === 'te-REF'){
      this.openReference$.next(target);
    }
  }

  loadProject(){}

  saveProject(){}

  createReference(pointer?: string[]): TextEditoreReference{
    const newReference = {
      id: generateUUID(),
      type: 'PROJECT',
      pointer: pointer || [this.currentProject.id], //project id, page id, block id,
      blocks: [getDefaultBlock()],
      title: 'New Reference',
    };
    /* this.currentProject.references.push(newReference); */
    this.createReference$.next(newReference);
    return newReference;
  }

  addReference(newReference){ console.log('???')
    this.currentProject.references.push(newReference);
  }

  deleteReference(id: string){}

  useReference(pointer?, blocks?){}

  chooseReference(service){
    this.chooseReference$.next(service);
  }

  createNote(){

  }

  scrollTo(block: TextEditorBlock){
    this.currentEditor.scrollTo(block);
  }
}
