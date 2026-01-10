import type { WeatherData } from "@shared/api/weather/types";
import { Icon } from "@shared/ui/Icon";

interface WeatherCardProps {
  data: WeatherData;
  locationName?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const WeatherCard = ({
  data,
  locationName,
  isFavorite = false,
  onToggleFavorite,
}: WeatherCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl relative">
      {locationName && onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 text-white/60 hover:text-yellow-400 transition-colors"
          title={isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
        >
          <Icon
            icon={isFavorite ? "star" : "star_outline"}
            size="lg"
            className={isFavorite ? "text-yellow-400" : ""}
          />
        </button>
      )}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {locationName || "현재 날씨"}
        </h2>
        <div className="text-6xl md:text-8xl font-bold text-white mb-4">
          {Math.round(data.currentTemp)}°
        </div>
        <div className="flex justify-center gap-4 text-white/80 text-lg md:text-xl">
          <span>최저 {Math.round(data.minTemp)}°</span>
          <span className="text-white/40">|</span>
          <span>최고 {Math.round(data.maxTemp)}°</span>
        </div>
      </div>
    </div>
  );
};
