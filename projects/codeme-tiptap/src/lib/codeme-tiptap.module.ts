import { NgModule } from '@angular/core';
import { CodemeTiptapComponent } from './codeme-tiptap.component';
import { NgxTiptapModule } from 'ngx-tiptap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditorButtonComponent } from './ui/editor-button.component';
import { EditorToolbarComponent } from './ui/editor-toolbar.component';
import { CdmHeadingDirective } from './editor-feature/';
import { CdmParagraphDirective } from './editor-feature';

@NgModule({
  declarations: [
    CodemeTiptapComponent,
    EditorButtonComponent,
    EditorToolbarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxTiptapModule,
    CdmHeadingDirective,
    CdmParagraphDirective,
  ],
  exports: [CodemeTiptapComponent, CdmHeadingDirective, CdmParagraphDirective],
})
export class CodemeTiptapModule {}