import { EventEmitter, Injectable, inject } from '@angular/core';
import { Editor, Node } from '@tiptap/core';
import { EDITOR_FEATURE, EditorFeature } from './editor-feature/editor-feature';
import {
  Observable,
  Subject,
  combineLatest,
  first,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Portal } from '@angular/cdk/portal';
import { EditorState } from 'prosemirror-state'; // Adjust based on your editor's state management

@Injectable()
export class EditorService {
  editor!: Editor;
  currentSelection: any = null;

  private features =
    inject<EditorFeature[]>(EDITOR_FEATURE, { optional: true }) || [];

  private features$ = this.features.map(({ enabled, extension, config }) =>
    combineLatest([enabled, config]).pipe(
      switchMap(([enabled, cfg]) =>
        enabled
          ? from(extension()).pipe(
              map((extArray) => {
                if (Array.isArray(extArray)) {
                  return extArray.map((ext) => ext.configure(cfg || {}));
                }
                return extArray.configure(cfg || {});
              })
            )
          : of(null)
      )
    )
  );

  buttons: Portal<any>[] = this.features
    .filter((feat) => feat.button)
    // features are filtered, so button cannot be undefined
    .map((feat) => feat.button as Portal<any>);

  extensions$: Observable<Node[]> = combineLatest(this.features$).pipe(
    map((extensionsArray) => {
      return extensionsArray.flat().filter(Boolean) as Node[];
    })
  );

  get editor$(): Observable<Editor> {
    return this.extensions$.pipe(
      map(
        (extensions) =>
          new Editor({ extensions: [Document, Text, Paragraph, ...extensions] })
      ),
      tap((editor) => {
        console.log(this.features);
        this.editor = editor;
      })
    );
  }

  exec(cb: (editor: Editor) => void) {
    if (!this.editor) {
      console.error('Editor not initialized');
      return;
    }
    cb(this.editor);
  }
}
