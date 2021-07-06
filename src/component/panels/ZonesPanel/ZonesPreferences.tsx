import {
  useEffect,
  useCallback,
  useImperativeHandle,
  useRef,
  memo,
  CSSProperties,
} from 'react';

import { forwardRefWithAs } from '../../../utils';
import { usePreferences } from '../../context/PreferencesContext';
import IsotopesViewer from '../../elements/IsotopesViewer';
import FormikColumnFormatField from '../../elements/formik/FormikColumnFormatField';
import FormikForm from '../../elements/formik/FormikForm';
import { useAlert } from '../../elements/popup/Alert';
import useNucleus from '../../hooks/useNucleus';
import { SET_PANELS_PREFERENCES } from '../../reducer/preferencesReducer';
import {
  useStateWithLocalStorage,
  getValue as getValueByKeyPath,
} from '../../utility/LocalStorage';
import { zoneDefaultValues } from '../extra/preferences/defaultValues';

const styles: Record<
  'container' | 'groupContainer' | 'row' | 'header' | 'inputLabel' | 'input',
  CSSProperties
> = {
  container: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    height: '100%',
    overflowY: 'auto',
  },
  groupContainer: {
    padding: '5px',
    borderRadius: '5px',
    margin: '10px 0px',
    backgroundColor: 'white',
  },
  row: {
    display: 'flex',
    margin: '5px 0px',
  },
  header: {
    borderBottom: '1px solid #e8e8e8',
    paddingBottom: '5px',
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  inputLabel: {
    flex: 2,
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#232323',
  },
  input: {
    width: '30%',
    textAlign: 'center',
  },
};

const formatFields: Array<{
  id: number;
  label: string;
  checkController: string;
  formatController: string;
}> = [
  {
    id: 1,
    label: 'From :',
    checkController: 'showFrom',
    formatController: 'fromFormat',
  },
  {
    id: 2,
    label: 'To :',
    checkController: 'showTo',
    formatController: 'toFormat',
  },
  {
    id: 3,
    label: 'Absolute :',
    checkController: 'showAbsolute',
    formatController: 'absoluteFormat',
  },
  {
    id: 4,
    label: 'Relative :',
    checkController: 'showRelative',
    formatController: 'relativeFormat',
  },
];

interface ZonesPreferencesInnerProps {
  nucleus: Array<string>;
  innerRef: any;
}

function ZonesPreferencesInner({
  nucleus,
  innerRef,
}: ZonesPreferencesInnerProps) {
  const alert = useAlert();
  const [, setSettingsData] = useStateWithLocalStorage('nmr-general-settings');
  const preferences = usePreferences();
  const formRef = useRef<any>();

  const updateValues = useCallback(() => {
    if (nucleus) {
      const defaultValues = nucleus.reduce((acc, nucleusLabel) => {
        acc[nucleusLabel] = zoneDefaultValues;
        return acc;
      }, {});
      const zonesPreferences = getValueByKeyPath(
        preferences,
        `formatting.panels.zones`,
      );
      formRef.current.setValues(
        zonesPreferences ? zonesPreferences : defaultValues,
      );
    }
  }, [nucleus, preferences]);

  useEffect(() => {
    updateValues();
  }, [updateValues]);

  const saveToLocalStorgate = (values) => {
    setSettingsData(values, 'formatting.panels.ranges');
  };

  const saveHandler = useCallback(
    (values, showMessage = false) => {
      preferences.dispatch({
        type: SET_PANELS_PREFERENCES,
        payload: { key: 'zones', value: values },
      });
      if (showMessage) {
        alert.success('zones preferences saved successfully');
      }
    },
    [alert, preferences],
  );

  useImperativeHandle(
    innerRef,
    () => ({
      saveSetting: () => {
        formRef.current.submitForm();
      },
      cancelSetting: () => {
        updateValues();
      },
    }),
    [updateValues],
  );

  const handleSubmit = (values) => {
    saveHandler(values, true);
    saveToLocalStorgate(values);
  };

  return (
    <div style={styles.container}>
      <FormikForm onSubmit={handleSubmit} ref={formRef}>
        {nucleus?.map((nucleusLabel) => (
          <div key={nucleusLabel} style={styles.groupContainer}>
            <IsotopesViewer style={styles.header} value={nucleusLabel} />
            {formatFields.map((field) => (
              <FormikColumnFormatField
                key={field.id}
                label={field.label}
                checkControllerName={`${nucleusLabel}.${field.checkController}`}
                formatControllerName={`${nucleusLabel}.${field.formatController}`}
              />
            ))}
          </div>
        ))}
      </FormikForm>
    </div>
  );
}

const MemoizedZonesPreferences = memo(ZonesPreferencesInner);

function ZonesPreferences(props, ref) {
  const nucleus = useNucleus();
  return <MemoizedZonesPreferences innerRef={ref} {...{ nucleus }} />;
}

export default forwardRefWithAs(ZonesPreferences);
