/**
 * 타임라인 그룹별로 "옵션/색상/주요 컬럼"을 정의한 메타데이터 객체입니다.
 * - groupConfig[KEY]
 *    - type: "range" | "point"
 *    - options: vis-timeline에 넘길 옵션(기본값)
 *    - stateColors: 각 상태별 Tailwind 색상 클래스
 *    - columns: 시간, 상태, 설명(코멘트) 컬럼명
 */
export const groupConfig = {
  EQP_LOG: {
    type: "range",
    options: {},
    stateColors: {
      RUN: "bg-blue-600 border-blue-700",
      IDLE: "bg-yellow-600 border-yellow-700",
      PM: "bg-green-600 border-green-700",
      DOWN: "bg-red-600 border-red-700",
    },
    columns: {
      time: "timestamp",
      state: "status",
      comment: "status",
    },
  },
  TIP_LOG: {
    type: "range",
    options: {},
    stateColors: {
      OPEN: "bg-blue-600 border-blue-700",
      CLOSE: "bg-red-600 border-red-700",
    },
    columns: {
      time: "start_time",
      state: "state",
      comment: "step",
    },
  },
  RACB_LOG: {
    type: "point",
    options: {},
    stateColors: {
      ALARM: "bg-red-600 border-red-700",
      WARN: "bg-amber-600 border-amber-700",
    },
    columns: {
      time: "occurred_at",
      state: "event_type",
      comment: "comment",
    },
  },
  CTTTM_LOG: {
    type: "point",
    options: {},
    stateColors: {
      TTM_FAIL: "bg-red-600 border-red-700",
      TTM_WARN: "bg-yellow-600 border-yellow-700",
    },
    columns: {
      time: "occurred_at",
      state: "event_type",
      comment: "comment",
    },
  },
};
