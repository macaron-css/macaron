import { Component, createEffect, onMount, onCleanup } from 'solid-js';
import { Uri, languages, editor as mEditor } from 'monaco-editor';
import { style } from '@macaron-css/core';

const Editor: Component<{
  displayErrors?: boolean;
  value: string;
  class: string;
  disabled?: boolean;
  onDocChange?: (code: string) => void;
  // onEditorReady?: Parameters<Repl>[0]['onEditorReady'];
}> = props => {
  let parent!: HTMLDivElement;
  let editor: mEditor.IStandaloneCodeEditor;

  onMount(() => {
    editor = mEditor.create(parent, {
      value: props.value,
      automaticLayout: true,
      language: 'typescript',
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 3,
      padding: { top: 15 },
      readOnly: props.disabled,
    });

    mEditor.setTheme('vs-dark');

    editor.onDidChangeModelContent(() => {
      props.onDocChange?.(editor.getValue());
    });
  });

  createEffect(() => {
    if (props.disabled) {
      editor.setValue(props.value);
    }
  });

  onCleanup(() => editor?.dispose());

  createEffect(() => {
    languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: !props.displayErrors,
      noSyntaxValidation: !props.displayErrors,
    });
  });

  return <div class={props.class} ref={parent} />;
};

export default Editor;
