import { HistoryTrackerService } from './services/history-tracker.service';
import { Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { WindowedEditorService } from './services/windowed-editor.service';
import { WindowedEditor } from './models/windowed-editor.model';
import { Project } from './models/project.model';
import { generateUUID } from './utils/utils';
import { getDefaultBlock } from './components/text-editor/text-editor.contants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'writing-app';

  items: MenuItem[];
  // {"name": "Dev project","files":[{"id":"4059c6fc-6058-4657-86a5-16f244c7273c","blocks":[{"id":"65424b0d-5f3f-4e4f-8ede-9d42ab70969b","type":"P","text":"as<b>dasda</b>sda<a class=\"text-editor-reference\" href=\"\" te-data=\"te-REF\" te-data-context=\"{&quot;pointer&quot;:[&quot;1351967c-4a5d-47d0-bb10-fe29c25d01ab&quot;],&quot;id&quot;:&quot;3f6d9028-04c7-4cba-bfc7-653aa723e4fc&quot;}\" style=\"color: yellow; text-decoration: underline;\">sdasd</a>asds","position":0}],"position":0,"title":""}],"references":[{"id":"3f6d9028-04c7-4cba-bfc7-653aa723e4fc","type":"PROJECT","pointer":["1351967c-4a5d-47d0-bb10-fe29c25d01ab"],"blocks":[{"id":"1c6e9433-a52b-4c59-beba-04e9dec59efa","type":"P","text":"test","position":0}],"title":"tests"}],"notes":[],"id":"1351967c-4a5d-47d0-bb10-fe29c25d01ab"}
  project: Project =
  {
    name: 'Initial project',
    files: [{
      name: 'Page 1',
      type: 'FILE', 
      path: '/page_1',
      id: generateUUID(),
      blocks: [getDefaultBlock()],
    }],
    references: [],
    notes: [],
    id: generateUUID(),
  };

  windows: WindowedEditor[] = [{
    title: 'Initial Window',
    text: 'Start writing!'
  }];

  @ViewChild('menubar') menubar: Menubar;

  constructor(private windowedEditorService: WindowedEditorService, private historyTrackerService: HistoryTrackerService){
    if(localStorage.getItem('project')){
      this.project = JSON.parse(localStorage.getItem('project')!);
    }
  }

  ngOnInit() {
      this.items = [
          {
              label: 'New',
              items: [{
                      label: 'Project', 
                      icon: 'pi pi-fw pi-plus',
                      command: () => {
                        this.project = this.createNewProject();
                      }
                  },
              ]
          }
      ];
  }

  ngAfterViewInit(){
   /* 0.1rem	1.6px */
   this.windowedEditorService.offsetY = (this.menubar.el.nativeElement as HTMLDivElement).offsetHeight + 8 * 2;
  }

  createNewProject(){
    const project: Project = 
    {
      name: 'New Project',
      files: [{
        name: 'Page 1',
        type: 'FILE', 
        path: '/page_1',
        id: generateUUID(),
        blocks: [getDefaultBlock()],
      }],
      references: [],
      notes: [],
      id: generateUUID(),
    };

    return project;
  }

  onDeleteWindow(index: number){
    this.windows.splice(index, 1);
  }
}
