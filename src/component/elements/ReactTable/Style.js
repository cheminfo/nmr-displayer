import { css } from '@emotion/core';

const HighlightedRowStyle = css`
  background-color: #ff6f0057;
`;

const ConstantlyHighlightedRowStyle = css`
  background-color: #fffacd;
`;

const ReactTableStyle = css`
  border-spacing: 0;
  border: 1px solid #dedede;
  width: 100%;
  font-size: 12px;
  height: 100%;
  .react-contextmenu-wrapper {
    display: contents;
  }
  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }
  th,
  td {
    margin: 0;
    padding: 0.4rem;
    border-bottom: 1px solid #dedede;
    border-right: 1px solid #dedede;

    :last-child {
      border-right: 0;
    }
    button {
      background-color: transparent;
      border: none;
    }
  }
`;

export { ReactTableStyle, HighlightedRowStyle, ConstantlyHighlightedRowStyle };
