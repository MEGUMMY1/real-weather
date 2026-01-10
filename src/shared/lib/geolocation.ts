/**
 * 사용자 위치 정보 가져오기
 */

export interface Position {
  lat: number;
  lon: number;
}

export const getCurrentPosition = (): Promise<Position> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation을 지원하지 않는 브라우저입니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근이 거부되었습니다.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

