import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ initialValue = '', onChange }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.setContent(initialValue);
    }
  }, [initialValue]);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => {
        editorRef.current = editor;
        if (initialValue) {
          editor.setContent(initialValue);
        }
      }}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup: (editor: any) => {
          editor.on('NodeChange', () => {
            const content = editor.getContent();
            onChange(content);
          });
        }
      }}
    />
  );
} 