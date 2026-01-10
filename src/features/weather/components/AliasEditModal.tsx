import { useState, useEffect } from "react";
import { Modal } from "@shared/ui/Modal";

interface AliasEditModalProps {
  isOpen: boolean;
  currentAlias: string;
  onSave: (alias: string) => void;
  onCancel: () => void;
}

export const AliasEditModal = ({
  isOpen,
  currentAlias,
  onSave,
  onCancel,
}: AliasEditModalProps) => {
  const [alias, setAlias] = useState(currentAlias);

  useEffect(() => {
    if (isOpen) {
      setAlias(currentAlias);
    }
  }, [isOpen, currentAlias]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(alias.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="별칭 수정">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="별칭을 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      </form>
    </Modal>
  );
};

