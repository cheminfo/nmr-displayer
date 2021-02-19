import { Fragment, useCallback } from 'react';
import { FaRegTrashAlt, FaSearchPlus } from 'react-icons/fa';

import {
  DatumKind,
  SignalKinds,
  SignalKindsToInclude,
} from '../../../../data/constants/SignalsKinds';
import { deleteZone } from '../../../../data/utilities/ZoneUtilities';
import { useAssignmentData } from '../../../assignment';
import { useDispatch } from '../../../context/DispatchContext';
import SelectUncontrolled from '../../../elements/SelectUncontrolled';
import {
  CHANGE_ZONE_DATA,
  SET_X_DOMAIN,
  SET_Y_DOMAIN,
} from '../../../reducer/types/Types';

const selectBoxStyle = {
  marginLeft: 2,
  marginRight: 2,
  border: 'none',
  height: '20px',
};

function ActionsColumn({ rowData, rowSpanTags }) {
  const dispatch = useDispatch();
  const assignmentData = useAssignmentData();

  const changeSignalKindHandler = useCallback(
    (value) => {
      const _zone = { ...rowData };
      _zone.signal[_zone.tableMetaInfo.signalIndex].kind = value;
      _zone.kind = SignalKindsToInclude.includes(value)
        ? DatumKind.signal
        : DatumKind.mixed;
      dispatch({
        type: CHANGE_ZONE_DATA,
        data: _zone,
      });
    },
    [dispatch, rowData],
  );

  const deleteZoneHandler = useCallback(() => {
    deleteZone(assignmentData, dispatch, rowData);
  }, [assignmentData, dispatch, rowData]);

  const zoomZoneHandler = useCallback(() => {
    const xMargin = Math.abs(rowData.x.from - rowData.x.to) * 10;
    dispatch({
      type: SET_X_DOMAIN,
      xDomain:
        rowData.x.from <= rowData.x.to
          ? [rowData.x.from - xMargin, rowData.x.to + xMargin]
          : [rowData.x.to - xMargin, rowData.x.from + xMargin],
    });
    const yMargin = Math.abs(rowData.y.from - rowData.y.to) * 10;
    dispatch({
      type: SET_Y_DOMAIN,
      yDomain:
        rowData.y.from <= rowData.y.to
          ? [rowData.y.from - yMargin, rowData.y.to + yMargin]
          : [rowData.y.to - yMargin, rowData.y.from + yMargin],
    });
  }, [dispatch, rowData.x.from, rowData.x.to, rowData.y.from, rowData.y.to]);

  return (
    <Fragment>
      <td>
        <SelectUncontrolled
          onChange={(value) => {
            changeSignalKindHandler(value);
          }}
          data={SignalKinds}
          value={rowData.tableMetaInfo.signal.kind}
          style={selectBoxStyle}
        />
      </td>
      <td {...rowSpanTags}>
        <button
          type="button"
          className="delete-button"
          onClick={deleteZoneHandler}
        >
          <FaRegTrashAlt />
        </button>
        <button type="button" className="zoom-button" onClick={zoomZoneHandler}>
          <FaSearchPlus title="Zoom to zone in spectrum" />
        </button>
      </td>
    </Fragment>
  );
}

export default ActionsColumn;
