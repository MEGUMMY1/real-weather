/**
 * 주소를 위경도로 변환하는 유틸리티
 * 대한민국 행정구역의 대표 좌표를 반환합니다.
 */

export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * 행정구역 주소를 대표 좌표로 변환
 * 실제 지오코딩 API 대신 주요 도시/구의 대표 좌표를 사용
 */
export const addressToCoordinates = (address: string): Coordinates | null => {
  // 주소를 파싱
  const parts = address.split("-");
  const si = parts[0];
  const gu = parts[1];
  const dong = parts[2];

  // 주요 도시의 대표 좌표 (시청 위치 기준)
  const cityCoordinates: Record<string, Coordinates> = {
    서울특별시: { lat: 37.5665, lon: 126.978 },
    부산광역시: { lat: 35.1796, lon: 129.0756 },
    대구광역시: { lat: 35.8714, lon: 128.6014 },
    인천광역시: { lat: 37.4563, lon: 126.7052 },
    광주광역시: { lat: 35.1595, lon: 126.8526 },
    대전광역시: { lat: 36.3504, lon: 127.3845 },
    울산광역시: { lat: 35.5384, lon: 129.3114 },
    세종특별자치시: { lat: 36.48, lon: 127.289 },
    경기도: { lat: 37.4138, lon: 127.5183 },
    강원특별자치도: { lat: 37.8228, lon: 128.1555 },
    충청북도: { lat: 36.8, lon: 127.7 },
    충청남도: { lat: 36.5184, lon: 126.8 },
    전북특별자치도: { lat: 35.7175, lon: 127.153 },
    전라남도: { lat: 34.8679, lon: 126.991 },
    경상북도: { lat: 36.4919, lon: 128.8889 },
    경상남도: { lat: 35.4606, lon: 128.2132 },
    제주특별자치도: { lat: 33.4996, lon: 126.5312 },
  };

  // 시/도 레벨 좌표 반환
  if (cityCoordinates[si]) {
    return cityCoordinates[si];
  }

  // 구/군 레벨: 시의 좌표에 약간의 오프셋 추가
  if (gu) {
    const base = cityCoordinates[si] as Coordinates | undefined;
    if (base) {
      return {
        lat: base.lat + (Math.random() - 0.5) * 0.1,
        lon: base.lon + (Math.random() - 0.5) * 0.1,
      };
    }
  }

  // 동 레벨: 구의 좌표 사용
  if (dong && gu) {
    const base = cityCoordinates[si] as Coordinates | undefined;
    if (base) {
      return {
        lat: base.lat + (Math.random() - 0.5) * 0.05,
        lon: base.lon + (Math.random() - 0.5) * 0.05,
      };
    }
  }

  return null;
};
