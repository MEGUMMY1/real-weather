import type { ReactNode } from "react";

export type IconType = {
  [key: string]: {
    svgOptions?: {
      viewBox?: string;
    };
    icon: ReactNode;
  };
};

const ICONS_TEMP: IconType = {
  map_pin: {
    svgOptions: {
      viewBox: "0 0 24 24",
    },
    icon: (
      <>
        <path
          d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="12" cy="10" r="3" fill="currentColor" />
      </>
    ),
  },
  navigation: {
    svgOptions: {
      viewBox: "0 0 24 24",
    },
    icon: (
      <polygon
        points="3 11 22 2 13 21 11 13 3 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  search: {
    svgOptions: {
      viewBox: "0 0 24 24",
    },
    icon: (
      <>
        <circle
          cx="11"
          cy="11"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="m21 21-4.35-4.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    ),
  },
  close: {
    svgOptions: {
      viewBox: "0 0 24 24",
    },
    icon: (
      <>
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  star: {
    svgOptions: {
      viewBox: "0 0 24 24",
    },
    icon: (
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
      />
    ),
  },
  star_outline: {
    svgOptions: {
      viewBox: "0 0 24 24",
    },
    icon: (
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  edit: {
    svgOptions: {
      viewBox: "0 0 24 24",
    },
    icon: (
      <>
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    ),
  },
  chevron_left: {
    svgOptions: {
      viewBox: "0 0 24 24",
    },
    icon: (
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
};

export type IconList = keyof typeof ICONS_TEMP;

export default ICONS_TEMP as IconType;
