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
      // 현재 위치 가져오기
      const position = await getCurrentPosition();
      // 지역명 가져오기
      const locationName = await getLocationNameFromCoordinates(position.lat, position.lon);
      // 날씨 데이터 가져오기
      const weatherData = await fetchWeatherData(position.lat, position.lon);
      return {
        weatherData,
        locationName,
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
};
