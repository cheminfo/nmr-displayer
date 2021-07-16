import { ScaleLinear } from 'd3';
import { xyReduce, xyIntegral } from 'ml-spectra-processing';
import { useCallback, useMemo } from 'react';

import { usePreferences } from '../context/PreferencesContext';
import { integralDefaultValues } from '../panels/extra/preferences/defaultValues';
import { getValue } from '../utility/LocalStorage';

import IntegralResizable from './IntegralResizable';

interface IntegralProps {
  integralData: { id: string; from: number; to: number; integral?: number };
  x: Array<number>;
  y: Array<number>;
  xDomain: number[];
  isActive: boolean;
  scaleY: ScaleLinear<any, any, never> | null;
  scaleX: any;
}

function Integral({
  integralData,
  x,
  y,
  xDomain,
  isActive,
  scaleY,
  scaleX,
}: IntegralProps) {
  const { from, to } = integralData;
  const preferences = usePreferences();

  const integralSettings = useMemo(() => {
    let {
      color = integralDefaultValues.color,
      strokeWidth = integralDefaultValues.strokeWidth,
    } = getValue(preferences, 'formatting.panels.integrals') || {};
    return { color, strokeWidth };
  }, [preferences]);

  const integral = useMemo(() => {
    return xyIntegral(
      { x: x, y: y },
      {
        from: from,
        to: to,
        reverse: true,
      },
    );
  }, [from, to, x, y]);

  const makePath = useCallback(() => {
    if (integral && scaleY) {
      const pathPoints = xyReduce(integral, {
        from: xDomain[0],
        to: xDomain[1],
        nbPoints: 200,
        optimize: true,
      });

      let path = `M ${scaleX()(pathPoints.x[0])} ${scaleY(pathPoints.y[0])}`;
      path += pathPoints.x.slice(1).reduce((accumulator, point, i) => {
        accumulator += ` L ${scaleX()(point)} ${scaleY(pathPoints.y[i + 1])}`;
        return accumulator;
      }, '');

      return path;
    } else {
      return '';
    }
  }, [integral, scaleX, scaleY, xDomain]);

  return (
    <g data-test-id="integral">
      <path
        className="line"
        stroke={integralSettings.color}
        strokeWidth={integralSettings.strokeWidth}
        fill="none"
        style={{
          transformOrigin: 'center top',
          opacity: isActive ? 1 : 0.2,
        }}
        d={makePath()}
      />

      <IntegralResizable integralData={integralData} />
    </g>
  );
}

export default Integral;
