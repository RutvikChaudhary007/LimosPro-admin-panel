import BubbleMenu from "@tiptap/extension-bubble-menu";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const editorStyles = `
  .tiptap {
    min-height: 250px;
    padding: 1rem;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }
  .tiptap:focus {
    outline: none;
  }
  .tiptap p {
    margin: 0.75em 0;
  }
  .tiptap h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 1em 0 0.5em 0;
  }
  .tiptap h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.8em 0 0.4em 0;
  }
  .tiptap h3 {
    font-size: 1.25em;
    font-weight: bold;
    margin: 0.6em 0 0.3em 0;
  }
  .tiptap h4 {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0.5em 0 0.25em 0;
  }
  .tiptap ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 0.75em 0;
  }
  .tiptap ol {
    list-style-type: decimal;
    padding-left: 1.5em;
    margin: 0.75em 0;
  }
  .tiptap a {
    color: #60a5fa;
    text-decoration: underline;
  }
  .tiptap img {
    max-width: 100%;
    height: auto;
    margin: 1em 0;
    border-radius: 4px;
  }
  .tiptap blockquote {
    border-left: 3px solid #4b5563;
    margin: 1em 0;
    padding-left: 1em;
    color: #9ca3af;
  }
  .tiptap code {
    background-color: #374151;
    color: #fbbf24;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
  }
  .tiptap pre {
    background-color: #1f2937;
    color: #f3f4f6;
    padding: 1em;
    border-radius: 6px;
    margin: 1em 0;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
  }
  .tiptap .task-list-item {
    display: flex;
    align-items: flex-start;
  }
  .tiptap .task-list-item-checkbox {
    margin-right: 0.5em;
    margin-top: 0.2em;
  }
  .tiptap .highlight {
    background-color: #fbbf24;
    color: #000;
    padding: 0.1em 0.2em;
    border-radius: 2px;
  }
  .tiptap .text-align-left { text-align: left; }
  .tiptap .text-align-center { text-align: center; }
  .tiptap .text-align-right { text-align: right; }
  .tiptap .text-align-justify { text-align: justify; }
  
  /* Bubble Menu */
  .tiptap-bubble-menu {
    display: flex;
    background-color: #374151;
    border: 1px solid #4b5563;
    border-radius: 6px;
    padding: 4px;
    gap: 2px;
    z-index: 50;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .tiptap-bubble-menu button {
    background: transparent;
    border: none;
    color: #d1d5db;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: background-color 0.2s;
  }
  .tiptap-bubble-menu button:hover {
    background-color: #4b5563;
    color: white;
  }
  .tiptap-bubble-menu button.active {
    background-color: #60a5fa;
    color: white;
  }
  
  /* Toolbar */
  .tiptap-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    padding: 8px;
    background-color: #1f2937;
    border-bottom: 1px solid #374151;
  }
  .tiptap-toolbar-group {
    display: flex;
    gap: 2px;
    margin-right: 8px;
    padding-right: 8px;
    border-right: 1px solid #374151;
  }
  .tiptap-toolbar button {
    background: #374151;
    border: 1px solid #4b5563;
    color: #d1d5db;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    min-width: 32px;
    transition: all 0.2s;
  }
  .tiptap-toolbar button:hover {
    background-color: #4b5563;
    color: white;
  }
  .tiptap-toolbar button.active {
    background-color: #60a5fa;
    color: white;
    border-color: #3b82f6;
  }
  .tiptap-toolbar select {
    background: #374151;
    border: 1px solid #4b5563;
    color: #d1d5db;
    padding: 6px 8px;
    border-radius: 4px;
    font-size: 12px;
    min-width: 100px;
  }
  .tiptap-toolbar select:focus {
    outline: none;
    border-color: #60a5fa;
  }
`;

