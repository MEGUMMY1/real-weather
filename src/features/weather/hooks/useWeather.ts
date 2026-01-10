import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "@shared/api/weather/api";
import { getCurrentPosition } from "@shared/lib/geolocation";
import { getLocationNameFromCoordinates } from "@shared/lib/reverseGeocoding";

export interface WeatherWithLocation {
  weatherData: Awaited<ReturnType<typeof fetchWeatherData>>;
  locationName: string | null;
}

/**
 * 날씨 데이터를 가져오는 커스텀 훅
 */
export const useWeather = () => {
  return useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      const position = await getCurrentPosition();

      const [locationName, weatherData] = await Promise.allSettled([
        getLocationNameFromCoordinates(position.lat, position.lon),
        fetchWeatherData(position.lat, position.lon),
      ]);

      if (weatherData.status === "rejected") {
        throw weatherData.reason;
      }

      const resolvedLocationName = locationName.status === "fulfilled" ? locationName.value : null;

      return {
        weatherData: weatherData.value,
        locationName: resolvedLocationName,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
