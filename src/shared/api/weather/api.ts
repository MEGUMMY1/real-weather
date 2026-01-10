import type { WeatherApiResponse, WeatherItem, WeatherData } from "./types";
import { WEATHER_CATEGORIES } from "./types";
import { getBaseDate, getBaseTime, getAdjustedBaseDate } from "@shared/lib/date";
import { convertWGS84ToGrid } from "@shared/lib/coordinate";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL;

/**
 * 기상청 단기예보 API 호출
 */
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  const { nx, ny } = convertWGS84ToGrid(lat, lon);
  const baseDate = getAdjustedBaseDate();
  const baseTime = getBaseTime();

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: String(nx),
    ny: String(ny),
  });

  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WeatherApiResponse = await response.json();

    if (data.response.header.resultCode !== "00") {
      const errorMsg = data.response.header.resultMsg || "날씨 데이터를 가져오는데 실패했습니다.";
      console.error("기상청 API 에러:", {
        resultCode: data.response.header.resultCode,
        resultMsg: errorMsg,
        baseDate,
        baseTime,
        nx,
        ny,
      });
      throw new Error(errorMsg);
    }

    // items.item이 배열인지 확인
    const items = data.response.body.items?.item;
    if (!items || (Array.isArray(items) && items.length === 0)) {
      console.error("날씨 데이터가 없습니다:", {
        baseDate,
        baseTime,
        nx,
        ny,
        totalCount: data.response.body.totalCount,
      });
      throw new Error("해당 시간의 날씨 데이터가 없습니다. 잠시 후 다시 시도해주세요.");
    }

    // item이 배열이 아닌 경우 배열로 변환
    const itemsArray = Array.isArray(items) ? items : [items];

    return parseWeatherData(itemsArray, lat, lon, nx, ny);
  } catch (error) {
    console.error("날씨 API 호출 오류:", error);
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.");
      }
      throw error;
    }
    throw new Error("날씨 데이터를 가져오는데 실패했습니다.");
  }
};

/**
 * API 응답 데이터를 파싱하여 WeatherData 형식으로 변환
 */
const parseWeatherData = (
  items: WeatherItem[],
  lat: number,
  lon: number,
  nx: number,
  ny: number
): WeatherData => {
  const now = new Date();
  const currentHour = String(now.getHours()).padStart(2, "0") + "00";
  const today = getBaseDate();

  // 현재 시간의 기온 찾기
  let currentTemp = 0;
  const currentTempItem = items.find(
    (item) =>
      item.category === WEATHER_CATEGORIES.TMP &&
      item.fcstDate === today &&
      item.fcstTime === currentHour
  );
  if (currentTempItem) {
    currentTemp = Number(currentTempItem.fcstValue);
  } else {
    // 현재 시간 데이터가 없으면 가장 가까운 시간의 데이터 사용
    const tempItems = items
      .filter(
        (item) =>
          item.category === WEATHER_CATEGORIES.TMP &&
          item.fcstDate === today &&
          Number(item.fcstTime) >= Number(currentHour)
      )
      .sort((a, b) => Number(a.fcstTime) - Number(b.fcstTime));
    if (tempItems.length > 0) {
      currentTemp = Number(tempItems[0].fcstValue);
    }
  }

  // 최저/최고 기온 찾기
  const minTempItem = items.find(
    (item) => item.category === WEATHER_CATEGORIES.TMN && item.fcstDate === today
  );
  const maxTempItem = items.find(
    (item) => item.category === WEATHER_CATEGORIES.TMX && item.fcstDate === today
  );

  const minTemp = minTempItem ? Number(minTempItem.fcstValue) : currentTemp;
  const maxTemp = maxTempItem ? Number(maxTempItem.fcstValue) : currentTemp;

  // 시간대별 기온 (오늘 현재 시간 이후 + 내일 전체)
  const hourlyTemps: Array<{ time: string; temp: number; date: string }> = [];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getBaseDate(tomorrow);

  // 오늘과 내일의 기온 데이터 필터링
  const tempItems = items.filter(
    (item) =>
      item.category === WEATHER_CATEGORIES.TMP &&
      (item.fcstDate === today || item.fcstDate === tomorrowStr)
  );

  // 시간대별로 그룹화 (날짜와 시간을 함께 키로 사용)
  const tempByTime = new Map<string, number>();
  tempItems.forEach((item) => {
    const key = `${item.fcstDate}-${item.fcstTime}`;
    tempByTime.set(key, Number(item.fcstValue));
  });

  // 현재 시간 이후의 데이터만 필터링하고 정렬 (오늘은 현재 시간 이후, 내일은 전체)
  const sortedKeys = Array.from(tempByTime.keys())
    .filter((key) => {
      const [date, time] = key.split("-");
      if (date === today) {
        return Number(time) >= Number(currentHour);
      }
      return true; // 내일 데이터는 모두 포함
    })
    .sort((a, b) => {
      const [dateA, timeA] = a.split("-");
      const [dateB, timeB] = b.split("-");
      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }
      return Number(timeA) - Number(timeB);
    });

  // 모든 데이터 추가 (오늘 현재 시간 이후 + 내일 전체)
  sortedKeys.forEach((key) => {
    const [date, time] = key.split("-");
    hourlyTemps.push({
      time: `${time.slice(0, 2)}:${time.slice(2)}`,
      temp: tempByTime.get(key) || 0,
      date: date,
    });
  });

  return {
    currentTemp,
    minTemp,
    maxTemp,
    hourlyTemps,
    location: {
      lat,
      lon,
      nx,
      ny,
    },
  };
};
