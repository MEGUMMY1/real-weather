import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "@shared/api/weather/api";
import { addressToCoordinates } from "@shared/lib/geocoding";
import type { LocationItem } from "@shared/lib/locationSearch";

/**
 * 선택한 장소의 날씨 데이터를 가져오는 커스텀 훅
 */
export const useWeatherByLocation = (location: LocationItem | null) => {
  return useQuery({
    queryKey: ["weather", location?.fullName],
    queryFn: async () => {
      if (!location) {
        throw new Error("장소를 선택해주세요.");
      }

      const coordinates = addressToCoordinates(location.fullName);
      if (!coordinates) {
        throw new Error("해당 장소의 정보가 제공되지 않습니다.");
      }

      return await fetchWeatherData(coordinates.lat, coordinates.lon);
    },
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
