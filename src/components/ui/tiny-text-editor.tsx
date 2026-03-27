import { Editor } from "@tinymce/tinymce-react";
import type React from "react";
import { useEffect, useRef } from "react";

type TinyEditorProps = {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  init?: any;
  onBlur?: () => void;
  name?: string;
  autosaveKey?: string;
  autosaveInterval?: number;
} & Omit<React.ComponentProps<"div">, "ref">;

// ─── Tailwind font tokens (synced with tailwind.config.ts) ───────────────────

const PROJECT_FONTS = {
  montserrat: "Montserrat, sans-serif",
  varela: "'Varela Round', sans-serif",
  quicksand: "Quicksand, sans-serif",
  mono: "'Courier New', monospace",
};

const PROJECT_FONT_SIZES = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
  "4xl": "36px",
  "5xl": "48px",
  "6xl": "60px",
};

// TinyMCE dropdown format strings built from tokens above
const FONT_FAMILY_FORMATS =
  `Montserrat=${PROJECT_FONTS.montserrat}; ` +
  `Varela Round=${PROJECT_FONTS.varela}; ` +
  `Quicksand=${PROJECT_FONTS.quicksand}`;

const FONT_SIZE_FORMATS = Object.entries(PROJECT_FONT_SIZES)
  .map(([label, size]) => `${label} (${size})=${size}`)
  .join(" ");
// → "xs (12px)=12px  sm (14px)=14px  base (16px)=16px ..."

// ─────────────────────────────────────────────────────────────────────────────

