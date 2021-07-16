/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const styles = css`
  background-color: white;
  position: absolute;
  height: auto;
  z-index: 99999999999999;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  border-radius: 10px;
  margin-bottom: 20px;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      padding: 10px 30px;
      text-align: center;
      color: black;
      border-bottom: 0.55px solid lightgoldenrodyellow;
      min-width: 150px;
    }

    li:last-of-type {
      border-bottom: none;
    }

    li:hover {
      background-color: gray;
      color: white;
    }
  }
`;

interface DropDownListItem {
  key: string;
  label: string;
}

interface DropDownListProps {
  data: Array<DropDownListItem>;
  onSelect: (element: number) => void;
}

function DropDownList({ data = [], onSelect }: DropDownListProps) {
  return (
    <div css={styles}>
      <ul>
        {data.map((item, i) => (
          <li key={item.key} onClick={() => onSelect(i)}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropDownList;
