/**
 * 각 로그 타입(logType)에 따라 색상 클래스를 정의합니다.
 * 이 설정은 vis-timeline의 item className에 적용됩니다.
 */

export const groupConfig = {
  EQP_LOG: {
    stateColors: {
      RUN: "bg-blue-600 border-blue-700",
      IDLE: "bg-yellow-600 border-yellow-700",
      PM: "bg-green-600 border-green-700",
      DOWN: "bg-red-600 border-red-700",
    },
  },
  TIP_LOG: {
    stateColors: {
      OPEN: "bg-blue-600 border-blue-700",
      CLOSE: "bg-red-600 border-red-700",
    },
  },
  RACB_LOG: {
    stateColors: {
      ALARM: "bg-red-600 border-red-700",
      WARN: "bg-amber-600 border-amber-700",
    },
  },
  CTTTM_LOG: {
    stateColors: {
      TTM_FAIL: "bg-red-600 border-red-700",
      TTM_WARN: "bg-yellow-600 border-yellow-700",
    },
  },
};
