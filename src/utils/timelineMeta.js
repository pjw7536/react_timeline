export const groupConfig = {
  RUN: {
    type: "range",
    options: { stack: false, zoomMin: 1000 * 60 * 30 },
    stateColors: {
      RUN: "bg-blue-500 border-blue-500",
      IDLE: "bg-yellow-500",
    },
    columns: {
      time: "timestamp",
      state: "status",
      comment: "status",
    },
  },
  STEP: {
    type: "range",
    options: {
      stack: false,
      zoomMax: 1000 * 60 * 60 * 24 * 14,
      align: "center",
      height: "100px",
    },
    stateColors: {
      OPEN: "bg-blue-500 border-blue-600",
      CLOSE: "bg-red-500 border-red-600",
    },
    columns: {
      time: "start_time",
      state: "state",
      comment: "step",
    },
  },
  EVENT: {
    type: "point",
    options: { showCurrentTime: false },
    stateColors: {
      ALARM: "bg-red-500 border-red-600",
      WARN: "bg-amber-500 border-amber-600",
    },
    columns: {
      time: "occurred_at",
      state: "event_type",
      comment: "comment",
    },
  },
};
