import { useFormikContext } from 'formik';
import lodashGet from 'lodash/get';
import { useCallback, useEffect, useMemo } from 'react';

import Input, { InputProps } from '../Input';

interface FormikInputProps extends InputProps {
  name: string;
  label?: string;
  style?: {
    label?: any;
    input?: any;
  };
  onChange?: (element: any) => void;
  checkValue?: () => void;
  type?: 'text' | 'number';
  className?: string;
  value?: any;
  format?: () => (element: any) => any;
  checkErrorAfterInputTouched?: boolean;
}

function FormikInput(props: FormikInputProps) {
  const {
    label,
    name,
    style: styleInput = { label: {}, input: {} },
    onChange = () => null,
    checkValue = () => true,
    type = 'text',
    className = '',
    value = null,
    format = () => (value) => value,
    checkErrorAfterInputTouched = true,
    ...resProps
  } = props;

  const { values, handleChange, setFieldValue, errors, touched } =
    useFormikContext();

  const changeHandler = useCallback(
    (e) => {
      onChange(e);
      handleChange(e);
    },
    [handleChange, onChange],
  );

  useEffect(() => {
    if (value) {
      setFieldValue(name, value);
    }
  }, [name, setFieldValue, value]);

  const isInvalid = useMemo(() => {
    if (checkErrorAfterInputTouched) {
      return lodashGet(errors, name) && lodashGet(touched, name);
    }
    return lodashGet(errors, name);
  }, [checkErrorAfterInputTouched, errors, name, touched]);

  return (
    <Input
      label={label}
      name={name}
      value={value ? value : lodashGet(values, name)}
      onChange={changeHandler}
      type={type}
      style={{
        ...styleInput,
        input: {
          ...styleInput.input,
          ...(isInvalid && { borderColor: 'red' }),
        },
      }}
      checkValue={checkValue}
      className={className}
      format={format}
      {...resProps}
    />
  );
}

export default FormikInput;