const TinyEditorRHF = ({
  id,
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

    const savedContent = localStorage.getItem(autosaveKey);
    if (savedContent && savedContent !== value) {
      console.log("Auto-saved content found");
    }

    editor.on("keyup", () => handleAutoSave(editor));
    editor.on("change", () => handleAutoSave(editor));

    // YouTube button
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
            { type: "cancel", text: "Cancel" },
            { type: "submit", text: "Insert", buttonType: "primary" },
          ],
          onSubmit: (api: any) => {
            const { url } = api.getData();
            let videoId = "";

            if (url.includes("youtube.com/watch?v=")) {
              videoId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
              videoId = url.split("youtu.be/")[1].split("?")[0];
            }

            if (videoId) {
              editor.insertContent(
                `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
              );
              api.close();
            } else {
              alert("Please enter a valid YouTube URL");
            }
          },
        });
      },
    });
  };

  const handleEditorChange = (content: string) => {
    if (onChange) onChange(content);
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
  };

  const handleAutoSave = (editor: any) => {
    const currentContent = editor.getContent();

    if (currentContent !== lastSavedRef.current) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(autosaveKey, currentContent);
        lastSavedRef.current = currentContent;
        console.log("Content auto-saved at", new Date().toLocaleTimeString());

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

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return (
    <div {...rest}>
      <Editor
        id={id}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={handleInit}
        value={value}
        onEditorChange={handleEditorChange}
        onBlur={handleBlur}
        init={{
          height: 600,
          entity_encoding: "raw",
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
            "save",
            "accordion",
            "importcss",
          ],

          // ── Toolbar ──────────────────────────────────────────────────────
          toolbar:
            "undo redo | " +
            "blocks | " +
            "bold italic underline strikethrough | " +
            "fontfamily fontsize | " + // ✅ project fonts dropdown
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | " +
            "forecolor backcolor | " +
            "link image media youtube quickemojis | " +
            "table codesample | " +
            "ltr rtl | " +
            "fullscreen preview restoredraft save",

          // ── Font family — only project fonts ─────────────────────────────
          font_family_formats: FONT_FAMILY_FORMATS,
          // → "Montserrat=Montserrat,sans-serif; Varela Round=...; Quicksand=..."

          // ── Font sizes — synced with Tailwind tokens ──────────────────────
          fontsize_formats: FONT_SIZE_FORMATS,
          // → "xs (12px)=12px  sm (14px)=14px  base (16px)=16px ..."

          // ── Block formats ─────────────────────────────────────────────────
          block_formats:
            "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; " +
            "Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre",

          // ── Editor body styles (matches your Next.js frontend) ────────────
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Varela+Round&family=Quicksand:wght@400;500;600;700&display=swap');

            body {
              font-family: ${PROJECT_FONTS.montserrat};
              font-size: ${PROJECT_FONT_SIZES.base};
              line-height: 1.6;
              color: #111827;
            }

            /* Headings */
            h1 { font-size: ${PROJECT_FONT_SIZES["4xl"]}; font-weight: 700; line-height: 1.2; margin: 0.67em 0; }
            h2 { font-size: ${PROJECT_FONT_SIZES["3xl"]}; font-weight: 700; line-height: 1.3; margin: 0.75em 0; }
            h3 { font-size: ${PROJECT_FONT_SIZES["2xl"]}; font-weight: 600; line-height: 1.4; margin: 0.83em 0; }
            h4 { font-size: ${PROJECT_FONT_SIZES.xl};     font-weight: 600; line-height: 1.4; margin: 1em 0; }
            h5 { font-size: ${PROJECT_FONT_SIZES.lg};     font-weight: 500; margin: 1em 0; }
            h6 { font-size: ${PROJECT_FONT_SIZES.base};   font-weight: 500; margin: 1em 0; }

            /* Paragraphs & lists */
            p  { margin: 1em 0; }
            ul { list-style: disc;    padding-left: 2em; margin: 1em 0; }
            ol { list-style: decimal; padding-left: 2em; margin: 1em 0; }
            li { margin: 0.25em 0; }

            /* Links */
            a { color: #2563eb; text-decoration: underline; }

            /* Code */
            pre {
              background: #f4f4f4;
              border: 1px solid #ddd;
              border-left: 3px solid #f36d33;
              color: #444;
              font-family: ${PROJECT_FONTS.mono};
              font-size: ${PROJECT_FONT_SIZES.sm};
              line-height: 1.6;
              margin-bottom: 1.6em;
              overflow: auto;
              padding: 1em 1.5em;
              display: block;
              word-wrap: break-word;
            }
            code {
              background: #f4f4f4;
              border-radius: 3px;
              font-family: ${PROJECT_FONTS.mono};
              font-size: ${PROJECT_FONT_SIZES.sm};
              padding: 2px 4px;
            }

            /* Blockquote */
            blockquote {
              border-left: 4px solid #e5e7eb;
              padding-left: 1em;
              color: #6b7280;
              margin: 1em 0;
              font-style: italic;
            }

            /* Table */
            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            th, td { border: 1px solid #d1d5db; padding: 0.5em 1em; text-align: left; }
            th { background: #f9fafb; font-weight: 600; }

            /* Emoji */
            .emoji {
              font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
              font-size: 1.2em;
              vertical-align: middle;
            }

            /* Video preview */
            .mce-preview-object {
              border: 1px solid #666;
              background: #f0f0f0;
              padding: 10px;
              margin: 10px 0;
              border-radius: 4px;
              position: relative;
            }
            .mce-preview-object iframe { display: block; }
            .mce-preview-object .mce-shim {
              position: absolute; top: 0; left: 0;
              width: 100%; height: 100%;
              background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="%23999" d="M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0zm-6 46V18l20 14-20 14z"/></svg>') no-repeat center center;
              background-size: 50px 50px;
              cursor: pointer;
            }
          `,

          // ── Auto-save ─────────────────────────────────────────────────────
          autosave_prefix: autosaveKey + "_",
          autosave_restore_when_empty: false,
          autosave_interval: autosaveInterval / 1000 + "s",
          autosave_retention: "1440m",

          // ── Media / Video ─────────────────────────────────────────────────
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
          media_embed_handler: (data: any) => {
            let html = "";
            const wrapIframe = (src: string) =>
              `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;">` +
              `<iframe src="${src}" frameborder="0" allowfullscreen ` +
              `style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>`;

            if (
              data.url.includes("youtube.com") ||
              data.url.includes("youtu.be")
            ) {
              const m = data.url.match(
                /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
              );
              if (m) html = wrapIframe(`https://www.youtube.com/embed/${m[1]}`);
            } else if (data.url.includes("vimeo.com")) {
              const m = data.url.match(/vimeo\.com\/(\d+)/);
              if (m)
                html = wrapIframe(`https://player.vimeo.com/video/${m[1]}`);
            }
            return html;
          },

          // ── Emoticons ─────────────────────────────────────────────────────
          emoticons_database: "emojis",
          emoticons_append: {
            custom_mind_blown: {
              keywords: ["mindblown", "mind blown"],
              char: "🤯",
            },
          },

          // ── Code sample languages ─────────────────────────────────────────
          codesample_languages: [
            { text: "HTML/XML", value: "markup" },
            { text: "JavaScript", value: "javascript" },
            { text: "TypeScript", value: "typescript" },
            { text: "CSS", value: "css" },
            { text: "PHP", value: "php" },
            { text: "Python", value: "python" },
            { text: "Ruby", value: "ruby" },
            { text: "Java", value: "java" },
            { text: "C", value: "c" },
            { text: "C#", value: "csharp" },
            { text: "C++", value: "cpp" },
          ],

          // ── Quickbars ─────────────────────────────────────────────────────
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote",
          quickbars_insert_toolbar: "quickimage quicktable",
          quickbars_image_toolbar: "alignleft aligncenter alignright",

          // ── Misc ──────────────────────────────────────────────────────────
          preview_styles:
            "font-family font-size font-weight text-decoration text-transform color background-color",
          valid_children: "+body[iframe]",
          valid_elements: "*[*]",
          iframe_attrs: {
            allowfullscreen: "true",
            frameborder: "0",
            sandbox:
              "allow-same-origin allow-scripts allow-popups allow-presentation",
          },

          // ── Setup: only custom buttons (fontsizecustom/fontfamilycustom removed) ──
          setup: (editor: any) => {
            // Restore draft button
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

            // Quick emoji picker button
            editor.ui.registry.addButton("quickemojis", {
              text: "😀",
              tooltip: "Insert emoji",
              onAction: () => {
                const emojis = [
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
                ];

                editor.windowManager.open({
                  title: "Insert Emoji",
                  body: {
                    type: "panel",
                    items: [
                      {
                        type: "htmlpanel",
                        html:
                          '<div style="display:grid;grid-template-columns:repeat(8,1fr);gap:5px;max-height:300px;overflow-y:auto;">' +
                          emojis
                            .map(
                              (e) =>
                                `<button type="button" style="font-size:1.5em;padding:5px;background:transparent;border:none;cursor:pointer;" ` +
                                `onclick="parent.tinymce.activeEditor.insertContent('${e}');parent.tinymce.activeEditor.windowManager.close();">${e}</button>`,
                            )
                            .join("") +
                          "</div>",
                      },
                    ],
                  },
                  buttons: [{ type: "cancel", text: "Close" }],
                });
              },
            });
          },

          ...init,
          branding: false,
          promotion: false,
        }}
      />
    </div>
  );
};

