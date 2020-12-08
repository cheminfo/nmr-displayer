const REFERENCES = {
  '1H': {
    tms: {
      from: -0.1,
      to: 0.1,
      nbPeaks: 1,
      delta: 0,
    },
    tsp: {
      from: -0.1,
      to: 0.1,
      nbPeaks: 1,
      delta: 0,
    },
    glucose: {
      from: 5.18,
      to: 5.28,
      nbPeaks: 2,
      delta: 5.23,
    },
  },
  '13C': {},
};

function getRange(options = {}) {
  const { nucleus = '1H', reference = 'tms' } = options;

  if (!REFERENCES[nucleus]) {
    throw new Error('Nucleus not found: ', nucleus);
  }

  let info = REFERENCES[nucleus][reference.toLowerCase()];

  if (!info) {
    throw new Error('Reference not found: ', reference);
  }

  return {
    from: info.delta - 0.05,
    to: info.delta + 0.05,
    delta: info.delta,
    nbPeaks: info.nbPeaks,
  };
}

export { REFERENCES, getRange };
