import React, { forwardRef, useCallback, useMemo } from 'react';

import { useDispatch } from '../../../context/DispatchContext';
import EditableColumn from '../../../elements/EditableColumn';
import { CHANGE_RANGE_RELATIVE } from '../../../reducer/types/Types';
import FormatNumber from '../../../utility/FormatNumber';
import { checkSignalKinds } from '../../extra/utilities/RangeUtilities';

const RelativeColumn = forwardRef(
  (
    {
      rowData,
      rowSpanTags,
      onHoverRange,
      SignalKindsToConsiderInIntegralsSum,
      format,
      onEditStart,
      editStatus,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const integralVal = useMemo(() => {
      const flag = checkSignalKinds(
        rowData,
        SignalKindsToConsiderInIntegralsSum,
      );
      const formatedValue = FormatNumber(rowData.integral, format);
      return flag ? formatedValue : `[ ${formatedValue} ]`;
    }, [SignalKindsToConsiderInIntegralsSum, format, rowData]);

    const saveHandler = useCallback(
      (event) => {
        dispatch({
          type: CHANGE_RANGE_RELATIVE,
          value: event.target.value,
          id: rowData.id,
        });
      },
      [dispatch, rowData.id],
    );

    return (
      <td {...rowSpanTags} {...onHoverRange}>
        <EditableColumn
          ref={ref}
          onEditStart={onEditStart}
          value={integralVal}
          onSave={saveHandler}
          type="number"
          style={{ padding: '0.4rem' }}
          editStatus={editStatus}
        />
      </td>
    );
  },
);

export default RelativeColumn;
