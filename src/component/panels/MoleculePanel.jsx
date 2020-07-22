/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useAlert } from 'react-alert';
import Slider from 'react-animated-slider-2';
import {
  FaPlus,
  FaPaste,
  FaRegTrashAlt,
  FaFileExport,
  FaDownload,
  FaFileImage,
  FaCopy,
} from 'react-icons/fa';
import { MF } from 'react-mf';
import OCLnmr from 'react-ocl-nmr';
import 'react-animated-slider-2/build/horizontal.css';
import { useMeasure } from 'react-use';

import { useChartData } from '../context/ChartContext';
import { useDispatch } from '../context/DispatchContext';
import MenuButton from '../elements/MenuButton';
import ToolTip from '../elements/ToolTip/ToolTip';
import { useHighlightData } from '../highlight';
import MoleculeStructureEditorModal from '../modal/MoleculeStructureEditorModal';
import {
  ADD_MOLECULE,
  DELETE_MOLECULE,
  SET_MOLECULE,
  CHANGE_RANGE_DATA,
} from '../reducer/types/Types';
import {
  copyTextToClipboard,
  copyPNGToClipboard,
  exportAsSVG,
} from '../utility/Export';

import { HighlightSignalConcatenation } from './extra/constants/ConcatenationStrings';
import { getPubIntegral, unlink } from './extra/utilities/RangeUtilities';

const panelContainerStyle = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: 100%;
`;

const toolbarStyle = css`
  display: flex;
  flex-direction: row;
  border-bottom: 0.55px solid rgb(240, 240, 240);
  padding: 0px 5px;

  button svg {
    fill: #4e4e4e;
  }

  .bar-button {
    background-color: transparent;
    border: none;
  }

  p {
    margin: 0;
    text-align: right;
    width: 100%;
    line-height: 22px;
    padding: 0px 10px;
  }
`;

const moleculeContainerStyle = css`
  width: 100%;
  height: 100%;

  .slider {
    width: inherit;
    height: inherit;
    padding: 0px;

    .mol-svg-container {
      height: calc(100% - 25px);
      div {
        width: 100%;
        height: 100%;
      }
    }

    p {
      width: 100%;
      margin: 0 auto;
      display: block;
      position: relative;
    }

    svg polygon {
      fill: gray !important;
    }
  }
`;

const menuButton = css`
  background-color: transparent;
  border: none;
  border-bottom: 0.55px solid whitesmoke;
  height: 35px;
  outline: outline;
  display: flex;
  justify-content: flex-start;

  :focus {
    outline: none !important;
  }
  span {
    font-size: 10px;
    padding: 0px 10px;
  }
