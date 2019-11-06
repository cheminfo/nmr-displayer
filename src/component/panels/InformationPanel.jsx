import React, { useState, useCallback, useEffect } from 'react';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../elements/Table';
import { useChartData } from '../context/ChartContext';

// information panel
const InformationPanel = () => {
  const { data, activeSpectrum } = useChartData();
  const [information, setInformation] = useState([]);
  const [matches, setMatchesData] = useState([]);

  const handleSearch = useCallback(
    (input) => {
      const values = Object.keys(information).filter((key) =>
        key.toLowerCase().includes(input.target.value),
      );

      setMatchesData(values);
    },
    [information],
  );

  useEffect(() => {
    if (data && activeSpectrum) {
      const activeSpectrumData = data.find((d) => d.id === activeSpectrum.id);
      if (activeSpectrumData) {
        console.log(activeSpectrumData.meta);
        console.log(Object.keys(activeSpectrumData.meta));
        setInformation({
          ...activeSpectrumData.info,
          ...activeSpectrumData.meta,
        });
        setMatchesData(
          [
            ...Object.keys(activeSpectrumData.info),
            ...Object.keys(activeSpectrumData.meta),
          ],
          // ...Object.keys(activeSpectrumData.meta),
        );
      }
    }
  }, [activeSpectrum, data]);

  return (
    information && (
      <>
        <div>
          <input
            type="text"
            style={{ width: '100%' }}
            placeholder="Search for parameter..."
            onChange={handleSearch}
          />
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size={3}>Parameter</TableCell>
              <TableCell size={9}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((key) => (
              <TableRow key={key} className="Information">
                <TableCell size={3} align="left">
                  {key}
                </TableCell>
                <TableCell size={9} align="left" style={{ paddingLeft: 5 }}>
                  {`${information[key]}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    )
  );
};

export default InformationPanel;
