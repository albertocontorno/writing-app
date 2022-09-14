import { ProjectFile } from 'src/app/models/project.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HierarchyMenuService } from '../hierarchy-menu.service';

@Component({
  selector: 'app-hierarchy-menu-item',
  templateUrl: './hierarchy-menu-item.component.html',
  styleUrls: ['./hierarchy-menu-item.component.scss']
})
export class HierarchyMenuItemComponent implements OnInit {

  @Input() item: ProjectFile;
  @Input() hasParent = false;
  @Input() isEditing = false;
  isSelected: boolean =  false;
  constructor(private hierarchyMenuService: HierarchyMenuService) {
    hierarchyMenuService.itemSelected$.subscribe( item => this.isSelected = item === this.item );
    hierarchyMenuService.editItem$.subscribe( item => item === this.item ? this.isEditing = true : null );
    hierarchyMenuService.toggleItem$.subscribe( ({item, state}) => {
      if(this.item.type === 'FOLDER'){
        this.item.collapsed = (!item || this.item === item) ? state : this.item.collapsed;
      }
    });
  }

  ngOnInit(): void {
  }

  onItemSelected(){
    this.hierarchyMenuService.selectItem(this.item);
  }

  onOpenItem(){
    this.hierarchyMenuService.openItem(this.item);
  }

  onBlur(e){
    console.log(e);
    if(!(e.target.value.trim())){
      e.target.focus();
      return;
    };
    this.isEditing = false;
    
    // check name already exists!
    if(e.target.value){
      //if this.item.type === 'FILE' check in parent another FILE with same name
      //else check in parent another FOLDER with same name
    }
    this.item.name = e.target.value;
    // update item path and item children paths recursively   
    this.updateItemPath(this.item);
    console.log(this.item); 
  }

  updateItemPath(item, parent?){
    item.path = parent ? parent.path + '/' + this.getItemPathName(item.name) : item.path.substring(0, item.path.lastIndexOf('/')+1) + this.getItemPathName(item.name);
    if(item.children){
      item.children.forEach( el => {
        this.updateItemPath(el, item);
      });
    };
  }

  getItemPathName(name: string){
    return name.toLowerCase().replace(' ', '_');
  }

}
