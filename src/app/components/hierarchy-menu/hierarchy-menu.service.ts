import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProjectFile } from 'src/app/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class HierarchyMenuService {

  itemSelected$: Subject<ProjectFile> = new Subject();
  toggleItem$: Subject<{item: ProjectFile | null, state: boolean}> = new Subject();
  editItem$: Subject<ProjectFile> = new Subject();
  openItem$: Subject<ProjectFile> = new Subject();
  deleteItem$: Subject<ProjectFile> = new Subject();

  constructor() { }

  selectItem(item: ProjectFile){
    console.log(item);
    this.itemSelected$.next(item);
  }

  openItem(item: ProjectFile){
    this.openItem$.next(item)
  }

  deleteItem(item: ProjectFile){
    console.log('delete', item);
    this.deleteItem$.next(item);
  }

  collapse(item: ProjectFile){
    this.toggleItem$.next({item: item, state: true});
  }
  collapseAll(){
    this.toggleItem$.next({item: null, state: true});
  }
  expand(item: ProjectFile){
    this.toggleItem$.next({item, state: false});
  }
  expandAll(){
    this.toggleItem$.next({item: null, state: false});
  }

  move(item, parent){}
  edit(item: ProjectFile){
    this.editItem$.next(item);
  }
}
