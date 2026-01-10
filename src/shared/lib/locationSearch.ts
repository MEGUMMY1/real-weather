/**
 * 대한민국 행정구역 검색 유틸리티
 */

export interface LocationItem {
  alias?: string; // 별칭
  fullName: string; // 전체 주소 (예: "서울특별시-종로구-청운동")
  displayName: string; // 표시용 이름
  parts: {
    si?: string; // 시/도
    gu?: string; // 구/군
    dong?: string; // 동
  };
}

let locationCache: LocationItem[] | null = null;

/**
 * 행정구역 데이터 로드
 */
export const loadLocationData = async (): Promise<LocationItem[]> => {
  if (locationCache) {
    return locationCache;
  }

  try {
    const response = await fetch("/korea_districts.json");
    const data: string[] = await response.json();

    locationCache = data.map((item) => {
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

    return locationCache;
  } catch (error) {
    console.error("행정구역 데이터 로드 실패:", error);
    return [];
  }
};

/**
 * 장소 검색
 */
export const searchLocations = async (
  query: string,
  limit: number = 10
): Promise<LocationItem[]> => {
  if (!query.trim()) {
    return [];
  }

  const locations = await loadLocationData();
  const searchQuery = query.trim().toLowerCase();

  // 검색어와 매칭되는 장소 필터링
  const matched = locations.filter((location) => {
    const fullName = location.fullName.toLowerCase();
    const displayName = location.displayName.toLowerCase();

    // 전체 주소나 표시 이름에 검색어가 포함되어 있는지 확인
    return fullName.includes(searchQuery) || displayName.includes(searchQuery);
  });

  // 정렬: 정확히 일치하는 것 우선, 그 다음 부분 일치
  matched.sort((a, b) => {
    const aFull = a.fullName.toLowerCase();
    const bFull = b.fullName.toLowerCase();
    const aDisplay = a.displayName.toLowerCase();
    const bDisplay = b.displayName.toLowerCase();

    // 정확히 일치하는 경우 우선
    if (aFull === searchQuery || aDisplay === searchQuery) return -1;
    if (bFull === searchQuery || bDisplay === searchQuery) return 1;

    // 시작 부분이 일치하는 경우 우선
    if (aFull.startsWith(searchQuery) || aDisplay.startsWith(searchQuery)) return -1;
    if (bFull.startsWith(searchQuery) || bDisplay.startsWith(searchQuery)) return 1;

    return 0;
  });

  return matched.slice(0, limit);
};
