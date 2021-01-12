import lodash from 'lodash';
import { MF } from 'mf-parser';

import Correlation from './Correlation';
import Link from './Link';

const getAtomCountsByMF = (mf) => {
  return mf ? new MF(mf).getInfo().atoms : {};
};

const getAtomCounts = (correlations) => {
  return lodash.get(correlations, 'options.mf', false)
    ? getAtomCountsByMF(correlations.options.mf)
    : {};
};

const getLabel = (correlations, correlation) => {
  let label = Object.keys(correlation.getAttachments())
    .map((otherAtomType) =>
      correlation
        .getAttachments()
        // eslint-disable-next-line no-unexpected-multiline
        [otherAtomType].map((index) =>
          correlation.getLabel(correlations[index].getLabel('origin')),
        )
        .filter((_label) => _label),
    )
    .flat()
    .filter((_label, i, a) => a.indexOf(_label) === i)
    .sort((a, b) =>
      Number(a.split(/[a-z]+/i)[1]) - Number(b.split(/[a-z]+/i)[1]) < 0
        ? -1
        : Number(a.split(/[a-z]+/i)[1]) - Number(b.split(/[a-z]+/i)[1]) === 0 &&
          a.split(/\d+/)[1] < b.split(/\d+/)[1]
        ? -1
        : 1,
    )
    .join('/');

  if (label.length > 0) {
    return label;
  }

  return correlation.getLabel('origin');
};

const sortLabels = (labels) => {
  return labels.sort((a, b) =>
    Number(a.split(/[a-z]+/i)[1]) - Number(b.split(/[a-z]+/i)[1]) < 0
      ? -1
      : Number(a.split(/[a-z]+/i)[1]) - Number(b.split(/[a-z]+/i)[1]) === 0 &&
        a.split(/\d+/)[1] < b.split(/\d+/)[1]
      ? -1
      : 1,
  );
};

const getLabels = (correlations, correlation, experimentType) => {
  const labels = correlation
    .getLinks()
    .filter((link) => link.getExperimentType() === experimentType)
    .map((link) =>
      link
        .getMatches()
        .map((match) => {
          const matchingCorrelation = correlations[match];
          return getLabel(correlations, matchingCorrelation);
        })
        .flat(),
    )
    .flat()
    .filter((label, i, a) => label.length > 0 && a.indexOf(label) === i);

  return sortLabels(labels);
};

const checkSignalMatch = (signal1, signal2, tolerance) =>
  signal1.delta - tolerance <= signal2.delta &&
  signal2.delta <= signal1.delta + tolerance;

const letters = [...Array(26).keys()].map((i) => String.fromCharCode(i + 97));

const getLetter = (number) => {
  return letters[number];
};

const addFromData1D = (correlations, signals1D, tolerance) => {
  Object.keys(signals1D).forEach((atomType) => {
    signals1D[atomType].forEach((signal1D) => {
      const match = correlations.some(
        (correlation) =>
          correlation.getPseudo() === false &&
          correlation.getAtomType() === atomType &&
          checkSignalMatch(
            correlation.getSignal(),
            signal1D.signal,
            tolerance[atomType],
          ),
      );
      if (!match) {
        const pseudoIndex = correlations.findIndex(
          (correlation) =>
            correlation.getAtomType() === atomType &&
            correlation.getPseudo() === true &&
            correlation.getLinks().length === 0,
        );
        if (pseudoIndex >= 0) {
          correlations[pseudoIndex] = new Correlation({
            ...signal1D,
          });
        } else {
          correlations.push(
            new Correlation({
              ...signal1D,
            }),
          );
        }
      }
    });
  });
};

