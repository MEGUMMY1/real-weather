import { useState, useEffect } from "react";
import { useModal } from "@shared/ui/ModalProvider";
import { Icon } from "@shared/ui/Icon";

interface AliasEditModalContentProps {
  currentAlias: string;
  onSave: (alias: string) => void;
  onCancel: () => void;
}

export const AliasEditModalContent = ({
  currentAlias,
  onSave,
  onCancel,
}: AliasEditModalContentProps) => {
  const [alias, setAlias] = useState(currentAlias);
  const { closeModal } = useModal();

  useEffect(() => {
    setAlias(currentAlias);
  }, [currentAlias]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(alias.trim());
    closeModal();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
        <Icon icon="edit" size="2xl" className="text-white" />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">별칭 수정</h3>

      <form onSubmit={handleSubmit} className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">별칭</label>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="별칭을 입력하세요"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-md transition-all text-gray-800 placeholder-gray-400"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};