`;

const MoleculePanel = memo(() => {
  const [refContainer, { width, height }] = useMeasure();
  const [open, setOpen] = React.useState(false);
  const [currentMolfile, setCurrentMolfile] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [onAtomHoverHighlights, setOnAtomHoverHighlights] = useState([]);
  const [onAtomHoverAction, setOnAtomHoverAction] = useState(null);

  const dispatch = useDispatch();
  const alert = useAlert();

  const {
    data: spectrumData,
    activeSpectrum,
    molecules,
    activeTab,
    assignmentMeta, // override onClick methods in each case
  } = useChartData();

  const highlightData = useHighlightData();
  const [elements, setElements] = useState([]);

  useEffect(() => {
    if (activeTab) {
      const split = activeTab.split(',');
      if (split.length === 1) {
        setElements([activeTab.replace(/[0-9]/g, '')]);
      } else if (split.length === 2) {
        setElements(split.map((nucleus) => nucleus.replace(/[0-9]/g, '')));
      }
    } else {
      setElements([]);
    }
  }, [activeTab]);

  const extractFromAtom = useCallback(
    (atom) => {
      if (
        assignmentMeta.activeAssignmentAxis !== undefined &&
        elements &&
        Object.keys(atom).length > 0
      ) {
        console.log(assignmentMeta.activeAssignmentAxis);
        const dim = assignmentMeta.activeAssignmentAxis === 'X' ? 0 : 1;
        console.log(dim);
        if (elements[dim] === atom.atomLabel) {
          // take always oclID if atom type is same as element of activeTab)
          return { oclIDs: [atom.oclID], nbAtoms: atom.nbAtoms };
        }
        if (elements[dim] === 'H') {
          // if we are in proton spectrum and use then the IDs of attached hydrogens of an atom
          return {
            oclIDs: atom.hydrogenOCLIDs,
            nbAtoms: atom.nbAtoms * atom.nbHydrogens,
          };
        }
      }

      return { oclIDs: [], nbAtoms: 0 };
    },
    [assignmentMeta, elements],
  );

  const rangesData = useMemo(() => {
    const _data =
      activeSpectrum && spectrumData
        ? spectrumData[activeSpectrum.index]
        : null;

    if (_data && _data.ranges && _data.ranges.values) {
      return _data.ranges.values;
    }
    return [];
  }, [activeSpectrum, spectrumData]);

  const assignments = useMemo(() => {
    return rangesData.map((_range) => {
      return {
        rangeID: _range.id,
        diaID: {
          range: _range.diaID ? _range.diaID : [],
          signal: _range.signal
            ? _range.signal
                .map((_signal, i) => {
                  return {
                    diaID: _signal.diaID ? _signal.diaID : [],
                    signalIndex: i,
                  };
                })
                .flat()
            : [],
        },
      };
    });
  }, [rangesData]);

  const assignedDiaIDs = useMemo(() => {
    return assignments
      .map((_range) =>
        [].concat(
          _range.diaID.range,
          _range.diaID.signal.map((_signal) => _signal.diaID).flat(),
        ),
      )
      .flat();
  }, [assignments]);

  const toggleAssignment = useCallback(
    (diaID, atomInformation) => {
      // 1. one atom can only be assigned to one range/signal
      // 2. check whether an atom is already assigned to a range to allow toggling the assignment
      if (
        assignedDiaIDs.some((_oclID) =>
          atomInformation.oclIDs.includes(_oclID),
        ) &&
        !diaID.some((_oclID) => atomInformation.oclIDs.includes(_oclID))
      ) {
        alert.info('Atom is already assigned to another signal!');
        return diaID;
      }
      let _diaID = diaID ? diaID.slice() : [];
      if (atomInformation.oclIDs.length === 1) {
        if (_diaID.includes(atomInformation.oclIDs[0])) {
          _diaID = _diaID.filter((_id) => _id !== atomInformation.oclIDs[0]);
        } else {
          for (let i = 0; i < atomInformation.nbAtoms; i++) {
            _diaID.push(atomInformation.oclIDs[0]);
          }
        }
      } else if (atomInformation.oclIDs.length > 1) {
        atomInformation.oclIDs.forEach((_oclID) => {
          if (_diaID.includes(_oclID)) {
            _diaID = _diaID.filter((_id) => _id !== _oclID);
          } else {
            _diaID.push(_oclID);
          }
        });
      }

      return _diaID;
    },
    [alert, assignedDiaIDs],
  );

  const handleOnClickAtom = useCallback(
    (atom) => {
      if (
        highlightData.highlight.highlightedPermanently &&
        highlightData.highlight.highlightedPermanently.length > 0
      ) {
        const atomInformation = extractFromAtom(atom);
        console.log('---clickOnAtom---');
        console.log(atom);
        console.log(atomInformation);
        if (atomInformation.nbAtoms > 0) {
          // Detect range and signal index within permanent highlights (assignment mode)
          // via searching for the format "range.id" + ${HighlightSignalConcatenation} + "signalIndex".
          // Also, here, we expect that the permanent highlights contain only one signal,
          // if not the first is taken in this search.
          let range, split, signalIndex, id;
          let stop = false;
          for (let i = 0; i < rangesData.length; i++) {
            range = rangesData[i];
            for (
              let j = 0;
              j < highlightData.highlight.highlightedPermanently.length;
              j++
            ) {
              split = highlightData.highlight.highlightedPermanently[j].split(
                HighlightSignalConcatenation,
              );
              id = split[0];
              signalIndex = split[1];
              if (id === range.id) {
                stop = true;
                break;
              }
            }
            if (stop) break;
          }

          // determine the level of setting the diaID array (range vs. signal level) and save there
          const _range = { ...range };
          if (signalIndex === undefined) {
            _range.diaID = toggleAssignment(
              _range.diaID || [],
              atomInformation,
            );
          } else if (range.signal && range.signal[signalIndex]) {
            _range.signal[signalIndex] = {
              ..._range.signal[signalIndex],
              diaID: toggleAssignment(
                _range.signal[signalIndex].diaID || [],
                atomInformation,
              ),
            };
          }
          _range.pubIntegral = getPubIntegral(_range);
          dispatch({ type: CHANGE_RANGE_DATA, data: _range });
        } else {
          alert.info(
            'Not assigned! Different atom type or no attached hydrogens found!',
          );
        }
      }
    },
    [
      alert,
      dispatch,
      extractFromAtom,
      highlightData.highlight.highlightedPermanently,
      rangesData,
      toggleAssignment,
    ],
  );

  const currentDiaIDsToHighlight = useMemo(() => {
    // don't highlight assigned atoms on range level when hovering over signals
    const rangeIDs = highlightData.highlight.highlighted.filter(
      (_highlighted) =>
        _highlighted.split(HighlightSignalConcatenation).length === 1,
    );
    const signalIDs = highlightData.highlight.highlighted.filter(
      (_highlighted) =>
        _highlighted.split(HighlightSignalConcatenation).length === 2,
    );
    const ignoredRangeDiaIDs = rangeIDs.filter((_rangeID) =>
      signalIDs.some(
        (_signalID) =>
          _signalID.split(HighlightSignalConcatenation)[0] === _rangeID,
      ),
    );
    return highlightData.highlight.highlighted
      .map((_highlighted) => {
        let splitHighlight = _highlighted.split(HighlightSignalConcatenation);
        if (splitHighlight.length < 1 || splitHighlight.length > 2) {
          return null;
        }
        return assignments
          .map((_range) => {
            if (_range.rangeID === splitHighlight[0]) {
              if (
                splitHighlight.length === 1 &&
                !ignoredRangeDiaIDs.includes(splitHighlight[0])
              ) {
                return _range.diaID.range;
              } else if (splitHighlight.length === 2) {
                return _range.diaID.signal.find(
                  (_signal) =>
                    `${_range.rangeID}${HighlightSignalConcatenation}${_signal.signalIndex}` ===
                    _highlighted,
                ).diaID;
              }
            }
            return null;
          })
          .flat();
      })
      .flat()
      .filter((_highlighted) => _highlighted !== null);
  }, [assignments, highlightData.highlight.highlighted]);

  useEffect(() => {
    if (onAtomHoverAction) {
      if (onAtomHoverAction === 'show') {
        highlightData.dispatch({
          type: 'SHOW',
          payload: onAtomHoverHighlights,
        });
      } else if (onAtomHoverAction === 'hide') {
        highlightData.dispatch({
          type: 'HIDE',
          payload: onAtomHoverHighlights,
        });
        setOnAtomHoverHighlights([]);
      }
      setOnAtomHoverAction(null);
    }
  }, [onAtomHoverAction, onAtomHoverHighlights, highlightData]);

  const handleOnAtomHover = useCallback(
    (atom) => {
      const oclIDs = extractFromAtom(atom).oclIDs;
      // on enter the atom
      if (oclIDs.length > 0) {
        const filteredRange = assignments.find(
          (_range) =>
            _range.diaID.range.some((_id) => oclIDs.includes(_id)) ||
            _range.diaID.signal.some((_signal) =>
              oclIDs.some((_oclID) => _signal.diaID.includes(_oclID)),
            ),
        );
        const highlights = filteredRange
          ? [filteredRange.rangeID]
          : onAtomHoverHighlights.slice();

        if (highlights.length > 0) {
          if (filteredRange) {
            // The following is done to add a distinguishable highlight id
            // that a RangesTableRow knows to highlight the assigned atom
            // count label for a signal while hovering over an atom.
            if (filteredRange.diaID.range.some((_id) => oclIDs.includes(_id))) {
              highlights.push(filteredRange.rangeID);
            } else {
              const filteredSignalIndex = filteredRange.diaID.signal.find(
                (_signal) =>
                  oclIDs.some((_oclID) => _signal.diaID.includes(_oclID)),
              ).signalIndex;
              highlights.push(
                `${filteredRange.rangeID}${HighlightSignalConcatenation}${filteredSignalIndex}`,
              );
            }
          }
          setOnAtomHoverHighlights(highlights);
          setOnAtomHoverAction('show');
        }
      } else {
        // on leave the atom
        setOnAtomHoverAction('hide');
      }
    },
    [onAtomHoverHighlights, assignments, extractFromAtom],
  );

  const handleOnUnlinkAll = useCallback(() => {
    rangesData.forEach((range) => {
      const _range = Object.assign({}, range);
      unlink(_range);
      dispatch({ type: CHANGE_RANGE_DATA, data: _range });
    });
  }, [dispatch, rangesData]);

  const handleClose = useCallback(
    (e) => {
      setOpen(false);
      if (e === 'new') {
        setCurrentIndex(molecules.length);
      }
    },
    [molecules.length],
  );

  const handleOpen = useCallback((event, key, molfile) => {
    if (molfile) {
      setCurrentMolfile({ molfile, key });
    } else {
      setCurrentMolfile(null);
    }
    setOpen(true);
  }, []);

  const handlePaste = useCallback(() => {
    navigator.clipboard.readText().then((molfile) => {
      dispatch({ type: ADD_MOLECULE, molfile });
    });
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    if (molecules[currentIndex] && molecules[currentIndex].key) {
      setCurrentIndex(0);
      dispatch({ type: DELETE_MOLECULE, key: molecules[currentIndex].key });

      handleOnUnlinkAll();
    }
  }, [molecules, currentIndex, dispatch, handleOnUnlinkAll]);

  const saveAsSVGHandler = useCallback(() => {
    exportAsSVG('molFile', `molSVG${currentIndex}`);
  }, [currentIndex]);

  const saveAsPNGHandler = useCallback(() => {
    copyPNGToClipboard(`molSVG${currentIndex}`);
    alert.success('MOL copied as PNG to clipboard');
  }, [alert, currentIndex]);

  const saveAsMolHandler = useCallback(() => {
    if (molecules[currentIndex]) {
      const flag = copyTextToClipboard(molecules[currentIndex].molfile);
      if (flag) {
        alert.success('MOLFile copied to clipboard');
      } else {
        alert.error('copied not completed');
      }
    }
  }, [alert, currentIndex, molecules]);

  const handleReplaceMolecule = useCallback(
    (key, molfile) => {
      dispatch({ type: SET_MOLECULE, molfile, key });
    },
    [dispatch],
  );

  return (
    <div css={panelContainerStyle}>
      <div css={toolbarStyle}>
        <MenuButton
          className="bar-button"
          component={<FaFileExport />}
          toolTip="Export As"
        >
          <button type="button" css={menuButton} onClick={saveAsMolHandler}>
            <FaCopy />
            <span>Copy as molfile</span>
          </button>
          <button type="button" css={menuButton} onClick={saveAsPNGHandler}>
            <FaFileImage />
            <span>Copy as PNG</span>
          </button>
          <button type="button" css={menuButton} onClick={saveAsSVGHandler}>
            <FaDownload />
            <span>Export as SVG</span>
          </button>
        </MenuButton>

        <ToolTip title="Paste molfile" popupPlacement="left">
          <button className="bar-button" type="button" onClick={handlePaste}>
            <FaPaste />
          </button>
        </ToolTip>
        <ToolTip title="Add Molecule" popupPlacement="left">
          <button className="bar-button" type="button" onClick={handleOpen}>
            <FaPlus />
          </button>
        </ToolTip>
        <ToolTip title="Delete Molecule" popupPlacement="left">
          <button className="bar-button" type="button" onClick={handleDelete}>
            <FaRegTrashAlt />
          </button>
        </ToolTip>
        <p>
          {molecules &&
            molecules.length > 0 &&
            `${+(currentIndex + 1)} / ${molecules.length}`}{' '}
        </p>
      </div>
      <div css={moleculeContainerStyle}>
        <Slider
          onSlideChange={(event) => setCurrentIndex(event.slideIndex)}
          slideIndex={currentIndex}
        >
          {molecules && molecules.length > 0 ? (
            molecules.map((mol, index) => (
              <div
                key={mol.key}
                onDoubleClick={(event) =>
                  handleOpen(event, mol.key, mol.molfile)
                }
              >
                <div className="mol-svg-container" ref={refContainer}>
                  <OCLnmr
                    id={`molSVG${index}`}
                    width={width > 0 ? width : 100}
                    height={height > 0 ? height : 100}
                    molfile={mol.molfile}
                    setMolfile={(molfile) =>
                      handleReplaceMolecule(mol.key, molfile)
                    }
                    setSelectedAtom={handleOnClickAtom}
                    atomHighlightColor={
                      currentDiaIDsToHighlight &&
                      currentDiaIDsToHighlight.length > 0
                        ? 'red'
                        : '#FFD700'
                    }
                    atomHighlightOpacity={0.35}
                    highlights={
                      currentDiaIDsToHighlight &&
                      currentDiaIDsToHighlight.length > 0
                        ? currentDiaIDsToHighlight
                        : assignedDiaIDs
                    }
                    setHoverAtom={handleOnAtomHover}
                  />
                </div>
                <p>
                  <MF mf={mol.mf} /> - {mol.mw.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <div
              style={{ width: '100%', height: '100%' }}
              onClick={handleOpen}
            />
          )}
        </Slider>

        <MoleculeStructureEditorModal
          open={open}
          onClose={handleClose}
          selectedMolecule={currentMolfile}
        />
      </div>
    </div>
  );
});

export default MoleculePanel;
