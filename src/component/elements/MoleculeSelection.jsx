/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useCallback, useEffect, useState } from 'react';
import Slider from 'react-animated-slider-2';
import MF from 'react-mf/lib/components/MF';
import { MolfileSvgRenderer } from 'react-ocl/full';

const toolbarStyle = css`
  display: flex;
  flex-direction: row;
  border-top: 0.55px solid rgb(240, 240, 240);
  border-bottom: 0.55px solid rgb(240, 240, 240);
  padding: 0px 5px;

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
  button {
    flex: 2;
    padding: 5px;
    border: 1px solid gray;
    border-radius: 5px;
    height: 36px;
    margin: 0 auto;
    margin-top: 15px;
    display: block;
    width: 20%;

    color: white;
    background-color: gray;
  }
`;

const MoleculeSelection = ({ molecules, onChange }) => {
  const [currentIndex, setCurrentIndex] = useState();

  useEffect(() => {
    if (molecules && molecules.length > 0) {
      setCurrentIndex(0);
    }
  }, [molecules]);

  const onChangeHandler = useCallback(
    (e) => {
      setCurrentIndex(e.slideIndex);
      onChange(e.slideIndex);
    },
    [onChange],
  );

  return (
    <div>
      <div css={toolbarStyle}>
        <p>
          {molecules &&
            molecules.length > 0 &&
            `${+(currentIndex + 1)} / ${molecules.length}`}{' '}
        </p>
      </div>
      <div css={moleculeContainerStyle}>
        <Slider onSlideChange={onChangeHandler}>
          {molecules &&
            molecules.map((mol, index) => (
              <div key={mol.key}>
                <div>
                  <MolfileSvgRenderer
                    id={`molSVG${index}`}
                    width={120}
                    molfile={mol.molfile}
                  />
                </div>
                <p>
                  <MF mf={mol.mf} /> - {mol.mw.toFixed(2)}
                </p>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

MoleculeSelection.defaultProps = {
  onChange: () => {
    return null;
  },
};

export default MoleculeSelection;