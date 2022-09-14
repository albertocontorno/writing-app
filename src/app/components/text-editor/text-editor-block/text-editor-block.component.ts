import { TextEditorService } from './../text-editor.service';
import { Component, AfterViewInit, EventEmitter, Input, Output, Renderer2, ViewContainerRef, OnDestroy } from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { BLOCK_TYPES } from '../text-editor.contants';
import { KEYDOWN } from 'src/app/utils/keyCodes';

@Component({
  selector: 'app-text-editor-block',
  templateUrl: './text-editor-block.component.html',
  styleUrls: ['./text-editor-block.component.scss']
})
export abstract class TextEditorBlockComponent<T extends HTMLElement> implements AfterViewInit, OnDestroy {

  @Input() block;
  @Input() service: TextEditorService;
  @Input() isNew: boolean = false;
  @Output() createNewBlock: EventEmitter<void> = new EventEmitter();
  @Output() newBlockCreated: EventEmitter<this> = new EventEmitter();
  @Output() initialized: EventEmitter<any> = new EventEmitter();

  container: T;
  protected BLOCK_TYPES = BLOCK_TYPES;
  protected subscriptions: Subscription[] = [];
  protected contentEditable: boolean = true;

  constructor(protected hostElement: ViewContainerRef, protected render: Renderer2) { }

  ngAfterViewInit(): void {
    this.container = this.createBlockElement() as T;
    this.render.setAttribute(this.container, 'contentEditable', this.contentEditable.toString());
    this.hostElement.element.nativeElement.appendChild(this.container);
    this.block.component = this;
    this.block.element = this.container;
    this.render.appendChild(this.hostElement.element.nativeElement, this.container);
    if(this.isNew){
      this.newBlockCreated.emit(this);
    }

    this.subscriptions.push( fromEvent(this.container, 'click')
      .pipe( debounceTime(200) )
      .subscribe( e => {
        if(e.target){
          if((e.target as HTMLElement).attributes['te-event']){
            this.service.onEvent(e.target as HTMLElement);
          }
        }
      })
    );

    this.subscriptions.push( fromEvent(this.container, KEYDOWN)
      .pipe( debounceTime(300) )
      .subscribe( (e: any) => {
        this.upadteModel();
        this.service.onChange();
      } ));


    this.initialized.emit(this);
  }

  abstract createBlockElement(): HTMLElement;

  abstract upadteModel();

  ngOnDestroy(): void {
    this.subscriptions.forEach( sub => sub.unsubscribe() );
  }
}