const addFromData2D = (correlations, signals2D, tolerance) => {
  Object.keys(signals2D).forEach((experimentType) =>
    signals2D[experimentType].forEach((signal2D) =>
      signal2D.atomType.forEach((atomType, dim) => {
        const axis = dim === 0 ? 'x' : 'y';
        const matchedCorrelationIndices = correlations
          .map((correlation, k) =>
            correlation.getPseudo() === false &&
            correlation.getAtomType() === atomType &&
            checkSignalMatch(
              correlation.getSignal(),
              signal2D.signal[axis],
              tolerance[atomType],
            )
              ? k
              : -1,
          )
          .filter((index) => index >= 0)
          .filter((index, i, a) => a.indexOf(index) === i);

        const link = new Link({
          experimentType: signal2D.experimentType,
          experimentID: signal2D.experimentID,
          signal: signal2D.signal,
          axis,
          atomType: signal2D.atomType,
        });
        // in case of no signal match -> add new signal from 2D
        if (matchedCorrelationIndices.length === 0) {
          const newCorrelation = new Correlation({
            experimentType: signal2D.experimentType,
            experimentID: signal2D.experimentID,
            atomType,
            signal: {
              id: signal2D.signal.id,
              delta: signal2D.signal[axis].delta,
              sign: signal2D.signal.sign,
            },
          });
          newCorrelation.addLink(link);

          const pseudoIndex = correlations.findIndex(
            (correlation) =>
              correlation.getAtomType() === atomType &&
              correlation.getPseudo() === true &&
              correlation.getLinks().length === 0,
          );
          if (pseudoIndex >= 0) {
            correlations[pseudoIndex] = newCorrelation;
          } else {
            correlations.push(newCorrelation);
          }
        } else {
          matchedCorrelationIndices.forEach((index) => {
            if (
              !correlations[index]
                .getLinks()
                .some(
                  (_link) =>
                    _link.getExperimentType() === link.getExperimentType() &&
                    _link.getExperimentID() === link.getExperimentID() &&
                    lodash.isEqual(_link.getAtomType(), link.getAtomType()) &&
                    _link.getSignalID() === link.getSignalID() &&
                    _link.getAxis() === link.getAxis(),
                )
            ) {
              correlations[index].addLink(link);
            }
          });
        }
      }),
    ),
  );
};

const setMatches = (correlations) => {
  correlations.forEach((correlation) => {
    correlation.getLinks().forEach((link) => {
      // remove previous added matches
      link.removeMatches();
      // add matches
      const otherAtomType =
        link.axis === 'x' ? link.atomType[1] : link.atomType[0];
      getCorrelationsByAtomType(correlations, otherAtomType).forEach(
        (correlationOtherAtomType) => {
          const correlationIndexOtherAtomType = correlations.findIndex(
            (_correlation) =>
              _correlation.getID() === correlationOtherAtomType.getID(),
          );
          correlationOtherAtomType.getLinks().forEach((linkOtherAtomType) => {
            // check for correlation match and avoid possible duplicates
            if (
              linkOtherAtomType.getExperimentType() ===
                link.getExperimentType() &&
              linkOtherAtomType.getExperimentID() === link.getExperimentID() &&
              lodash.isEqual(
                linkOtherAtomType.getAtomType(),
                link.getAtomType(),
              ) &&
              linkOtherAtomType.getSignalID() === link.getSignalID() &&
              linkOtherAtomType.getAxis() !== link.getAxis()
            ) {
              link.addMatch(correlationIndexOtherAtomType);
            }
          });
        },
      );
    });
  });

  // remove links without any matches
  correlations.forEach((correlation) => {
    const linksToRemove = correlation
      .getLinks()
      .filter((link) => link.getMatches().length === 0);
    linksToRemove.forEach((link) => correlation.removeLink(link.getID()));
  });
};

