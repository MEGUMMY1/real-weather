import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Modal } from "./Modal";

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  title?: string;
  className?: string;
  onClose?: () => void;
}

interface ModalContextType {
  openModal: (content: ReactNode, options?: { title?: string; className?: string; onClose?: () => void }) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    content: null,
  });

  const openModal = useCallback(
    (content: ReactNode, options?: { title?: string; className?: string; onClose?: () => void }) => {
      setModalState({
        isOpen: true,
        content,
        title: options?.title,
        className: options?.className,
        onClose: options?.onClose,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState((prev) => {
      // onClose 콜백이 있으면 실행
      if (prev.onClose) {
        prev.onClose();
      }
      return {
        isOpen: false,
        content: null,
      };
    });
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen: modalState.isOpen }}>
      {children}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        className={modalState.className}
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
};

