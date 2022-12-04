import React, { useRef } from 'react';
import { Uri, languages, editor as mEditor } from 'monaco-editor';
import { globalStyle, style } from '@macaron-css/core';
import { useEffect } from 'react';
import theme from './theme.json';

globalStyle(`.monaco-editor .overflow-guard`, {
  borderRadius: '5px',
  border: '2px solid #3f3e63',
});

function Editor(props: {
  displayErrors?: boolean;
  value: string;
  class: string;
  disabled?: boolean;
  onDocChange?: (code: string) => void;
}) {
  const parent = useRef<HTMLDivElement>(null);
  const editor = useRef<mEditor.IStandaloneCodeEditor>();

  useEffect(() => {
    editor.current = mEditor.create(parent.current!, {
      value: props.value,
      automaticLayout: true,
      language: 'typescript',
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 3,
      padding: { top: 15 },
      readOnly: props.disabled,
      minimap: { enabled: false },
    });

    mEditor.defineTheme('github-f', theme);
    mEditor.setTheme('github-f');

    editor.current.onDidChangeModelContent(() => {
      props.onDocChange?.(editor.current!.getValue());
    });

    return () => {
      editor.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (props.disabled) {
      editor.current!.setValue(props.value);
    }
  }, [props.disabled, props.value]);

  useEffect(() => {
    languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: !props.displayErrors,
      noSyntaxValidation: !props.displayErrors,
    });
  }, [props.displayErrors]);

  return <div className={props.class} ref={parent} />;
}

export default Editor;
