/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FaFlask, FaSlidersH } from 'react-icons/fa';

import { useChartData } from '../../context/ChartContext';
import { useDispatch } from '../../context/DispatchContext';
import Select from '../../elements/Select';
import ToolTip from '../../elements/ToolTip/ToolTip';
import { useModal } from '../../elements/popup/Modal';
import { DISPLAYER_MODE } from '../../reducer/core/Constants';
import {
  SET_CORRELATION,
  SET_CORRELATIONS,
  SET_CORRELATIONS_MF,
  SET_CORRELATIONS_TOLERANCE,
} from '../../reducer/types/Types';
import DefaultPanelHeader from '../header/DefaultPanelHeader';

import CorrelationTable from './CorrelationTable/CorrelationTable';
import Overview from './Overview';
import SetMolecularFormulaModal from './SetMolecularFormulaModal';
import SetShiftToleranceModal from './SetShiftTolerancesModal';
import {
  findSignalMatch1D,
  findSignalMatch2D,
  findSpectrum,
  getAtomType,
} from './Utilities';

const panelStyle = css`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;
  width: 100%;
  justify-content: center,
  align-items: 'center',

  button {
    border-radius: 5px;
    margin-top: 3px;
    margin-left: 2px;
    border: none;
    height: 16px;
    width: 18px;
    font-size: 12px;
    padding: 0;
    background-color: transparent;
  }

  .overview-container {
    width: 100%;
    margin-left: 15px;
    white-space: nowrap;
    span {
      margin-left: 8px;
    }
  }

  .homoHeteroKinds-container {
    width: 100%;
    margin-left: 15px;
    span {
      margin-left: 7px;
    }
  }


`;

