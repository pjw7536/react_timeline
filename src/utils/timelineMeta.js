export const groupConfig = {
  EQP_STATUS: {
    type: "range",
    options: { stack: false, zoomMin: 1000 * 60 * 30 },
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
  TIP_STATUS: {
    type: "range",
    options: {
      stack: false,
      zoomMax: 1000 * 60 * 60 * 24 * 14,
      align: "center",
      height: "100px",
    },
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
  EQP_INTERLOCK: {
    type: "point",
    options: { showCurrentTime: false },
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
};
