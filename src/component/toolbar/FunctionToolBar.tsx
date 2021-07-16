/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  SvgNmrBaselineCorrection,
  SvgNmrFourierTransform,
  SvgNmrIntegrate,
  SvgNmrMultipleAnalysis,
  SvgNmrPeakPicking,
  SvgNmrPhaseCorrection,
  SvgNmrRangePicking,
  SvgNmrZeroFilling,
} from 'cheminfo-font';
import lodashGet from 'lodash/get';
import { useState, useEffect, useCallback, memo } from 'react';
import { FaSearchPlus, FaExpand, FaDiceFour } from 'react-icons/fa';

import { Filters } from '../../data/Filters';
import { Info as Datum1DInfo, Data1D } from '../../data/data1d/Spectrum1D';
import { Info as Datum2DInfo, Data2D } from '../../data/data2d/Spectrum2D';
import { useChartData } from '../context/ChartContext';
import { useDispatch } from '../context/DispatchContext';
import { usePreferences } from '../context/PreferencesContext';
import ToolTip from '../elements/ToolTip/ToolTip';
import { useHelp } from '../elements/popup/Help/Context';
import ToggleButton from '../elements/toggle/ToggleButton';
import ToggleButtonGroup from '../elements/toggle/ToggleButtonGroup';
import useDatumWithSpectraStatistics from '../hooks/useDatumWithSpectraStatistics';
import useToolsFunctions from '../hooks/useToolsFunctions';
import { ActiveSpectrum } from '../reducer/Reducer';
import { DISPLAYER_MODE } from '../reducer/core/Constants';
import { APPLY_FFT_FILTER, SET_SELECTED_FILTER } from '../reducer/types/Types';

import { options } from './ToolTypes';

const styles = css`
  button {
    background-color: transparent;
    border: none;
    width: 35px;
    height: 35px;
    min-height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: outline;
    :focus {
      outline: none !important;
    }import { Datum1D } from './../../data/data1d/Spectrum1D';


    &.fa {
      svg {
        font-size: 14px;
      }
    }
    &.cheminfo {
      svg {
        font-size: 18px;
      }
    }
  }
`;

interface FunctionToolBarInnerProps {
  defaultValue: string;
  activeSpectrum: ActiveSpectrum | null;
  fidCounter: number;
  ftCounter: number;
  displayerMode: DISPLAYER_MODE;
  info: Datum1DInfo | Datum2DInfo;
  datum: Data1D | Data2D;
}

