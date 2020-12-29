/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import lodash from 'lodash';
import { MF } from 'mf-parser';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FaFlask, FaSlidersH } from 'react-icons/fa';

import { SignalKindsToInclude } from '../../../data/constants/SignalsKinds';
import Correlation from '../../../data/correlation/Correlation';
import { checkSignalMatch } from '../../../data/correlation/Utilities';
import { useChartData } from '../../context/ChartContext';
import { useDispatch } from '../../context/DispatchContext';
import SelectUncontrolled from '../../elements/SelectUncontrolled';
import ToolTip from '../../elements/ToolTip/ToolTip';
import { useModal } from '../../elements/popup/Modal';
import {
  UPDATE_CORRELATIONS,
  SET_CORRELATION,
  SET_CORRELATION_MF,
  SET_CORRELATION_TOLERANCE,
  UNSET_CORRELATION_MF,
} from '../../reducer/types/Types';
import DefaultPanelHeader from '../header/DefaultPanelHeader';

import CorrelationTable from './CorrelationTable/CorrelationTable';
import Overview from './Overview';
import SetMolecularFormulaModal from './SetMolecularFormulaModal';
import SetShiftToleranceModal from './SetShiftTolerancesModal';
import { addToExperiments, getAtomType } from './Utilities';

const panelStyle = css`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;

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
    span {
      margin-left: 7px;
    }
  }

  .homoHeteroKinds-container {
    width: 100%;
    span {
      margin-left: 7px;
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    height: calc(100% - 20px);
    overflow: hidden;
    padding: 0;
  }
  .table-container {
    overflow: auto;
  }
`;