const setAttachmentsAndProtonEquivalences = (correlations) => {
  // update attachment information between heavy atoms and protons via HSQC or HMQC
  correlations.forEach((correlation) => {
    // remove previous set attachments
    correlation.removeAttachments();
    // add attachments
    correlation
      .getLinks()
      .filter(
        (link) =>
          link.getExperimentType() === 'hsqc' ||
          link.getExperimentType() === 'hmqc',
      )
      .forEach((link) => {
        const otherAtomType = link.getAtomType()[
          link.getAxis() === 'x' ? 1 : 0
        ];
        link.getMatches().forEach((matchIndex) => {
          correlation.addAttachment(otherAtomType, matchIndex);
        });
      });
  });
  // reset previously set proton equivalences and set new ones
  // check heavy atoms with an unambiguous protons count
  correlations.forEach((correlation) => {
    if (
      correlation.getAtomType() !== 'H' &&
      correlation.getProtonsCount().length === 1 &&
      correlation.hasAttachmentAtomType('H')
    ) {
      let equivalences = 0;
      if (correlation.getProtonsCount()[0] === 3) {
        equivalences = 2;
      } else if (correlation.getProtonsCount()[0] === 2) {
        equivalences = 1;
      }
      const factor = 1 + correlation.getEquivalences();
      const sharedEquivalences =
        (factor * (1 + equivalences)) / correlation.getAttachments().H.length -
        1;
      correlation.getAttachments().H.forEach((attachedProtonIndex) => {
        correlations[attachedProtonIndex].setEquivalences(sharedEquivalences);
      });
    }
  });
};

const getCorrelationsByAtomType = (correlations, atomType) => {
  return correlations
    ? correlations.filter(
        (correlation) => correlation.getAtomType() === atomType,
      )
    : [];
};

const isEditedHSQC = (experiment) => {
  // detection whether experiment is an edited HSQC
  if (lodash.get(experiment, 'info.pulseSequence', '').includes('hsqced')) {
    return true;
  }

  return false;
};

const setProtonsCountFromData = (
  correlations,
  signalsDEPT,
  signals2D,
  tolerance,
) => {
  const heavyAtomTypes = [];
  correlations.forEach((correlation) => {
    if (
      correlation.getPseudo() === false &&
      correlation.getAtomType() !== 'H' &&
      !heavyAtomTypes.includes(correlation.getAtomType())
    ) {
      heavyAtomTypes.push(correlation.getAtomType());
      if (Object.keys(signalsDEPT).length > 0) {
        setProtonsCountFromDEPT(
          correlations,
          signalsDEPT,
          tolerance,
          correlation.getAtomType(),
        );
      } else {
        setProtonsCountFromEditedHSQC(
          correlations,
          signals2D,
          tolerance,
          correlation.getAtomType(),
        );
      }
    }
  });
};

const setProtonsCountFromDEPT = (
  correlations,
  signalsDEPT,
  tolerance,
  atomType,
) => {
  const correlationsAtomType = getCorrelationsByAtomType(
    correlations,
    atomType,
  ).filter((correlation) => correlation.getPseudo() === false);
  const signalsDEPT90 = lodash
    .get(signalsDEPT, '90', [])
    .filter((signalDEPT90) => signalDEPT90.atomType === atomType)
    .map((signalDEPT90) => signalDEPT90.signal);
  const signalsDEPT135 = lodash
    .get(signalsDEPT, '135', [])
    .filter((signalDEPT135) => signalDEPT135.atomType === atomType)
    .map((signalDEPT135) => signalDEPT135.signal);

  setProtonsCount(
    correlationsAtomType,
    signalsDEPT90,
    signalsDEPT135,
    tolerance[atomType],
  );
};

const setProtonsCountFromEditedHSQC = (
  correlations,
  signals2D,
  tolerance,
  heavyAtomType,
) => {
  const correlationsAtomTypeHSQC = correlations.filter(
    (correlation) =>
      correlation.getPseudo() === false &&
      correlation.getAtomType() === heavyAtomType,
  );
  const signalsEditedHSQC = lodash
    .get(signals2D, 'hsqc', [])
    .filter(
      (signal2D) =>
        signal2D.atomType[1] === heavyAtomType && signal2D.signal.sign !== 0,
    )
    .map((signal2D) => {
      return { delta: signal2D.signal.y.delta, sign: signal2D.signal.sign };
    });

  setProtonsCount(
    correlationsAtomTypeHSQC,
    [],
    signalsEditedHSQC,
    tolerance[heavyAtomType],
  );
};

