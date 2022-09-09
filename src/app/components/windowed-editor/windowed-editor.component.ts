import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { WindowedEditor } from 'src/app/models/windowed-editor.model';
import { WindowedEditorService } from 'src/app/services/windowed-editor.service';

@Component({
  selector: 'app-windowed-editor',
  templateUrl: './windowed-editor.component.html',
  styleUrls: ['./windowed-editor.component.scss']
})
export class WindowedEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data: WindowedEditor;
  @Input() index: number;

  @Output() deleteWindow: EventEmitter<number> = new EventEmitter<number>();

  protected contentVisible: boolean = true;
  protected dimension: { w: number, h: number, tw: number } = { w: 250, h: 200, tw: 250 };

  private _resizeObserver: ResizeObserver;
  private _content: HTMLDivElement;

  @ViewChild('titleBar') titleBar: ElementRef;
  @ViewChild('content', { static: false }) set content( v: ElementRef ){
    this._content = v?.nativeElement;
    if(this.contentVisible && this._content){
      this._content.style.height = this.dimension.h + 'px';
      const w = this.dimension.tw > this.dimension.w ? this.dimension.tw : this.dimension.w;
      this._content.style.width = w + 'px';
      this._resizeObserver.observe(this._content);
    } else {
      this._resizeObserver.disconnect();
    }
  }
  
  constructor(private windowedEditorService: WindowedEditorService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._resizeObserver = new ResizeObserver( () => this.onContentResize(this._content) )
  }

  ngAfterViewInit(){
    this.onContentResize(this._content);
    setTimeout( () => {
      this.dimension.tw = this.titleBar.nativeElement.getBoundingClientRect().width;
    }, 10);
  }

  onTitleBarClicked(e: MouseEvent, windowEditor: any){
    this.windowedEditorService.moveWindow(e, windowEditor);
  }

  onContentResize(content: HTMLDivElement){
    const boundings = content.getBoundingClientRect();
    this.dimension.w = boundings.width;
    this.dimension.h = boundings.height;
    this.cdRef.detectChanges();
  }

  onFocus(windowEditor: HTMLDivElement){
    this.windowedEditorService.selectWindow(windowEditor);
  }

  toggleContent(windowEditor: HTMLDivElement){
    this.contentVisible = !this.contentVisible;
    if(this.contentVisible){
      this.windowedEditorService.selectWindow(windowEditor);
    }
  }

  onDelete(){
    this.deleteWindow.next(this.index);
  }

  ngOnDestroy(){
    this._resizeObserver.disconnect();
  }

}
