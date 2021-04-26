import { useField } from 'formik';

import ErrorMessage from './ErrorMessage';

function Input({ onFocus, onBlur, enableErrorMessage, ...props }) {
  const [field] = useField(props);
  return (
    <div>
      <input
        {...field}
        {...props}
        onFocus={() => onFocus(field.name)}
        onBlur={() => onBlur(field.name)}
      />
      {enableErrorMessage && enableErrorMessage === true ? (
        <ErrorMessage {...props} />
      ) : null}
    </div>
  );
}

Input.defaultProps = {
  onFocus: () => null,
  onBlur: () => null,
};

export default Input;