const setProtonsCount = (
  correlationsAtomType,
  signals90,
  signals135,
  toleranceAtomType,
) => {
  for (let i = 0; i < correlationsAtomType.length; i++) {
    if (correlationsAtomType[i].getEdited().protonsCount) {
      // do not overwrite a manually edited value
      continue;
    }

    const match = [-1, -1];
    for (let k = 0; k < signals90.length; k++) {
      if (
        signals90[k].sign === 1 &&
        checkSignalMatch(
          correlationsAtomType[i].signal,
          signals90[k],
          toleranceAtomType,
        )
      ) {
        match[0] = k;
        break;
      }
    }
    for (let k = 0; k < signals135.length; k++) {
      if (
        checkSignalMatch(
          correlationsAtomType[i].signal,
          signals135[k],
          toleranceAtomType,
        )
      ) {
        match[1] = k;
        break;
      }
    }

    if (match[0] >= 0) {
      // signal match in DEPT90
      // CH
      correlationsAtomType[i].setProtonsCount([1]);
      continue;
    }
    // no signal match in DEPT90
    if (match[1] >= 0) {
      // signal match in DEPT135
      if (signals135[match[1]].sign === 1) {
        // positive signal
        if (signals90.length > 0) {
          // in case of both DEPT90 and DEPT135 are given
          // CH3
          correlationsAtomType[i].setProtonsCount([3]);
          if (!correlationsAtomType[i].getEdited().hybridization) {
            // do not overwrite a manually edited value
            correlationsAtomType[i].setHybridization('SP3');
          }
        } else {
          // in case of DEPT135 is given only
          // CH or CH3
          correlationsAtomType[i].setProtonsCount([1, 3]);
        }
      } else {
        // negative signal
        // CH2
        correlationsAtomType[i].setProtonsCount([2]);
      }
    } else {
      if (signals135.length > 0) {
        // no signal match in both spectra
        // qC
        correlationsAtomType[i].setProtonsCount([0]);
      } else {
        // no information
        correlationsAtomType[i].setProtonsCount([]);
      }
    }
  }
};

const updatePseudoCorrelations = (correlations, mf) => {
  // add pseudo correlations
  addPseudoCorrelations(correlations, mf);
  // remove pseudo correlations to be replaced by equivalences
  replacePseudoCorrelationsByEquivalences(correlations, mf);

  return correlations;
};

const addPseudoCorrelations = (correlations, mf) => {
  const atoms = getAtomCountsByMF(mf);
  Object.keys(atoms).forEach((atomType) => {
    // consider also pseudo correlations since they do not need to be added again
    const atomTypeCount = correlations.filter(
      (correlation) => correlation.getAtomType() === atomType,
    ).length;
    // add missing pseudo correlations
    for (let i = atomTypeCount; i < atoms[atomType]; i++) {
      correlations.push(
        new Correlation({
          atomType,
          pseudo: true,
        }),
      );
    }
  });
};

const replacePseudoCorrelationsByEquivalences = (correlations, mf) => {
  const atoms = getAtomCountsByMF(mf);
  Object.keys(atoms).forEach((atomType) => {
    // remove pseudo correlations to be replaced by equivalences, starting at the end
    const atomTypeEquivalencesCount = correlations.reduce(
      (sum, correlation) =>
        correlation.getAtomType() === atomType &&
        correlation.getPseudo() === false
          ? sum + correlation.getEquivalences()
          : sum,
      0,
    );
    const pseudoCorrelationsAtomType = correlations.filter(
      (correlation) =>
        correlation.getAtomType() === atomType &&
        correlation.getPseudo() === true,
    );
    for (let i = atomTypeEquivalencesCount - 1; i >= 0; i--) {
      if (pseudoCorrelationsAtomType.length === 0) {
        break;
      }
      const pseudoCorrelationToRemove = pseudoCorrelationsAtomType.pop();
      correlations.splice(correlations.indexOf(pseudoCorrelationToRemove), 1);
    }
  });
};

