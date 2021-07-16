/** @jsxImportSource @emotion/react */
import { Fragment, useCallback, useRef, useState } from 'react';
import Draggable from 'react-draggable';

import { useChartData } from '../context/ChartContext';
import { useScaleChecked } from '../context/ScaleContext';

interface ResizedDrop {
  from?: number;
  to?: number;
}

interface ResizableProps {
  from: number;
  to: number;
  onDrag?: (element: ResizedDrop) => void;
  onDrop: (element: ResizedDrop) => void;
}

function Resizable({ from, to, onDrag = () => null, onDrop }: ResizableProps) {
  const { height, margin, mode } = useChartData();
  const [rightDragVisibility, setRightDragVisibility] = useState(false);
  const [leftDragVisibility, setLeftDragVisibility] = useState(false);
  const [enable, setEnable] = useState(true);
  const draggableRightRef = useRef(null);
  const draggableLeftRef = useRef(null);

  const { scaleX } = useScaleChecked();

  const handleRightStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setRightDragVisibility(true);
  }, []);

  const handleRightDrag = useCallback(
    (e) => {
      onDrag({ from: scaleX().invert(e.layerX) });
    },
    [onDrag, scaleX],
  );

  const handleRightStop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setRightDragVisibility(false);

      const _range =
        mode === 'RTL'
          ? [scaleX().invert(e.layerX), to]
          : [to, scaleX().invert(e.layerX)];

      let resized: ResizedDrop;
      if (_range[1] > _range[0]) {
        resized = {
          from: _range[0],
          to: _range[1],
        };
      } else {
        resized = {
          from,
          to,
        };
      }

      onDrop(resized);
    },
    [from, mode, onDrop, scaleX, to],
  );

  const handleLeftStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setLeftDragVisibility(true);
  }, []);

  const handleLeftDrag = useCallback(
    (e) => {
      onDrag({ to: scaleX().invert(e.layerX) });
    },
    [onDrag, scaleX],
  );

  const handleLeftStop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setLeftDragVisibility(false);
      const _range =
        mode === 'RTL'
          ? [from, scaleX().invert(e.layerX)]
          : [scaleX().invert(e.layerX), from];

      let resized;
      if (_range[1] > _range[0]) {
        resized = {
          from: _range[0],
          to: _range[1],
        };
      } else {
        resized = {
          from,
          to,
        };
      }

      onDrop(resized);
    },
    [from, mode, onDrop, scaleX, to],
  );

  const mouseDownCaptureHandler = useCallback(({ shiftKey }) => {
    if (shiftKey) {
      setEnable(false);
    }
  }, []);

  const mouseUpCaptureHandler = useCallback(() => {
    setEnable(true);
  }, []);

  const mouseOverHandler = useCallback(({ target, shiftKey }) => {
    if (shiftKey) {
      target.style.cursor = 'crosshair';
    } else {
      target.style.cursor = 'ew-resize';
    }
  }, []);

  return (
    <Fragment>
      <Draggable
        axis="x"
        defaultPosition={{
          x: scaleX()(from),
          y: 0,
        }}
        position={{
          x: scaleX()(from),
          y: 0,
        }}
        scale={1}
        handle=".handle"
        onStart={handleRightStart}
        onDrag={handleRightDrag}
        onStop={handleRightStop}
        nodeRef={draggableRightRef}
      >
        <rect
          ref={draggableRightRef}
          className={enable ? 'handle' : ''}
          width={rightDragVisibility ? 1 : 6}
          fill="red"
          height={height + margin.top}
          style={{ fillOpacity: rightDragVisibility ? 1 : 0 }}
          onMouseDownCapture={mouseDownCaptureHandler}
          onMouseUpCapture={mouseUpCaptureHandler}
          onMouseEnter={mouseOverHandler}
        />
      </Draggable>

      <Draggable
        axis="x"
        defaultPosition={{
          x: scaleX()(to),
          y: 0,
        }}
        position={{
          x: scaleX()(to),
          y: 0,
        }}
        handle=".handle"
        scale={1}
        onStart={handleLeftStart}
        onDrag={handleLeftDrag}
        onStop={handleLeftStop}
        nodeRef={draggableLeftRef}
      >
        <rect
          ref={draggableLeftRef}
          className={enable ? 'handle' : ''}
          width={leftDragVisibility ? 1 : 6}
          fill="red"
          height={height + margin.top}
          style={{ fillOpacity: leftDragVisibility ? 1 : 0 }}
          onMouseDownCapture={mouseDownCaptureHandler}
          onMouseUpCapture={mouseUpCaptureHandler}
          onMouseEnter={mouseOverHandler}
        />
      </Draggable>
    </Fragment>
  );
}

export default Resizable;
