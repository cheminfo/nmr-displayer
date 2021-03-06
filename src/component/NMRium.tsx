/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import lodashGet from 'lodash/get';
import {
  useEffect,
  useCallback,
  useReducer,
  useState,
  useMemo,
  useRef,
  memo,
  Reducer,
  CSSProperties,
  ReactElement,
  ReactNode,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SplitPane from 'react-split-pane';
import { useToggle, useFullscreen } from 'react-use';

import { Datum1D } from '../data/data1d/Spectrum1D';
import { Datum2D } from '../data/data2d/Spectrum2D';
import checkModifierKeyActivated from '../data/utilities/checkModifierKeyActivated';

import Viewer1D from './1d/Viewer1D';
import Viewer2D from './2d/Viewer2D';
import ErrorOverlay from './ErrorOverlay';
import KeysListenerTracker from './EventsTrackers/KeysListenerTracker';
import { AssignmentProvider } from './assignment';
import { ChartDataProvider } from './context/ChartContext';
import { DispatchProvider } from './context/DispatchContext';
import { GlobalProvider } from './context/GlobalContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { AlertProvider } from './elements/popup/Alert';
import { HelpProvider } from './elements/popup/Help';
import { ModalProvider } from './elements/popup/Modal';
import Header from './header/Header';
import { HighlightProvider } from './highlight';
import DropZone from './loader/DropZone';
import { defaultGetSpinner, SpinnerProvider } from './loader/SpinnerContext';
import Panels from './panels/Panels';
import checkActionType from './reducer/IgnoreActions';
import {
  spectrumReducer,
  initialState,
  dispatchMiddleware,
  intiState,
} from './reducer/Reducer';
import { DISPLAYER_MODE } from './reducer/core/Constants';
import preferencesReducer, {
  preferencesInitialState,
  INIT_PREFERENCES,
} from './reducer/preferencesReducer';
import {
  INITIATE,
  SET_WIDTH,
  SET_LOADING_FLAG,
  SET_MOUSE_OVER_DISPLAYER,
} from './reducer/types/Types';
import ToolBar from './toolbar/ToolBar';

const splitPaneStyles: Record<'container' | 'resizer' | 'pane', CSSProperties> =
  {
    container: {
      position: 'relative',
      height: 'none',
    },
    resizer: {
      width: 10,
      backgroundColor: '#f7f7f7',
      cursor: 'ew-resize',
    },
    pane: { overflow: 'hidden' },
  };

const containerStyles = css`
  background-color: white;
  width: 100%;
  display: block;
  height: 100%;
  font-size: 14px;

  div:focus {
    outline: none !important;
  }

  button {
    cursor: pointer;
    color: black;
    &:disabled {
      cursor: default;
    }
  }

  button:active,
  button:hover,
  button:focus,
  [type='button']:focus,
  button {
    outline: none !important;
  }
  * {
    -webkit-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .SplitPane {
    height: 100%;
  }

  .Resizer.vertical:after {
    content: '\\22EE';
    top: 50%;
    color: black;
    position: absolute;
    font-size: 14px;
  }

  .Resizer.vertical {
    padding: 2px;
  }

  .Resizer.vertical:hover {
    background-color: #dfdfdf !important;
    border-left: 0.55px #bbbbbbimport preferencesReducer from './reducer/preferencesReducer';
 solid;
    border-right: 0.55px #bbbbbb solid;
  }
`;

export enum NMRiumMode {
  EXERCISE_1D = 'exercise1D',
  PROCESS_1D = 'process1D',
  DEFAULT = 'default',
}

export interface NMRiumProps {
  data?: NMRiumData;
  onDataChange?: (data: any) => void;
  mode?: NMRiumMode;
  preferences?: NMRiumPreferences;
  emptyText?: ReactNode;
  initialShowPanels?: boolean;
  /**
   * Returns a custom spinner that will be rendered while loading data.
   */
  getSpinner?: () => ReactElement;
}

export type NMRiumPreferences = Partial<{
  general: Partial<{
    disableMultipletAnalysis: boolean;
    hideSetSumFromMolecule: boolean;
  }>;
  panels: Partial<{
    hideSpectraPanel: boolean;
    hideInformationPanel: boolean;
    hidePeaksPanel: boolean;
    hideIntegralsPanel: boolean;
    hideRangesPanel: boolean;
    hideStructuresPanel: boolean;
    hideFiltersPanel: boolean;
    hideZonesPanel: boolean;
    hideSummaryPanel: boolean;
    hideMultipleSpectraAnalysisPanel: boolean;
  }>;
  toolBarButtons: Partial<{
    hideZoomTool: boolean;
    hideZoomOutTool: boolean;
    hideImport: boolean;
    hideExportAs: boolean;
    hideSpectraStackAlignments: boolean;
    hideSpectraCenterAlignments: boolean;
    hideRealImaginary: boolean;
    hidePeakTool: boolean;
    hideIntegralTool: boolean;
    hideAutoRangesTool: boolean;
    hideZeroFillingTool: boolean;
    hidePhaseCorrectionTool: boolean;
    hideBaseLineCorrectionTool: boolean;
    hideFFTTool: boolean;
    hideMultipleSpectraAnalysisTool: boolean;
  }>;
}>;

export type Molecules = Array<{ molfile: string }>;
export type Spectra = Array<Datum1D | Datum2D>;

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface NMRiumData {
  molecules?: Molecules;
  spectra: DeepPartial<Spectra>;
}

const defaultPreferences = {};
const defaultData: NMRiumData = {
  spectra: [],
};

function NMRium({
  data: dataProp = defaultData,
  mode = NMRiumMode.DEFAULT,
  preferences = defaultPreferences,
  getSpinner = defaultGetSpinner,
  onDataChange,
  emptyText,
  initialShowPanels = true,
}: NMRiumProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const elementsWraperRef = useRef<HTMLDivElement>(null);
  const [show, toggle] = useToggle(false);

  const isFullscreen = useFullscreen(rootRef, show, {
    onClose: () => {
      toggle(false);
    },
  });
  const [isRightPanelHide, hideRightPanel] = useState(!initialShowPanels);
  const [isResizeEventStart, setResizeEventStart] = useState(false);

  const [state, dispatch] = useReducer<Reducer<any, any>, any>(
    spectrumReducer,
    initialState,
    intiState,
  );

  const [preferencesState, dispatchPreferences] = useReducer<Reducer<any, any>>(
    preferencesReducer,
    preferencesInitialState,
  );

  const { displayerMode, data: spectraData } = state;

  useEffect(() => {
    if (checkActionType(state.actionType)) {
      onDataChange?.(state);
    }
  }, [onDataChange, state]);

  const dispatchMiddleWare = useMemo(() => {
    return dispatchMiddleware(dispatch);
  }, []);

  useEffect(() => {
    rootRef.current?.focus();
  }, [isFullscreen]);

  useEffect(() => {
    dispatchPreferences({
      type: INIT_PREFERENCES,
      payload: {
        display: preferences,
        mode,
        dispatch: dispatchPreferences,
      },
    });
  }, [preferences, mode]);

  useEffect(() => {
    dispatchMiddleWare({ type: SET_LOADING_FLAG, isLoading: true });
    if (dataProp) {
      dispatchMiddleWare({ type: INITIATE, payload: dataProp });
    }
  }, [dataProp, dispatchMiddleWare]);

  const handleSplitPanelDragFinished = useCallback(
    (size) => {
      if (size && !isRightPanelHide) {
        setResizeEventStart(false);
        dispatch({ type: SET_WIDTH, width: size });
      }
    },
    [isRightPanelHide],
  );

  const preventAutoHelp = useMemo(() => {
    return lodashGet(
      preferencesState,
      'controllers.help.preventAutoHelp',
      false,
    );
  }, [preferencesState]);

  const rightPanelHandler = useCallback((e) => {
    e.stopPropagation();
    hideRightPanel((prevFlag) => !prevFlag);
  }, []);

  const preventContextMenuHandler = useCallback((e) => {
    if (!checkModifierKeyActivated(e)) {
      e.preventDefault();
    }
  }, []);
  const mouseEnterHandler = useCallback(() => {
    dispatchMiddleWare({ type: SET_MOUSE_OVER_DISPLAYER, payload: true });
  }, [dispatchMiddleWare]);
  const mouseLeaveHandler = useCallback(() => {
    dispatchMiddleWare({ type: SET_MOUSE_OVER_DISPLAYER, payload: false });
  }, [dispatchMiddleWare]);

  const chartDataContextValue = useMemo(
    () => ({ ...state, isResizeEventStart }),
    [state, isResizeEventStart],
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorOverlay}>
      <GlobalProvider
        value={{
          rootRef: rootRef.current,
          elementsWraperRef: elementsWraperRef.current,
        }}
      >
        <PreferencesProvider value={preferencesState}>
          <div
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}
            style={{ height: '100%', position: 'relative' }}
          >
            <HelpProvider
              wrapperRef={elementsWraperRef.current}
              preventAutoHelp={preventAutoHelp}
            >
              <AlertProvider wrapperRef={elementsWraperRef.current}>
                <DispatchProvider value={dispatchMiddleWare}>
                  <ChartDataProvider value={chartDataContextValue}>
                    <ModalProvider wrapperRef={elementsWraperRef.current}>
                      <HighlightProvider>
                        <AssignmentProvider spectraData={spectraData}>
                          <SpinnerProvider value={getSpinner}>
                            <div
                              className="nmrium-container"
                              ref={rootRef}
                              css={containerStyles}
                              onContextMenu={preventContextMenuHandler}
                            >
                              <Header
                                isFullscreen={isFullscreen}
                                onMaximize={toggle}
                              />

                              <div
                                style={{
                                  height: 'calc(100% - 36px)',
                                  width: '100%',
                                  backgroundColor: 'white',
                                }}
                              >
                                <DropZone>
                                  <KeysListenerTracker />

                                  <ToolBar />
                                  <SplitPane
                                    style={splitPaneStyles.container}
                                    resizerStyle={splitPaneStyles.resizer}
                                    paneStyle={splitPaneStyles.pane}
                                    pane1Style={
                                      isRightPanelHide
                                        ? {
                                            maxWidth: '100%',
                                            width: 'calc(100% - 10px)',
                                          }
                                        : { maxWidth: '80%' }
                                    }
                                    split="vertical"
                                    defaultSize={
                                      isRightPanelHide
                                        ? '99%'
                                        : 'calc(100% - 600px)'
                                    }
                                    minSize="80%"
                                    onDragFinished={
                                      handleSplitPanelDragFinished
                                    }
                                    onResizerDoubleClick={rightPanelHandler}
                                    onDragStarted={() => {
                                      setResizeEventStart(true);
                                    }}
                                  >
                                    <div
                                      style={{ width: '100%', height: '100%' }}
                                      data-test-id="viewer"
                                    >
                                      {displayerMode ===
                                      DISPLAYER_MODE.DM_1D ? (
                                        <Viewer1D emptyText={emptyText} />
                                      ) : (
                                        <Viewer2D emptyText={emptyText} />
                                      )}
                                    </div>
                                    {!isRightPanelHide ? <Panels /> : <div />}
                                  </SplitPane>
                                </DropZone>
                              </div>
                              <div
                                ref={elementsWraperRef}
                                key={String(isFullscreen)}
                                id="main-wrapper"
                                style={{
                                  position: 'absolute',
                                  pointerEvents: 'none',
                                  zIndex: 0,
                                  left: 0,
                                  right: 0,
                                  top: 0,
                                  bottom: 0,
                                }}
                              />
                            </div>
                          </SpinnerProvider>
                        </AssignmentProvider>
                      </HighlightProvider>
                    </ModalProvider>
                  </ChartDataProvider>
                </DispatchProvider>
              </AlertProvider>
            </HelpProvider>
          </div>
        </PreferencesProvider>
      </GlobalProvider>
    </ErrorBoundary>
  );
}

export default memo(NMRium);
