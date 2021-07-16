/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';

import { Zone as ZoneDataProps } from '../../../data/data2d/Spectrum2D';
import { checkZoneKind } from '../../../data/utilities/ZoneUtilities';
import { useAssignment } from '../../assignment';
import { useChartData } from '../../context/ChartContext';
import { TYPES, useHighlight } from '../../highlight';
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
    fill: #ff6f0057;
  }
  .delete-button {
    visibility: visible;
    cursor: pointer;
  }
`;

interface ZoneProps {
  zoneData: ZoneDataProps;
  isVisible: {
    zones: boolean;
  };
}

const Zone = ({ zoneData, isVisible }: ZoneProps) => {
  const { x, y, id, signal } = zoneData;
  const assignmentZone = useAssignment(id);
  const highlightZone = useHighlight([assignmentZone.id], TYPES.ZONE);
  const { margin, width, height, xDomain, yDomain } = useChartData();
  const scaleX = get2DXScale({ margin, width, xDomain });
  const scaleY = get2DYScale({ margin, height, yDomain });

  const {
    x: { from: x1, to: x2 },
    y: { from: y1, to: y2 },
  } = getNumberFromPartial(x, y);

  const [reduceOpacity, setReduceOpacity] = useState(false);

  useEffect(() => {
    setReduceOpacity(!checkZoneKind(zoneData));
  }, [zoneData]);

  return (
    <g
      css={
        highlightZone.isActive || assignmentZone.isActive
          ? stylesHighlighted
          : stylesOnHover
      }
      key={id}
      onMouseEnter={() => {
        assignmentZone.onMouseEnter(undefined);
        highlightZone.show();
      }}
      onMouseLeave={() => {
        assignmentZone.onMouseLeave(undefined);
        highlightZone.hide();
      }}
    >
      {isVisible.zones && (
        <g transform={`translate(${scaleX(x2)},${scaleY(y1)})`}>
          <rect
            x="0"
            width={scaleX(x1) - scaleX(x2)}
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
    </g>
  );
};

interface FromTo {
  from: number;
  to: number;
}

function getNumberFromPartial(
  x: Partial<FromTo>,
  y: Partial<FromTo>,
): { x: FromTo; y: FromTo } {
  const { from: x1, to: x2 } = x;
  const { from: y1, to: y2 } = y;

  return {
    x: {
      from: Number(x1),
      to: Number(x2),
    },
    y: {
      from: Number(y1),
      to: Number(y2),
    },
  };
}

export default Zone;