function FunctionToolBarInner({
  defaultValue,
  activeSpectrum,
  info,
  datum,
  displayerMode,
  ftCounter,
  fidCounter,
}: FunctionToolBarInnerProps) {
  const [option, setOption] = useState<string>('');
  const help = useHelp();
  const preferences = usePreferences();

  const dispatch = useDispatch();

  const { handleChangeOption, handleFullZoomOut } = useToolsFunctions();

  const handleChange = useCallback(
    (selectedOption) => {
      setOption(selectedOption);
      handleChangeOption(selectedOption);
    },
    [handleChangeOption],
  );

  useEffect(() => {
    setOption(defaultValue);
  }, [defaultValue]);

  const handleOnFFTFilter = useCallback(() => {
    dispatch({
      type: APPLY_FFT_FILTER,
      value: '',
    });
    dispatch({ type: SET_SELECTED_FILTER, selectedFilter: null });
  }, [dispatch]);

  const isButtonVisible = useCallback(
    (toolKey) => {
      return !lodashGet(preferences, `display.toolBarButtons.${toolKey}`);
    },
    [preferences],
  );
  const isPanelVisible = useCallback(
    (panelKey) => {
      return !lodashGet(preferences, `display.panels.${panelKey}`);
    },
    [preferences],
  );
  return (
    <div css={styles}>
      <ToggleButtonGroup value={option} onChange={handleChange}>
        {isButtonVisible('hideZoomTool') && (
          <ToggleButton
            key={options.zoom.id}
            value={options.zoom.id}
            {...help.onHover}
            helpID="zoomIn"
            className="fa"
          >
            <ToolTip
              title={`${options.zoom.label} ( Press z )`}
              popupPlacement="right"
              offset={{ x: 10, y: 0 }}
              style={{ display: 'flex' }}
            >
              <FaSearchPlus />
            </ToolTip>
          </ToggleButton>
        )}

        {isButtonVisible('hideZoomOutTool') && (
          <button className="fa" type="button" onClick={handleFullZoomOut}>
            <ToolTip
              title="Horizontal zoom out ( Press f ), Horizontal and Vertical zoom out, double click ( Press ff )"
              popupPlacement="right"
            >
              <FaExpand />
            </ToolTip>
          </button>
        )}

        {displayerMode === DISPLAYER_MODE.DM_1D &&
          isButtonVisible('hidePeakTool') && (
            <ToggleButton
              key={options.peakPicking.id}
              value={options.peakPicking.id}
              className="cheminfo"
              isVisible={activeSpectrum && !info?.isFid ? true : false}
              {...help.onHover}
              helpID="peakPicking"
            >
              <ToolTip
                title={`${options.peakPicking.label} ( Press p )`}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <SvgNmrPeakPicking />
              </ToolTip>
            </ToggleButton>
          )}
        {displayerMode === DISPLAYER_MODE.DM_1D &&
          isButtonVisible('hideIntegralTool') && (
            <ToggleButton
              key={options.integral.id}
              value={options.integral.id}
              className="cheminfo"
              isVisible={activeSpectrum && !info?.isFid ? true : false}
              {...help.onHover}
              helpID="integralPicking"
            >
              <ToolTip
                title={`${options.integral.label} ( Press i )`}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <SvgNmrIntegrate />
              </ToolTip>
            </ToggleButton>
          )}
        {displayerMode === DISPLAYER_MODE.DM_2D &&
          isButtonVisible('hideIntegralTool') && (
            <ToggleButton
              key={options.zone2D.id}
              value={options.zone2D.id}
              className="fa"
              isVisible={activeSpectrum ? true : false}
            >
              <ToolTip
                title={`${options.zone2D.label} ( Press r )`}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <FaDiceFour />
              </ToolTip>
            </ToggleButton>
          )}
        {displayerMode === DISPLAYER_MODE.DM_2D && (
          <ToggleButton
            key={options.slicingTool.id}
            value={options.slicingTool.id}
            isVisible={activeSpectrum ? true : false}
          >
            <ToolTip
              title={`${options.slicingTool.label}`}
              popupPlacement="right"
              offset={{ x: 10, y: 0 }}
            >
              Slic
            </ToolTip>
          </ToggleButton>
        )}
        {displayerMode === DISPLAYER_MODE.DM_1D &&
          isButtonVisible('hideAutoRangesTool') && (
            <ToggleButton
              key={options.rangesPicking.id}
              value={options.rangesPicking.id}
              className="cheminfo"
              isVisible={activeSpectrum && !info?.isFid ? true : false}
            >
              <ToolTip
                title={options.rangesPicking.label}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <SvgNmrRangePicking />
              </ToolTip>
            </ToggleButton>
          )}
        {displayerMode === DISPLAYER_MODE.DM_1D &&
          isButtonVisible('hideMultipleSpectraAnalysisTool') &&
          ((activeSpectrum && !info?.isFid && ftCounter > 1) ||
            (!activeSpectrum && fidCounter === 0)) && (
            <ToggleButton
              key={options.multipleSpectraAnalysis.id}
              value={options.multipleSpectraAnalysis.id}
              className="cheminfo"
            >
              <ToolTip
                title={options.multipleSpectraAnalysis.label}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <SvgNmrMultipleAnalysis />
              </ToolTip>
            </ToggleButton>
          )}
        {displayerMode === DISPLAYER_MODE.DM_1D &&
          isButtonVisible('hideZeroFillingTool') && (
            <ToggleButton
              key={options.zeroFilling.id}
              value={options.zeroFilling.id}
              className="cheminfo"
              isVisible={Filters.zeroFilling.isApplicable({ info })}
            >
              <ToolTip
                title={options.zeroFilling.label}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <SvgNmrZeroFilling />
              </ToolTip>
            </ToggleButton>
          )}
        {displayerMode === DISPLAYER_MODE.DM_1D &&
          isButtonVisible('hidePhaseCorrectionTool') && (
            <ToggleButton
              key={options.phaseCorrection.id}
              value={options.phaseCorrection.id}
              className="cheminfo"
              isVisible={
                activeSpectrum &&
                info &&
                Filters.phaseCorrection.isApplicable({ info }) &&
                (datum as Data1D).im
                  ? true
                  : false
              }
            >
              <ToolTip
                title={options.phaseCorrection.label}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <SvgNmrPhaseCorrection />
              </ToolTip>
            </ToggleButton>
          )}

        {displayerMode === DISPLAYER_MODE.DM_1D &&
          isButtonVisible('hideBaseLineCorrectionTool') && (
            <ToggleButton
              key={options.baseLineCorrection.id}
              value={options.baseLineCorrection.id}
              className="cheminfo"
              isVisible={
                activeSpectrum &&
                info &&
                Filters.baselineCorrection.isApplicable({ info })
                  ? true
                  : false
              }
            >
              <ToolTip
                title={options.baseLineCorrection.label}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <SvgNmrBaselineCorrection />
              </ToolTip>
            </ToggleButton>
          )}

        {displayerMode === DISPLAYER_MODE.DM_1D &&
          isButtonVisible('hideExclusionZonesTool') &&
          isPanelVisible('hideMultipleSpectraAnalysisPanel') &&
          !info?.isFid && (
            <ToggleButton
              key={options.exclusionZones.id}
              value={options.exclusionZones.id}
              className="cheminfo"
            >
              <ToolTip
                title={options.exclusionZones.label}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              >
                <SvgNmrMultipleAnalysis />
              </ToolTip>
            </ToggleButton>
          )}
      </ToggleButtonGroup>

      {displayerMode === DISPLAYER_MODE.DM_1D &&
        isButtonVisible('hideFFTTool') &&
        info &&
        Filters.fft.isApplicable({ info }) && (
          <button
            className="cheminfo"
            type="button"
            onClick={handleOnFFTFilter}
            data-test-id="tool-FFT-filter"
          >
            <ToolTip
              title={`FFT Filter`}
              popupPlacement="right"
              offset={{ x: 10, y: 0 }}
            >
              <SvgNmrFourierTransform />
            </ToolTip>
          </button>
        )}
    </div>
  );
}

const MemoizedFunctionToolBar = memo(FunctionToolBarInner);

export default function FunctionToolBar({
  defaultValue = options.zoom.id,
}: {
  defaultValue?: string;
}) {
  const { activeSpectrum, verticalAlign, displayerMode, activeTab } =
    useChartData();

  const data = useDatumWithSpectraStatistics();

  return (
    <MemoizedFunctionToolBar
      {...{
        ...data,
        activeSpectrum,
        verticalAlign,
        displayerMode,
        activeTab,
        defaultValue,
      }}
    />
  );
}