export { TinyEditorRHF };

/**
 * previously used
 */
// import { Editor } from "@tinymce/tinymce-react";
// import type React from "react";
// import { useEffect, useRef } from "react";

// type TinyEditorProps = {
//   id?: string;
//   value: string;
//   onChange: (v: string) => void;
//   init?: any;
//   onBlur?: () => void;
//   name?: string;
//   autosaveKey?: string;
//   autosaveInterval?: number;
// } & Omit<React.ComponentProps<"div">, "ref">;

// const TinyEditorRHF = ({
//   id,
//   value,
//   onChange,
//   init = {},
//   onBlur,
//   name,
//   autosaveKey = "tinymce-autosave",
//   autosaveInterval = 30000,
//   ...rest
// }: TinyEditorProps) => {
//   const editorRef = useRef<any>(null);
//   const lastSavedRef = useRef<string>("");
//   const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

//   const handleInit = (_evt: any, editor: any) => {
//     editorRef.current = editor;

//     // Load auto-saved content if exists
//     const savedContent = localStorage.getItem(autosaveKey);
//     if (savedContent && savedContent !== value) {
//       console.log("Auto-saved content found");
//     }

//     // Setup auto-save
//     editor.on("keyup", () => {
//       handleAutoSave(editor);
//     });

//     editor.on("change", () => {
//       handleAutoSave(editor);
//     });