function SummaryPanel() {
  const {
    molecules,
    correlations: correlationsData,
    data: spectraData,
    xDomain,
    yDomain,
    displayerMode,
    activeTab,
  } = useChartData();

  const dispatch = useDispatch();
  const modal = useModal();

  const [additionalColumnData, setAdditionalColumnData] = useState([]);
  const [
    selectedAdditionalColumnsAtomType,
    setSelectedAdditionalColumnsAtomType,
  ] = useState<string>('-');
  const [showProtonsAsRows, setShowProtonsAsRows] = useState(false);
  const [filterIsActive, setFilterIsActive] = useState(false);

  const filteredCorrelationsData = useMemo(() => {
    const isInView = (value) => {
      if (value.pseudo === true) {
        return false;
      }
      const atomTypesInView = activeTab
        .split(',')
        .map((tab) => getAtomType(tab));

      const factor = 10000;
      const xDomain0 = xDomain[0] * factor;
      const xDomain1 = xDomain[1] * factor;
      const yDomain0 = yDomain[0] * factor;
      const yDomain1 = yDomain[1] * factor;

      if (displayerMode === DISPLAYER_MODE.DM_1D) {
        const delta = value.signal.delta * factor;
        const spectrum = findSpectrum(spectraData, value);
        if (
          spectrum &&
          atomTypesInView[0] === value.atomType &&
          delta >= xDomain0 &&
          delta <= xDomain1
        ) {
          return true;
        }
        // try to find a link which contains the belonging 2D signal in the spectra in view
        if (
          value.link.some((link) => {
            const spectrum = findSpectrum(spectraData, link);
            return findSignalMatch1D(
              spectrum,
              link,
              factor,
              xDomain0,
              xDomain1,
            );
          })
        ) {
          return true;
        }
      } else if (displayerMode === DISPLAYER_MODE.DM_2D) {
        if (!atomTypesInView.includes(value.atomType)) {
          return false;
        }
        const spectrum = findSpectrum(spectraData, value);
        // correlation is represented by a 2D signal
        if (
          findSignalMatch2D(
            spectrum,
            value,
            factor,
            xDomain0,
            xDomain1,
            yDomain0,
            yDomain1,
          )
        ) {
          return true;
        } else {
          // try to find a link which contains the belonging 2D signal in the spectra in view
          if (
            value.link.some((link) => {
              const spectrum = findSpectrum(spectraData, link);
              return findSignalMatch2D(
                spectrum,
                link,
                factor,
                xDomain0,
                xDomain1,
                yDomain0,
                yDomain1,
              );
            })
          ) {
            return true;
          }
        }
      }
      // do not show correlation
      return false;
    };

    if (correlationsData) {
      const _values = filterIsActive
        ? correlationsData.values.filter((value) => isInView(value))
        : correlationsData.values;

      return { ...correlationsData, values: _values };
    }
  }, [
    activeTab,
    correlationsData,
    displayerMode,
    filterIsActive,
    spectraData,
    xDomain,
    yDomain,
  ]);

  const handleOnSetMolecularFormula = useCallback(
    (mf) => {
      dispatch({
        type: SET_CORRELATIONS_MF,
        payload: {
          mf,
        },
      });
    },
    [dispatch],
  );

  const handleOnSetShiftTolerance = useCallback(
    (tolerance) => {
      dispatch({
        type: SET_CORRELATIONS_TOLERANCE,
        payload: {
          tolerance,
        },
      });
    },
    [dispatch],
  );

  const showSetMolecularFormulaModal = useCallback(() => {
    modal.show(
      <SetMolecularFormulaModal
        onClose={() => modal.close()}
        onSave={handleOnSetMolecularFormula}
        molecules={molecules}
        previousMF={correlationsData.options.mf}
      />,
    );
  }, [correlationsData, handleOnSetMolecularFormula, modal, molecules]);

  const showSetShiftToleranceModal = useCallback(() => {
    modal.show(
      <SetShiftToleranceModal
        onClose={() => modal.close()}
        onSave={handleOnSetShiftTolerance}
        previousTolerance={correlationsData.options.tolerance}
      />,
    );
  }, [correlationsData, handleOnSetShiftTolerance, modal]);

  const additionalColumnTypes = useMemo(() => {
    const columnTypes = ['-'].concat(
      correlationsData
        ? correlationsData.values
            .map((correlation) => correlation.atomType)
            .filter((atomType, i, array) => array.indexOf(atomType) === i)
        : [],
    );

    if (columnTypes.includes('H')) {
      columnTypes.push('H-H');
    }

    if (columnTypes.includes('H')) {
      setSelectedAdditionalColumnsAtomType('H');
    } else {
      setSelectedAdditionalColumnsAtomType('-');
    }

    return columnTypes.map((columnType) => {
      return {
        key: columnType,
        label: columnType,
        value: columnType,
      };
    });
  }, [correlationsData]);

  useEffect(() => {
    const _selectedAdditionalColumnsAtomType =
      selectedAdditionalColumnsAtomType.split('-')[0];

    setAdditionalColumnData(
      filteredCorrelationsData
        ? filteredCorrelationsData.values
            .filter(
              (correlation) =>
                correlation.atomType === _selectedAdditionalColumnsAtomType,
            )
            .reverse()
        : [],
    );
  }, [filteredCorrelationsData, selectedAdditionalColumnsAtomType]);

  const editEquivalencesSaveHandler = useCallback(
    (correlation, value) => {
      dispatch({
        type: SET_CORRELATION,
        payload: {
          id: correlation.id,
          correlation: {
            ...correlation,
            equivalence: value,
            edited: { ...correlation.edited, equivalence: true },
          },
        },
      });
    },
    [dispatch],
  );

  const editProtonsCountSaveHandler = useCallback(
    (correlation, valuesString) => {
      let values;
      // eslint-disable-next-line prefer-named-capture-group
      if (valuesString.match(/^([0-9],{0,1})+$/g)) {
        // allow digits followed by optional comma only
        values = valuesString
          .split(',')
          .filter((char) => char.length > 0)
          .map((char) => Number(char));
      } else if (valuesString.trim().length === 0) {
        // set values to default
        values = [];
      }

      if (values) {
        // ignore not supported text input
        dispatch({
          type: SET_CORRELATION,
          payload: {
            id: correlation.id,
            correlation: {
              ...correlation,
              protonsCount: values,
              edited: { ...correlation.edited, protonsCount: true },
            },
          },
        });
      }
    },
    [dispatch],
  );

  const changeHybridizationSaveHandler = useCallback(
    (correlation, value) => {
      dispatch({
        type: SET_CORRELATION,
        payload: {
          id: correlation.id,
          correlation: {
            ...correlation,
            hybridization: value,
            edited: { ...correlation.edited, hybridization: true },
          },
        },
      });
    },
    [dispatch],
  );

  const editAdditionalColumnFieldSaveHandler = useCallback(
    (rowCorrelation, columnCorrelation) => {
      dispatch({
        type: SET_CORRELATIONS,
        payload: {
          ids: [rowCorrelation.id, columnCorrelation.id],
          correlations: [
            {
              ...rowCorrelation,
              edited: {
                ...rowCorrelation.edited,
                additionalColumnField: true,
              },
            },
            {
              ...columnCorrelation,
              edited: {
                ...columnCorrelation.edited,
                additionalColumnField: true,
              },
            },
          ],
        },
      });
    },
    [dispatch],
  );

  const handleOnFilter = useCallback(() => {
    setFilterIsActive(!filterIsActive);
  }, [filterIsActive]);

  return (
    <div css={panelStyle}>
      <DefaultPanelHeader
        canDelete={false}
        counter={correlationsData ? correlationsData.values.length : 0}
        onFilter={handleOnFilter}
        filterToolTip={
          filterIsActive
            ? 'Show all correlations'
            : 'Hide correlations out of view'
        }
        filterIsActive={filterIsActive}
        counterFiltered={filteredCorrelationsData?.values.length}
      >
        <ToolTip
          title={`Set molecular formula (${correlationsData.options.mf})`}
          popupPlacement="right"
        >
          <button type="button" onClick={showSetMolecularFormulaModal}>
            <FaFlask />
          </button>
        </ToolTip>
        <ToolTip title={`Set shift tolerance`} popupPlacement="right">
          <button type="button" onClick={showSetShiftToleranceModal}>
            <FaSlidersH />
          </button>
        </ToolTip>
        <div className="overview-container">
          <Overview correlationsData={correlationsData} />
        </div>
        <div className="homoHeteroKinds-container">
          <Select
            onChange={(selection) => {
              setSelectedAdditionalColumnsAtomType(selection);
              if (selection === 'H-H') {
                setShowProtonsAsRows(true);
              } else {
                setShowProtonsAsRows(false);
              }
            }}
            data={additionalColumnTypes}
            defaultValue={selectedAdditionalColumnsAtomType}
            style={{
              width: '65px',
              height: '20px',
              border: '1px solid grey',
            }}
          />
        </div>
      </DefaultPanelHeader>
      <CorrelationTable
        correlationsData={correlationsData}
        filteredCorrelationsData={filteredCorrelationsData}
        additionalColumnData={additionalColumnData}
        editEquivalencesSaveHandler={editEquivalencesSaveHandler}
        changeHybridizationSaveHandler={changeHybridizationSaveHandler}
        editProtonsCountSaveHandler={editProtonsCountSaveHandler}
        editAdditionalColumnFieldSaveHandler={
          editAdditionalColumnFieldSaveHandler
        }
        showProtonsAsRows={showProtonsAsRows}
        spectraData={spectraData}
      />
    </div>
  );
}

export default memo(SummaryPanel);
