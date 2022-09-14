import { ProjectService } from 'src/app/services/project.service';
import { TextEditorNote } from './../../../models/project.model';
import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-text-editor-extras',
  templateUrl: './text-editor-extras.component.html',
  styleUrls: ['./text-editor-extras.component.scss']
})
export class TextEditorExtrasComponent implements OnInit {

  @Input() notes: TextEditorNote[] = [];

  index = -1;

  items: MenuItem[] = [
    {
      label: 'Delete',
      icon: PrimeIcons.TIMES,
      command: () => this.notes.splice(this.index, 1)
    },
    {
      label: 'Move Up',
      icon: PrimeIcons.ARROW_UP,
      command: (note) => {
        const prevIndex = this.index! - 1;
        if(prevIndex >= 0){
          const temp = this.notes[prevIndex];
          this.notes[prevIndex] = this.notes[this.index];
          this.notes[this.index] = temp;
        }
      }
    },
    {
      label: 'Move Down',
      icon: PrimeIcons.ARROW_DOWN,
      command: (note) => {
        const nextIndex = this.index! + 1;
        if(nextIndex < this.notes.length){
          const temp = this.notes[nextIndex];
          this.notes[nextIndex] = this.notes[this.index];
          this.notes[this.index] = temp;
        }
      }
    }
  ]

  updateTitle(e, index?){
    this.notes[index].title += e.key;
    e.preventDefault();
    e.stopPropagation();
  }

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
  }

  openMenu(e, menu, index: number){
    menu.toggle(e);
    this.index = index;
  }

}
