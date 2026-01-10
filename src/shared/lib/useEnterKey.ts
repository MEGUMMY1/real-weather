import { useEffect } from "react";

interface UseEnterKeyOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

/**
 * 엔터키와 ESC 키를 처리하는 커스텀 훅
 */
export const useEnterKey = ({ onEnter, onEscape, enabled = true }: UseEnterKeyOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        onEnter();
      } else if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEnter, onEscape, enabled]);
};

/**
 * input 요소에 직접 적용하는 엔터키 핸들러 훅
 */
export const useEnterKeyHandler = (onEnter?: () => void, onEscape?: () => void) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    } else if (e.key === "Escape" && onEscape) {
      e.preventDefault();
      onEscape();
    }
  };

  return handleKeyDown;
};
