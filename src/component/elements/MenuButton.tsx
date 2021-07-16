/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactNode, useState, useCallback, useRef } from 'react';

import ToolTip from './ToolTip/ToolTip';

const menuStyles = css`
  .menu {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    padding: 0px;
    margin: 0px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 99999;
    padding: 2px;
    background-color: white;

    button:hover {
      background-color: #fafafa;
    }
  }

  .menu-cover {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .menu-item {
    background-color: transparent;
    border: none;
    border-bottom: 0.55px solid whitesmoke;
    height: 35px;
    outline: outline;
    display: table-cell;
    vertical-align: middle;
    text-align: left;
    padding: 0 10px;

    svg {
      display: inline-block;
    }

    :focus {
      outline: none !important;
    }
    span {
      font-size: 10px;
      padding: 0px 10px;
    }
  }
`;

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <button type="button" className="menu-item" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface MenuListProps {
  items: Array<MenuItemProps & { id: number }>;
  onClick: (element: MenuItemProps & { id: number }) => void;
  boxBounding: any;
}

function MenuList({ items, boxBounding, onClick }: MenuListProps) {
  return (
    <div
      className="menu"
      style={{
        transform: `translate(${boxBounding.width}px, -${boxBounding.height}px) `,
      }}
    >
      {items?.map((item) => {
        return (
          <MenuItem
            key={`${item.id}`}
            {...item}
            onClick={() => onClick(item)}
          />
        );
      })}
    </div>
  );
}

interface MenuButtonProps {
  style?: any;
  component: any;
  toolTip: string;
  className?: string;
  items: Array<any>;
  onClick: (element: any) => void;
}

export default function MenuButton({
  style,
  component,
  toolTip = '',
  className,
  items = [],
  onClick = () => null,
}: MenuButtonProps) {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isShown, showMenu] = useState(false);

  const closeMenuButton = useCallback(() => {
    showMenu(false);
  }, []);

  const handleClick = useCallback(() => {
    showMenu((flag) => !flag);
  }, []);
  const clickHandler = useCallback(
    (e) => {
      showMenu(false);
      onClick(e);
    },
    [onClick],
  );

  return (
    <div style={{ height: 'auto' }} css={menuStyles}>
      <button
        ref={menuButtonRef}
        type="button"
        css={style}
        onClick={handleClick}
        className={className}
        style={{ boxSizing: 'border-box' }}
      >
        <ToolTip title={toolTip} popupPlacement="right">
          {component}
        </ToolTip>
      </button>
      {isShown && (
        <MenuList
          items={items}
          boxBounding={menuButtonRef.current?.getBoundingClientRect()}
          onClick={clickHandler}
        />
      )}

      {isShown && <div className="menu-cover" onClick={closeMenuButton} />}
    </div>
  );
}
