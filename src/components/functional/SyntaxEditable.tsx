// SyntaxEditable.tsx
import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  useCallback,
} from "react";

interface SyntaxEditableProps {
  code: string;
  onChange: (code: string) => void;
}

const SyntaxEditable: React.FC<SyntaxEditableProps> = ({ code, onChange }) => {
  const editableRef = useRef<HTMLDivElement | null>(null);
  const formatCode = (code: string): string => {
    const codePatterns: Record<
      string,
      (match: string, ...groups: string[]) => string
    > = {
      [`\\b(${Object.getOwnPropertyNames(Math).join("|")})\\b`]: (_, group) => {
        return `<span class="text-[#ff5555]">${group}</span>`;
      },
      "(\\(|\\))": (_, group) => {
        return `<span class="text-[#e3cf4b]">${group}</span>`
      },
      "(\\+|\\*|\\||\\&|\\^|\\%|,)": (_, group) => {
        return `<span class="text-[#1598d9]">${group}</span>`
      },
    //   "(\\d+)": (_, group) => {
    //     return `<span class="text-[#af98e6]">${group}</span>`
    //   }
    };

    let formattedCode = code;
    for (const pattern in codePatterns) {
      const regex = new RegExp(pattern, "g");
      formattedCode = formattedCode.replace(regex, codePatterns[pattern]);
    }

    return formattedCode;
  };

  const handleInput = useCallback(() => {
    if (editableRef.current) {
      onChange(editableRef.current.innerText);
      const text = editableRef.current.innerText;
      const formattedText = formatCode(text);
      editableRef.current.innerHTML = formattedText;
      placeCaretAtEnd();
    }
  }, []);

  const placeCaretAtEnd = () => {
    if (editableRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.addEventListener("input", handleInput);
    }

    return () => {
      if (editableRef.current) {
        editableRef.current.removeEventListener("input", handleInput);
      }
    };
  }, [handleInput]);

  return (
    <div
      ref={editableRef}
      content={code}
      role="textbox"
      contentEditable
      className="w-full h-full bg-background-800 bg-opacity-60 p-3 outline-none"
    />
  );
};

export default SyntaxEditable;
