/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, {
  useState,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from 'react';
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
import { MolfileSvgRenderer } from 'react-ocl';
import 'react-animated-slider-2/build/horizontal.css';

import { ChartContext } from '../context/ChartContext';
import { useDispatch } from '../context/DispatchContext';
import MenuButton from '../elements/MenuButton';
import ToolTip from '../elements/ToolTip/ToolTip';
import MoleculeStructureEditorModal from '../modal/MoleculeStructureEditorModal';
import {
  DELETE_MOLECULE,
  ADD_MOLECULE,
  CHANGE_RANGE_SUM,
  CHANGE_INTEGRAL_SUM,
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
  .slider {
    height: 180px;
    padding: 0px;
  }
  .slider p {
    width: 100%;
    margin: 0 auto;
    display: block;
    position: relative;
  }

  .slider svg polygon {
    fill: gray !important;
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

const MoleculePanel = () => {
  const refContainer = useRef();

  const [open, setOpen] = React.useState(false);
  const [currentMolfile, setCurrentMolfile] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAtom, setCurrentAtom] = useState(null);

  const dispatch = useDispatch();
  const alert = useAlert();

  const { molecules, activeTab } = useContext(ChartContext);

  useEffect(() => {
    if (activeTab && molecules.length > 0 && molecules[currentIndex]) {
      const element = activeTab.replace(/[0-9]/g, '');
      const elementsCount = molecules[currentIndex].atoms[element]
        ? molecules[currentIndex].atoms[element]
        : 0;
      dispatch({ type: CHANGE_INTEGRAL_SUM, value: elementsCount });
      dispatch({ type: CHANGE_RANGE_SUM, value: elementsCount });
    } else {
      dispatch({ type: CHANGE_INTEGRAL_SUM, value: 100 });
      dispatch({ type: CHANGE_RANGE_SUM, value: 100 });
    }
  }, [activeTab, currentIndex, dispatch, molecules]);

  const handleClose = useCallback(
    (e) => {
      setOpen(false);
      if (e === 'new') {
        // has no effect regarding slide changing because updating the slideIndex parameter for Slides component has no effect
        // it could have negative effects somewhere else with a wrong set current index
        // setCurrentIndex(molecules.length);

        // handle current molecule index manually, following the observed behavior in Slider:
        // - if adding when no slides (empty): first slide
        // - if adding a slide: the next slide comes, but no index changing
        // - if deleting a slide: the next slide comes, but no index changing
        // - if deleting the last slide: return to begin (first slide)
        // handle the first molecule index only
        if (molecules.length === 0) {
          setCurrentIndex(0);
        }
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
      dispatch({ type: DELETE_MOLECULE, key: molecules[currentIndex].key });
      // setCurrentIndex(0);

      // handling current index manually (see handleClose)
      if (currentIndex === molecules.length - 1) {
        setCurrentIndex(0);
      }
    }
  }, [dispatch, molecules, currentIndex]);

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
      <div css={moleculeContainerStyle} ref={refContainer}>
        <Slider
          onSlideChange={(event) => setCurrentIndex(event.slideIndex)}
          slideIndex={currentIndex}
        >
          {molecules &&
            molecules.map((mol, index) => (
              <div
                key={mol.key}
                onDoubleClick={(event) =>
                  handleOpen(event, mol.key, mol.molfile)
                }
              >
                <div>
                  <MolfileSvgRenderer
                    id={`molSVG${index}`}
                    width={
                      refContainer && refContainer.current.clientWidth - 70
                    }
                    molfile={mol.molfile}
                    atomHighlight={currentAtom && [currentAtom]}
                    atomHighlightColor="yellow"
                    atomHighlightOpacity={0.5}
                    onAtomEnter={(atomID) => setCurrentAtom(atomID)}
                    onAtomLeave={() => setCurrentAtom(null)}
                  />
                </div>
                <p>
                  <MF mf={mol.mf} /> - {mol.mw.toFixed(2)}
                </p>
              </div>
            ))}
        </Slider>

        <MoleculeStructureEditorModal
          open={open}
          onClose={handleClose}
          selectedMolecule={currentMolfile}
        />
      </div>
    </div>
  );
};

export default MoleculePanel;
