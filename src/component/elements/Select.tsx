/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CSSProperties, useCallback } from 'react';

import { forwardRefWithAs } from '../../utils';

const arrowDownIcon = `url('data:image/svg+xml;utf8,<svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="960px" height="560px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve"><g id="Rounded_Rectangle_33_copy_4_1_"><path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"/></g></svg>')`;

export interface SelectProps {
  onChange?: (element: string) => void;
  data: Array<{
    key: string | number;
    value: string | number;
    label: string | number;
  }>;
  style?: CSSProperties;
  defaultValue?: string | number;
  name?: string;
  className?: string;
}

const Select = forwardRefWithAs(function Select(props: SelectProps, ref) {
  const {
    data,
    style = { width: 100 },
    onChange = () => null,
    defaultValue,
    name = '',
    className = '',
  } = props;

  const handleOnChanged = useCallback(
    (e) => {
      let value = e.target.value;
      if (!isNaN(value)) {
        value = Number(value);
      }
      onChange(value);
    },
    [onChange],
  );

  const styles = css`
    padding: 0px 5px;
    border: 0.55px solid #cacaca;
    font-size: 14px;
    width: ${style.width ? Number(style.width) - 5 : 115}px;
    margin: 0;
    height: 100%;
    background: ${arrowDownIcon} no-repeat right white;
    -webkit-appearance: none;
    background-position-x: calc(100% - 5px);
    background-size: 15px 15px;
    border-radius: 5px;
    margin: 0px 5px;
    :focus,
    input:focus {
      outline: none;
    }
  `;

  return (
    <select
      ref={ref}
      css={[styles]}
      name={name}
      onChange={handleOnChanged}
      defaultValue={defaultValue}
      className={className}
      style={style}
    >
      {data.map((d) => (
        <option key={`${d.key}`} value={d.value}>
          {d.label}
        </option>
      ))}
    </select>
  );
});

export default Select;
