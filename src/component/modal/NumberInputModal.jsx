import { jsx, css } from '@emotion/core';
import { useRef, useCallback } from 'react';
/** @jsx jsx */
import { FaTimes } from 'react-icons/fa';

const styles = css`
  display: flex;
  flex-direction: column;
  width: 450px;
  padding: 5px;
  button:focus {
    outline: none;
  }
  .header {
    height: 24px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    span {
      color: #464646;
      font-size: 15px;
      flex: 1;
    }

    button {
      background-color: transparent;
      border: none;
      svg {
        height: 16px;
      }
    }
  }
  .container {
    display: flex;
    margin: 30px 5px;
    input,
    button {
      padding: 5px;
      border: 1px solid gray;
      border-radius: 5px;
      height: 36px;
      margin: 2px;
    }
    input {
      flex: 10;
    }
    button {
      flex: 2;
      color: white;
      background-color: gray;
    }
  }
`;

const NumberInputModal = ({ onSave, onClose, header }) => {
  const valueReft = useRef();

  const saveHandler = useCallback(() => {
    onSave(valueReft.current.value);
  }, [onSave]);

  return (
    <div css={styles}>
      <div className="header">
        <span>{header}</span>
        <button onClick={onClose} type="button">
          <FaTimes />
        </button>
      </div>
      <div className="container">
        <input
          ref={valueReft}
          type="number"
          placeholder="Enter the new value"
        />
        <button type="button" onClick={saveHandler}>
          Set
        </button>
      </div>
    </div>
  );
};

NumberInputModal.defaultProps = {
  onSave: () => {
    return null;
  },
  onClose: () => {
    return null;
  },
};
export default NumberInputModal;
