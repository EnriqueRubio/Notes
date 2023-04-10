import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import ImageCompress from 'quill-image-compress';
import 'react-quill/dist/quill.snow.css';
import './editor.component.css';
Quill.register('modules/imageCompress', ImageCompress);
const QuillEditor = ({ onEditorReady, getCurrentContent }) => {
    const quillRef = useRef();
    const quillInstanceRef = useRef(null);
    const content = getCurrentContent();
    
    useEffect(() => {
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
            ['clean'],
            ['code-block']
          ],
          imageCompress: {
            quality: 0.7, // default
            maxWidth: 600, // default
            maxHeight: 700, // default
            imageType: 'image/jpeg', // default
            debug: true, // default
          }
        }
    });

    quillInstanceRef.current = quill;

    if (onEditorReady) {
        onEditorReady(quill);
    }
    }, []);

    useEffect(() => {
        if (content && quillInstanceRef.current) {
            quillInstanceRef.current.setContents(content);
        } else {
            quillInstanceRef.current.setContents('');
        }
    }, [content]);

    return (
      <div id="quill-editor" ref={quillRef} className="quill-editor-container" />
    );
  };
  
  export default QuillEditor;
  