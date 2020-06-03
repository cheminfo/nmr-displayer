/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Formik, Form } from 'formik';
import { useMemo } from 'react';

import SignalsForm from './SignalsForm';
import {
  SaveButton,
  ResetButton,
  CancelButton,
} from './elements/DefaultButtons';
import RangeValidationSchema from './validation/RangeValidationScheme';

const ButtonContainerStyle = css`
  text-align: center;
  button {
    background-color: transparent;
    border: 1px solid #dedede;
    margin-top: 20px;
  }
`;

const RangeForm = ({
  rangeData,
  spectrumData,
  handleOnClose,
  handleOnSave,
  multiplets,
  checkMultiplicity,
  translateMultiplicity,
}) => {
  const initialStateSignalCouplings = useMemo(() => {
    const signal = rangeData.signal[0];
    if (signal && signal.multiplicity) {
      // counter within j array to access to right j values
      let counterJ = 0;
      const couplings = [];
      let coupling;
      signal.multiplicity.split('').forEach((_multiplicity) => {
        if (checkMultiplicity(_multiplicity)) {
          coupling = { ...signal.j[counterJ] };
          counterJ++;
        } else {
          coupling = { multiplicity: _multiplicity, coupling: '' };
        }
        couplings.push(coupling);
      });
      return couplings;
    }
  }, [checkMultiplicity, rangeData.signal]);

  return (
    <Formik
      initialValues={{
        from: rangeData.from,
        to: rangeData.to,
        signals: rangeData.signal.slice(),
        newSignalFrom: rangeData.from,
        newSignalTo: rangeData.to,
        selectedSignalIndex: 0,
        selectedSignalCouplings: initialStateSignalCouplings,
        newCouplingMultiplicity: '',
        newCouplingCoupling: '',
        spectrumData: spectrumData,
        multiplets: multiplets.slice(),
      }}
      validationSchema={RangeValidationSchema(spectrumData, multiplets)}
      onSubmit={(values, { setSubmitting }) => {
        handleOnSave(values);
        setSubmitting(false);
      }}
    >
      {() => {
        return (
          <Form>
            <SignalsForm
              spectrumData={spectrumData}
              checkMultiplicity={checkMultiplicity}
              translateMultiplicity={translateMultiplicity}
            />

            <div css={ButtonContainerStyle}>
              <SaveButton />
              <ResetButton />
              <CancelButton onCancel={handleOnClose} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RangeForm;
