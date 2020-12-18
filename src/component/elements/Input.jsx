import PropTypes from 'prop-types';
import { Fragment, forwardRef, useState, useEffect, useCallback } from 'react';

const styles = {
  label: {
    lineHeight: 2,
    userSelect: 'none',
  },
  input: {
    height: '100%',
    width: '100px',
    borderRadius: '5px',
    border: '0.55px solid #c7c7c7',
    margin: '0px 5px 0px 5px',
    textAlign: 'center',
  },
};

const Input = forwardRef(
  (
    {
      label,
      value,
      name,
      style,
      onChange,
      onKeyDown,
      checkValue,
      type,
      enableAutoSelect,
      className,
      format,
      ...prop
    },
    ref,
  ) => {
    const [val, setVal] = useState(value);
    useEffect(() => {
      setVal(value);
    }, [value]);

    useEffect(() => {
      if (enableAutoSelect) {
        ref.current.select();
      }
    }, [enableAutoSelect, ref]);

    const getValue = useCallback(
      (value) => {
        const formatValue = format();
        return formatValue(
          type === 'number'
            ? String(value).trim() === '-'
              ? Number(0)
              : Number(value)
            : value,
        );
      },
      [format, type],
    );

    const onChangeHandler = useCallback(
      (e) => {
        e.persist();
        e.stopPropagation();
        e.preventDefault();
        function check(value) {
          if (type === 'number') {
            const pattern = /^(?:-?[0-9]*|[0-9]\d*)(?:\.\d{0,20})?$/;
            if (value.trim() === '' || pattern.test(value)) {
              return true;
            }
            return false;
          }
          return true;
        }
        const _value = e.target.value;
        if (check(_value) && checkValue(_value)) {
          const formatValue = format();

          setVal(formatValue(_value));
          onChange({
            ...e,
            target: { name: e.target.name, value: getValue(_value) },
          });
        }
      },
      [checkValue, format, getValue, onChange, type],
    );

    const handleKeyDown = useCallback(
      (event) => {
        event.persist();
        // event.preventDefault();
        event.stopPropagation();

        onKeyDown({
          ...event,
          target: { name: event.target.name, value: getValue(val) },
        });
      },
      [getValue, onKeyDown, val],
    );
    const preventPropagate = useCallback((event) => {
      event.stopPropagation();
    }, []);

    return (
      <Fragment>
        {label && (
          <span style={{ ...styles.label, ...style.label }} className="label">
            {label}
          </span>
        )}
        <input
          {...prop}
          ref={ref}
          name={name}
          style={{ ...styles.input, ...style.input }}
          type="text"
          value={val}
          onChange={onChangeHandler}
          onKeyDown={handleKeyDown}
          onKeyPress={preventPropagate}
          onDoubleClick={(e) => e.stopPropagation()}
          className={`input ${className}`}
        />
      </Fragment>
    );
  },
);

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  style: PropTypes.shape({
    label: PropTypes.object,
    input: PropTypes.object,
  }),
  onChange: PropTypes.func,
  checkValue: PropTypes.func,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
  format: PropTypes.func,
  type: PropTypes.oneOf(['text', 'number']),
  enableAutoSelect: PropTypes.bool,
};

Input.defaultProps = {
  style: {
    label: {},
    input: {},
  },
  value: '',
  onChange: () => {
    return null;
  },
  checkValue: () => true,
  onKeyDown: () => null,
  type: 'text',
  className: '',
  enableAutoSelect: false,
  format: () => (val) => val,
};

export default Input;
