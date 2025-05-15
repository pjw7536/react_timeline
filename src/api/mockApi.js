/* 더미 API – setTimeout 으로 네트워크 지연 모사  */
import {
  lines,
  equipments,
  runStatusDB,
  stepStatusDB,
  eventLogDB,
} from "../data/mockData";

const fake = (data, ms = 300) =>
  new Promise((res) => setTimeout(() => res({ data }), ms));

export const fetchLines = () => fake(lines);

export const fetchEquipments = (lineId) =>
  fake(equipments.filter((e) => e.lineId === lineId));

export const fetchRunStatus = (eqpId) =>
  fake(runStatusDB.filter((r) => r.eqpId === eqpId));

export const fetchStepStatus = (eqpId) =>
  fake(stepStatusDB.filter((s) => s.eqpId === eqpId));

export const fetchEventLog = (eqpId) =>
  fake(eventLogDB.filter((ev) => ev.eqpId === eqpId));
