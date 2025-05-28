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
          editor.on('init', () => {
            const toolbar = editor.getContainer().querySelector('.tox-toolbar');
            if (toolbar) {
              const boldButton = toolbar.querySelector('button[title="Bold"]');
              if (boldButton) boldButton.setAttribute('data-testid', 'toolbar-bold');
              
              const italicButton = toolbar.querySelector('button[title="Italic"]');
              if (italicButton) italicButton.setAttribute('data-testid', 'toolbar-italic');
              
              const bulletListButton = toolbar.querySelector('button[title="Bullet list"]');
              if (bulletListButton) bulletListButton.setAttribute('data-testid', 'toolbar-bullet-list');
            }
          });

          editor.on('input', () => {
            const content = editor.getContent();
            onChange(content);
          });
        },
        init_instance_callback: (editor: any) => {
          editor.on('BeforeSetContent', (e: any) => {
            if (e.content === editor.getContent()) {
              e.preventDefault();
            }
          });
        }
      }}
    />
  );
} 