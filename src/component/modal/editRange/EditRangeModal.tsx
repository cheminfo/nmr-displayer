/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { FaSearchPlus } from 'react-icons/fa';

import generateID from '../../../data/utilities/generateID';
import { useChartData } from '../../context/ChartContext';
import { useDispatch } from '../../context/DispatchContext';
import Button from '../../elements/Button';
import CloseButton from '../../elements/CloseButton';
import SaveButton from '../../elements/SaveButton';
import FormikForm from '../../elements/formik/FormikForm';
import FormikOnChange from '../../elements/formik/FormikOnChange';
import {
  hasCouplingConstant,
  translateMultiplet,
} from '../../panels/extra/utilities/MultiplicityUtilities';
import { CHANGE_TEMP_RANGE } from '../../reducer/types/Types';
import { useFormatNumberByNucleus } from '../../utility/FormatNumber';

import SignalsForm from './forms/components/SignalsForm';
import useRangeFormValidation from './forms/validation/EditRangeValidation';

const styles = css`
  overflow: auto;
  width: 600px;
  height: 500px;
  padding: 5px;
  button:focus {
    outline: none;
  }
  .header {
    height: 24px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    span {
      color: #464646;
      font-size: 15px;
      flex: 1;
      border-left: 1px solid #ececec;
      padding-left: 6px;
    }

    button {
      background-color: transparent;
      border: none;
      padding: 5px;

      svg {
        height: 16px;
      }
    }
  }
  .container {
    display: flex;
    margin: 30px 5px;
    input,
    button {
      padding: 5px;
      border: 1px solid gray;
      border-radius: 5px;
      height: 36px;
      margin: 2px;
    }
    input {
      flex: 10;
    }
    button {
      flex: 2;
      color: white;
      background-color: gray;
    }
  }
`;

interface EditRangeModalProps {
  onSaveEditRangeModal: (value: any) => Promise<void> | null;
  onCloseEditRangeModal: () => void;
  onZoomEditRangeModal: (value: any) => void;
  rangeData: any;
}

interface Coupling {
  multiplicity: any;
  coupling: string | number;
}

function EditRangeModal({
  onSaveEditRangeModal = () => null,
  onCloseEditRangeModal = () => null,
  onZoomEditRangeModal = () => null,
  rangeData,
}: EditRangeModalProps) {
  const formRef = useRef<any>(null);
  const { activeTab } = useChartData();
  const dispatch = useDispatch();
  const format = useFormatNumberByNucleus(activeTab as string);
  const validation = useRangeFormValidation();

  const handleOnZoom = useCallback(() => {
    onZoomEditRangeModal(rangeData);
  }, [onZoomEditRangeModal, rangeData]);

  useEffect(() => {
    handleOnZoom();
  }, [handleOnZoom]);

  const handleOnClose = useCallback(() => {
    onCloseEditRangeModal();
  }, [onCloseEditRangeModal]);

  const getCouplings = useCallback(
    (couplings) =>
      couplings
        .filter((coupling) => coupling.coupling !== '')
        .map((coupling) => {
          return {
            ...coupling,
            multiplicity: translateMultiplet(coupling.multiplicity),
          };
        }),
    [],
  );

  const getSignals = useCallback(
    (signals) => {
      return signals.map((_signal) => {
        return {
          id: generateID(),
          ..._signal,
          multiplicity: _signal.j
            .map((_coupling) => translateMultiplet(_coupling.multiplicity))
            .join(''),
          j: getCouplings(_signal.j),
        };
      });
    },
    [getCouplings],
  );

  const handleOnSave = useCallback(
    async (formValues) => {
      const _range = { ...rangeData };
      _range.signal = getSignals(formValues.signals);
      await onSaveEditRangeModal(_range);
      handleOnClose();
    },
    [getSignals, handleOnClose, onSaveEditRangeModal, rangeData],
  );

  const data = useMemo(() => {
    const signals = rangeData.signal.map((signal) => {
      // counter within j array to access to right j values
      let counterJ = 0;
      const couplings: Array<Coupling> = [];
      signal.multiplicity.split('').forEach((_multiplicity) => {
        let coupling: Coupling = {
          multiplicity: _multiplicity,
          coupling: '',
        };

        if (hasCouplingConstant(_multiplicity)) {
          coupling = { ...signal.j[counterJ] };
          coupling.coupling = Number(format(coupling.coupling));
          counterJ++;
        }

        coupling.multiplicity = translateMultiplet(coupling.multiplicity);
        couplings.push(coupling);
      });

      return { ...signal, j: couplings };
    });
    return { activeTab: '0', signals };
  }, [format, rangeData]);

  const changeHandler = useCallback(
    (values) => {
      const { signals } = values;
      const signal = getSignals(signals);
      dispatch({
        type: CHANGE_TEMP_RANGE,
        payload: { tempRange: Object.assign({}, rangeData, { signal }) },
      });
    },
    [dispatch, getSignals, rangeData],
  );

  return (
    <div css={styles}>
      <FormikForm
        ref={formRef}
        initialValues={data}
        validationSchema={validation}
        onSubmit={handleOnSave}
      >
        <div className="header handle">
          <Button onClick={handleOnZoom} className="zoom-button">
            <FaSearchPlus title="Set to default view on range in spectrum" />
          </Button>
          <span>
            {` Range and Signal edition: ${format(
              rangeData.from,
            )} ppm to ${format(rangeData.to)} ppm`}
          </span>
          <SaveButton
            onClick={() => formRef.current.submitForm()}
            // disabled={formRef.current.errors}
            popupTitle="Save and exit"
          />

          <CloseButton onClick={handleOnClose} />
        </div>
        <SignalsForm rangeData={rangeData} />
        <FormikOnChange onChange={changeHandler} />
      </FormikForm>
    </div>
  );
}

export default EditRangeModal;