export default function EnhancedTiptapEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  label,
}: TiptapEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        codeBlock: {
          HTMLAttributes: {
            class: "code-block",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "blockquote",
          },
        },
      }),
      Underline,
      Strike,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "link",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "image",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Code,
      CodeBlock,
      TextStyle,
      Color,
      FontFamily,
      Placeholder.configure({
        placeholder,
      }),
      BubbleMenu.configure({
        element: document.querySelector(".tiptap-bubble-menu") as HTMLElement,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap",
        spellcheck: "true",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter Image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const setColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  const setFontFamily = (font: string) => {
    editor?.chain().focus().setFontFamily(font).run();
  };

  if (!mounted || !editor) {
    return (
      <div className="text-sm mb-3">
        {label && (
          <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
            {label}
          </div>
        )}
        <div className="h-48 w-full rounded-md border border-gray-700 bg-gray-900 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="text-sm mb-3">
      {label && (
        <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
          {label}
        </div>
      )}

      <style>{editorStyles}</style>

      {/* Bubble Menu Element */}
      <div className="tiptap-bubble-menu" style={{ display: "none" }}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "active" : ""}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          onClick={addLink}
          className={editor.isActive("link") ? "active" : ""}
          title="Add Link"
        >
          🔗
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "active" : ""}
          title="Highlight"
        >
          🌟
        </button>
      </div>

      <div className="bg-gray-900 rounded border border-gray-700 overflow-hidden">
        {/* Main Toolbar */}
        <div className="tiptap-toolbar">
          {/* Text Formatting */}
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "active" : ""}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "active" : ""}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "active" : ""}
              title="Underline (Ctrl+U)"
            >
              <u>U</u>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "active" : ""}
              title="Strikethrough"
            >
              <s>S</s>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive("code") ? "active" : ""}
              title="Code"
            >
              {"</>"}
            </button>
          </div>

          {/* Headings */}
          <div className="tiptap-toolbar-group">
            <select
              onChange={(e) => {
                const level = parseInt(e.target.value);
                if (level === 0) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as any })
                    .run();
                }
              }}
              value={
                editor.isActive("heading", { level: 1 })
                  ? "1"
                  : editor.isActive("heading", { level: 2 })
                    ? "2"
                    : editor.isActive("heading", { level: 3 })
                      ? "3"
                      : editor.isActive("heading", { level: 4 })
                        ? "4"
                        : "0"
              }
              title="Text Style"
            >
              <option value="0">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
            </select>
          </div>

          {/* Lists */}
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "active" : ""}
              title="Bullet List"
            >
              <span>•</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "active" : ""}
              title="Numbered List"
            >
              <span>1.</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={editor.isActive("taskList") ? "active" : ""}
              title="Task List"
            >
              <span>✓</span>
            </button>
          </div>

          {/* Text Alignment */}
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={editor.isActive({ textAlign: "left" }) ? "active" : ""}
              title="Align Left"
            >
              <span>↤</span>
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "active" : ""
              }
              title="Align Center"
            >
              <span>↔</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "active" : ""
              }
              title="Align Right"
            >
              <span>↦</span>
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={
                editor.isActive({ textAlign: "justify" }) ? "active" : ""
              }
              title="Justify"
            >
              <span>⇔</span>
            </button>
          </div>

          {/* Special Formatting */}
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={editor.isActive("superscript") ? "active" : ""}
              title="Superscript"
            >
              <sup>x²</sup>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={editor.isActive("subscript") ? "active" : ""}
              title="Subscript"
            >
              <sub>x₂</sub>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive("highlight") ? "active" : ""}
              title="Highlight"
            >
              <span
                style={{
                  backgroundColor: "#fbbf24",
                  color: "#000",
                  padding: "0 2px",
                }}
              >
                H
              </span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "active" : ""}
              title="Blockquote"
            >
              <span>"</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "active" : ""}
              title="Code Block"
            >
              <span>{"</>"}</span>
            </button>
          </div>

          {/* Insert */}
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={addLink}
              className={editor.isActive("link") ? "active" : ""}
              title="Insert Link"
            >
              🔗
            </button>
            <button type="button" onClick={addImage} title="Insert Image">
              🖼️
            </button>
          </div>

          {/* Color */}
          <div className="tiptap-toolbar-group">
            <select
              onChange={(e) => setColor(e.target.value)}
              defaultValue="#ffffff"
              title="Text Color"
            >
              <option value="#ffffff">White</option>
              <option value="#000000">Black</option>
              <option value="#ef4444">Red</option>
              <option value="#10b981">Green</option>
              <option value="#3b82f6">Blue</option>
              <option value="#f59e0b">Yellow</option>
              <option value="#8b5cf6">Purple</option>
              <option value="#f97316">Orange</option>
            </select>
          </div>

          {/* Font Family */}
          <div className="tiptap-toolbar-group">
            <select
              onChange={(e) => setFontFamily(e.target.value)}
              defaultValue=""
              title="Font Family"
            >
              <option value="">Default</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>

          {/* Actions */}
          <div className="tiptap-toolbar-group" style={{ marginLeft: "auto" }}>
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo (Ctrl+Z)"
            >
              ↩️
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo (Ctrl+Y)"
            >
              ↪️
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().clearContent().run()}
              title="Clear All"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} />

        {/* Character/Word Count */}
        <div className="flex justify-between items-center px-3 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-400">
          <div>
            Words: {editor?.storage.characterCount?.words() || 0} | Characters:{" "}
            {editor?.storage.characterCount?.characters() || 0}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(editor?.getHTML() || "")
              }
              className="hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-800"
              title="Copy HTML"
            >
              Copy HTML
            </button>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(editor?.getText() || "")
              }
              className="hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-800"
              title="Copy Text"
            >
              Copy Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import ReactQuill from "react-quill-new";
