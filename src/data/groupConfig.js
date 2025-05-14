// src/data/groupConfig.js

export const groupConfig = {
  A: {
    label: "EQP MT",
    type: "range",
    stateColors: {
      running: "bg-blue-500 border-blue-600",
      error: "bg-red-500 border-red-600",
      success: "bg-green-500 border-green-600",
    },
    columns: {
      time: "timestamp",
      state: "status",
      comment: "comment",
    },
  },
  B: {
    label: "TIP MT",
    type: "range",
    stateColors: {
      maintenance: "bg-yellow-500 border-yellow-600",
      offline: "bg-purple-500 border-purple-600",
      unknown: "bg-gray-500 border-gray-400",
    },
    columns: {
      time: "event_time",
      state: "action",
      comment: "comment",
    },
  },
  C: {
    label: "Chane PT",
    type: "point",
    stateColors: {
      alert: "bg-red-500 border-red-600",
      stable: "bg-green-500 border-green-600",
    },
    columns: {
      time: "occurred_at",
      state: "event_type",
      comment: "comment",
    },
  },
};
