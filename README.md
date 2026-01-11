# 리얼웨더 (RealWeather)

실시간 날씨 정보를 제공하는 웹 애플리케이션입니다. 기상청 단기예보 API를 활용하여 현재 위치 및 검색한 지역의 날씨 정보를 확인할 수 있습니다.

## 🚀 프로젝트 실행 방법

### 필수 요구사항

- Node.js 20.19+
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone https://github.com/MEGUMMY1/real-weather
   cd REALTEETH-weather
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **환경 변수 설정**

   프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

   ```env
   VITE_WEATHER_API_KEY=121fcb169480a9dbf4d328bc4db00e6f5421ebcb5a7c733b696d9704e0fbdd08
   VITE_WEATHER_API_URL=https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst
   ```

4. **개발 서버 실행**

   ```bash
   npm run dev
   ```

5. **프로덕션 빌드**
   ```bash
   npm run build
   ```

## ✨ 구현한 기능

### 1. 날씨 정보 조회

- **현재 위치 기반 날씨 조회**: 브라우저 Geolocation API를 사용하여 사용자의 현재 위치 기반 날씨 정보 제공
- **지역 검색**: 대한민국 행정구역 검색 기능
- **검색 결과 선택**: 키보드 방향키로 검색 결과 탐색 및 Enter로 선택

### 2. 즐겨찾기 기능

- 최대 6개까지 즐겨찾기 추가 가능
- 별칭 설정 및 수정 기능
- 즐겨찾기 목록 스와이프/스크롤 지원
  - 모바일: 한 행에 2개씩 표시
  - 데스크톱: 한 번에 3개씩 표시
- 즐겨찾기 클릭 시 상세 페이지로 이동

### 3. 시간대별 기온 표시

- 현재 시간 이후의 시간대별 기온을 가로 스크롤로 표시
- 마우스 드래그 및 터치 스와이프 지원

### 4. 사용자 경험 (UX)

- **로딩 상태**: 데이터 로딩 중 로딩 스피너 표시
- **에러 처리**: 에러 발생 시 재시도 버튼 제공
- **토스트 알림**: 즐겨찾기 추가 실패 등 사용자 알림
- **모달 관리**: 전역 모달 상태 관리
- **키보드 접근성**: ESC 키로 모달 닫기, 방향키로 검색 결과 탐색

### 5. 반응형 디자인

- 모바일, 태블릿, 데스크톱 환경 지원

## 🛠 기술 스택

### 핵심 라이브러리

- **React 19.2.0**
- **TypeScript 5.9.3**
- **Vite 7.2.4**

### 상태 관리

- **@tanstack/react-query 5.90.16**
- **Zustand 5.0.9**

### 라우팅

- **react-router-dom 7.12.0**

### 스타일링

- **Tailwind CSS 3.4.0**

### 개발 도구

- **ESLint**
- **TypeScript Strict Mode**

## 🏗 기술적 의사결정 및 이유

### 1. 아키텍처: Feature-Sliced Design (FSD)

```
src/
├── app/          # 앱 초기화, 라우팅, 프로바이더
├── pages/        # 페이지 컴포넌트
├── features/     # 기능별 모듈
└── shared/       # 공유 유틸리티, UI 컴포넌트
```

**이유:**

- 관심사의 분리로 코드 구조가 명확함
- 기능별로 독립적인 모듈 구성으로 유지보수 용이
- 확장성 있는 구조

### 2. 상태 관리: React Query + Zustand

**React Query 사용 이유:**

- 날씨 데이터의 캐싱, 동기화, 재시도 로직을 자동으로 처리
- `staleTime` 설정으로 불필요한 API 호출 최소화
- 로딩/에러 상태를 자동으로 관리

**Zustand 사용 이유:**

- 보일러플레이트 코드 최소화
- `persist` 미들웨어로 로컬 스토리지 연동 간편

### 3. 전역 모달/토스트 관리: Context API

**Zustand 대신 Context API를 사용한 이유**

- **단순한 UI 상태**: 모달/토스트는 열림/닫힘, 메시지 표시 등 매우 단순한 상태로, Zustand의 복잡한 기능은 과한 선택
- **라이브러리 분리**: 모달/토스트는 단순히 UI 상태만 관리하므로 분리
- **번들 크기 최적화**: 추가 라이브러리 없이 사용 가능하여 번들 크기 감소
- **렌더링 최적화**: 모달/토스트는 전역에서 한 번만 렌더링되고, 자주 변경되지 않는 단순한 상태이므로 충분

### 4. 성능 최적화

**Geolocation 최적화:**

- `enableHighAccuracy: false`: GPS 대신 네트워크 기반 위치 사용으로 응답 속도 개선
- `maximumAge: 5분`: 캐시된 위치 정보 활용

**API 호출 최적화:**

- 타임아웃 설정: 무한 대기 방지
- 병렬 처리: 위치명과 날씨 데이터를 `Promise.allSettled`로 동시 요청
- React Query 캐싱: 캐시된 데이터 재사용

### 5. 빌드 최적화

**esbuild drop 옵션:**

- 프로덕션 빌드에서 `console` 및 `debugger` 자동 제거
- 번들 크기 감소 및 프로덕션 코드 정리

### 6. 사용자 경험 개선

**키보드 네비게이션:**

- 검색 결과에서 방향키로 탐색 가능
- ESC 키로 모달 닫기
- 접근성 향상

**스와이프 지원:**

- 모바일에서 즐겨찾기 목록 스와이프 가능

## 📁 프로젝트 구조

```
src/
├── app/                    # 앱 초기화
│   ├── index.tsx          # 루트 컴포넌트
│   ├── providers/         # 전역 프로바이더
│   │   └── QueryProvider.tsx
│   └── router/            # 라우팅 설정
│       └── index.tsx
├── pages/                  # 페이지 컴포넌트
│   ├── home/              # 홈 페이지
│   └── detail/            # 상세 페이지
├── features/               # 기능별 모듈
│   └── weather/
│       ├── components/    # 날씨 관련 컴포넌트
│       └── hooks/         # 커스텀 훅
└── shared/                 # 공유 리소스
    ├── api/               # API 호출 로직
    ├── lib/               # 유틸리티 함수
    ├── ui/                # 공통 UI 컴포넌트
    └── constants/        # 상수
```

## 📝 주요 기능 상세

### 지역 검색

- `korea_districts.json` 파일을 활용한 클라이언트 사이드 검색
- 실시간 자동완성
- 키보드 방향키로 결과 탐색

### 즐겨찾기

- 로컬 스토리지에 자동 저장 (Zustand persist)
- 최대 6개 제한
- 별칭 설정으로 사용자 맞춤화

### 날씨 데이터

- 기상청 단기예보 API 활용
- 위경도를 격자 좌표로 변환하여 API 호출
- 현재 시간 기준 가장 최근 발표 데이터 사용

## 🚀 배포

프로젝트는 Vite로 빌드되며, Netlify를 통해 배포되었습니다.

**서비스**: [https://prismatic-toffee-cb421e.netlify.app/](https://prismatic-toffee-cb421e.netlify.app/)
