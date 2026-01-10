import { useModal } from "@shared/ui/ModalProvider";
import { AddFavoriteModalContent } from "./AddFavoriteModalContent";

export const useAddFavoriteModal = () => {
  const { openModal } = useModal();

  const openAddFavoriteModal = (
    locationName: string,
    onSave: (alias?: string) => void,
    onCancel: () => void
  ) => {
    openModal(
      <AddFavoriteModalContent locationName={locationName} onSave={onSave} onCancel={onCancel} />,
      {
        className: "bg-white/95 backdrop-blur-xl",
      }
    );
  };

  return { openAddFavoriteModal };
};
