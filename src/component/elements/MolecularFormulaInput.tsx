/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback, useState } from 'react';

import getAtomsFromMF from '../../data/utilities/getAtomsFromMF';

const inputStyle = css`
  text-align: center;

  input {
    height: 100%;
    width: 200px;
    border-radius: 5px;
    border: 0.55px solid #c7c7c7;
    margin: 0px 5px 0px 5px;
    text-align: center;
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

interface MolecularFormulaInputProps {
  onSave?: (element: string) => void;
  previousMF: string;
}

function MolecularFormulaInput({
  onSave = () => null,
  previousMF,
}: MolecularFormulaInputProps) {
  const [mf, setMF] = useState('');
  const [isValidMF, setIsValidMF] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);

  const checkMF = useCallback((mf) => {
    try {
      getAtomsFromMF(mf);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const onChangeHandler = useCallback(
    (e) => {
      setHasChanged(true);
      if (checkMF(e.target.value)) {
        setIsValidMF(true);
        setMF(e.target.value);
      } else {
        setIsValidMF(false);
        setMF('');
      }
    },
    [checkMF],
  );

  const onSaveHandler = useCallback(() => {
    onSave(hasChanged ? mf.trim() : previousMF);
  }, [hasChanged, mf, onSave, previousMF]);

  return (
    <div css={inputStyle}>
      <input type="text" onChange={onChangeHandler} defaultValue={previousMF} />
      <button type="button" onClick={onSaveHandler} disabled={!isValidMF}>
        Set
      </button>
    </div>
  );
}

export default MolecularFormulaInput;
