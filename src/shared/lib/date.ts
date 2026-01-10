/**
 * 날씨 API 호출에 필요한 날짜/시간 포맷 유틸리티
 */

/**
 * YYYYMMDD 형식의 날짜 문자열 반환
 */
export const getBaseDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * HHmm 형식의 시간 문자열 반환
 * 기상청 단기예보 API는 매일 02, 05, 08, 11, 14, 17, 20, 23시에 데이터를 발표합니다.
 * 가장 최근의 base_time을 반환합니다.
 */
export const getBaseTime = (date: Date = new Date()): string => {
  const hour = date.getHours();
  let baseHour = 0;

  // 가장 최근의 base_time 계산 (02, 05, 08, 11, 14, 17, 20, 23시)
  if (hour < 2) {
    baseHour = 23; // 전날 23시 데이터 사용
  } else if (hour < 5) {
    baseHour = 2;
  } else if (hour < 8) {
    baseHour = 5;
  } else if (hour < 11) {
    baseHour = 8;
  } else if (hour < 14) {
    baseHour = 11;
  } else if (hour < 17) {
    baseHour = 14;
  } else if (hour < 20) {
    baseHour = 17;
  } else if (hour < 23) {
    baseHour = 20;
  } else {
    baseHour = 23;
  }

  return String(baseHour).padStart(2, '0') + '00';
};

/**
 * base_time이 전날 23시인 경우 base_date를 하루 전으로 조정
 */
export const getAdjustedBaseDate = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 2) {
    // 전날 23시 데이터 사용
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    return getBaseDate(yesterday);
  }
  return getBaseDate(date);
};

