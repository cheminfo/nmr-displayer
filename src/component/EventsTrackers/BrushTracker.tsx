import lodashDebounce from 'lodash/debounce';
import lodashMap from 'lodash/map';
import {
  createContext,
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

const initialState = {
  step: 'initial',
  brush: {
    start: null,
    end: null,
  },
  startX: 0,
  endX: 0,
  startY: 0,
  endY: 0,
};

export const BrushContext = createContext(initialState);

interface BrushTrackerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onBrush?: (element: any) => void;
  onZoom?: (element: any) => void;
  onDoubleClick?: (element: any) => void;
  onClick?: (element: any) => void;
  noPropagation?: boolean;
}

export function BrushTracker({
  children,
  className,
  style,
  onBrush = () => null,
  onZoom = () => null,
  onDoubleClick = () => null,
  onClick = () => null,
  noPropagation,
}: BrushTrackerProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);
  const debounceClickEventsRef = useRef<Array<any>>([]);

  const mouseDownHandler = useCallback(
    (event) => {
      if (event.button === 0) {
        if (noPropagation) {
          event.stopPropagation();
        }
        dispatch({
          type: 'DOWN',
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          screenX: event.screenX,
          screenY: event.screenY,
          clientX: event.clientX,
          clientY: event.clientY,
          boundingRect: event.currentTarget.getBoundingClientRect(),
        });

        setMouseDownTime(event.timeStamp);
      }
      return false;
    },
    [noPropagation],
  );

  const clickHandler = useCallback(
    (e) => {
      e.persist();
      const timeStamp = e.timeStamp;
      const boundingRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - boundingRect.x;
      const y = e.clientY - boundingRect.y;

      const callback = lodashDebounce(() => {
        if (
          timeStamp - mouseDownTime <= 150 &&
          debounceClickEventsRef.current.length === 1
        ) {
          onClick({ ...e, x, y });
        }
        debounceClickEventsRef.current = [];
      }, 200);

      debounceClickEventsRef.current.push(callback);

      callback();

      if (debounceClickEventsRef.current.length > 1) {
        lodashMap(debounceClickEventsRef.current, (debounce) =>
          debounce.cancel(),
        );
        debounceClickEventsRef.current = [];
        onDoubleClick({ ...e, x, y });
      }
    },
    [mouseDownTime, onClick, onDoubleClick],
  );

  const handleMouseWheel = useCallback(
    (event) => {
      const boundingRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - boundingRect.x;
      const y = event.clientY - boundingRect.y;

      const { deltaY, deltaX, shiftKey, deltaMode } = event;
      onZoom({ deltaY: deltaY || deltaX, shiftKey, deltaMode, x, y });
    },
    [onZoom],
  );

  useEffect(() => {
    const { step, startX, endX } = state;
    if (step === 'end' && Math.abs(startX - endX) > 5) {
      onBrush(state);
      dispatch({
        type: 'DONE',
      });
    }
  }, [onBrush, state]);

  const moveCallback = useCallback((event) => {
    dispatch({
      type: 'MOVE',
      screenX: event.screenX,
      screenY: event.screenY,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }, []);

  const upCallback = useCallback((event) => {
    dispatch({
      type: 'UP',
      clientX: event.clientX,
      clientY: event.clientY,
    });
    return false;
  }, []);

  return (
    <BrushContext.Provider value={state}>
      <div
        className={className}
        style={style}
        onMouseDown={mouseDownHandler}
        onMouseUp={upCallback}
        onMouseMove={moveCallback}
        onClick={clickHandler}
        onWheel={handleMouseWheel}
      >
        {children}
      </div>
    </BrushContext.Provider>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'UP':
      if (state.step === 'brushing' || state.step === 'start') {
        const { clientX, clientY } = action;

        return {
          ...state,
          endX: clientX - state.boundingRect.x,
          endY: clientY - state.boundingRect.y,

          step: state.step === 'start' ? 'initial' : 'end',
        };
      }
      return state;
    case 'DOWN':
      if (state.step === 'initial' || state.step === 'end') {
        const {
          screenX,
          screenY,
          clientX,
          clientY,
          boundingRect,
          shiftKey,
          altKey,
        } = action;
        const x = clientX - boundingRect.x;
        const y = clientY - boundingRect.y;

        return {
          ...state,
          shiftKey,
          altKey,
          startX: x,
          startY: y,
          startScreenX: screenX,
          startScreenY: screenY,
          startClientX: clientX,
          startClientY: clientY,
          boundingRect,
          step: 'start',
        };
      }
      return state;
    case 'MOVE':
      if (state.step === 'start' || state.step === 'brushing') {
        const { clientX, clientY } = action;

        return {
          ...state,
          step: 'brushing',
          endX: clientX - state.boundingRect.x,
          endY: clientY - state.boundingRect.y,
        };
      }
      return state;
    case 'DONE':
      if (state.step === 'end') {
        return {
          ...state,
          step: 'initial',
        };
      }
      break;
    default:
      return state;
  }
}