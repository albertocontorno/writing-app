import { MenuItem, PrimeIcons } from 'primeng/api';
import { ProjectFile } from './../../models/project.model';
import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { HierarchyMenuService } from './hierarchy-menu.service';

@Component({
  selector: 'app-hierarchy-menu',
  templateUrl: './hierarchy-menu.component.html',
  styleUrls: ['./hierarchy-menu.component.scss'],
  providers: [HierarchyMenuService]
})
export class HierarchyMenuComponent implements OnInit {
  @Input() name: string = 'Test Project';
  _items: ProjectFile[] = [];
  @Input() set items ( v: ProjectFile[] ){
    this._items = v;
    this.createFileIndex(this._items);
    console.log(this.index)
  }

  @HostListener('document:keydown', ['$event']) onKeydown (e) {
    console.log(e.key);
    if(this.selectedItem && e.key === 'Delete'){
      console.log('delete', this.selectedItem)
      this.deleteItem.next(this.selectedItem);
      this.selectedItem = undefined;
    }
  }
  
  /*[
    {
      name: 'Characters',
      type: 'folder',
      path: '/characters',
      collapsed: false,
      icon: '',
      children: [
        {
          name: 'Naga',
          type: 'file',
          path: '/characters/naga',
          icon: '',
        },
        {
          name: 'Jolly',
          type: 'file',
          path: '/characters/jolly',
          icon: '',
        },
        {
          name: 'Enemies',
          type: 'folder',
          path: '/characters/enemies',
          icon: '',
          collapsed: true,
          children: [
            {
              name: 'Jeff',
              type: 'file',
              path: '/characters/enemies/jeff',
              icon: '',
            }
          ]
        }, 

      ]
    },
    {
      name: 'Locations',
      type: 'folder',
      path: '/locations',
      collapsed: false,
      icon: '',
      children: [
        {
          name: 'Great Red Mountain',
          type: 'file',
          path: '/locations/great-red-mountain',
          icon: '',
        }
      ]
    }
  ];*/

  @Output() init: EventEmitter<HierarchyMenuService> = new EventEmitter();
  @Output() createFile: EventEmitter<ProjectFile> = new EventEmitter();
  @Output() createFolder: EventEmitter<ProjectFile> = new EventEmitter();
  @Output() deleteItem: EventEmitter<ProjectFile> = new EventEmitter();
  @Output() openItem: EventEmitter<ProjectFile> = new EventEmitter();

  selectedItem?: ProjectFile;
  contextMenu: MenuItem[] = [
    {
      label: 'Delete',
      icon: PrimeIcons.TRASH,
      command: () => {
        this.hierarchyMenuService.deleteItem(this.selectedItem!);
      }
    },
    {
      label: 'Rename',
      icon: PrimeIcons.PENCIL,
      command: () => {
        this.hierarchyMenuService.edit(this.selectedItem!);
      }
    }
  ]

  @ViewChild('hierarchyItems') hierarchyItems;

  constructor(private hierarchyMenuService: HierarchyMenuService) {
    this.hierarchyMenuService.itemSelected$.subscribe( item => this.selectedItem = item );
    this.hierarchyMenuService.deleteItem$.subscribe( item => this.deleteItem.next(item) );
    this.hierarchyMenuService.openItem$.subscribe( item => this.openItem.next(item) );
  }

  ngOnInit(): void {
    this.init.next(this.hierarchyMenuService);
  }

  collapseAll(){
    this.hierarchyMenuService.collapseAll();
  }
   
  onItemSelected(item: ProjectFile){
    this.selectedItem = item;
  }

  addFolder(){
    this.createFolder.next(this.selectedItem!);
  }

  addFile(){
    this.createFile.next(this.selectedItem!);
    console.log(this.selectedItem);
    if(!this.selectedItem){
      console.log('push on this.items');
    }
    if(this.selectedItem?.type === 'FOLDER'){
      console.log('push on the children')
    }
    if(this.selectedItem?.type === 'FILE'){
      console.log('push on the parent')
    }
  }


  index: any = {};
  index2: any = {};

  createFileIndex(items){
    items.forEach( item => {
      this.index[item.path] = item;
      /* if(item.type === 'FOLDER'){
        const newSubIndex = {};
        index[this.getItemPathName(item.name)] = newSubIndex;
        this.createFileIndex(item.children, newSubIndex);
      } else {
        index[this.getItemPathName(item.name)] = item;
      } */
    })

    
  }

  getItemPathName(name: string){
    return name.toLowerCase().replace(' ', '_');
  }

}
