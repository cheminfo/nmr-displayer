import { useState, useCallback, Ref, ChangeEvent } from 'react';

import { forwardRefWithAs } from '../../utils';

export interface CheckBoxProps {
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  checked?: boolean;
}

const CheckBox = forwardRefWithAs(
  (props: CheckBoxProps, ref: Ref<HTMLInputElement>) => {
    const {
      checked: checkProps = false,
      disabled = false,
      name = '',
      onChange = () => null,
    } = props;

    const [checked, setCheck] = useState<boolean>(checkProps);

    const handleCheck = useCallback(
      (e) => {
        setCheck(!checked);
        onChange(e);
      },
      [checked, onChange],
    );

    return (
      <input
        ref={ref}
        type="checkbox"
        name={name}
        id={name}
        onChange={handleCheck}
        defaultChecked={checkProps}
        disabled={disabled}
      />
    );
  },
);

export default CheckBox;
