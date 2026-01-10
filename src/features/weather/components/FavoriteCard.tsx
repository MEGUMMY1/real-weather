import type { WeatherData } from "@shared/api/weather/types";
import type { FavoriteLocation } from "@shared/lib/useFavoritesStore";
import { Icon } from "@shared/ui/Icon";
import { useAliasEditModal } from "./AliasEditModal";

interface FavoriteCardProps {
  favorite: FavoriteLocation;
  weatherData?: WeatherData;
  onClick: () => void;
  onRemove: () => void;
  onUpdateAlias: (alias: string) => void;
}

export const FavoriteCard = ({
  favorite,
  weatherData,
  onClick,
  onRemove,
  onUpdateAlias,
}: FavoriteCardProps) => {
  const { openAliasEditModal } = useAliasEditModal();
  const displayName = favorite.alias || favorite.displayName;

  return (
    <>
      <div
        onClick={onClick}
        className="bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors relative group"
      >
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openAliasEditModal(
                favorite.alias || favorite.displayName,
                (alias) => {
                  onUpdateAlias(alias);
                },
                () => {}
              );
            }}
            className="text-white/60 hover:text-white"
            title="별칭 수정"
          >
            <Icon icon="edit" size="sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-white/60 hover:text-white"
            title="즐겨찾기 제거"
          >
            <Icon icon="close" size="sm" />
          </button>
        </div>

        <div className="pr-12">
          <h3 className="text-white font-semibold text-lg mb-2 truncate">{displayName}</h3>

          {weatherData ? (
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">
                {Math.round(weatherData.currentTemp)}°
              </div>
              <div className="flex gap-2 text-white/80 text-sm">
                <span>최저 {Math.round(weatherData.minTemp)}°</span>
                <span>최고 {Math.round(weatherData.maxTemp)}°</span>
              </div>
            </div>
          ) : (
            <div className="text-white/60 text-sm">날씨 정보 로딩 중...</div>
          )}
        </div>
      </div>
    </>
  );
};