//     // Add custom YouTube button
//     editor.ui.registry.addButton("youtube", {
//       text: "YouTube",
//       icon: "embed",
//       onAction: () => {
//         editor.windowManager.open({
//           title: "Insert YouTube Video",
//           body: {
//             type: "panel",
//             items: [
//               {
//                 type: "input",
//                 name: "url",
//                 label: "YouTube URL",
//                 placeholder: "https://www.youtube.com/watch?v=...",
//               },
//             ],
//           },
//           buttons: [
//             {
//               type: "cancel",
//               text: "Cancel",
//             },
//             {
//               type: "submit",
//               text: "Insert",
//               buttonType: "primary",
//             },
//           ],
//           onSubmit: (api: any) => {
//             const data = api.getData();
//             const url = data.url;
//             let videoId = "";

//             // Extract video ID from URL
//             if (url.includes("youtube.com/watch?v=")) {
//               videoId = url.split("v=")[1].split("&")[0];
//             } else if (url.includes("youtu.be/")) {
//               videoId = url.split("youtu.be/")[1].split("?")[0];
//             }

//             if (videoId) {
//               const embedCode =
//                 '<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
//                 videoId +
//                 '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
//               editor.insertContent(embedCode);
//               api.close();
//             } else {
//               alert("Please enter a valid YouTube URL");
//             }
//           },
//         });
//       },
//     });
//   };

//   const handleEditorChange = (content: string, _editor: any) => {
//     if (onChange) {
//       onChange(content);
//     }
//   };

//   const handleBlur = () => {
//     if (onBlur) {
//       onBlur();
//     }
//   };

//   // Auto-save function
//   const handleAutoSave = (editor: any) => {
//     const currentContent = editor.getContent();

//     if (currentContent !== lastSavedRef.current) {
//       if (saveTimeoutRef.current) {
//         clearTimeout(saveTimeoutRef.current);
//       }

//       saveTimeoutRef.current = setTimeout(() => {
//         localStorage.setItem(autosaveKey, currentContent);
//         lastSavedRef.current = currentContent;
//         console.log("Content auto-saved at", new Date().toLocaleTimeString());

