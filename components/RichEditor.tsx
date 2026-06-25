"use client";
import React, { useRef } from "react";

// a contentEditable rich-text editor.
// the key fix: we remember the last selection range inside the editor,
// and restore it before running execCommand — otherwise clicking a
// toolbar button collapses the selection and formatBlock/list silently no-op.
export interface RichEditorHandle {
  format: (cmd: "bold" | "italic" | "quote" | "bullet") => void;
  clear: () => void;
}

export const RichEditor = React.forwardRef<RichEditorHandle, {
  html: string;
  onChange: (html: string) => void;
  editable: boolean;
  placeholder: string;
  style: React.CSSProperties;
  className?: string;
}>(function RichEditor({ html, onChange, editable, placeholder, style, className }, ref) {
  const el = useRef<HTMLDivElement>(null);
  const saved = useRef<Range | null>(null);

  // remember caret/selection whenever it changes inside the editor
  const remember = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && el.current?.contains(sel.anchorNode)) {
      saved.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restore = () => {
    el.current?.focus();
    const sel = window.getSelection();
    if (saved.current && sel) { sel.removeAllRanges(); sel.addRange(saved.current); }
  };

  const run = (cmd: string, val?: string) => {
    restore();
    document.execCommand(cmd, false, val);
    if (el.current) onChange(el.current.innerHTML);
    remember();
  };

  // is the caret currently inside a <blockquote>?
  const inBlockquote = (): boolean => {
    let n = window.getSelection()?.anchorNode as Node | null;
    while (n && n !== el.current) {
      if ((n as HTMLElement).nodeName === "BLOCKQUOTE") return true;
      n = n.parentNode;
    }
    return false;
  };

  React.useImperativeHandle(ref, () => ({
    format: (cmd) => {
      if (cmd === "bold") run("bold");
      else if (cmd === "italic") run("italic");
      else if (cmd === "quote") {
        restore();
        // toggle: if already a quote, turn it back into a normal paragraph
        document.execCommand("formatBlock", false, inBlockquote() ? "<div>" : "<blockquote>");
        if (el.current) onChange(el.current.innerHTML);
        remember();
      }
      else if (cmd === "bullet") run("insertUnorderedList");
    },
    clear: () => {
      if (el.current) { el.current.innerHTML = ""; onChange(""); el.current.focus(); }
    },
  }));

  // keep DOM in sync when html is set externally (e.g. reset)
  React.useEffect(() => {
    if (el.current && el.current.innerHTML !== html) el.current.innerHTML = html;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html === "" ]); // only force-sync on clear

  return (
    <div
      ref={el}
      className={"ll-editor" + (className ? " " + className : "")}
      contentEditable={editable}
      suppressContentEditableWarning
      data-ph={placeholder}
      onInput={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
      onKeyUp={remember}
      onMouseUp={remember}
      style={style}
    />
  );
});
