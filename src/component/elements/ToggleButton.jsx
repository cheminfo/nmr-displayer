/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';

import ToolTip from './ToolTip/ToolTip';

const styles = css`
  background-color: transparent;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: lightgray;
  }

  &.toggle-active {
    background-color: gray;
    color: white;
  }
`;

const ToggleButton = ({
  children,
  style,
  onClick,
  popupTitle,
  popupPlacement,
  defaultValue,
}) => {
  const [flag, Toggle] = useState(defaultValue);

  useEffect(() => {
    onClick(flag);
  }, [flag, onClick]);

  const toggleHandler = useCallback(() => {
    Toggle((prev) => {
      return !prev;
    });
  }, []);
  return (
    <ToolTip title={popupTitle} popupPlacement={popupPlacement}>
      <button
        css={[styles, style]}
        className={flag ? 'toogle toggle-active' : 'toggle'}
        type="button"
        onClick={toggleHandler}
      >
        {children}
      </button>
    </ToolTip>
  );
};

ToggleButton.defaultProps = {
  popupTitle: '',
  popupPlacement: 'right',
  style: {},
  defaultValue: false,
};

export default ToggleButton;