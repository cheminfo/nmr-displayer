import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { useChartData } from './context/ChartContext';

const axisStyles = css`
  path,
  line {
    fill: none;
    stroke: black;
    stroke-width: 1;
    shape-rendering: crispEdges;
    user-select: none;
  }
`;

const gridStyles = css`
  line {
    stroke: rgb(104, 104, 104);
    stroke-opacity: 0.2;
    shape-rendering: crispEdges;
    stroke-dasharray: 3;
    stroke-width: 1;
    user-select: none;
  }

  path {
    stroke-width: 0;
  }
`;

const XAxis = ({ label, show, showGrid, mode }) => {
  const { xDomain, getScale, height, width, margin } = useChartData();

  const refAxis = useRef();
  const refGrid = useRef();

  label = label ? label : mode === 'RTL' ? 'δ [ppm]' : 'time [s]';

  const xAxis = d3
    .axisBottom()
    .ticks(8)
    .tickFormat(d3.format('0'));

  const grid = d3
    .axisBottom()
    .ticks(10)
    .tickSize(-(height - margin.top - margin.bottom))
    .tickFormat('');

  useEffect(() => {
    if (show) {
      const range =
        mode === 'RTL'
          ? [width - margin.right, margin.left]
          : [margin.left, width - margin.right];
      const scale = d3.scaleLinear([xDomain[0], xDomain[1]], range);
      d3.select(refAxis.current).call(xAxis.scale(scale));
      d3.select(refGrid.current).call(grid.scale(scale));
    }
  }, [grid, margin.left, margin.right, mode, show, width, xAxis, xDomain]);

  useEffect(() => {
    if (show) {
      // const scale = d3.scaleLinear(
      //   [domain[0], domain[1]],
      //   [width - margin.right, margin.left],
      // );
      const scale = getScale();
      d3.select(refAxis.current)
        // .transition()
        // .duration(500)
        .call(xAxis.scale(scale.x.domain(xDomain)));

      d3.select(refGrid.current).call(grid.scale(scale.x.domain(xDomain)));
    }
  }, [getScale, grid, show, xAxis, xDomain]);

  const Axis = useMemo(
    () =>
      show &&
      show === true && (
        <g
          className="x"
          css={axisStyles}
          transform={`translate(0,${height - margin.bottom})`}
          ref={refAxis}
        >
          <text fill="#000" x={width - 60} y="20" dy="0.71em" textAnchor="end">
            {label}
          </text>
        </g>
      ),

    [height, label, margin.bottom, show, width],
  );

  const Grid = useMemo(
    () =>
      showGrid &&
      showGrid === true && (
        <g
          css={gridStyles}
          ref={refGrid}
          transform={`translate(0,${height - margin.bottom})`}
        />
      ),

    [showGrid, height, margin.bottom],
  );

  if (!width || !height) {
    return null;
  }

  return (
    <React.Fragment>
      {Axis}
      {Grid}
    </React.Fragment>
  );
};

export default XAxis;

XAxis.contextTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  showGrid: PropTypes.bool,
  show: PropTypes.bool,
  label: PropTypes.string,
  isFID: PropTypes.bool,
};

XAxis.defaultProps = {
  showGrid: false,
  show: true,
  label: '',
  isFID: true,
};
