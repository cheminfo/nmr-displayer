import PropsTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useChartData } from '../context/ChartContext';

import Contours from './Contours';
import Left1DChart from './Left1DChart';
import Top1DChart from './Top1DChart';
import XAxis from './XAxis';
import YAxis from './YAxis';

const Chart2D = ({ data, colors }) => {
  const { width, height, margin } = useChartData();

  const chart2d = useMemo(() => {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        id="nmrSVG"
        // ref={centerRef}
      >
        <defs>
          <clipPath id="clip">
            <rect
              width={width - margin.left - margin.right}
              height={height - margin.top - margin.bottom}
              x={margin.left}
              y={margin.top}
            />
          </clipPath>
        </defs>
        <rect
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
          x={margin.left}
          y={margin.top}
          stroke="black"
          strokeWidth="1"
          fill="transparent"
        />
        {data && data[0] && <Top1DChart data={data[0]} />}
        {data && data[1] && <Left1DChart data={data[1]} />}
        <Contours colors={colors} />
        <g className="container" style={{ pointerEvents: 'none' }}>
          <XAxis />
          <YAxis />
        </g>
      </svg>
    );
  }, [
    width,
    height,
    margin.left,
    margin.right,
    margin.top,
    margin.bottom,
    data,
    colors,
  ]);

  return chart2d;
};
Chart2D.defaultProps = {
  onDimensionChange: () => null,
};

Chart2D.propsTypes = {
  onDimensionChange: PropsTypes.func.isRequired,
};

export default Chart2D;
