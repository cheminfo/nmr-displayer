import { Draft, original } from 'immer';
import cloneDeep from 'lodash/cloneDeep';

import {
  DatumKind,
  SignalKindsToInclude,
} from '../../../data/constants/SignalsKinds';
import {
  changeZoneSignal,
  Datum2D,
  detectZones,
  detectZonesManual,
  Zone,
} from '../../../data/data2d/Datum2D';
import {
  getPubIntegral,
  unlink,
  unlinkInAssignmentData,
} from '../../../data/utilities/ZoneUtilities';
import Events from '../../utility/Events';
import { State } from '../Reducer';
import get2DRange from '../helper/get2DRange';

// eslint-disable-next-line import/order
import { handleUpdateCorrelations } from './CorrelationsActions';
// import { AnalysisObj } from '../core/Analysis';

import { setDomain } from './DomainActions';

let noiseFactor = 1;

Events.on('noiseFactorChanged', (val) => {
  noiseFactor = val;
});

function add2dZoneHandler(draft: Draft<State>, action) {
  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    const drawnZone = get2DRange(draft, action);
    detectZonesManual(draft.data[index], {
      selectedZone: drawnZone,
      thresholdFactor: noiseFactor,
      convolutionByFFT: false,
    });
    handleOnChangeZonesData(draft);
  }
}

function handleAutoZonesDetection(draft: Draft<State>, detectionOptions) {
  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    detectZones(draft.data[index], detectionOptions);
    handleOnChangeZonesData(draft);
  }
}

function changeZoneSignalDelta(draft: Draft<State>, action) {
  const { zoneID, signal } = action.payload;
  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    changeZoneSignal(draft.data[index], zoneID, signal);
    setDomain(draft);
    handleOnChangeZonesData(draft);
  }
}

function getZoneIndex(state, spectrumIndex, zoneID) {
  return state.data[spectrumIndex].zones.values.findIndex(
    (zone) => zone.id === zoneID,
  );
}

function handleChangeZoneSignalKind(draft: Draft<State>, action) {
  const state = original(draft) as State;
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const { rowData, value } = action.payload;
    const zoneIndex = getZoneIndex(state, index, rowData.id);
    const _zone = (draft.data[index] as Datum2D).zones.values[
      zoneIndex
    ] as Zone;
    _zone.signal[rowData.tableMetaInfo.signalIndex].kind = value;
    _zone.kind = SignalKindsToInclude.includes(value)
      ? DatumKind.signal
      : DatumKind.mixed;
    handleOnChangeZonesData(draft);
  }
}

function handleDeleteZone(draft: Draft<State>, action) {
  const state = original(draft) as State;
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const { zoneData, assignmentData } = action.payload;
    if (zoneData === undefined) {
      (draft.data[index] as Datum2D).zones.values.forEach((zone) =>
        unlinkInAssignmentData(assignmentData, zone),
      );
      (draft.data[index] as Datum2D).zones.values = [];
    } else {
      unlinkInAssignmentData(assignmentData, zoneData);
      const zoneIndex = getZoneIndex(state, index, zoneData.id);
      (draft.data[index] as Datum2D).zones.values.splice(zoneIndex, 1);
    }
    handleOnChangeZonesData(draft);
  }
}

function handleUnlinkZone(draft: Draft<State>, action) {
  const state = original(draft) as State;
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const {
      zoneData,
      assignmentData,
      isOnZoneLevel,
      signalIndex,
      axis,
    } = action.payload;

    for (let zone of zoneData
      ? [zoneData]
      : (state.data[index] as Datum2D).zones.values) {
      // remove assignments in global state
      const _zoneData = unlink(
        cloneDeep(zone),
        isOnZoneLevel,
        signalIndex,
        axis,
      );
      // remove assignments in assignment hook data
      unlinkInAssignmentData(
        assignmentData,
        _zoneData,
        isOnZoneLevel,
        signalIndex,
        axis,
      );

      const zoneIndex = getZoneIndex(state, index, _zoneData.id);
      (draft.data[index] as Datum2D).zones.values[zoneIndex] = _zoneData;
    }
  }
}

function handleSetDiaIDZone(draft: Draft<State>, action) {
  const state = original(draft) as State;
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const { zoneData, diaID, axis, signalIndex } = action.payload;

    const zoneIndex = getZoneIndex(state, index, zoneData.id);
    const _zone = (draft.data[index] as Datum2D).zones.values[
      zoneIndex
    ] as Zone;
    if (signalIndex === undefined) {
      _zone[axis].diaID = diaID;
    } else {
      _zone.signal[signalIndex][axis].diaID = diaID;
    }
    _zone[axis].pubIntegral = getPubIntegral(_zone, axis);
  }
}

function handleOnChangeZonesData(draft) {
  handleUpdateCorrelations(draft);
}

export {
  add2dZoneHandler,
  handleAutoZonesDetection,
  handleDeleteZone,
  changeZoneSignalDelta,
  handleChangeZoneSignalKind,
  handleUnlinkZone,
  handleSetDiaIDZone,
};
