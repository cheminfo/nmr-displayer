/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Fragment, useCallback } from 'react';
import { FaRegTrashAlt, FaSearchPlus, FaEdit } from 'react-icons/fa';

import {
  DatumKind,
  SignalKinds,
  SignalKindsToInclude,
} from '../../../../data/constants/SignalsKinds';
import {
  deleteRange,
  unlink,
  unlinkInAssignmentData,
} from '../../../../data/utilities/RangeUtilities';
import { useAssignmentData } from '../../../assignment';
import { useDispatch } from '../../../context/DispatchContext';
import SelectUncontrolled from '../../../elements/SelectUncontrolled';
import {
  useModal,
  positions,
  transitions,
} from '../../../elements/popup/Modal';
import EditRangeModal from '../../../modal/editRange/EditRangeModal';
import {
  SET_X_DOMAIN,
  CHANGE_RANGE_DATA,
  RESET_SELECTED_TOOL,
  SET_SELECTED_TOOL,
} from '../../../reducer/types/Types';

const styles = css`
  width: 66px;
  padding: 0 !important;
  button {
    background-color: transparent;
    border: none;
    padding: 5px;
  }

  button:disabled {
    opacity: 0.6;
  }
`;
const selectBoxStyle = {
  marginLeft: 2,
  marginRight: 2,
  border: 'none',
  height: '20px',
};

function ActionsColumn({ rowData, onHoverSignal, rowSpanTags }) {
  const dispatch = useDispatch();
  const modal = useModal();
  const assignmentData = useAssignmentData();

  const zoomRangeHandler = useCallback(() => {
    const margin = Math.abs(rowData.from - rowData.to);
    dispatch({
      type: SET_X_DOMAIN,
      xDomain: [rowData.from - margin, rowData.to + margin],
    });
  }, [dispatch, rowData.from, rowData.to]);

  const deleteRangeHandler = useCallback(() => {
    deleteRange(assignmentData, dispatch, rowData);
  }, [assignmentData, dispatch, rowData]);

  const changeRangeSignalKindHandler = useCallback(
    (value) => {
      const _rowData = { ...rowData };
      _rowData.signal[_rowData.tableMetaInfo.signalIndex].kind = value;
      _rowData.kind = SignalKindsToInclude.includes(value)
        ? DatumKind.signal
        : DatumKind.mixed;
      dispatch({
        type: CHANGE_RANGE_DATA,
        data: _rowData,
      });
    },
    [dispatch, rowData],
  );

  const saveEditRangeHandler = useCallback(
    (editedRange) => {
      // for now: clear all assignments for this range because signals or levels to store might have changed
      unlinkInAssignmentData(assignmentData, editedRange);
      editedRange = unlink(editedRange);
      delete editedRange.tableMetaInfo;

      dispatch({
        type: CHANGE_RANGE_DATA,
        data: editedRange,
      });
    },
    [assignmentData, dispatch],
  );

  const closeEditRangeHandler = useCallback(() => {
    dispatch({ type: RESET_SELECTED_TOOL });
    modal.close();
  }, [dispatch, modal]);

  const openEditRangeHandler = useCallback(() => {
    dispatch({ type: SET_SELECTED_TOOL, selectedTool: 'editRange' });
    modal.show(
      <EditRangeModal
        onCloseEditRangeModal={closeEditRangeHandler}
        onSaveEditRangeModal={saveEditRangeHandler}
        onZoomEditRangeModal={zoomRangeHandler}
        rangeData={rowData}
      />,
      {
        position: positions.CENTER_RIGHT,
        transition: transitions.SCALE,
        isBackgroundBlur: false,
      },
    );
  }, [
    closeEditRangeHandler,
    dispatch,
    modal,
    rowData,
    saveEditRangeHandler,
    zoomRangeHandler,
  ]);

  return (
    <Fragment>
      <td {...onHoverSignal}>
        <SelectUncontrolled
          onChange={changeRangeSignalKindHandler}
          data={SignalKinds}
          value={rowData.tableMetaInfo.signal.kind}
          style={selectBoxStyle}
        />
      </td>
      <td {...rowSpanTags} css={styles}>
        <button
          type="button"
          className="delete-button"
          onClick={deleteRangeHandler}
        >
          <FaRegTrashAlt />
        </button>
        <button
          type="button"
          className="zoom-button"
          onClick={zoomRangeHandler}
        >
          <FaSearchPlus title="Zoom to range in spectrum" />
        </button>
        <button
          type="button"
          className="edit-button"
          onClick={openEditRangeHandler}
        >
          <FaEdit color="blue" />
        </button>
      </td>
    </Fragment>
  );
}

export default ActionsColumn;
