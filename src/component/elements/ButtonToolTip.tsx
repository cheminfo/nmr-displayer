import { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

import ToolTip from './ToolTip/ToolTip';

interface ButtonToolTipProps
  extends Omit<InputHTMLAttributes<HTMLButtonElement>, 'type'> {
  popupTitle?: string;
  popupPlacement?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ButtonToolTip({
  children,
  style = {},
  onClick = () => null,
  popupTitle = '',
  popupPlacement = 'right',
  ...props
}: ButtonToolTipProps) {
  return (
    <ToolTip title={popupTitle} popupPlacement={popupPlacement}>
      <button style={style} type="button" onClick={onClick} {...props}>
        {children}
      </button>
    </ToolTip>
  );
}

export default ButtonToolTip;
