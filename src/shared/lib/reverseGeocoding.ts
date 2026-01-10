/**
 * 역지오코딩: 위경도를 주소로 변환
 * korea_districts.json을 활용하여 가장 가까운 지역 찾기
 */

import type { LocationItem } from "./locationSearch";

let locationDataCache: LocationItem[] | null = null;

const loadLocationData = async (): Promise<LocationItem[]> => {
  if (locationDataCache) {
    return locationDataCache;
  }

  try {
    const response = await fetch("/korea_districts.json");
    const data: string[] = await response.json();
    locationDataCache = data.map((item) => {
      const parts = item.split("-");
      return {
        fullName: item,
        displayName: item.replace(/-/g, " "),
        parts: {
          si: parts[0],
          gu: parts[1],
          dong: parts[2],
        },
      };
    });
    return locationDataCache;
  } catch (error) {
    console.error("행정구역 데이터 로드 실패:", error);
    return [];
  }
};

/**
 * 위경도로부터 가장 가까운 지역 찾기
 */
export const getLocationNameFromCoordinates = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const locations = await loadLocationData();
    if (locations.length === 0) {
      return null;
    }

    // 간단한 거리 계산 (하버사인 공식 대신 근사치 사용)
    // 실제로는 각 지역의 중심 좌표와 비교해야 하지만,
    // 여기서는 시/도 레벨에서 매칭
    const cityNames = [
      "서울특별시",
      "부산광역시",
      "대구광역시",
      "인천광역시",
      "광주광역시",
      "대전광역시",
      "울산광역시",
      "세종특별자치시",
      "경기도",
      "강원특별자치도",
      "충청북도",
      "충청남도",
      "전북특별자치도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주특별자치도",
    ];

    // 위도 기반으로 대략적인 지역 추정
    // 실제로는 더 정확한 좌표 매핑이 필요하지만, 간단하게 구현
    let closestCity = "서울특별시";

    if (lat >= 37.4 && lat <= 37.7 && lon >= 126.8 && lon <= 127.2) {
      closestCity = "서울특별시";
    } else if (lat >= 35.0 && lat <= 35.3 && lon >= 129.0 && lon <= 129.3) {
      closestCity = "부산광역시";
    } else if (lat >= 35.8 && lat <= 36.0 && lon >= 128.5 && lon <= 128.7) {
      closestCity = "대구광역시";
    } else if (lat >= 37.4 && lat <= 37.5 && lon >= 126.6 && lon <= 126.8) {
      closestCity = "인천광역시";
    } else if (lat >= 35.1 && lat <= 35.2 && lon >= 126.8 && lon <= 126.9) {
      closestCity = "광주광역시";
    } else if (lat >= 36.3 && lat <= 36.4 && lon >= 127.3 && lon <= 127.5) {
      closestCity = "대전광역시";
    } else if (lat >= 35.5 && lat <= 35.6 && lon >= 129.2 && lon <= 129.4) {
      closestCity = "울산광역시";
    } else if (lat >= 36.4 && lat <= 36.6 && lon >= 127.2 && lon <= 127.3) {
      closestCity = "세종특별자치시";
    } else if (lat >= 37.0 && lat <= 38.5 && lon >= 126.5 && lon <= 127.8) {
      closestCity = "경기도";
    } else if (lat >= 37.0 && lat <= 38.6 && lon >= 127.0 && lon <= 129.6) {
      closestCity = "강원특별자치도";
    } else if (lat >= 36.0 && lat <= 37.5 && lon >= 127.0 && lon <= 128.5) {
      closestCity = "충청북도";
    } else if (lat >= 35.5 && lat <= 36.8 && lon >= 126.0 && lon <= 127.5) {
      closestCity = "충청남도";
    } else if (lat >= 35.0 && lat <= 36.5 && lon >= 126.0 && lon <= 127.5) {
      closestCity = "전북특별자치도";
    } else if (lat >= 34.0 && lat <= 35.5 && lon >= 125.0 && lon <= 127.5) {
      closestCity = "전라남도";
    } else if (lat >= 35.5 && lat <= 37.5 && lon >= 128.0 && lon <= 130.0) {
      closestCity = "경상북도";
    } else if (lat >= 34.5 && lat <= 35.8 && lon >= 127.5 && lon <= 129.5) {
      closestCity = "경상남도";
    } else if (lat >= 33.0 && lat <= 34.0 && lon >= 126.0 && lon <= 127.0) {
      closestCity = "제주특별자치도";
    }

    return closestCity;
  } catch (error) {
    console.error("지역명 가져오기 실패:", error);
    return null;
  }
};

