import React from 'react';

import { useChartData } from '../context/ChartContext';

import { get2DXScale, get2DYScale } from './utilities/scale';

const Contours = () => {
  const { data } = useChartData();

  const ContoursPaths = ({ id: spectrumID, sign, color }) => {
    const {
      margin,
      width,
      height,
      xDomain,
      yDomain,
      contours,
    } = useChartData();

    const buildContourPath = (contour) => {
      const _scaleX = get2DXScale({ margin, width, xDomain });
      const _scaleY = get2DYScale({ margin, height, yDomain });

      let path = ` M ${_scaleX(contour[0].x)} ${_scaleY(contour[0].y)} `;
      path += contour.slice(1).reduce((acc, co) => {
        acc += ` L ${_scaleX(co.x)} ${_scaleY(co.y)} `;
        return acc;
      }, '');
      path += ' z';
      return path;
    };

    return (
      contours &&
      contours[spectrumID][sign] &&
      contours[spectrumID][sign].length > 0 &&
      contours[spectrumID][sign].map((contoursData, innerIndex) => (
        <path
          key={innerIndex}
          fill="none"
          stroke={color}
          strokeWidth="1"
          d={buildContourPath(contoursData)}
        />
      ))
    );
  };

  return (
    <g clipPath="url(#clip)" className="contours">
      {data
        .filter((datum) => datum.info.dimension === 2)
        .map((datum, index) => (
          <g key={`${index}`}>
            {datum.display.isPositiveVisible && (
              <ContoursPaths
                id={datum.id}
                sign="positive"
                color={datum.display.positiveColor}
              />
            )}
            {datum.display.isNegativeVisible && (
              <ContoursPaths
                id={datum.id}
                sign="negative"
                color={datum.display.negativeColor}
              />
            )}
          </g>
        ))}
    </g>
  );
};

export default Contours;
