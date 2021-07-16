import { useFormikContext } from 'formik';
import lodashGet from 'lodash/get';
import { useCallback } from 'react';

import CheckBox, { CheckBoxProps } from '../CheckBox';

interface FormikCheckBoxProps extends CheckBoxProps {
  name: string;
  label?: string;
  className?: string;
  reverse?: boolean;
}

function FormikCheckBox(props: FormikCheckBoxProps) {
  const {
    label,
    name,
    onChange = () => null,
    className = 'checkbox',
    reverse = false,
    ...resProps
  } = props;

  const { values, setFieldValue } = useFormikContext();
  const value = reverse ? !lodashGet(values, name) : lodashGet(values, name);

  const changeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      onChange(e);
      setFieldValue(name, reverse ? value : !value);
    },
    [name, onChange, reverse, setFieldValue, value],
  );

  return (
    <div className={`${className} check-${value}`}>
      <label htmlFor={name} className="checkbox-lable">
        {label}
      </label>
      <CheckBox
        {...resProps}
        name={name}
        checked={value}
        onChange={changeHandler}
      />
    </div>
  );
}

export default FormikCheckBox;
