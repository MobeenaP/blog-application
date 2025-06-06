

import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef } from 'react';


interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
}

// Fix 2: Use any type for the editor ref (quick fix)
export const RichTextEditor = ({ initialValue, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Your editor initialization code
  }, []);

  return (
    <Editor
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={initialValue}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      onEditorChange={(content) => onChange?.(content)}
    />
  );
};

// Alternative Fix 3: Define your own editor type
interface EditorInstance {
  getContent: () => string;
  setContent: (content: string) => void;
  // Add other methods you need
}

export const RichTextEditorTyped = ({ initialValue, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<EditorInstance | null>(null);

  return (
    <Editor
      onInit={(evt, editor) => editorRef.current = editor as EditorInstance}
      initialValue={initialValue}
      init={{
        // Your TinyMCE config
      }}
      onEditorChange={(content) => onChange?.(content)}
    />
  );
};