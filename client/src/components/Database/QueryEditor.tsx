import { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
}

const QueryEditor = ({ 
  value, 
  onChange, 
  language = "javascript", 
  height = "300px" 
}: QueryEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  // Setup editor options
  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: "on",
    roundedSelection: false,
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
      alwaysConsumeMouseWheel: false
    },
    lineHeight: 20,
    fontSize: 14,
    fontFamily: '"Roboto Mono", monospace',
    wordWrap: "on" as "on",
    wrappingIndent: "indent" as "indent",
    renderLineHighlight: "line" as "line"
  };

  return (
    <div className="border rounded-md">
      <Editor
        height={height}
        language={language}
        value={value}
        options={editorOptions}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-light"
      />
    </div>
  );
};

export default QueryEditor;
