import { useModal } from "@shared/ui/ModalProvider";
import { AliasEditModalContent } from "./AliasEditModalContent";

export const useAliasEditModal = () => {
  const { openModal } = useModal();

  const openAliasEditModal = (
    currentAlias: string,
    onSave: (alias: string) => void,
    onCancel: () => void
  ) => {
    openModal(
      <AliasEditModalContent currentAlias={currentAlias} onSave={onSave} onCancel={onCancel} />,
      {
        className: "bg-white/95 backdrop-blur-xl",
      }
    );
  };

  return { openAliasEditModal };
};
