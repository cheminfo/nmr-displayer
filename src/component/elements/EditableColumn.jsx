import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import Input from './Input';

const defaultProps = {
  onSave: () => null,
  onEditStart: () => null,
  type: 'text',
  editStatus: false,
};

function EditableColumn(
  {
    onSave = defaultProps.onSave,
    value,
    type = defaultProps.type,
    style = defaultProps.style,
    onEditStart = defaultProps.onEditStart,
    editStatus = defaultProps.editStatus,
  },
  ref,
) {
  const [enabled, enableEdit] = useState();
  const refInput = useRef();

  useEffect(() => {
    enableEdit(editStatus);
  }, [editStatus]);

  useImperativeHandle(ref, () => ({
    startEdit: () => {
      enableEdit(true);
    },
    closeEdit: () => {
      enableEdit(false);
    },
  }));

  const editModeHandler = useCallback(
    (flag, event = null) => {
      if (!flag) {
        if (event.keyCode === 13) {
          // when press Enter
          onSave(event);
          enableEdit(flag);
        } else if (event.keyCode === 27) {
          // when press Escape
          enableEdit(flag);
        }
      } else {
        onEditStart(event);
        enableEdit(flag);
      }
    },
    [onEditStart, onSave],
  );

  return (
    <div
      style={{ width: '100%', height: '100%', ...style }}
      onDoubleClick={(event) => editModeHandler(true, event)}
    >
      {!enabled && value}
      {enabled && (
        <Input
          enableAutoSelect={true}
          ref={refInput}
          value={value}
          type={type}
          onKeyDown={(e) => editModeHandler(false, e)}
        />
      )}
    </div>
  );
}

EditableColumn.defaultProps = defaultProps;

export default forwardRef(EditableColumn);