const removeDeletedCorrelations = (correlations, signals1D, signals2D) => {
  const _correlations = correlations.filter(
    (correlation) => correlation.getPseudo() === false,
  );
  const removeList = _correlations.slice();
  _correlations.forEach((correlation) => {
    if (correlation.getExperimentType() === '1d') {
      // search in 1D data
      if (
        lodash
          .get(signals1D, correlation.getAtomType(), [])
          .some((signal1D) => signal1D.signal.id === correlation.getSignal().id)
      ) {
        const index = removeList.indexOf(correlation);
        if (index >= 0) {
          removeList.splice(index, 1);
        }
      }
    } else {
      // search in 2D data
      if (
        lodash
          .get(signals2D, `${correlation.getExperimentType()}`, [])
          .some(
            (signal2D) =>
              signal2D.atomType.indexOf(correlation.getAtomType()) !== -1 &&
              signal2D.signal.id === correlation.getSignal().id,
          )
      ) {
        const index = removeList.indexOf(correlation);
        if (index >= 0) {
          removeList.splice(index, 1);
        }
      }
    }
  });

  removeList.forEach((correlation) => {
    const index = correlations.indexOf(correlation); // in case we already removed previously
    if (index >= 0) {
      correlations.splice(index, 1);
    }
  });
};

const setLabels = (correlations) => {
  const atomTypeCounts = {};
  correlations.forEach((correlation) => {
    if (!lodash.get(atomTypeCounts, correlation.getAtomType(), false)) {
      atomTypeCounts[correlation.getAtomType()] = 0;
    }
    atomTypeCounts[correlation.getAtomType()]++;
    correlation.setLabel(
      'origin',
      `${correlation.getAtomType()}${
        atomTypeCounts[correlation.getAtomType()]
      }`,
    );
  });
};

const sortCorrelations = (correlations) => {
  const compare = (corr1, corr2) => {
    if (corr1.getSignal().delta < corr2.getSignal().delta) {
      return -1;
    }
    if (corr1.getSignal().delta > corr2.getSignal().delta) {
      return 1;
    }
    return 0;
  };

  let sortedCorrelations = [];
  const atomTypes = correlations
    .map((correlation) => correlation.getAtomType())
    .filter((atomType, i, a) => a.indexOf(atomType) === i);
  atomTypes.forEach((atomType) => {
    const correlationsAtomType = getCorrelationsByAtomType(
      correlations,
      atomType,
    );
    correlationsAtomType.sort(compare);
    sortedCorrelations = sortedCorrelations.concat(correlationsAtomType);
  });

  // set indices to correlations
  sortedCorrelations.forEach((correlation, i) => correlation.setIndex(i));

  return sortedCorrelations;
};

