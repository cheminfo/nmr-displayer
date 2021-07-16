import debounce from 'lodash/debounce';
import { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';

import { forwardRefWithAs } from '../../utils';

const styles: Record<'label' | 'input', CSSProperties> = {
  label: {
    lineHeight: 2,
    userSelect: 'none',
  },
  input: {
    height: '100%',
    width: '100px',
    borderRadius: '5px',
    borderWidth: '0.55px',
    borderColor: '#c7c7c7',
    borderStyle: 'solid',
    margin: '0px 5px 0px 5px',
    textAlign: 'center',
  },
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: string;
  style?: {
    label?: CSSProperties;
    input?: CSSProperties;
    container?: CSSProperties;
  };
  enableAutoSelect?: boolean;
  debounceTime?: number;
  checkValue?: (element: number | string) => boolean;
  format?: () => (element: string) => number | string;
}

const Input = forwardRefWithAs(
  (
    {
      label,
      value = '',
      name,
      style = { label: {}, input: {}, container: {} },
      onChange = () => null,
      debounceTime = 0,
      onKeyDown = () => null,
      checkValue = () => true,
      type = 'text',
      enableAutoSelect = false,
      className,
      format = () => (value) => value,
      onBlur = () => null,
      onFocus = () => null,
      ...props
    }: InputProps,
    ref,
  ) => {
    const [val, setVal] = useState(value);
    const debounceOnChange = useRef(
      debounce((value) => {
        onChange(value);
      }, debounceTime),
    ).current;

    useEffect(() => {
      setVal(value);
    }, [value]);

    useEffect(() => {
      if (enableAutoSelect) {
        ref?.current?.select();
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

        const _value: string = e.target.value;
        if (check(_value) && checkValue(_value)) {
          const formatValue = format();

          setVal(formatValue(_value));

          const val = {
            ...e,
            target: { name: e.target.name, value: getValue(_value) },
          };

          if (debounceTime) {
            debounceOnChange(val);
          } else {
            onChange(val);
          }
        }
      },
      [
        checkValue,
        debounceOnChange,
        debounceTime,
        format,
        getValue,
        onChange,
        type,
      ],
    );

    const handleKeyDown = useCallback(
      (event) => {
        event.persist();
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...(style?.container ? style.container : {}),
        }}
      >
        {label && (
          <span
            style={{
              ...styles.label,
              ...(style?.label ? style.label : {}),
            }}
            className="label"
          >
            {label}
          </span>
        )}
        <input
          {...props}
          ref={ref}
          name={name}
          data-test-id={name ? `input-${name}` : ''}
          style={{
            ...styles.input,
            ...(style?.input ? style.input : {}),
          }}
          type="text"
          value={val}
          onChange={onChangeHandler}
          onKeyDown={handleKeyDown}
          onKeyPress={preventPropagate}
          onDoubleClick={(e) => e.stopPropagation()}
          className={`input ${className || ''}`}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    );
  },
);

export default Input;
