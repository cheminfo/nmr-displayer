import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */
import { useCallback, useState, useEffect } from 'react';

import { checkZoneKind } from '../../../data/utilities/ZoneUtilities';
import { useAssignment, useAssignmentData } from '../../assignment';
import { useChartData } from '../../context/ChartContext';
import { useDispatch } from '../../context/DispatchContext';
import DeleteButton from '../../elements/DeleteButton';
import { useHighlight } from '../../highlight';
import { DELETE_2D_ZONE } from '../../reducer/types/Types';
import { get2DXScale, get2DYScale } from '../utilities/scale';

import Signal from './Signal';

const stylesOnHover = css`
  pointer-events: bounding-box;
  @-moz-document url-prefix() {
    pointer-events: fill;
  }
  user-select: 'none';
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */

  // // disabled because Resizable component appears now when hovering over it
  // :hover .range-area {
  //   height: 100%;
  //   fill: #ff6f0057;
  //   cursor: pointer;
  // }

  .delete-button {
    visibility: hidden;
  }
`;

const stylesHighlighted = css`
  pointer-events: bounding-box;

  @-moz-document url-prefix() {
    pointer-events: fill;
  }
  .Integral-area {
    // height: 100%;
    fill: #ff6f0057;
  }
  .delete-button {
    visibility: visible;
    cursor: pointer;
  }
`;

const Zone = ({ zoneData, isVisible }) => {
  const { x, y, id, signal } = zoneData;
  const assignmentZone = useAssignment(id);
  const highlightZone = useHighlight(
    [assignmentZone.id],
    // assignmentZone.assigned.x || [],
    // assignmentZone.assigned.y || [],
  );
  const assignmentData = useAssignmentData();
  const { margin, width, height, xDomain, yDomain } = useChartData();
  const scaleX = get2DXScale({ margin, width, xDomain });
  const scaleY = get2DYScale({ margin, height, yDomain });
  const { from: x1, to: x2 } = x;
  const { from: y1, to: y2 } = y;
  const dispatch = useDispatch();

  const [reduceOpacity, setReduceOpacity] = useState(false);

  useEffect(() => {
    setReduceOpacity(!checkZoneKind(zoneData));
  }, [zoneData]);

  const deleteHandler = useCallback(() => {
    dispatch({
      type: DELETE_2D_ZONE,
      payload: {
        zoneData,
        assignmentData,
      },
    });
  }, [assignmentData, dispatch, zoneData]);

  return (
    <g
      css={
        highlightZone.isActive || assignmentZone.isActive
          ? stylesHighlighted
          : stylesOnHover
      }
      key={id}
      onMouseEnter={() => {
        assignmentZone.onMouseEnter();
        highlightZone.show();
      }}
      onMouseLeave={() => {
        assignmentZone.onMouseLeave();
        highlightZone.hide();
      }}
    >
      {isVisible.zones && (
        <g transform={`translate(${scaleX(x1)},${scaleY(y1)})`}>
          <rect
            x="0"
            width={scaleX(x2) - scaleX(x1)}
            height={scaleY(y2) - scaleY(y1)}
            className="Integral-area"
            fill="#0000000f"
            stroke={reduceOpacity ? '#343a40' : 'darkgreen'}
            strokeWidth={reduceOpacity ? '0' : '1'}
          />
        </g>
      )}
      {signal.map((_signal, i) => (
        <Signal key={`${id + i}`} signal={_signal} isVisible={isVisible} />
      ))}

      <DeleteButton
        x={scaleX(x1) - 20}
        y={scaleY(y1)}
        onDelete={deleteHandler}
      />
    </g>
  );
};

Zone.defaultProps = {
  onDelete: () => null,
};

export default Zone;
