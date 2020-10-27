import { jsx, css } from '@emotion/core';
/** @jsx jsx */
import { useCallback } from 'react';

import { useDispatch } from '../../context/DispatchContext';
import { useScale } from '../../context/ScaleContext';
import DeleteButton from '../../elements/DeleteButton';
import { useHighlight } from '../../highlight';
import { DELETE_ANALYZE_SPECTRA_RANGE } from '../../reducer/types/Types';
import Resizable from '../Resizable';

const stylesOnHover = css`
  pointer-events: bounding-box;
  @-moz-document url-prefix() {
    pointer-events: fill;
  }
  user-select: 'none';
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */

  //   :hover .range-area {
  //     height: 100%;
  //     fill: #ff6f0057;
  //     cursor: pointer;
  //   }

  .delete-button {
    visibility: hidden;
  }
`;

const stylesHighlighted = css`
  pointer-events: bounding-box;

  @-moz-document url-prefix() {
    pointer-events: fill;
  }
  .range-area {
    height: 100%;
    fill: #ff6f0057;
  }
  .delete-button {
    visibility: visible;
    cursor: pointer;
  }
`;

const AnalysisRange = ({ rangeData }) => {
  const { colKey, from, to } = rangeData;
  const highlight = useHighlight([colKey]);
  const { scaleX } = useScale();
  const dispatch = useDispatch();

  const deleteHandler = useCallback(() => {
    dispatch({ type: DELETE_ANALYZE_SPECTRA_RANGE, range: rangeData });
  }, [dispatch, rangeData]);

  // const handleOnStartResizing = useCallback(() => {}, []);

  //   const handleOnStopResizing = useCallback(
  //     (resized) => {
  //       dispatch({
  //         type: RESIZE_RANGE,
  //         data: { ...rangeData, ...resized },
  //       });
  //     },
  //     [rangeData],
  //   );

  return (
    <g
      {...highlight.onHover}
      css={highlight.isActive ? stylesHighlighted : stylesOnHover}
    >
      <g transform={`translate(${scaleX()(to)},10)`}>
        <rect
          x="0"
          width={scaleX()(from) - scaleX()(to)}
          height="6"
          className="range-area"
          fill="green"
          //   fillOpacity={highlightRange.isActive ? 1 : 0.4}
        />
        <text
          textAnchor="middle"
          x={(scaleX()(from) - scaleX()(to)) / 2}
          y="20"
          fontSize="10"
          fill="red"
          fillOpacity={highlight.isActive ? 1 : 0.6}
        >
          {/* {absolute !== undefined ? absolute.toFixed(2) : ''} */}
        </text>
      </g>
      <Resizable
        from={rangeData.from}
        to={rangeData.to}
        // onDrop={handleOnStopResizing}
      />
      <DeleteButton x={scaleX()(to) - 20} y={10} onDelete={deleteHandler} />
    </g>
  );
};

export default AnalysisRange;