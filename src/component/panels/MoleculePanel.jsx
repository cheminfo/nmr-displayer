/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import OCL from 'openchemlib/full';
import { useState, useCallback, useMemo, useEffect, memo } from 'react';
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
import { useMeasure } from 'react-use';

import { ConcatenationString } from '../../data/utilities/Concatenation';
import { useAssignmentData, useAssignment } from '../assignment';
import { useDispatch } from '../context/DispatchContext';
import MenuButton from '../elements/MenuButton';
import NextPrev from '../elements/NextPrev';
import ToolTip from '../elements/ToolTip/ToolTip';
import { useAlert } from '../elements/popup/Alert';
import { useHighlightData } from '../highlight';
import MoleculeWrapper from '../hoc/MoleculeWrapper';
import MoleculeStructureEditorModal from '../modal/MoleculeStructureEditorModal';
import { DISPLAYER_MODE } from '../reducer/core/Constants';
import {
  ADD_MOLECULE,
  DELETE_MOLECULE,
  SET_DIAID_RANGE,
  SET_DIAID_ZONE,
  SET_MOLECULE,
  UNLINK_RANGE,
  UNLINK_ZONE,
} from '../reducer/types/Types';
import {
  copyTextToClipboard,
  copyPNGToClipboard,
  exportAsSVG,
} from '../utility/Export';

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

  button {
    background-color: transparent;
    border: none;
    padding: 5px;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0px;
    .mol-svg-container {
      height: calc(100% - 25px);
      width: 100%;
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
      text-align: center;
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

function MoleculePanel({ zones, ranges, molecules, activeTab, displayerMode }) {
  const [refContainer, { width, height }] = useMeasure();
  const [open, setOpen] = useState(false);
  const [currentMolfile, setCurrentMolfile] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [onAtomHoverHighlights, setOnAtomHoverHighlights] = useState([]);
  const [onAtomHoverAction, setOnAtomHoverAction] = useState(null);

  const dispatch = useDispatch();
  const alert = useAlert();

  const highlightData = useHighlightData();
  const assignmentData = useAssignmentData();
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

  const activeAssignment = useAssignment(
    assignmentData.assignment.activeID !== undefined
      ? assignmentData.assignment.activeID
      : ConcatenationString, // dummy value
  );

  const extractFromAtom = useCallback(
    (atom) => {
      if (elements.length > 0 && Object.keys(atom).length > 0) {
        const dim =
          activeAssignment.activeAxis === 'x'
            ? 0
            : activeAssignment.activeAxis === 'y'
            ? 1
            : undefined;
        if (dim !== undefined) {
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
        } else {
          return {
            oclIDs: [atom.oclID].concat(atom.hydrogenOCLIDs),
            nbAtoms: atom.nbAtoms + atom.nbAtoms * atom.nbHydrogens,
          };
        }
      }

      return { oclIDs: [], nbAtoms: 0 };
    },
    [activeAssignment.activeAxis, elements],
  );

  const data = useMemo(() => {
    if (zones || ranges) {
      if (displayerMode === DISPLAYER_MODE.DM_1D && ranges && ranges.values) {
        return ranges.values;
      } else if (
        displayerMode === DISPLAYER_MODE.DM_2D &&
        zones &&
        zones.values
      ) {
        return zones.values;
      }
    }
    return [];
  }, [displayerMode, ranges, zones]);

  const assignedDiaIDs = useMemo(() => {
    const assignedDiaID = { x: [], y: [] };
    for (let id in assignmentData.assignment.assignment) {
      if (assignmentData.assignment.assignment[id].x) {
        assignedDiaID.x.push(...assignmentData.assignment.assignment[id].x);
      }
      if (assignmentData.assignment.assignment[id].y) {
        assignedDiaID.y.push(...assignmentData.assignment.assignment[id].y);
      }
    }
    // with its structure it's prepared for showing assigned IDs per axis
    return assignedDiaID;
  }, [assignmentData.assignment]);

  // used for atom highlighting for now, until we would like to highlight atoms per axis separately
  const assignedDiaIDsMerged = useMemo(
    () => assignedDiaIDs.x.concat(assignedDiaIDs.y),
    [assignedDiaIDs.x, assignedDiaIDs.y],
  );

  const toggleAssignment = useCallback(
    (diaID, atomInformation) => {
      // 1. one atom can only be assigned to one range/zone/signal
      // 2. check whether an atom is already assigned to a range to allow toggling the assignment
      if (
        assignedDiaIDsMerged.some((_oclID) =>
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
    [alert, assignedDiaIDsMerged],
  );

  const findDatumAndSignalIndex = useCallback(
    (id) => {
      // if datum could be found then the id is on range/zone level
      let datum = data.find((_datum) => _datum.id === id);
      let signalIndex;
      if (!datum) {
        // figure out the datum via id
        for (let i = 0; i < data.length; i++) {
          signalIndex = data[i].signal.findIndex(
            (_signal) => _signal.id === id,
          );
          if (signalIndex >= 0) {
            datum = data[i];
            break;
          }
        }
      }

      return { datum, signalIndex };
    },
    [data],
  );

  const handleOnClickAtom = useCallback(
    (atom) => {
      if (activeAssignment.isActive) {
        const atomInformation = extractFromAtom(atom);
        if (atomInformation.nbAtoms > 0) {
          // save assignment in assignment hook
          atomInformation.oclIDs.forEach((_oclID) => {
            activeAssignment.toggle(_oclID);
          });
          // save assignment (diaIDs) in range/zone data
          const { datum, signalIndex } = findDatumAndSignalIndex(
            activeAssignment.id,
          );
          if (datum) {
            // determine the level of setting the diaID array (range vs. signal level) and save there
            let _diaID = [];
            // on range/zone level
            if (signalIndex === undefined) {
              if (displayerMode === DISPLAYER_MODE.DM_1D) {
                _diaID = toggleAssignment(datum.diaID || [], atomInformation);
              } else if (displayerMode === DISPLAYER_MODE.DM_2D) {
                _diaID = toggleAssignment(
                  datum[activeAssignment.activeAxis].diaID || [],
                  atomInformation,
                );
              }
            } else if (datum.signal && datum.signal[signalIndex]) {
              // on signal level
              if (displayerMode === DISPLAYER_MODE.DM_1D) {
                _diaID = toggleAssignment(
                  datum.signal[signalIndex].diaID || [],
                  atomInformation,
                );
              } else if (displayerMode === DISPLAYER_MODE.DM_2D) {
                _diaID = toggleAssignment(
                  datum.signal[signalIndex][activeAssignment.activeAxis]
                    .diaID || [],
                  atomInformation,
                );
              }
            }
            if (displayerMode === DISPLAYER_MODE.DM_1D) {
              dispatch({
                type: SET_DIAID_RANGE,
                payload: {
                  rangeData: datum,
                  diaID: _diaID,
                  signalIndex,
                },
              });
            } else if (displayerMode === DISPLAYER_MODE.DM_2D) {
              dispatch({
                type: SET_DIAID_ZONE,
                payload: {
                  zoneData: datum,
                  diaID: _diaID,
                  axis: activeAssignment.activeAxis,
                  signalIndex,
                },
              });
            }
          }
        } else {
          alert.info(
            'Not assigned! Different atom type or no attached hydrogens found!',
          );
        }
      }
    },
    [
      activeAssignment,
      alert,
      dispatch,
      displayerMode,
      extractFromAtom,
      findDatumAndSignalIndex,
      toggleAssignment,
    ],
  );

  const currentDiaIDsToHighlight = useMemo(() => {
    const assignmentOnHover = assignmentData.assignment.isOnHover
      ? assignmentData.assignment.assignment[
          assignmentData.assignment.onHoverID
        ]
      : null;

    const axisOnHover = assignmentData.assignment.isOnHover
      ? assignmentData.assignment.onHoverAxis
      : null;

    return assignmentOnHover
      ? displayerMode === DISPLAYER_MODE.DM_1D
        ? assignmentOnHover.x || []
        : displayerMode === DISPLAYER_MODE.DM_2D
        ? axisOnHover
          ? axisOnHover === 'x'
            ? assignmentOnHover.x || []
            : axisOnHover === 'y'
            ? assignmentOnHover.y || []
            : (assignmentOnHover.x || []).concat(assignmentOnHover.y || [])
          : (assignmentOnHover.x || []).concat(assignmentOnHover.y || [])
        : []
      : [];
  }, [
    assignmentData.assignment.assignment,
    assignmentData.assignment.isOnHover,
    assignmentData.assignment.onHoverAxis,
    assignmentData.assignment.onHoverID,
    displayerMode,
  ]);

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
        // set all IDs to highlight when hovering over an atom from assignment data
        let highlights = [];
        for (let key in assignmentData.assignment.assignment) {
          let datum, signalIndex;
          let stop = false;
          if (
            assignmentData.assignment.assignment[key].x &&
            assignmentData.assignment.assignment[key].x.some((_assigned) =>
              oclIDs.includes(_assigned),
            )
          ) {
            highlights = highlights.concat(
              assignmentData.assignment.assignment[key].x,
            );
            const result = findDatumAndSignalIndex(key);
            datum = result.datum;
            signalIndex = result.signalIndex;
            stop = true;
          }
          if (
            assignmentData.assignment.assignment[key].y &&
            assignmentData.assignment.assignment[key].y.some((_assigned) =>
              oclIDs.includes(_assigned),
            )
          ) {
            highlights = highlights.concat(
              assignmentData.assignment.assignment[key].y,
            );
            const result = findDatumAndSignalIndex(key);
            datum = result.datum;
            signalIndex = result.signalIndex;
            stop = true;
          }
          if (datum) {
            highlights.push(datum.id);
            if (signalIndex !== undefined) {
              highlights.push(datum.signal[signalIndex].id);
            }
          }
          if (stop) {
            break;
          }
        }
        setOnAtomHoverHighlights(highlights);
        setOnAtomHoverAction('show');
      } else {
        // on leave the atom
        setOnAtomHoverAction('hide');
      }
    },
    [
      assignmentData.assignment.assignment,
      extractFromAtom,
      findDatumAndSignalIndex,
    ],
  );

  const handleOnUnlinkAll = useCallback(() => {
    data.forEach((datum) => {
      if (displayerMode === DISPLAYER_MODE.DM_1D) {
        dispatch({
          type: UNLINK_RANGE,
          payload: { rangeData: datum, assignmentData },
        });
      } else if (displayerMode === DISPLAYER_MODE.DM_2D) {
        dispatch({
          type: UNLINK_ZONE,
          payload: {
            zoneData: datum,
            assignmentData,
          },
        });
      }
    });
  }, [data, displayerMode, dispatch, assignmentData]);

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
        <MenuButton component={<FaFileExport />} toolTip="Export As">
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
        <NextPrev
          onChange={(slideIndex) => setCurrentIndex(slideIndex)}
          defaultIndex={currentIndex}
        >
          {molecules && molecules.length > 0 ? (
            molecules.map((mol, index) => (
              <div
                className="slider"
                key={mol.key}
                onDoubleClick={(event) =>
                  handleOpen(event, mol.key, mol.molfile)
                }
                style={{
                  backgroundColor: (index + 1) % 2 !== 0 ? '#fafafa' : 'white',
                }}
              >
                <div className="mol-svg-container" ref={refContainer}>
                  <OCLnmr
                    OCL={OCL}
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
                        : assignedDiaIDsMerged
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
        </NextPrev>

        <MoleculeStructureEditorModal
          open={open}
          onClose={handleClose}
          selectedMolecule={currentMolfile}
        />
      </div>
    </div>
  );
}

export default MoleculeWrapper(memo(MoleculePanel));
