/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMemo } from 'react';

import { getLabelColor } from '../Utilities';

import CorrelationTableRow from './CorrelationTableRow';

const tableStyle = css`
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
    white-space: nowrap;
    text-align: center;
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

const CorrelationTable = ({
  correlations,
  additionalColumns,
  editEquivalencesSaveHandler,
  changeHybridizationSaveHandler,
  editProtonsCountSaveHandler,
  showProtonsAsRows,
}) => {
  const rows = useMemo(() => {
    if (!correlations) {
      return [];
    }

    return correlations.values
      .filter((correlation) =>
        showProtonsAsRows
          ? correlation.getAtomType() === 'H'
          : correlation.getAtomType() !== 'H',
      )
      .map((correlation) => (
        <CorrelationTableRow
          additionalColumns={additionalColumns}
          correlations={correlations.values}
          correlation={correlation}
          key={`correlation${correlation.getAtomType()}${correlation.getID()}`}
          styleRow={{ backgroundColor: 'mintcream' }}
          styleLabel={{
            color: getLabelColor(correlations, correlation),
          }}
          onSaveEditEquivalences={editEquivalencesSaveHandler}
          onChangeHybridization={changeHybridizationSaveHandler}
          onSaveEditProtonsCount={editProtonsCountSaveHandler}
        />
      ));
  }, [
    additionalColumns,
    changeHybridizationSaveHandler,
    correlations,
    editEquivalencesSaveHandler,
    editProtonsCountSaveHandler,
    showProtonsAsRows,
  ]);

  return (
    <div className="table-container">
      <table css={tableStyle}>
        <tbody>
          <tr>
            <th>Exp</th>
            <th>Atom</th>
            <th>δ (ppm)</th>
            <th>Equiv</th>
            <th>#H</th>
            <th style={{ borderRight: '1px solid' }}>Hybrid</th>
            {additionalColumns.map((correlation) => (
              <th
                key={`CorrCol_${correlation.getID()}`}
                style={{ color: getLabelColor(correlations, correlation) }}
              >
                <div style={{ display: 'block' }}>
                  <p>{correlation.getLabel('origin')}</p>
                  <p>
                    {correlation &&
                    correlation.getSignal() &&
                    correlation.getSignal().delta
                      ? correlation.getSignal().delta.toFixed(2)
                      : ''}
                  </p>
                  <p style={{ fontSize: 8 }}>
                    {correlation.getExperimentType()
                      ? `(${correlation.getExperimentType().toUpperCase()})`
                      : ''}
                  </p>
                </div>
              </th>
            ))}
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default CorrelationTable;
