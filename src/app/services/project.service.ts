import { generateUUID } from 'src/app/utils/utils';
import { Project, TextEditoreReference } from './../models/project.model';
import { Injectable } from '@angular/core';
import { getDefaultBlock } from '../components/text-editor/text-editor.contants';
import { filter, Subject } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  createReference$: Subject<any> = new Subject();
  chooseReference$: Subject<any> = new Subject();
  openReference$: Subject<any> = new Subject();

  currentProject: Project;
  currentEditor;
  constructor() { }

  setCurrentEditor(editor){
    this.currentEditor = editor;
  }

  save(){
    const toSave:any = {...this.currentProject};
    toSave.pages = this.currentProject.pages.map( page => {
      const pageCopy: any = {...page};
      pageCopy.blocks = page.blocks.map( b => {
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

    console.log(JSON.stringify(toSave));
    console.log(JSON.parse(JSON.stringify(toSave)));
    localStorage.setItem('project', JSON.stringify(toSave))
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

  addReference(newReference){
    this.currentProject.references.push(newReference);
  }

  deleteReference(id: string){}

  useReference(pointer?, blocks?){

  }

  chooseReference(service){
    this.chooseReference$.next(service);
  }
}
