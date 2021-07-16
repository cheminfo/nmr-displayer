import { useFormikContext } from 'formik';
import lodashGet from 'lodash/get';
import { useCallback, memo } from 'react';

import ColorInput, { ColorInputProps } from '../ColorInput';

interface FormikColorPickerProps extends ColorInputProps {
  name: string;
}

function FormikColorPicker(props: FormikColorPickerProps) {
  const { onColorChange = () => null, name, ...colorPickerProps } = props;

  const { values, setFieldValue } = useFormikContext();

  const colorChangeHandler = useCallback(
    (color) => {
      onColorChange(color);
      setFieldValue(name, color.hex);
    },
    [name, onColorChange, setFieldValue],
  );

  return (
    <ColorInput
      {...colorPickerProps}
      name={name}
      onColorChange={colorChangeHandler}
      value={lodashGet(values, name)}
    />
  );
}

export default memo(FormikColorPicker);
