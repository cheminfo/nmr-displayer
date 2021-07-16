import { CSSProperties, useContext } from 'react';

import { BrushContext } from '../EventsTrackers/BrushTracker';
import { useChartData } from '../context/ChartContext';
import { options } from '../toolbar/ToolTypes';

const styles: Record<'container', CSSProperties> = {
  container: {
    transformOrigin: 'top left',
    position: 'absolute',
    top: '0px',
    left: '0px',
    zoom: '100%',
  },
};

const allowTools: Array<string | number> = [
  options.zoom.id,
  options.zeroFilling.id,
  options.peakPicking.id,
  options.integral.id,
  options.phaseCorrection.id,
  options.baseLineCorrection.id,
  options.rangesPicking.id,
  options.zone2D.id,
  options.slicingTool.id,
  options.editRange.id,
  options.multipleSpectraAnalysis.id,
  options.exclusionZones.id,
];

export const BRUSH_TYPE = {
  X: 1,
  Y: 2,
  XY: 3,
};

const defaultDimensionBorder: {
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
} = {
  startX: 0,
  startY: 0,
};

interface BrushXYProps {
  brushType: number;
  dimensionBorder?: {
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
  };
  width?: number;
  height?: number;
}

export default function BrushXY({
  brushType = BRUSH_TYPE.XY,
  dimensionBorder = defaultDimensionBorder,
  width: widthProps,
  height: heightProps,
}: BrushXYProps) {
  let {
    width,
    height,
    toolOptions: { selectedTool },
  } = useChartData();
  let { startX, endX, startY, endY, step } = useContext(BrushContext);

  if (
    !allowTools.includes(selectedTool) ||
    step !== 'brushing' ||
    !dimensionBorder ||
    (dimensionBorder.startX && startX < dimensionBorder.startX) ||
    (dimensionBorder.startY && startY < dimensionBorder.startY) ||
    ((dimensionBorder.endX && Math.sign(endX - startX) === 1
      ? endX > dimensionBorder.endX
      : endX < dimensionBorder.startX) &&
      (dimensionBorder.endX &&
      dimensionBorder.endY &&
      Math.sign(endY - startY) === 1
        ? endY > dimensionBorder.endY
        : endY < dimensionBorder.startY))
  ) {
    return null;
  }

  width = widthProps ? widthProps : width;

  height = heightProps ? heightProps : height;

  endX =
    dimensionBorder.endX && endX > dimensionBorder.endX
      ? dimensionBorder.endX
      : dimensionBorder.startX && endX < dimensionBorder.startX
      ? dimensionBorder.startX
      : endX;
  endY =
    dimensionBorder.endY && endY > dimensionBorder.endY
      ? dimensionBorder.endY
      : dimensionBorder.startY && endY < dimensionBorder.startY
      ? dimensionBorder.startY
      : endY;

  const scaleX =
    brushType === BRUSH_TYPE.X || brushType === BRUSH_TYPE.XY
      ? (endX - startX) / width
      : 1;
  startX =
    brushType === BRUSH_TYPE.X || brushType === BRUSH_TYPE.XY ? startX : 0;

  const scaleY =
    brushType === BRUSH_TYPE.Y || brushType === BRUSH_TYPE.XY
      ? (endY - startY) / height
      : 1;
  startY =
    brushType === BRUSH_TYPE.Y || brushType === BRUSH_TYPE.XY ? startY : 0;
  return (
    <div
      style={{
        ...styles.container,
        transform: `translate(${startX}px, ${startY}px) scale(${scaleX},${scaleY})`,
        willChange: 'transform',
      }}
    >
      <svg width={width} height={height}>
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="gray"
          opacity="0.2"
        />
      </svg>
    </div>
  );
}
