import lodashGet from 'lodash/get';
import { useMemo, useCallback, memo } from 'react';
import { FaMinusCircle } from 'react-icons/fa';

function SignalAssignmentsColumn({
  rowData,
  onHover,
  assignment,
  highlight,
  onUnlinkVisibilityChange,
  unlinkVisibility,
  onLink,
  onUnlink,
}) {
  const diaIDs = useMemo(() => {
    return lodashGet(rowData, 'tableMetaInfo.signal.diaID', []);
  }, [rowData]);

  const tdCss = useMemo(() => {
    return assignment.isActive || highlight.isActive
      ? {
          color: 'red',
          fontWeight: 'bold',
        }
      : null;
  }, [assignment.isActive, highlight.isActive]);

  const visibilityChangeHandler = useCallback(
    (flag) => {
      onUnlinkVisibilityChange(flag);
    },
    [onUnlinkVisibilityChange],
  );
  const assignHandler = useCallback(
    (e) => {
      onLink(e, assignment);
    },
    [assignment, onLink],
  );

  return (
    <td {...onHover} onClick={assignHandler} style={tdCss}>
      {diaIDs && diaIDs.length > 0 ? (
        <div
          onMouseEnter={() => visibilityChangeHandler(true)}
          onMouseLeave={() => visibilityChangeHandler(false)}
        >
          {diaIDs.length}{' '}
          <sup>
            <button
              type="button"
              style={{
                visibility: unlinkVisibility ? 'visible' : 'hidden',
                padding: 0,
                margin: 0,
              }}
              onClick={(e) => onUnlink(e, false)}
            >
              <FaMinusCircle color="red" />
            </button>
          </sup>
        </div>
      ) : assignment.isActive ? (
        '0'
      ) : (
        ''
      )}
    </td>
  );
}

SignalAssignmentsColumn.defaultProps = {
  onHover: () => null,
  onUnlinkVisibilityChange: () => null,
  onLink: () => null,
  onUnlink: () => null,
};

export default memo(SignalAssignmentsColumn);