import { constant } from "@/lib/constant";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

export function RichTextEditor({
  value,
  onChange,
  theme = "snow",
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  theme?: string;
  [key: string]: any;
}) {
  (globalThis as any).hljs = hljs;
  const quillRef = useRef<any>(null);
  const { className, ...restProps } = props;
  // 🔥 Build modules correctly
  const modules = {
    ...constant.EDITOR_FORMATS.modules,
    toolbar: {
      ...constant.EDITOR_FORMATS.modules.toolbar,
      handlers: {
        undo: () => quillRef.current?.getEditor().history.undo(),
        redo: () => quillRef.current?.getEditor().history.redo(),
        image: () => handleImageInsert(),
      },
    },
  };

  const handleImageInsert = () => {
    const quill = quillRef.current?.getEditor();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", reader.result);
      };
      reader.readAsDataURL(file);
    };
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme={theme}
      value={value}
      onChange={onChange}
      modules={modules}
      formats={constant.EDITOR_FORMATS.formats}
      className={className}
      {...restProps}
    />
  );
}

import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";

interface Props {
  value: string;
  onChange: (value: string) => void;
  config?: any;
}

export function FroalaEditorRHF({ value, onChange, config = {} }: Props) {
  return (
    <FroalaEditor
      tag="textarea"
      model={value}
      onModelChange={onChange}
      config={{
        placeholderText: "Write here...",
        charCounterCount: true,
        ...config,
      }}
    />
  );
}

import { Editor } from "@tinymce/tinymce-react";

type TinyEditorProps = {
  value: string;
  onChange: (v: string) => void;
  init?: any;
  onBlur?: () => void;
  name?: string;
  autosaveKey?: string;
  autosaveInterval?: number;
} & Omit<React.ComponentProps<"div">, "ref">;