const SummaryPanel = memo(() => {
  const { data, molecules, correlations } = useChartData();
  const dispatch = useDispatch();
  const modal = useModal();

  const [mf, setMF] = useState();
  const [tolerance, setTolerance] = useState();
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const [atoms, setAtoms] = useState({});
  const [
    selectedAdditionalColumnsAtomType,
    setSelectedAdditionalColumnsAtomType,
  ] = useState('H');
  const [showProtonsAsRows, setShowProtonsAsRows] = useState(false);

  useEffect(() => {
    if (lodash.get(correlations, 'options.mf', false)) {
      setMF(correlations.options.mf);
    }
  }, [correlations]);

  useEffect(() => {
    if (lodash.get(correlations, 'options.tolerance', false)) {
      setTolerance(correlations.options.tolerance);
    }
  }, [correlations]);

  useEffect(() => {
    if (molecules && molecules.length > 0) {
      dispatch({ type: SET_CORRELATION_MF, mf: molecules[0].mf });
    } else {
      dispatch({ type: UNSET_CORRELATION_MF });
    }
  }, [dispatch, molecules]);

  useEffect(() => {
    dispatch({ type: SET_CORRELATION_TOLERANCE, tolerance });
  }, [dispatch, tolerance]);

  const showSetMolecularFormulaModal = useCallback(() => {
    modal.show(
      <SetMolecularFormulaModal
        onClose={() => modal.close()}
        onSave={(mf) => dispatch({ type: SET_CORRELATION_MF, mf })}
        molecules={molecules}
        previousMF={mf}
      />,
    );
  }, [dispatch, mf, modal, molecules]);

  const showSetShiftToleranceModal = useCallback(() => {
    modal.show(
      <SetShiftToleranceModal
        onClose={() => modal.close()}
        onSave={(_tolerance) => setTolerance(_tolerance)}
        previousTolerance={tolerance}
      />,
    );
  }, [modal, tolerance]);

  useEffect(() => (mf ? setAtoms(new MF(mf).getInfo().atoms) : setAtoms({})), [
    mf,
  ]);

  // all experiments
  const experiments = useMemo(() => {
    const _experiments = {};
    if (data) {
      data
        .filter((_data) => _data.info.isFid === false)
        .forEach((_data) => {
          if (!lodash.get(_experiments, `${_data.info.dimension}D`, false)) {
            _experiments[`${_data.info.dimension}D`] = {};
          }
          let _experiment = _data.info.experiment;
          if (
            !lodash.get(
              _experiments,
              `${_data.info.dimension}D.${_experiment}`,
              false,
            )
          ) {
            _experiments[`${_data.info.dimension}D`][`${_experiment}`] = [];
          }
          _experiments[`${_data.info.dimension}D`][`${_experiment}`].push(
            _data,
          );
        });
    }
    return _experiments;
  }, [data]);

  useEffect(() => {
    const _selectedAdditionalColumnsAtomType = selectedAdditionalColumnsAtomType.split(
      '-',
    )[0];

    setAdditionalColumns(
      correlations
        ? correlations.values.filter(
            (correlation) =>
              correlation.atomType === _selectedAdditionalColumnsAtomType,
          )
        : [],
    );
  }, [correlations, selectedAdditionalColumnsAtomType]);

  // general remark for all experiment types:
  // build an array of experiments, because one could have more than
  // one spectrum in spectra list for one atom type or experiment type

  // "plain" 1D experiments containing ranges, i.e. without DEPT etc.
  const experiments1D = useMemo(() => {
    const _experiments1D = {};
    Object.keys(atoms).forEach((atomType) => {
      addToExperiments(experiments, _experiments1D, '1D.1d', true, atomType);
    });

    return _experiments1D;
  }, [atoms, experiments]);

  // "extra" 1D experiments containing ranges, e.g. DEPT
  const experiments1DExtra = useMemo(() => {
    const _experiments1DExtra = {};
    Object.keys(lodash.get(experiments, `1D`, {}))
      .filter((experimentType) => experimentType !== '1d') // don't consider "plain" 1D experiments here
      .forEach((experimentType) => {
        addToExperiments(
          experiments,
          _experiments1DExtra,
          `1D.${experimentType}`,
          false,
          experimentType,
        );
      });

    return _experiments1DExtra;
  }, [experiments]);

  // 2D experiments containing zones
  const experiments2D = useMemo(() => {
    const _experiments2D = {};
    Object.keys(lodash.get(experiments, '2D', {})).forEach(
      (_experimentType) => {
        addToExperiments(
          experiments,
          _experiments2D,
          `2D.${_experimentType}`,
          false,
          _experimentType,
        );
      },
    );

    return _experiments2D;
  }, [experiments]);

  const signals1D = useMemo(() => {
    // store valid signals from 1D experiments
    const _signals1D = {};
    Object.keys(atoms).forEach((atomType) => {
      let _signals = [];
      if (lodash.get(experiments1D, `${atomType}`, []).length > 0) {
        // @TODO for now we will use the first occurring matched spectrum only (index)
        const index = 0;
        const __signals = experiments1D[`${atomType}`][index].ranges.values
          .map((_range) =>
            _range.signal.filter((_signal) =>
              SignalKindsToInclude.includes(_signal.kind),
            ),
          )
          .flat();
        __signals.forEach((__signal) => {
          if (
            !_signals.some((_signal) =>
              checkSignalMatch(_signal.signal, __signal, 0.0),
            )
          ) {
            _signals.push({
              experimentType: '1d',
              experimentID: experiments1D[`${atomType}`][index].id,
              atomType: atomType,
              signal: __signal,
            });
          }
        });

        _signals1D[atomType] = _signals;
      }
    });

    return _signals1D;
  }, [atoms, experiments1D]);

  const signalsDEPT = useMemo(() => {
    // store valid signals from 1D extra experiments, e.g. DEPT, APT
    const _signalsDEPT = {};
    // store valid signals from 2D experiments
    Object.keys(experiments1DExtra)
      .filter((experimentType) => experimentType === 'dept')
      .forEach((experimentType) =>
        experiments1DExtra[experimentType].forEach((experimentDEPT) => {
          let _signals = [];
          const mode = experimentDEPT.info.pulseSequence
            .match(/\d/g)
            .reduce((_mode, digit) => _mode + digit);
          const atomType = getAtomType(experimentDEPT.info.nucleus);
          const __signals = experimentDEPT.ranges.values
            .map((_range) =>
              _range.signal
                .filter((_signal) =>
                  SignalKindsToInclude.includes(_signal.kind),
                )
                .map((_signal) => {
                  return { ..._signal, sign: _range.absolute > 0 ? 1 : -1 };
                }),
            )
            .flat();
          __signals.forEach((__signal) => {
            if (
              !_signals.some((_signal) =>
                checkSignalMatch(_signal.signal, __signal, 0.0),
              )
            ) {
              _signals.push({
                experimentType,
                experimentID: experimentDEPT.id,
                mode,
                atomType,
                signal: __signal,
              });
            }
          });

          _signalsDEPT[mode] = _signals;
        }),
      );

    return _signalsDEPT;
  }, [experiments1DExtra]);

  const signals2D = useMemo(() => {
    // store valid signals from 2D experiments
    const _signals2D = {};
    Object.keys(experiments2D).forEach((_experimentType) => {
      let _signals = [];
      // @TODO for now we will use the first occurring matched spectrum only (index)
      const index = 0;
      const atomType = experiments2D[_experimentType][
        index
      ].info.nucleus.map((_nucleus) => getAtomType(_nucleus));
      const __signals = experiments2D[_experimentType][index].zones.values
        .map((_zone) =>
          _zone.signal.filter((_signal) =>
            SignalKindsToInclude.includes(_signal.kind),
          ),
        )
        .flat();
      __signals.forEach((__signal) => {
        if (
          !_signals.some(
            (_signal) =>
              checkSignalMatch(_signal.signal.x, __signal.x, 0.0) &&
              checkSignalMatch(_signal.signal.y, __signal.y, 0.0),
          )
        ) {
          _signals.push({
            experimentType: _experimentType,
            experimentID: experiments2D[_experimentType][index].id,
            atomType,
            signal: __signal,
          });
        }
      });

      _signals2D[_experimentType] = _signals;
    });

    return _signals2D;
  }, [experiments2D]);

  useEffect(() => {
    dispatch({
      type: UPDATE_CORRELATIONS,
      signals1D,
      signals2D,
      signalsDEPT,
    });
  }, [dispatch, signals1D, signals2D, signalsDEPT, tolerance]);

  const editEquivalencesSaveHandler = useCallback(
    (correlation, value) => {
      dispatch({
        type: SET_CORRELATION,
        id: correlation.getID(),
        correlation: new Correlation({
          ...correlation,
          equivalence: value,
          edited: { ...correlation.getEdited(), equivalence: true },
        }),
      });
    },
    [dispatch],
  );

  const editProtonsCountSaveHandler = useCallback(
    (correlation, value) => {
      dispatch({
        type: SET_CORRELATION,
        id: correlation.getID(),
        correlation: new Correlation({
          ...correlation,
          protonsCount: value,
          edited: { ...correlation.getEdited(), protonsCount: true },
        }),
      });
    },
    [dispatch],
  );

  const changeHybridizationSaveHandler = useCallback(
    (correlation, value) => {
      dispatch({
        type: SET_CORRELATION,
        id: correlation.getID(),
        correlation: new Correlation({
          ...correlation,
          hybridization: value,
          edited: { ...correlation.getEdited(), hybridization: true },
        }),
      });
    },
    [dispatch],
  );

  const additionalColumnsTypes = useMemo(() => {
    return Object.keys(atoms)
      .map((atom) => {
        return { key: atom, label: atom, value: atom };
      })
      .concat({ key: 'H-H', label: 'H-H', value: 'H-H' });
  }, [atoms]);

  return (
    <div css={panelStyle}>
      <DefaultPanelHeader canDelete={false}>
        <ToolTip title={`Set molecular formula (${mf})`} popupPlacement="right">
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
          <Overview correlations={correlations} />
        </div>
        <div className="homoHeteroKinds-container">
          <SelectUncontrolled
            onChange={(selection) => {
              setSelectedAdditionalColumnsAtomType(selection);
              if (selection === 'H-H') {
                setShowProtonsAsRows(true);
              } else {
                setShowProtonsAsRows(false);
              }
            }}
            data={additionalColumnsTypes}
            value={selectedAdditionalColumnsAtomType}
            style={{
              marginLeft: 2,
              marginRight: 2,
              border: 'none',
              height: '20px',
            }}
          />
        </div>
      </DefaultPanelHeader>
      <CorrelationTable
        correlations={correlations}
        additionalColumns={additionalColumns}
        editEquivalencesSaveHandler={editEquivalencesSaveHandler}
        changeHybridizationSaveHandler={changeHybridizationSaveHandler}
        editProtonsCountSaveHandler={editProtonsCountSaveHandler}
        showProtonsAsRows={showProtonsAsRows}
      />
    </div>
  );
});

export default SummaryPanel;
