import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */
import * as d3 from 'd3';
import { useCallback, Fragment, useMemo } from 'react';

import { useChartData } from '../context/ChartContext';
import { useDispatch } from '../context/DispatchContext';
import { useScale } from '../context/ScaleContext';
import DeleteButton from '../elements/DeleteButton';
import { useHighlight } from '../highlight/index';
import { RESIZE_INTEGRAL, DELETE_INTEGRAL } from '../reducer/types/Types';

import Resizable from './Resizable';

const stylesOnHover = css`
  pointer-events: bounding-box;
  @-moz-document url-prefix() {
    pointer-events: fill;
  }
  // // disabled because Resizable component appears now when hovering over it
  // :hover .target {
  //   visibility: visible !important;
  //   cursor: pointer;
  // }
  .highlight {
    fill: transparent;
  }
  .target {
    visibility: hidden;
  }
`;

const stylesHighlighted = css`
  pointer-events: bounding-box;

  @-moz-document url-prefix() {
    pointer-events: fill;
  }
  fill: #ff6f0057;

  .target {
    visibility: visible;
  }
`;

function IntegralResizable({ spectrumID, integralSeries, integralData }) {
  const { height, margin } = useChartData();
  const { scaleX } = useScale();

  const { id, integral } = integralData;

  const highlight = useHighlight([id]);

  // isn't it actually the from/to range? -> return [from, to]
  const xBoundary = useMemo(() => {
    if (integralSeries) {
      return d3.extent(integralSeries.x);
    } else {
      return [];
    }
  }, [integralSeries]);

  const dispatch = useDispatch();

  const deleteIntegral = useCallback(() => {
    dispatch({
      type: DELETE_INTEGRAL,
      integralID: id,
      spectrumID: spectrumID,
    });
  }, [dispatch, id, spectrumID]);

  // const handleOnStartResizing = useCallback(() => {}, []);

  const handleOnStopResizing = useCallback(
    (resized) => {
      dispatch({
        type: RESIZE_INTEGRAL,
        data: { ...integralData, ...resized },
      });
    },
    [dispatch, integralData],
  );

  const x0 = xBoundary[0] ? scaleX()(xBoundary[0]) : 0;
  const x1 = xBoundary[1] ? scaleX()(xBoundary[1]) : 0;

  return (
    <Fragment>
      <g
        css={highlight.isActive ? stylesHighlighted : stylesOnHover}
        {...highlight.onHover}
      >
        <rect
          data-no-export="true"
          x={`${x1}`}
          y="0"
          width={`${x0 - x1}`}
          height={height - margin.bottom}
          className="highlight"
        />
        {/* {highlight.isActive && ( */}
        <text
          x={x1}
          y={height - margin.bottom + 30}
          fill="black"
          style={{ fontSize: '12px', fontWeight: 'bold' }}
        >
          {integral !== undefined ? integral.toFixed(2) : ''}
        </text>
        {/* )} */}
        <Resizable
          from={integralData.from}
          to={integralData.to}
          // onDrag={handleOnStartResizing}
          onDrop={handleOnStopResizing}
          data-no-export="true"
        />
        <DeleteButton
          x={`${x1 - 20}`}
          y={height - margin.bottom - 20}
          onDelete={deleteIntegral}
        />
      </g>
    </Fragment>
  );
}

export default IntegralResizable;
