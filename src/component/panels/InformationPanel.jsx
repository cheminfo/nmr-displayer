import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';

import { useChartData } from '../context/ChartContext';
import ReactTableFlexLayout from '../elements/ReactTable/ReactTableFlexLayout';

const styles = {
  searchInput: {
    width: '100%',
    borderRadius: '5px',
    border: '0.55px solid gray',
    padding: '5px',
    marginBottom: '2px',
  },
};

// information panel
const InformationPanel = memo(() => {
  const { data, activeSpectrum } = useChartData();
  const [information, setInformation] = useState([]);
  const [matches, setMatchesData] = useState([]);
  const [currentActiveSpectrumID, setCurrentActiveSpectrumID] = useState(null);

  const handleSearch = useCallback(
    (input) => {
      const values = Object.keys(information).filter((key) =>
        key.toLowerCase().includes(input.target.value.toLowerCase()),
      );
      setMatchesData(values);
    },
    [information],
  );

  useEffect(() => {
    if (data && activeSpectrum) {
      const activeSpectrumData = data.find((d) => d.id === activeSpectrum.id);
      if (
        activeSpectrumData &&
        (!currentActiveSpectrumID ||
          currentActiveSpectrumID !== activeSpectrumData.id)
      ) {
        const keys = Object.keys(activeSpectrumData.info).concat(
          Object.keys(activeSpectrumData.meta),
        );

        setMatchesData(keys);
        setInformation({
          ...activeSpectrumData.info,
          ...activeSpectrumData.meta,
        });
        setCurrentActiveSpectrumID(activeSpectrumData.id);
      }
    }
  }, [activeSpectrum, currentActiveSpectrumID, data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Parameter',
        sortType: 'basic',
        minWidth: 100,
        width: 20,
        maxWidth: 20,
        Cell: ({ row }) => (
          <p style={{ padding: '5px', backgroundColor: 'white' }}>
            {row.original}
          </p>
        ),
      },
      {
        Header: 'Value',
        sortType: 'basic',
        resizable: true,
        Cell: ({ row }) => (
          <p
            style={{
              backgroundColor: '#efefef',
              width: '100%',
              height: '100%',
              padding: '5px',
              fontFamily: 'monospace',
              whiteSpace: 'pre',
            }}
          >
            {information[row.original]}
          </p>
        ),
      },
    ],
    [information],
  );

  return (
    <>
      <div>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search for parameter..."
          onChange={handleSearch}
        />
      </div>

      <ReactTableFlexLayout data={matches} columns={columns} />
    </>
  );
});

export default InformationPanel;
