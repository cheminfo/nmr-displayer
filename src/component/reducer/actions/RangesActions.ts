import { Draft, original } from 'immer';
import cloneDeep from 'lodash/cloneDeep';

import {
  DatumKind,
  SignalKindsToInclude,
} from '../../../data/constants/SignalsKinds';
import {
  addRange,
  changeRangeSignal,
  detectRanges,
  updateIntegralRanges,
  changeRange,
  changeRangesRealtive,
  Datum1D,
  Range,
  Signal,
} from '../../../data/data1d/Datum1D';
import {
  getPubIntegral,
  unlink,
  unlinkInAssignmentData,
} from '../../../data/utilities/RangeUtilities';
import { State } from '../Reducer';
import getRange from '../helper/getRange';

import { handleUpdateCorrelations } from './CorrelationsActions';

function handleAutoRangesDetection(draft: Draft<State>, detectionOptions) {
  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    detectRanges(draft.data[index], detectionOptions);
    handleOnChangeRangesData(draft);
  }
}

function getRangeIndex(state: State, spectrumIndex, rangeID) {
  return (state.data[spectrumIndex] as Datum1D).ranges.values.findIndex(
    (range) => range.id === rangeID,
  );
}

function handleDeleteRange(draft: Draft<State>, action) {
  const state = original(draft) as State;
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const { rangeData, assignmentData } = action.payload;
    const datum = draft.data[index] as Datum1D;
    if (rangeData === undefined) {
      datum.ranges.values.forEach((range) =>
        unlinkInAssignmentData(assignmentData, range),
      );
      datum.ranges.values = [];
    } else {
      unlinkInAssignmentData(assignmentData, rangeData);
      const rangeIndex = getRangeIndex(state, index, rangeData.id);
      datum.ranges.values.splice(rangeIndex, 1);
    }
    updateIntegralRanges(draft.data[index]);
    handleOnChangeRangesData(draft);
  }
}

function handleChangeRangeSignalKind(draft: Draft<State>, action) {
  const state = original(draft) as State;
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const { rowData, value } = action.payload;
    const rangeIndex = getRangeIndex(state, index, rowData.id);
    const _range = (draft.data[index] as Datum1D).ranges.values[
      rangeIndex
    ] as Range;
    if (_range?.signal) {
      (_range.signal[rowData.tableMetaInfo.signalIndex] as Signal).kind = value;
      _range.kind = SignalKindsToInclude.includes(value)
        ? DatumKind.signal
        : DatumKind.mixed;
      updateIntegralRanges(draft.data[index]);
      handleOnChangeRangesData(draft);
    }
  }
}

function handleSaveEditedRange(draft: Draft<State>, action) {
  const state = original(draft) as State;
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const { editedRowData, assignmentData } = action.payload;
    // remove assignments in global state
    const _editedRowData = unlink(editedRowData);
    delete _editedRowData.tableMetaInfo;
    // remove assignments in assignment hook data
    // for now: clear all assignments for this range because signals or levels to store might have changed
    unlinkInAssignmentData(assignmentData, _editedRowData);

    const rangeIndex = getRangeIndex(state, index, _editedRowData.id);
    (draft.data[index] as Datum1D).ranges.values[rangeIndex] = _editedRowData;
    updateIntegralRanges(draft.data[index]);
    handleOnChangeRangesData(draft);
  }
}

function handleUnlinkRange(draft: Draft<State>, action) {
  const state = original(draft) as State;
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const {
      rangeData,
      assignmentData,
      isOnRangeLevel,
      signalIndex,
    } = action.payload;
    // remove assignments in global state
    for (let range of rangeData
      ? [rangeData]
      : (state.data[index] as Datum1D).ranges.values) {
      const _rangeData = unlink(cloneDeep(range), isOnRangeLevel, signalIndex);
      // remove assignments in assignment hook data
      unlinkInAssignmentData(
        assignmentData,
        _rangeData,
        isOnRangeLevel,
        signalIndex,
      );

      const rangeIndex = getRangeIndex(state, index, _rangeData.id);
      (draft.data[index] as Datum1D).ranges.values[rangeIndex] = _rangeData;
    }
  }
}

function handleSetDiaIDRange(draft, action) {
  const state = original(draft);
  if (state.activeSpectrum?.id) {
    const { index } = state.activeSpectrum;
    const { rangeData, diaID, signalIndex } = action.payload;

    const rangeIndex = getRangeIndex(state, index, rangeData.id);
    const _range = draft.data[index].ranges.values[rangeIndex];
    if (signalIndex === undefined) {
      _range.diaID = diaID;
    } else {
      _range.signal[signalIndex].diaID = diaID;
    }
    _range.pubIntegral = getPubIntegral(_range);
  }
}

function handleResizeRange(draft: Draft<State>, action) {
  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    changeRange(draft.data[index], action.data);
  }
}

function handleChangeRangeSum(draft: Draft<State>, value) {
  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    (draft.data[index] as Datum1D).ranges.options.sum = value;
    updateIntegralRanges(draft.data[index]);
  }
}
function handleAddRange(draft: Draft<State>, action) {
  const { startX, endX } = action;
  const range = getRange(draft, { startX, endX });

  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    const [from, to] = range;
    addRange(draft.data[index], { from, to });
    handleOnChangeRangesData(draft);
  }
}

function handleChangeRangeRaltiveValue(draft, action) {
  const { id: rangeID, value } = action;
  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    changeRangesRealtive(draft.data[index], rangeID, value);
  }
}

function handleChangeRangeSignalValue(draft, action) {
  const { rangeID, signalID, value } = action.payload;
  if (draft.activeSpectrum?.id) {
    const { index } = draft.activeSpectrum;
    changeRangeSignal(draft.data[index], rangeID, signalID, value);
    handleOnChangeRangesData(draft);
  }
}

function handleOnChangeRangesData(draft) {
  handleUpdateCorrelations(draft);
}

export {
  handleAutoRangesDetection,
  handleDeleteRange,
  handleChangeRangeSum,
  handleAddRange,
  handleResizeRange,
  handleChangeRangeRaltiveValue,
  handleChangeRangeSignalValue,
  handleChangeRangeSignalKind,
  handleSaveEditedRange,
  handleUnlinkRange,
  handleSetDiaIDRange,
};
