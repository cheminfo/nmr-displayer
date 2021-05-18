import { xNoiseSanPlot } from 'ml-spectra-processing';
import { memo, useMemo } from 'react';
import { Axis, LineSeries, Legend, Heading, Plot } from 'react-plot';

const Spectrum1DHistogram = memo(({ color = 'red', data, options = {} }) => {
  const input = prepareData(data.re);
  const { factorStd = 5, yLogBase = 2 } = options;
  const sanResult = xNoiseSanPlot(input, options);

  let sanPlot = {};
  let lines = {};
  for (let plotKey in sanResult.sanplot) {
    const { x, y } = sanResult.sanplot[plotKey];
    let result = new Array(x.length);
    for (let i = 0; i < x.length; i++) {
      result[i] = { x: x[i], y: y[i] };
    }
    sanPlot[plotKey] = result;
    lines[plotKey] = getLine(sanResult[plotKey], result, { yLogBase });
  }

  return (
    <div
      style={{
        borderTop: '1px solid #ededed',
        marginTop: '10px',
        paddingTop: '10px',
      }}
    >
      <Plot
        width={220}
        height={220}
        margin={{ bottom: 40, left: 40, top: 50, right: 13 }}
        // seriesViewportStyle={{ stroke: 'gray' }}
      >
        <Heading title="Sanplot" />
        <LineSeries
          data={sanPlot.positive}
          xAxis="x"
          yAxis="y"
          label="positive"
          lineStyle={{
            stroke: color,
            strokeWidth: 1.2,
          }}
          markerStyle={{
            fill: color,
            stroke: color,
          }}
        />
        <LineSeries
          data={lines.positive}
          xAxis="x"
          yAxis="y"
          label="noise level"
          lineStyle={{
            stroke: 'blue',
            strokeWidth: 0.8,
            strokeDasharray: [3, 3],
          }}
          markerStyle={{
            fill: color,
            stroke: color,
          }}
        />
        <Axis
          id="x"
          label="Pt"
          position="bottom"
          tickStyle={{ fontSize: '0.6rem' }}
          labelStyle={{ fontSize: '0.6rem' }}
        />
        <Axis
          id="y"
          label={`Intensity [Log${yLogBase}]`}
          position="left"
          tickStyle={{ fontSize: '0.6rem' }}
          labelStyle={{ fontSize: '0.7rem' }}
        />
        <Legend position="embedded" bottom={5} right={60} />
      </Plot>

      <Plot
        width={220}
        height={180}
        margin={{ bottom: 50, left: 40, top: 10, right: 13 }}
        // seriesViewportStyle={{ stroke: 'gray' }}
      >
        <LineSeries
          data={sanPlot.negative}
          xAxis="x"
          yAxis="y"
          label="negative"
          lineStyle={{
            stroke: color,
            strokeWidth: 1.2,
          }}
          markerStyle={{
            fill: color,
            stroke: color,
          }}
        />

        <LineSeries
          data={lines.negative}
          xAxis="x"
          yAxis="y"
          label="noise level"
          lineStyle={{
            stroke: 'blue',
            strokeWidth: 0.8,
            strokeDasharray: [3, 3],
          }}
          markerStyle={{
            fill: color,
            stroke: color,
          }}
        />

        <Axis
          id="x"
          label="Pt"
          position="bottom"
          tickStyle={{ fontSize: '0.6rem' }}
          labelStyle={{ fontSize: '0.5rem' }}
        />
        <Axis
          id="y"
          label={`Intensity [Log${yLogBase}]`}
          position="left"
          tickStyle={{ fontSize: '0.6rem' }}
          labelStyle={{ fontSize: '0.7rem' }}
        />
        <Legend position="embedded" bottom={5} right={60} />
      </Plot>
    </div>
  );
});

export default Spectrum1DHistogram;

function prepareData(input) {
  let length = input.length;
  let jump = Math.floor(length / 307200) || 1;
  const array = new Float64Array((length / jump) >> 0);
  let index = 0;
  for (let i = 0; i < array.length; i += jump) {
    array[index++] = input[i];
  }
  return array;
}

function getLine(value, data, options) {
  const { log10, abs } = Math;
  const { yLogBase } = options;
  const inLogScale = log10(abs(value)) / log10(yLogBase);
  return [
    { x: data[0].x, y: inLogScale },
    { x: data[data.length - 1].x, y: inLogScale },
  ];
}