const TinyEditorRHF = ({
  value,
  onChange,
  init = {},
  onBlur,
  name,
  autosaveKey = "tinymce-autosave",
  autosaveInterval = 30000,
  ...rest
}: TinyEditorProps) => {
  const editorRef = useRef<any>(null);
  const lastSavedRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleInit = (_evt: any, editor: any) => {
    editorRef.current = editor;

    // Load auto-saved content if exists
    const savedContent = localStorage.getItem(autosaveKey);
    if (savedContent && savedContent !== value) {
      console.log("Auto-saved content found");
    }

    // Setup auto-save
    editor.on("keyup", () => {
      handleAutoSave(editor);
    });

    editor.on("change", () => {
      handleAutoSave(editor);
    });

    // Add custom YouTube button
    editor.ui.registry.addButton("youtube", {
      text: "YouTube",
      icon: "embed",
      onAction: () => {
        editor.windowManager.open({
          title: "Insert YouTube Video",
          body: {
            type: "panel",
            items: [
              {
                type: "input",
                name: "url",
                label: "YouTube URL",
                placeholder: "https://www.youtube.com/watch?v=...",
              },
            ],
          },
          buttons: [
            {
              type: "cancel",
              text: "Cancel",
            },
            {
              type: "submit",
              text: "Insert",
              buttonType: "primary",
            },
          ],
          onSubmit: (api: any) => {
            const data = api.getData();
            const url = data.url;
            let videoId = "";

            // Extract video ID from URL
            if (url.includes("youtube.com/watch?v=")) {
              videoId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
              videoId = url.split("youtu.be/")[1].split("?")[0];
            }

            if (videoId) {
              const embedCode =
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
                videoId +
                '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
              editor.insertContent(embedCode);
              api.close();
            } else {
              alert("Please enter a valid YouTube URL");
            }
          },
        });
      },
    });
  };

  const handleEditorChange = (content: string, _editor: any) => {
    if (onChange) {
      onChange(content);
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  // Auto-save function
  const handleAutoSave = (editor: any) => {
    const currentContent = editor.getContent();

    if (currentContent !== lastSavedRef.current) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(autosaveKey, currentContent);
        lastSavedRef.current = currentContent;
        console.log("Content auto-saved at", new Date().toLocaleTimeString());

        // Show notification in editor
        if (editor.notificationManager) {
          editor.notificationManager.open({
            text: "Content auto-saved",
            type: "info",
            timeout: 2000,
          });
        }
      }, autosaveInterval);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full mb-4" {...rest}>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={handleInit}
        value={value}
        onEditorChange={handleEditorChange}
        onBlur={handleBlur}
        init={{
          height: 600,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "visualchars",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "preview",
            "table",
            "help",
            "wordcount",
            "emoticons",
            "autosave",
            "autoresize",
            "codesample",
            "directionality",
            "nonbreaking",
            "pagebreak",
            "save", // Keep this for manual save
            "accordion",
            "importcss",
          ],
          toolbar:
            "undo redo | " +
            "blocks |formatselect | " +
            "bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | " +
            "forecolor backcolor | " +
            "link image media youtube quickemojis | " +
            "table codesample | " +
            "ltr rtl | " +
            "fullscreen preview restoredraft save",

          // Format options
          block_formats:
            "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre",

          // Style formats (includes font controls)
          style_formats: [
            {
              title: "Typography",
              items: [
                { title: "Title", format: "h1" },
                { title: "Subtitle", format: "h2" },
                { title: "Heading 3", format: "h3" },
                { title: "Heading 4", format: "h4" },
                { title: "Paragraph", format: "p" },
              ],
            },
            {
              title: "Font Size",
              items: [
                {
                  title: "Small",
                  inline: "span",
                  styles: { fontSize: "12px" },
                },
                {
                  title: "Normal",
                  inline: "span",
                  styles: { fontSize: "14px" },
                },
                {
                  title: "Large",
                  inline: "span",
                  styles: { fontSize: "18px" },
                },
                { title: "Huge", inline: "span", styles: { fontSize: "24px" } },
              ],
            },
            {
              title: "Font Family",
              items: [
                {
                  title: "Arial",
                  inline: "span",
                  styles: { fontFamily: "Arial, Helvetica, sans-serif" },
                },
                {
                  title: "Times New Roman",
                  inline: "span",
                  styles: { fontFamily: "Times New Roman, Times, serif" },
                },
                {
                  title: "Courier New",
                  inline: "span",
                  styles: { fontFamily: "Courier New, Courier, monospace" },
                },
                {
                  title: "Georgia",
                  inline: "span",
                  styles: { fontFamily: "Georgia, serif" },
                },
                {
                  title: "Verdana",
                  inline: "span",
                  styles: { fontFamily: "Verdana, Geneva, sans-serif" },
                },
              ],
            },
            {
              title: "Custom",
              items: [
                {
                  title: "Red text",
                  inline: "span",
                  styles: { color: "#ff0000" },
                },
                {
                  title: "Blue text",
                  inline: "span",
                  styles: { color: "#0000ff" },
                },
                {
                  title: "Green text",
                  inline: "span",
                  styles: { color: "#00ff00" },
                },
                {
                  title: "Code",
                  inline: "code",
                  styles: { fontFamily: "monospace" },
                },
                { title: "Keyboard", inline: "kbd" },
                { title: "Sample", inline: "samp" },
              ],
            },
          ],

          // Default font settings
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
            
            body { 
              font-family: Arial, Helvetica, sans-serif, "Noto Color Emoji"; 
              font-size: 14px; 
              line-height: 1.6;
            }
            h1, h2, h3, h4, h5, h6 { 
              font-family: 'Times New Roman', Times, serif, "Noto Color Emoji"; 
            }
            
            /* Emoji styling */
            .emoji {
              font-family: "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", 
                          "Segoe UI Symbol", "Android Emoji", "Twemoji Mozilla", sans-serif;
              font-size: 1.2em;
              vertical-align: middle;
            }
            
            /* Video preview styling */
            .mce-preview-object {
              border: 1px solid #666;
              background: #f0f0f0;
              padding: 10px;
              margin: 10px 0;
              border-radius: 4px;
              position: relative;
            }
            
            .mce-preview-object iframe {
              display: block;
            }
            
            .mce-preview-object .mce-shim {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="%23999" d="M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0zm-6 46V18l20 14-20 14z"/></svg>') no-repeat center center;
              background-size: 50px 50px;
              cursor: pointer;
            }
            
            /* Code sample styling */
            pre {
              background: #f4f4f4;
              border: 1px solid #ddd;
              border-left: 3px solid #f36d33;
              color: #666;
              page-break-inside: avoid;
              font-family: monospace;
              font-size: 13px;
              line-height: 1.6;
              margin-bottom: 1.6em;
              max-width: 100%;
              overflow: auto;
              padding: 1em 1.5em;
              display: block;
              word-wrap: break-word;
            }
            
            code {
              background: #f4f4f4;
              border-radius: 3px;
              font-family: monospace;
              padding: 2px 4px;
            }
          `,

          // Auto-save configuration
          autosave_prefix: autosaveKey + "_",
          autosave_restore_when_empty: false,
          autosave_interval: autosaveInterval / 1000 + "s",
          autosave_retention: "1440m",

          // Media/Video settings
          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image media",
          extended_valid_elements:
            "iframe[src|frameborder|allowfullscreen|allow|width|height|scrolling|style]",
          media_live_embeds: true,
          media_dimensions: false,
          media_alt_source: false,
          media_poster: true,
          media_filter_html: false,

          // Media embed patterns
          media_patterns: [
            {
              regex: /youtube\.com\/watch\?v=([\w-]+)/,
              type: "iframe",
              w: 560,
              h: 314,
            },
            { regex: /youtu\.be\/([\w-]+)/, type: "iframe", w: 560, h: 314 },
            { regex: /vimeo\.com\/(\d+)/, type: "iframe", w: 560, h: 314 },
          ],

          // Custom media embed handler
          media_embed_handler: (data: any) => {
            let html: string = "";

            // YouTube
            if (
              data.url.indexOf("youtube.com") > -1 ||
              data.url.indexOf("youtu.be") > -1
            ) {
              const videoId = data.url.match(
                /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
              );
              if (videoId) {
                html =
                  '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">' +
                  '<iframe src="https://www.youtube.com/embed/' +
                  videoId[1] +
                  '" ' +
                  'frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">' +
                  "</iframe></div>";
              }
            }

            // Vimeo
            else if (data.url.indexOf("vimeo.com") > -1) {
              const videoId = data.url.match(/vimeo.com\/(\d+)/);
              if (videoId) {
                html =
                  '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">' +
                  '<iframe src="https://player.vimeo.com/video/' +
                  videoId[1] +
                  '" ' +
                  'frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">' +
                  "</iframe></div>";
              }
            }

            return html;
          },

          // Emoticons configuration
          emoticons_database: "emojis",
          emoticons_append: {
            custom_mind_blown: {
              keywords: ["mindblown", "mind blown", "explode"],
              char: "🤯",
            },
          },

          // Codesample configuration
          codesample_languages: [
            { text: "HTML/XML", value: "markup" },
            { text: "JavaScript", value: "javascript" },
            { text: "CSS", value: "css" },
            { text: "PHP", value: "php" },
            { text: "Ruby", value: "ruby" },
            { text: "Python", value: "python" },
            { text: "Java", value: "java" },
            { text: "C", value: "c" },
            { text: "C#", value: "csharp" },
            { text: "C++", value: "cpp" },
          ],

          // Quickbars configuration
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote",
          quickbars_insert_toolbar: "quickimage quicktable",
          quickbars_image_toolbar: "alignleft aligncenter alignright",

          // Preview settings
          preview_styles:
            "font-family font-size font-weight text-decoration text-transform color background-color",

          // Enable all iframe attributes
          valid_children: "+body[iframe]",
          valid_elements: "*[*]",

          // Enable responsive iframes
          iframe_attrs: {
            allowfullscreen: "true",
            frameborder: "0",
            sandbox:
              "allow-same-origin allow-scripts allow-popups allow-presentation",
          },

          // Setup for additional functionality
          setup: (editor: any) => {
            // Add custom font size buttons
            editor.ui.registry.addButton("fontsizecustom", {
              type: "menubutton",
              icon: "text-size",
              tooltip: "Font size",
              fetch: (callback: any) => {
                const items = [
                  {
                    type: "menuitem",
                    text: "8px",
                    onAction: () => {
                      editor.formatter.apply("fontsize", { value: "8px" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "10px",
                    onAction: () => {
                      editor.formatter.apply("fontsize", { value: "10px" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "12px",
                    onAction: () => {
                      editor.formatter.apply("fontsize", { value: "12px" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "14px",
                    onAction: () => {
                      editor.formatter.apply("fontsize", { value: "14px" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "16px",
                    onAction: () => {
                      editor.formatter.apply("fontsize", { value: "16px" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "18px",
                    onAction: () => {
                      editor.formatter.apply("fontsize", { value: "18px" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "24px",
                    onAction: () => {
                      editor.formatter.apply("fontsize", { value: "24px" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "32px",
                    onAction: () => {
                      editor.formatter.apply("fontsize", { value: "32px" });
                    },
                  },
                ];
                callback(items);
              },
            });

            // Add custom font family buttons
            editor.ui.registry.addButton("fontfamilycustom", {
              type: "menubutton",
              icon: "font",
              tooltip: "Font family",
              fetch: (callback: (items: any[]) => void) => {
                const items = [
                  {
                    type: "menuitem",
                    text: "Arial",
                    onAction: () => {
                      editor.formatter.apply("fontname", { value: "Arial" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "Times New Roman",
                    onAction: () => {
                      editor.formatter.apply("fontname", {
                        value: "Times New Roman",
                      });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "Courier New",
                    onAction: () => {
                      editor.formatter.apply("fontname", {
                        value: "Courier New",
                      });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "Georgia",
                    onAction: () => {
                      editor.formatter.apply("fontname", { value: "Georgia" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "Verdana",
                    onAction: () => {
                      editor.formatter.apply("fontname", { value: "Verdana" });
                    },
                  },
                  {
                    type: "menuitem",
                    text: "Tahoma",
                    onAction: () => {
                      editor.formatter.apply("fontname", { value: "Tahoma" });
                    },
                  },
                ];
                callback(items);
              },
            });

            // Add restore draft button
            editor.ui.registry.addButton("restoredraft", {
              text: "Restore Draft",
              tooltip: "Restore auto-saved draft",
              onAction: () => {
                const savedContent = localStorage.getItem(autosaveKey);
                if (savedContent) {
                  editor.setContent(savedContent);
                  editor.notificationManager.open({
                    text: "Draft restored",
                    type: "success",
                    timeout: 3000,
                  });
                } else {
                  editor.notificationManager.open({
                    text: "No saved draft found",
                    type: "error",
                    timeout: 3000,
                  });
                }
              },
            });

            // Add custom emoji toolbar button
            editor.ui.registry.addButton("quickemojis", {
              text: "😀",
              tooltip: "Insert emoji",
              onAction: () => {
                editor.windowManager.open({
                  title: "Insert Emoji",
                  body: {
                    type: "panel",
                    items: [
                      {
                        type: "htmlpanel",
                        html:
                          '<div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; max-height: 300px; overflow-y: auto;">' +
                          [
                            "😀",
                            "😃",
                            "😄",
                            "😁",
                            "😆",
                            "😅",
                            "😂",
                            "🙂",
                            "😉",
                            "😊",
                            "😇",
                            "🥰",
                            "😍",
                            "🤩",
                            "😘",
                            "😗",
                            "😚",
                            "😙",
                            "😋",
                            "😛",
                            "😜",
                            "🤪",
                            "😝",
                            "🤑",
                            "🤗",
                            "🤭",
                            "🤫",
                            "🤔",
                            "🤨",
                            "😐",
                            "😑",
                            "😶",
                            "😏",
                            "😒",
                            "🙄",
                            "😬",
                            "🤥",
                            "😌",
                            "😔",
                            "😪",
                            "🤤",
                            "😴",
                            "😷",
                            "🤒",
                            "🤕",
                            "🤢",
                            "🤮",
                            "🤧",
                            "🥵",
                            "🥶",
                            "🥴",
                            "😵",
                            "🤯",
                            "🤠",
                            "🥳",
                            "😎",
                            "🤓",
                            "🧐",
                            "❤️",
                            "💔",
                            "👍",
                            "👎",
                            "👏",
                            "🙌",
                            "👋",
                            "🤝",
                            "✌️",
                            "🤞",
                            "🤟",
                            "🤘",
                            "👌",
                            "👈",
                            "👉",
                            "👆",
                            "👇",
                            "✋",
                            "🤚",
                            "🖐️",
                            "🖖",
                            "👊",
                            "✊",
                            "🤛",
                            "🤜",
                          ]
                            .map(
                              (emoji) =>
                                `<button type="button" style="font-size: 1.5em; padding: 5px; background: transparent; border: none; cursor: pointer;" onclick="parent.tinymce.activeEditor.insertContent('${emoji}'); parent.tinymce.activeEditor.windowManager.close();">${emoji}</button>`,
                            )
                            .join("") +
                          "</div>",
                      },
                    ],
                  },
                  buttons: [
                    {
                      type: "cancel",
                      text: "Close",
                    },
                  ],
                });
              },
            });

            // Add emoji quick insert on colon type
            editor.on("keyup", (e: any) => {
              if (e.key === ":" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                // Could trigger emoji picker here
              }
            });
          },

          ...init,
          skin: "oxide-dark",
          content_css: "dark",
          branding: false,
          promotion: false,
        }}
      />
    </div>
  );
};

export { TinyEditorRHF };