//         // Show notification in editor
//         if (editor.notificationManager) {
//           editor.notificationManager.open({
//             text: "Content auto-saved",
//             type: "info",
//             timeout: 2000,
//           });
//         }
//       }, autosaveInterval);
//     }
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (saveTimeoutRef.current) {
//         clearTimeout(saveTimeoutRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div {...rest}>
//       <Editor
//         id={id}
//         tinymceScriptSrc="/tinymce/tinymce.min.js"
//         licenseKey="gpl"
//         onInit={handleInit}
//         value={value}
//         onEditorChange={handleEditorChange}
//         onBlur={handleBlur}
//         init={{
//           height: 600,
//           entity_encoding: "raw",
//           menubar: false,
//           plugins: [
//             "advlist",
//             "autolink",
//             "lists",
//             "link",
//             "image",
//             "charmap",
//             "anchor",
//             "searchreplace",
//             "visualblocks",
//             "visualchars",
//             "code",
//             "fullscreen",
//             "insertdatetime",
//             "media",
//             "preview",
//             "table",
//             "help",
//             "wordcount",
//             "emoticons",
//             "autosave",
//             "autoresize",
//             "codesample",
//             "directionality",
//             "nonbreaking",
//             "pagebreak",
//             "save", // Keep this for manual save
//             "accordion",
//             "importcss",
//           ],
//           toolbar:
//             "undo redo | " +
//             "blocks |formatselect | " +
//             "bold italic underline strikethrough | " +
//             "fontsize fontfamily | " +
//             "alignleft aligncenter alignright alignjustify | " +
//             "bullist numlist outdent indent | " +
//             "forecolor backcolor | " +
//             "link image media youtube quickemojis | " +
//             "table codesample | " +
//             "ltr rtl | " +
//             "fullscreen preview restoredraft save",

//           // Format options
//           block_formats:
//             "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre",

//           // Style formats (includes font controls)
//           style_formats: [
//             {
//               title: "Typography",
//               items: [
//                 { title: "Title", format: "h1" },
//                 { title: "Subtitle", format: "h2" },
//                 { title: "Heading 3", format: "h3" },
//                 { title: "Heading 4", format: "h4" },
//                 { title: "Paragraph", format: "p" },
//               ],
//             },
//             {
//               title: "Font Size",
//               items: [
//                 {
//                   title: "Small",
//                   inline: "span",
//                   styles: { fontSize: "12px" },
//                 },
//                 {
//                   title: "Normal",
//                   inline: "span",
//                   styles: { fontSize: "14px" },
//                 },
//                 {
//                   title: "Large",
//                   inline: "span",
//                   styles: { fontSize: "18px" },
//                 },
//                 { title: "Huge", inline: "span", styles: { fontSize: "24px" } },
//               ],
//             },
//             {
//               title: "Font Family",
//               items: [
//                 {
//                   title: "Arial",
//                   inline: "span",
//                   styles: { fontFamily: "Arial, Helvetica, sans-serif" },
//                 },
//                 {
//                   title: "Times New Roman",
//                   inline: "span",
//                   styles: { fontFamily: "Times New Roman, Times, serif" },
//                 },
//                 {
//                   title: "Courier New",
//                   inline: "span",
//                   styles: { fontFamily: "Courier New, Courier, monospace" },
//                 },
//                 {
//                   title: "Georgia",
//                   inline: "span",
//                   styles: { fontFamily: "Georgia, serif" },
//                 },
//                 {
//                   title: "Verdana",
//                   inline: "span",
//                   styles: { fontFamily: "Verdana, Geneva, sans-serif" },
//                 },
//               ],
//             },
//             {
//               title: "Custom",
//               items: [
//                 {
//                   title: "Red text",
//                   inline: "span",
//                   styles: { color: "#ff0000" },
//                 },
//                 {
//                   title: "Blue text",
//                   inline: "span",
//                   styles: { color: "#0000ff" },
//                 },
//                 {
//                   title: "Green text",
//                   inline: "span",
//                   styles: { color: "#00ff00" },
//                 },
//                 {
//                   title: "Code",
//                   inline: "code",
//                   styles: { fontFamily: "monospace" },
//                 },
//                 { title: "Keyboard", inline: "kbd" },
//                 { title: "Sample", inline: "samp" },
//               ],
//             },
//           ],

//           // Default font settings
//           content_style: `
//           @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Varela+Round&family=Quicksand:wght@400;500;600;700&display=swap');

//           body {
//             font-family: Montserrat, sans-serif;  /* your project's default font */
//             font-size: 16px;
//             line-height: 1.6;
//           }

//           h1, h2, h3, h4, h5, h6 {
//              font-family: Montserrat, sans-serif;
//              font-weight: 700;
//            }

//             /* Emoji styling */
//             .emoji {
//               font-family: "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji",
//                           "Segoe UI Symbol", "Android Emoji", "Twemoji Mozilla", sans-serif;
//               font-size: 1.2em;
//               vertical-align: middle;
//             }

//             /* Video preview styling */
//             .mce-preview-object {
//               border: 1px solid #666;
//               background: #f0f0f0;
//               padding: 10px;
//               margin: 10px 0;
//               border-radius: 4px;
//               position: relative;
//             }

//             .mce-preview-object iframe {
//               display: block;
//             }

//             .mce-preview-object .mce-shim {
//               position: absolute;
//               top: 0;
//               left: 0;
//               width: 100%;
//               height: 100%;
//               background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="%23999" d="M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0zm-6 46V18l20 14-20 14z"/></svg>') no-repeat center center;
//               background-size: 50px 50px;
//               cursor: pointer;
//             }

//             /* Code sample styling */
//             pre {
//               background: #f4f4f4;
//               border: 1px solid #ddd;
//               border-left: 3px solid #f36d33;
//               color: #666;
//               page-break-inside: avoid;
//               font-family: monospace;
//               font-size: 13px;
//               line-height: 1.6;
//               margin-bottom: 1.6em;
//               max-width: 100%;
//               overflow: auto;
//               padding: 1em 1.5em;
//               display: block;
//               word-wrap: break-word;
//             }

//             code {
//               background: #f4f4f4;
//               border-radius: 3px;
//               font-family: monospace;
//               padding: 2px 4px;
//             }
//             pre, code {

//                 font-size: 14px;
//               }
//           `,

//           // Auto-save configuration
//           autosave_prefix: autosaveKey + "_",
//           autosave_restore_when_empty: false,
//           autosave_interval: autosaveInterval / 1000 + "s",
//           autosave_retention: "1440m",

//           // Media/Video settings
//           image_title: true,
//           automatic_uploads: true,
//           file_picker_types: "image media",
//           extended_valid_elements:
//             "iframe[src|frameborder|allowfullscreen|allow|width|height|scrolling|style]",
//           media_live_embeds: true,
//           media_dimensions: false,
//           media_alt_source: false,
//           media_poster: true,
//           media_filter_html: false,

//           // Media embed patterns
//           media_patterns: [
//             {
//               regex: /youtube\.com\/watch\?v=([\w-]+)/,
//               type: "iframe",
//               w: 560,
//               h: 314,
//             },
//             { regex: /youtu\.be\/([\w-]+)/, type: "iframe", w: 560, h: 314 },
//             { regex: /vimeo\.com\/(\d+)/, type: "iframe", w: 560, h: 314 },
//           ],

//           // Custom media embed handler
//           media_embed_handler: (data: any) => {
//             let html: string = "";

//             // YouTube
//             if (
//               data.url.indexOf("youtube.com") > -1 ||
//               data.url.indexOf("youtu.be") > -1
//             ) {
//               const videoId = data.url.match(
//                 /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
//               );
//               if (videoId) {
//                 html =
//                   '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">' +
//                   '<iframe src="https://www.youtube.com/embed/' +
//                   videoId[1] +
//                   '" ' +
//                   'frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">' +
//                   "</iframe></div>";
//               }
//             }

//             // Vimeo
//             else if (data.url.indexOf("vimeo.com") > -1) {
//               const videoId = data.url.match(/vimeo.com\/(\d+)/);
//               if (videoId) {
//                 html =
//                   '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">' +
//                   '<iframe src="https://player.vimeo.com/video/' +
//                   videoId[1] +
//                   '" ' +
//                   'frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">' +
//                   "</iframe></div>";
//               }
//             }

//             return html;
//           },

//           // Emoticons configuration
//           emoticons_database: "emojis",
//           emoticons_append: {
//             custom_mind_blown: {
//               keywords: ["mindblown", "mind blown", "explode"],
//               char: "🤯",
//             },
//           },

//           // Codesample configuration
//           codesample_languages: [
//             { text: "HTML/XML", value: "markup" },
//             { text: "JavaScript", value: "javascript" },
//             { text: "CSS", value: "css" },
//             { text: "PHP", value: "php" },
//             { text: "Ruby", value: "ruby" },
//             { text: "Python", value: "python" },
//             { text: "Java", value: "java" },
//             { text: "C", value: "c" },
//             { text: "C#", value: "csharp" },
//             { text: "C++", value: "cpp" },
//           ],

//           // Quickbars configuration
//           quickbars_selection_toolbar:
//             "bold italic | quicklink h2 h3 blockquote",
//           quickbars_insert_toolbar: "quickimage quicktable",
//           quickbars_image_toolbar: "alignleft aligncenter alignright",

//           // Preview settings
//           preview_styles:
//             "font-family font-size font-weight text-decoration text-transform color background-color",

//           // Enable all iframe attributes
//           valid_children: "+body[iframe]",
//           valid_elements: "*[*]",

//           // Enable responsive iframes
//           iframe_attrs: {
//             allowfullscreen: "true",
//             frameborder: "0",
//             sandbox:
//               "allow-same-origin allow-scripts allow-popups allow-presentation",
//           },

//           // Setup for additional functionality
//           setup: (editor: any) => {
//             // Add custom font size buttons
//             editor.ui.registry.addButton("fontsizecustom", {
//               type: "menubutton",
//               icon: "text-size",
//               tooltip: "Font size",
//               fetch: (callback: any) => {
//                 const items = [
//                   {
//                     type: "menuitem",
//                     text: "8px",
//                     onAction: () => {
//                       editor.formatter.apply("fontsize", { value: "8px" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "10px",
//                     onAction: () => {
//                       editor.formatter.apply("fontsize", { value: "10px" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "12px",
//                     onAction: () => {
//                       editor.formatter.apply("fontsize", { value: "12px" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "14px",
//                     onAction: () => {
//                       editor.formatter.apply("fontsize", { value: "14px" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "16px",
//                     onAction: () => {
//                       editor.formatter.apply("fontsize", { value: "16px" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "18px",
//                     onAction: () => {
//                       editor.formatter.apply("fontsize", { value: "18px" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "24px",
//                     onAction: () => {
//                       editor.formatter.apply("fontsize", { value: "24px" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "32px",
//                     onAction: () => {
//                       editor.formatter.apply("fontsize", { value: "32px" });
//                     },
//                   },
//                 ];
//                 callback(items);
//               },
//             });

//             // Add custom font family buttons
//             editor.ui.registry.addButton("fontfamilycustom", {
//               type: "menubutton",
//               icon: "font",
//               tooltip: "Font family",
//               fetch: (callback: (items: any[]) => void) => {
//                 const items = [
//                   {
//                     type: "menuitem",
//                     text: "Arial",
//                     onAction: () => {
//                       editor.formatter.apply("fontname", { value: "Arial" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "Times New Roman",
//                     onAction: () => {
//                       editor.formatter.apply("fontname", {
//                         value: "Times New Roman",
//                       });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "Courier New",
//                     onAction: () => {
//                       editor.formatter.apply("fontname", {
//                         value: "Courier New",
//                       });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "Georgia",
//                     onAction: () => {
//                       editor.formatter.apply("fontname", { value: "Georgia" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "Verdana",
//                     onAction: () => {
//                       editor.formatter.apply("fontname", { value: "Verdana" });
//                     },
//                   },
//                   {
//                     type: "menuitem",
//                     text: "Tahoma",
//                     onAction: () => {
//                       editor.formatter.apply("fontname", { value: "Tahoma" });
//                     },
//                   },
//                 ];
//                 callback(items);
//               },
//             });

//             // Add restore draft button
//             editor.ui.registry.addButton("restoredraft", {
//               text: "Restore Draft",
//               tooltip: "Restore auto-saved draft",
//               onAction: () => {
//                 const savedContent = localStorage.getItem(autosaveKey);
//                 if (savedContent) {
//                   editor.setContent(savedContent);
//                   editor.notificationManager.open({
//                     text: "Draft restored",
//                     type: "success",
//                     timeout: 3000,
//                   });
//                 } else {
//                   editor.notificationManager.open({
//                     text: "No saved draft found",
//                     type: "error",
//                     timeout: 3000,
//                   });
//                 }
//               },
//             });

//             // Add custom emoji toolbar button
//             editor.ui.registry.addButton("quickemojis", {
//               text: "😀",
//               tooltip: "Insert emoji",
//               onAction: () => {
//                 editor.windowManager.open({
//                   title: "Insert Emoji",
//                   body: {
//                     type: "panel",
//                     items: [
//                       {
//                         type: "htmlpanel",
//                         html:
//                           '<div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; max-height: 300px; overflow-y: auto;">' +
//                           [
//                             "😀",
//                             "😃",
//                             "😄",
//                             "😁",
//                             "😆",
//                             "😅",
//                             "😂",
//                             "🙂",
//                             "😉",
//                             "😊",
//                             "😇",
//                             "🥰",
//                             "😍",
//                             "🤩",
//                             "😘",
//                             "😗",
//                             "😚",
//                             "😙",
//                             "😋",
//                             "😛",
//                             "😜",
//                             "🤪",
//                             "😝",
//                             "🤑",
//                             "🤗",
//                             "🤭",
//                             "🤫",
//                             "🤔",
//                             "🤨",
//                             "😐",
//                             "😑",
//                             "😶",
//                             "😏",
//                             "😒",
//                             "🙄",
//                             "😬",
//                             "🤥",
//                             "😌",
//                             "😔",
//                             "😪",
//                             "🤤",
//                             "😴",
//                             "😷",
//                             "🤒",
//                             "🤕",
//                             "🤢",
//                             "🤮",
//                             "🤧",
//                             "🥵",
//                             "🥶",
//                             "🥴",
//                             "😵",
//                             "🤯",
//                             "🤠",
//                             "🥳",
//                             "😎",
//                             "🤓",
//                             "🧐",
//                             "❤️",
//                             "💔",
//                             "👍",
//                             "👎",
//                             "👏",
//                             "🙌",
//                             "👋",
//                             "🤝",
//                             "✌️",
//                             "🤞",
//                             "🤟",
//                             "🤘",
//                             "👌",
//                             "👈",
//                             "👉",
//                             "👆",
//                             "👇",
//                             "✋",
//                             "🤚",
//                             "🖐️",
//                             "🖖",
//                             "👊",
//                             "✊",
//                             "🤛",
//                             "🤜",
//                           ]
//                             .map(
//                               (emoji) =>
//                                 `<button type="button" style="font-size: 1.5em; padding: 5px; background: transparent; border: none; cursor: pointer;" onclick="parent.tinymce.activeEditor.insertContent('${emoji}'); parent.tinymce.activeEditor.windowManager.close();">${emoji}</button>`,
//                             )
//                             .join("") +
//                           "</div>",
//                       },
//                     ],
//                   },
//                   buttons: [
//                     {
//                       type: "cancel",
//                       text: "Close",
//                     },
//                   ],
//                 });
//               },
//             });

//             // Add emoji quick insert on colon type
//             editor.on("keyup", (e: any) => {
//               if (e.key === ":" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
//                 // Could trigger emoji picker here
//               }
//             });
//           },

//           ...init,
//           // skin: "oxide-dark",
//           // content_css: "light",
//           branding: false,
//           promotion: false,
//         }}
//       />
//     </div>
//   );
// };

// export { TinyEditorRHF };
