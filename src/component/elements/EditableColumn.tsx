import React, {
  CSSProperties,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';

import { forwardRefWithAs } from '../../utils';

import Input from './Input';

interface EditableColumnProps {
  onSave?: (element: React.KeyboardEvent<HTMLInputElement>) => void;
  onEditStart?: (element: React.MouseEvent<HTMLDivElement>) => void;
  type?: 'number' | 'text';
  editStatus?: boolean;
  value: string;
  style?: CSSProperties;
}

function EditableColumn(props: EditableColumnProps, ref) {
  const {
    onSave = () => null,
    value,
    type = 'text',
    style,
    onEditStart = () => null,
    editStatus = false,
  } = props;

  const [enabled, enableEdit] = useState<boolean | undefined>();

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

  const editModeHandlerKeyboard = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSave(event);
        enableEdit(false);
      } else if (event.key === 'Escape') {
        enableEdit(false);
      }
    },
    [onSave],
  );

  const editModeHandlerMouse = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onEditStart(event);
      enableEdit(true);
    },
    [onEditStart],
  );

  return (
    <div
      style={{ display: 'table', width: '100%', height: '100%', ...style }}
      onDoubleClick={(evt) => editModeHandlerMouse(evt)}
    >
      {!enabled && (
        <span style={{ display: 'table-cell', verticalAlign: 'middle' }}>
          {value}
        </span>
      )}
      {enabled && (
        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
          <Input
            enableAutoSelect
            value={value}
            type={type}
            onKeyDown={(evt) => editModeHandlerKeyboard(evt)}
          />
        </div>
      )}
    </div>
  );
}

export default forwardRefWithAs(EditableColumn);
