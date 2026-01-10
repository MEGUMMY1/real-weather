import { useState } from "react";
import { Modal } from "@shared/ui/Modal";
import { Icon } from "@shared/ui/Icon";

interface AddFavoriteModalProps {
  isOpen: boolean;
  locationName: string;
  onSave: (alias?: string) => void;
  onCancel: () => void;
}

export const AddFavoriteModal = ({
  isOpen,
  locationName,
  onSave,
  onCancel,
}: AddFavoriteModalProps) => {
  const [alias, setAlias] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(alias.trim() || undefined);
    setAlias("");
  };

  const handleClose = () => {
    setAlias("");
    onCancel();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" className="bg-white/95 backdrop-blur-xl">
      <div className="flex flex-col items-center">
        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg">
          <Icon icon="star" size="2xl" className="text-white" />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">즐겨찾기에 추가</h3>
        <p className="text-gray-500 text-sm mb-6">{locationName}</p>

        <form onSubmit={handleSubmit} className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">별칭 (선택사항)</label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="예: 우리집, 회사 등"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-800 placeholder-gray-400"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
