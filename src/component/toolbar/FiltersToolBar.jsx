import React, { useCallback, useState, useEffect } from 'react';

import { useDispatch } from '../context/DispatchContext';
import { SET_SELECTED_FILTER, APPLY_FFT_FILTER } from '../reducer/Actions';
import ToolTip from '../elements/ToolTip/ToolTip';
import { ToggleButton, ToggleButtonGroup } from '../elements/toggle';
import { Filters } from '../../data/data1d/filter1d/Filters';
import { isApplicable as isZeroFillingApplicable } from '../../data/data1d/filter1d/zeroFilling';
import { isApplicable as isFFTApplicable } from '../../data/data1d/filter1d/fft';
import { isApplicable as isManualPhaseCorrectionApplicable } from '../../data/data1d/filter1d/phaseCorrection';
import { useChartData } from '../context/ChartContext';

const styles = {
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    width: '35px',
    height: '35px',
  },
  icon: {
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '18px 18px',
  },
};

const BasicToolBar = () => {
  const [option, setOption] = useState();
  const dispatch = useDispatch();
  const [selectedSpectrumInfo, setSelectedSpectrumInfo] = useState();
  const { data, activeSpectrum } = useChartData();
  const handleChangeOption = useCallback(
    (selectedFilter) => dispatch({ type: SET_SELECTED_FILTER, selectedFilter }),
    [dispatch],
  );

  const handleChange = useCallback(
    (selectedOption) => {
      setOption(selectedOption);
      handleChangeOption(selectedOption);
    },
    [handleChangeOption],
  );

  const handleOnFFTFilter = useCallback(() => {
    dispatch({
      type: APPLY_FFT_FILTER,
      value: '',
    });
    dispatch({ type: SET_SELECTED_FILTER, selectedFilter: null });
  }, [dispatch]);

  useEffect(() => {
    if (data && activeSpectrum) {
      const { info } = data.find((d) => d.id === activeSpectrum.id);
      setSelectedSpectrumInfo({ info });
    } else {
      setSelectedSpectrumInfo({ info: { isComplex: false, isFid: false } });
    }
  }, [activeSpectrum, data]);
  return (
    <>
      <ToggleButtonGroup value={option} onChange={handleChange}>
        {selectedSpectrumInfo && isZeroFillingApplicable(selectedSpectrumInfo) && (
          <ToggleButton
            key={Filters.zeroFilling.name}
            value={Filters.zeroFilling.name}
            className="ci-icon-nmr-zero-filling"
            style={styles.icon}
          >
            <ToolTip
              title={`Zero Filling Filter`}
              popupPlacement="right"
              offset={{ x: 10, y: 0 }}
            />
          </ToggleButton>
        )}

        {selectedSpectrumInfo &&
          isManualPhaseCorrectionApplicable(selectedSpectrumInfo) && (
            <ToggleButton
              key={Filters.phaseCorrection.name}
              value={Filters.phaseCorrection.name}
              className="ci-icon-nmr-phase-correction"
              style={styles.icon}
            >
              <ToolTip
                title={`Manual Phase Correction`}
                popupPlacement="right"
                offset={{ x: 10, y: 0 }}
              />
            </ToggleButton>
          )}
      </ToggleButtonGroup>

      {selectedSpectrumInfo && isFFTApplicable(selectedSpectrumInfo) && (
        <button
          className="ci-icon-nmr-fourier-transform"
          style={{ ...styles.icon, ...styles.button }}
          type="button"
          onClick={handleOnFFTFilter}
        >
          <ToolTip
            title={`FFT Filter`}
            popupPlacement="right"
            offset={{ x: 10, y: 0 }}
          />
        </button>
      )}
    </>
  );
};

export default BasicToolBar;
