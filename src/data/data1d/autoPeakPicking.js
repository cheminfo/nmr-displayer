import * as SD from 'spectra-data';

import median from 'ml-array-median';
import generateID from '../utilities/generateID';

export default function autoPeakPicking(datum1D, options) {
  const { minMaxRatio, maxNumberOfPeaks } = options;
  // we calculate the noise but this could be improved
  let noise = median(datum1D.data.re.map((y) => Math.abs(y)));

  const spectrum = SD.NMR.fromXY(datum1D.data.x, datum1D.data.re);
  let peaks = spectrum.createPeaks({
    noiseLevel: noise * 5,
    minMaxRatio: minMaxRatio, // Threshold to determine if a given peak should be considered as a noise
    realTopDetection: true,
    maxCriteria: true,
    smoothY: false,
    sgOptions: { windowSize: 7, polynomial: 3 },
  });

  peaks.sort((a, b) => b.y - a.y);
  if (maxNumberOfPeaks) peaks = peaks.slice(0, maxNumberOfPeaks);

  return peaks.map((peak) => {
    return {
      id: generateID(),
      xIndex: peak.index,
      intensity: peak.y,
      width: peak.width,
      xShift: datum1D.data.x[peak.index] - peak.x,
    };
  });
}
