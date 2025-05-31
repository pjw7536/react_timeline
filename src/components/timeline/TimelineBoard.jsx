import React from "react";
import { useEqpStatusLog } from "../../hooks/useEqpStatusLog";
import { useTipLog } from "../../hooks/useTIPLog";
import { useRacbLog } from "../../hooks/useRacbLog";
import { useCtttmLog } from "../../hooks/useCTTTMLog";
import LoadingSpinner from "../common/LoadingSpinner";
import NonStackedTimeline from "./NonStackedTimeline";
import StackedTimeline from "./StackedTimeline";
import { calcRange, addBuffer } from "../../utils/timelineUtils";

const TimelineBoard = ({ eqpId }) => {
  const { data: eqp_log = [], isLoading: l1 } = useEqpStatusLog(eqpId);
  const { data: tip_log = [], isLoading: l2 } = useTipLog(eqpId);
  const { data: racb_log = [], isLoading: l3 } = useRacbLog(eqpId);
  const { data: ctttm_log = [], isLoading: l4 } = useCtttmLog(eqpId);

  if (!eqpId) return null;
  if (l1 || l2 || l3 || l4) return <LoadingSpinner />;

  const range = calcRange(eqp_log, tip_log, racb_log, ctttm_log);
  const fullRange = addBuffer(range.min.getTime(), range.max.getTime());

  return (
    <div className="w-full space-y-4">
      <NonStackedTimeline
        dataMap={{ EQP_LOG: eqp_log, TIP_LOG: tip_log }}
        range={fullRange}
      />
      <StackedTimeline
        dataMap={{ CTTTM_LOG: ctttm_log, RACB_LOG: racb_log }}
        range={fullRange}
      />
    </div>
  );
};

export default TimelineBoard;
