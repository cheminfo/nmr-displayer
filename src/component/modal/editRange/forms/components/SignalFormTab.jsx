/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useFormikContext, FieldArray } from 'formik';
import { memo } from 'react';

import CouplingsTable from './CouplingsTable';

const SignalFormTabStyle = css`
  border-spacing: 0;
  width: 100%;
  font-size: 12px;
  height: 100%;

  margin: 0;
  padding: 0.4rem;
  text-align: center;
`;

function SignalFormTab({ onFocus, onBlur }) {
  const { values } = useFormikContext();

  return (
    <div css={SignalFormTabStyle}>
      <FieldArray
        name={`signals.${values.activeTab}.j`}
        render={({ push, remove }) => (
          <div>
            <CouplingsTable
              push={push}
              remove={remove}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
        )}
      />
    </div>
  );
}

export default memo(SignalFormTab);
