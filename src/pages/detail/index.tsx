import { WeatherCard } from "@features/weather/components/WeatherCard";
import { HourlyWeather } from "@features/weather/components/HourlyWeather";
import { Loading } from "@shared/ui/Loading";
import { Error as ErrorComponent } from "@shared/ui/Error";
import { Icon } from "@shared/ui/Icon";
import type { LocationItem } from "@shared/lib/locationSearch";
import { addressToCoordinates } from "@shared/lib/geocoding";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "@shared/api/weather/api";

interface DetailPageProps {
  location: LocationItem;
  onBack: () => void;
}

export const DetailPage = ({ location: locationItem, onBack }: DetailPageProps) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["detail-weather", locationItem?.fullName],
    queryFn: async () => {
      if (!locationItem) {
        throw new Error("장소 정보가 없습니다.");
      }
      const coords = addressToCoordinates(locationItem.fullName);
      if (!coords) {
        throw new Error("해당 장소의 정보가 제공되지 않습니다.");
      }
      return await fetchWeatherData(coords.lat, coords.lon);
    },
    enabled: !!locationItem,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pt-16">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="text-white mb-6 flex items-center gap-2 hover:text-white/80 transition-colors"
          >
            <Icon icon="chevron_left" size="sm" />
            뒤로가기
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6 md:mb-8">
          {locationItem.alias || locationItem.displayName}
        </h1>

        {isLoading && (
          <div className="flex justify-center">
            <Loading />
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <ErrorComponent
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
            <WeatherCard data={data} locationName={locationItem.displayName} />
            <HourlyWeather data={data} />
          </div>
        )}
      </div>
    </div>
  );
};
