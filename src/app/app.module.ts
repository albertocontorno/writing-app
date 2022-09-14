import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MenubarModule} from 'primeng/menubar';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {FocusTrapModule} from 'primeng/focustrap';
import {ContextMenuModule} from 'primeng/contextmenu';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {TabMenuModule} from 'primeng/tabmenu';
import {SplitterModule} from 'primeng/splitter';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {TreeModule} from 'primeng/tree';
import {MenuModule} from 'primeng/menu';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {AutoFocusModule} from 'primeng/autofocus';

import { WindowedEditorComponent } from './components/windowed-editor/windowed-editor.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { TextEditorHeadingComponent } from './components/text-editor/text-editor-heading/text-editor-heading.component';
import { TextEditorListComponent } from './components/text-editor/text-editor-list/text-editor-list.component';
import { TextEditorParagraphComponent } from './components/text-editor/text-editor-paragraph/text-editor-paragraph.component';
import { TextEditorIndexComponent } from './components/text-editor/text-editor-index/text-editor-index.component';
import { TextEditorExtrasComponent } from './components/text-editor/text-editor-extras/text-editor-extras.component';
import { WritingDesktopComponent } from './components/writing-desktop/writing-desktop.component';

import { WindowedEditorService } from './services/windowed-editor.service';
import { TextEditorDividerComponent } from './components/text-editor/text-editor-divider/text-editor-divider.component';
import { HierarchyMenuComponent } from './components/hierarchy-menu/hierarchy-menu.component';
import { HierarchyMenuItemComponent } from './components/hierarchy-menu/hierarchy-menu-item/hierarchy-menu-item.component';

@NgModule({
  declarations: [
    AppComponent,
    WindowedEditorComponent,
    TextEditorComponent,
    TextEditorHeadingComponent,
    TextEditorListComponent,
    TextEditorParagraphComponent,
    TextEditorIndexComponent,
    TextEditorExtrasComponent,
    WritingDesktopComponent,
    TextEditorDividerComponent,
    HierarchyMenuComponent,
    HierarchyMenuItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MenubarModule,
    PanelModule,
    ButtonModule,
    FocusTrapModule,
    ContextMenuModule,
    OverlayPanelModule,
    TabMenuModule,
    SplitterModule,
    ScrollPanelModule,
    DialogModule,
    InputTextModule,
    TreeModule,
    MenuModule,
    ConfirmPopupModule,
    AutoFocusModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
