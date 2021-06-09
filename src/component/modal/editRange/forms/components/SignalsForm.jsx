/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useFormikContext } from 'formik';
import lodashGet from 'lodash/get';
import { useCallback, useMemo, memo, useEffect, useState } from 'react';

import { useChartData } from '../../../../context/ChartContext';
import Tab from '../../../../elements/Tab/Tab';
import Tabs from '../../../../elements/Tab/Tabs';
import { translateMultiplet } from '../../../../panels/extra/utilities/MultiplicityUtilities';
import Events from '../../../../utility/Events';
import { useFormatNumberByNucleus } from '../../../../utility/FormatNumber';

import AddSignalFormTab from './AddSignalFormTab';
import SignalFormTab from './SignalFormTab';

const textStyles = css`
  text-align: center;
  width: 100%;

  .errorText {
    color: red;
  }

  .infoText {
    padding: 10px;
    margin: 10px 0;
    font-size: 14px;
    text-align: left;
    color: white;
    background-color: #5f5f5f;
    border-radius: 5px;
  }
`;

const tabStylesAddition = css`
  color: red;
`;

function SignalsForm({ rangeLabel }) {
  const { values, setFieldValue, errors } = useFormikContext();

  const { data: spectraData, activeSpectrum, activeTab } = useChartData();
  const format = useFormatNumberByNucleus(activeTab);

  const [activeField, setActiveField] = useState(null);
  const [frequency, setFrequency] = useState(null);

  useEffect(() => {
    if (
      spectraData &&
      activeSpectrum &&
      lodashGet(
        spectraData,
        `[${activeSpectrum.index}].info.originFrequency`,
        undefined,
      )
    ) {
      setFrequency(spectraData[activeSpectrum.index].info.originFrequency);
    } else {
      setFrequency(null);
    }
  }, [activeSpectrum, spectraData]);

  useEffect(() => {
    Events.on('brushEnd', (event) => {
      if (activeField && frequency) {
        setFieldValue(
          activeField,
          Math.abs(event.range[0] - event.range[1]) * frequency,
        );
      }
    });

    return () => {
      Events.off('brushEnd');
    };
  }, [activeField, setFieldValue, frequency, values.activeTab]);

  useEffect(() => {
    Events.on('mouseClick', (event) => {
      if (values.activeTab === 'addSignalTab' && activeField) {
        setFieldValue(activeField, event.xPPM);
      }
    });

    return () => {
      Events.off('mouseClick');
    };
  }, [values.activeTab, activeField, setFieldValue]);

  const handleOnFocus = useCallback(
    (name) => {
      setActiveField(name);
    },
    [setActiveField],
  );

  const tapClickHandler = useCallback(
    ({ tabid }) => {
      setFieldValue('activeTab', tabid);
      setActiveField(null);
    },
    [setFieldValue],
  );

  const handleDeleteSignal = useCallback(
    ({ tabid }) => {
      const _signals = values.signals.filter(
        (_signal, i) => i !== Number(tabid),
      );
      setFieldValue('signals', _signals);
    },
    [setFieldValue, values.signals],
  );

  useEffect(() => {
    setFieldValue(
      'activeTab',
      values.signals.length > 0
        ? (values.signals.length - 1).toString()
        : 'addSignalTab',
    );
  }, [setFieldValue, values.signals.length]);

  const tabContainsErrors = useCallback(
    (i) => {
      return (
        errors.signals &&
        (lodashGet(errors, 'signals.noCouplings', []).some(
          (_error) => _error.index === i,
        ) ||
          lodashGet(errors, `signals[${i}].missingCouplings`, []).length > 0)
      );
    },
    [errors],
  );

  const signalFormTabs = useMemo(() => {
    const signalTabs =
      values.signals.length > 0
        ? values.signals.map((signal, i) => (
            <Tab
              // eslint-disable-next-line react/no-array-index-key
              key={`signalForm${i}`}
              tabid={`${i}`}
              tablabel={`𝛅: ${format(signal.delta)} (${signal.j
                .map((_coupling) => translateMultiplet(_coupling.multiplicity))
                .join('')})`}
              tabstyles={tabContainsErrors(i) ? tabStylesAddition : null}
            >
              <SignalFormTab onFocus={handleOnFocus} />
            </Tab>
          ))
        : [];

    const addSignalTab = (
      <Tab
        tablabel="+"
        tabid="addSignalTab"
        candelete={false}
        key="addSignalTab"
        className="add-signal-tab"
      >
        <AddSignalFormTab onFocus={handleOnFocus} rangeLabel={rangeLabel} />
      </Tab>
    );

    return signalTabs.concat(addSignalTab);
  }, [format, handleOnFocus, rangeLabel, tabContainsErrors, values.signals]);

  const editSignalInfoText = (
    <p className="infoText">
      Focus on an input field and press Shift + Drag &#38; Drop to draw a
      coupling constant in spectrum view.
    </p>
  );

  const addSignalInfoText = (
    <p className="infoText">
      Focus on the input field and press Shift + Left mouse click to select new
      signal delta value in spectrum view.
    </p>
  );

  return (
    <div>
      <div css={textStyles}>
        {errors.signals &&
        (errors.signals.noSignals || errors.signals.noCouplings) ? (
          <div>
            <p className="errorText">
              {errors.signals.noSignals ||
                errors.signals.noCouplings[0].message}
            </p>
            {errors.signals.noSignals ? addSignalInfoText : null}
          </div>
        ) : values.activeTab === 'addSignalTab' ? (
          addSignalInfoText
        ) : (
          editSignalInfoText
        )}
      </div>
      <Tabs
        activeTab={values.activeTab}
        onClick={tapClickHandler}
        canDelete
        onDelete={handleDeleteSignal}
      >
        {signalFormTabs}
      </Tabs>
    </div>
  );
}

export default memo(SignalsForm);
