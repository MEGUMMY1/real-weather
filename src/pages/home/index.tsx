import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeather } from "@features/weather/hooks/useWeather";
import { useWeatherByLocation } from "@features/weather/hooks/useWeatherByLocation";
import { WeatherCard } from "@features/weather/components/WeatherCard";
import { HourlyWeather } from "@features/weather/components/HourlyWeather";
import { LocationSearch } from "@features/weather/components/LocationSearch";
import { FavoritesList } from "@features/weather/components/FavoritesList";
import { useAddFavoriteModal } from "@features/weather/components/AddFavoriteModal";
import { Loading } from "@shared/ui/Loading";
import { Error } from "@shared/ui/Error";
import { Icon } from "@shared/ui/Icon";
import { useFavoritesStore, type FavoriteLocation } from "@shared/lib/useFavoritesStore";
import type { LocationItem } from "@shared/lib/locationSearch";
import type { WeatherData } from "@shared/api/weather/types";

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const { openAddFavoriteModal } = useAddFavoriteModal();
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const currentLocationWeather = useWeather();
  const locationWeather = useWeatherByLocation(selectedLocation);

  // 검색한 장소가 있으면 해당 날씨, 없으면 현재 위치 날씨 사용
  const weatherQuery = selectedLocation ? locationWeather : currentLocationWeather;
  const weatherResult = weatherQuery.data;
  const data: WeatherData | undefined = selectedLocation
    ? (weatherResult as WeatherData | undefined)
    : weatherResult && "weatherData" in weatherResult
    ? weatherResult.weatherData
    : (weatherResult as WeatherData | undefined);
  const isLoading = weatherQuery.isLoading;
  const error = weatherQuery.error;
  const refetch = weatherQuery.refetch;

  // 현재 표시할 위치 이름
  const displayLocationName = selectedLocation
    ? selectedLocation.displayName
    : currentLocationWeather.data?.locationName || "현재 위치";

  const handleSelectLocation = (location: LocationItem) => {
    setSelectedLocation(location);
  };

  const handleUseCurrentLocation = () => {
    setSelectedLocation(null);
  };

  const handleFavoriteClick = (favorite: FavoriteLocation) => {
    navigate(`/detail/${favorite.id}`);
  };

  const handleToggleFavorite = () => {
    if (!selectedLocation) return;

    if (isFavorite(selectedLocation)) {
      // 즐겨찾기 해제
      const favorite = favorites.find((fav) => fav.fullName === selectedLocation.fullName);
      if (favorite) {
        removeFavorite(favorite.id);
      }
    } else {
      // 즐겨찾기 추가 - 모달 띄우기
      openAddFavoriteModal(
        selectedLocation.displayName,
        (alias) => {
          if (selectedLocation) {
            const success = addFavorite(selectedLocation, alias);
            if (!success) {
              alert("즐겨찾기는 최대 6개까지 추가할 수 있습니다.");
            }
          }
        },
        () => {}
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pt-12 md:pt-16">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <LocationSearch
                onSelectLocation={handleSelectLocation}
                selectedLocation={selectedLocation}
              />
            </div>
            <button
              onClick={handleUseCurrentLocation}
              className="px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition-colors flex items-center gap-2 whitespace-nowrap"
              title="현재 위치로 조회"
            >
              <Icon icon="navigation" size="md" />
              <span className="hidden md:inline">현재 위치</span>
            </button>
          </div>
        </div>

        <FavoritesList onFavoriteClick={handleFavoriteClick} />

        {isLoading && (
          <div className="flex justify-center">
            <Loading />
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <Error
              message={
                error && typeof error === "object" && "message" in error
                  ? String(error.message)
                  : error && typeof error === "string"
                  ? error
                  : "날씨 정보를 불러올 수 없습니다."
              }
              onRetry={() => refetch()}
            />
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            <WeatherCard
              data={data}
              locationName={displayLocationName || undefined}
              isFavorite={selectedLocation ? isFavorite(selectedLocation) : false}
              onToggleFavorite={selectedLocation ? handleToggleFavorite : undefined}
            />
            <HourlyWeather data={data} />
          </div>
        )}

        {!isLoading && !error && !data && selectedLocation && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-center">
              <p className="text-white text-lg">해당 장소의 정보가 제공되지 않습니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