const buildCorrelationsState = (correlationData) => {
  const state = {};
  const atoms = getAtomCounts(correlationData);
  const atomTypesInCorrelations = correlationData.values.reduce(
    (array, correlation) =>
      array.includes(correlation.getAtomType())
        ? array
        : array.concat(correlation.getAtomType()),
    [],
  );

  atomTypesInCorrelations.forEach((atomType) => {
    const correlationsAtomType = getCorrelationsByAtomType(
      correlationData.values,
      atomType,
    );
    let atomCountAtomType = correlationsAtomType.reduce(
      (sum, correlation) =>
        correlation.getPseudo() === false
          ? sum + 1 + correlation.getEquivalences()
          : sum,
      0,
    );

    // add protons count from pseudo correlations
    if (atomType === 'H') {
      correlationData.values.forEach((correlation) => {
        if (
          correlation.getPseudo() === true &&
          correlation.getAtomType() !== 'H' &&
          correlation.getProtonsCount().length === 1 &&
          correlation.getLinks().some(
            (link) =>
              link.getPseudo() === true &&
              link.getExperimentType() === 'hsqc' &&
              link.getMatches().length === 1 &&
              // do not consider again already counted protons which are real correlations
              correlationData.values[link.getMatches()[0]].getPseudo() === true,
          )
        ) {
          atomCountAtomType += correlation.getProtonsCount()[0];
        }
      });
    }

    const atomCount = atoms[atomType];

    state[atomType] = {
      current: atomCountAtomType,
      total: atomCount,
      complete: atomCountAtomType === atomCount ? true : false,
    };
    const createErrorProperty = () => {
      if (!lodash.get(state, `${atomType}.error`, false)) {
        state[atomType].error = {};
      }
    };
    if (!state[atomType].complete) {
      createErrorProperty();
      state[atomType].error.incomplete = true;
    }
    if (atomType === 'H') {
      const notAttached = correlationsAtomType.reduce(
        (array, correlation) =>
          Object.keys(correlation.getAttachments()).length === 0
            ? array.concat(correlation.getIndex())
            : array,
        [],
      );
      if (notAttached.length > 0) {
        createErrorProperty();
        state[atomType].error.notAttached = notAttached;
      }
      const ambiguousAttachment = correlationsAtomType.reduce(
        (array, correlation) =>
          Object.keys(correlation.getAttachments()).length > 1 ||
          Object.keys(correlation.getAttachments()).some(
            (otherAtomType) =>
              correlation.getAttachments()[otherAtomType].length > 1,
          )
            ? array.concat(correlation.getIndex())
            : array,
        [],
      );
      if (ambiguousAttachment.length > 0) {
        createErrorProperty();
        state[atomType].error.ambiguousAttachment = ambiguousAttachment;
      }
    }

    const outOfLimit = correlationsAtomType.some(
      (correlation, k) =>
        correlation.getPseudo() === false &&
        correlation.getAtomType() === atomType &&
        k >= atomCount,
    );
    if (outOfLimit) {
      createErrorProperty();
      state[atomType].error.outOfLimit = true;
    }
  });

  return state;
};

const buildCorrelationsData = (
  signals1D,
  signals2D,
  signalsDEPT,
  mf,
  tolerance,
  correlations = [],
) => {
  let _correlations = correlations.slice();
  // remove deleted correlations
  removeDeletedCorrelations(_correlations, signals1D, signals2D);
  // add all 1D signals
  addFromData1D(_correlations, signals1D, tolerance);
  // add signals from 2D if 1D signals for an atom type and belonging shift are missing
  // add correlations: 1D -> 2D
  addFromData2D(_correlations, signals2D, tolerance);
  // set the number of attached protons via DEPT or edited HSQC
  setProtonsCountFromData(_correlations, signalsDEPT, signals2D, tolerance);

  updateCorrelationsData(_correlations, mf);

  return _correlations;
};

const updateCorrelationsData = (correlations, mf) => {
  // sort by atom type and shift value
  correlations = sortCorrelations(correlations);
  // link signals via matches to same 2D signal: e.g. 13C -> HSQC <- 1H
  setMatches(correlations);
  // set attachments via HSQC or HMQC
  setAttachmentsAndProtonEquivalences(correlations);
  // update pseudo correlation
  updatePseudoCorrelations(correlations, mf);
  // set labels
  setLabels(correlations);

  return correlations;
};

export {
  buildCorrelationsData,
  buildCorrelationsState,
  checkSignalMatch,
  getAtomCounts,
  getAtomCountsByMF,
  getCorrelationsByAtomType,
  getLabel,
  getLabels,
  getLetter,
  isEditedHSQC,
  updateCorrelationsData,
};
