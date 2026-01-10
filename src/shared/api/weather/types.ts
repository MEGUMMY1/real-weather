/**
 * 기상청 단기예보 API 타입 정의
 */

export interface WeatherApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: WeatherItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export interface WeatherItem {
  baseDate: string; // 발표일자
  baseTime: string; // 발표시각
  category: string; // 자료구분코드
  fcstDate: string; // 예보일자
  fcstTime: string; // 예보시각
  fcstValue: string; // 예보 값
  nx: number; // X 좌표
  ny: number; // Y 좌표
}

export interface WeatherData {
  currentTemp: number; // 현재 기온
  minTemp: number; // 최저 기온
  maxTemp: number; // 최고 기온
  hourlyTemps: Array<{
    time: string;
    temp: number;
    date?: string;
  }>; // 시간대별 기온
  location: {
    lat: number;
    lon: number;
    nx: number;
    ny: number;
  };
}

/**
 * 기상청 API 카테고리 코드
 */
export const WEATHER_CATEGORIES = {
  TMP: "TMP", // 1시간 기온
  TMN: "TMN", // 일 최저기온
  TMX: "TMX", // 일 최고기온
  SKY: "SKY", // 하늘상태
  PTY: "PTY", // 강수형태
  POP: "POP", // 강수확률
  PCP: "PCP", // 1시간 강수량
  REH: "REH", // 습도
  SNO: "SNO", // 1시간 신적설
  VEC: "VEC", // 풍향
  WSD: "WSD", // 풍속
} as const;
