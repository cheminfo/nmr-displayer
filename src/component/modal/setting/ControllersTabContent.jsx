import FormikCheckBox from '../../elements/formik/FormikCheckBox';
import FormikInput from '../../elements/formik/FormikInput';

const ControllersTabContent = () => {
  return (
    <>
      <p className="section-header">Mouse Scroll Wheel Sensitivity</p>
      <FormikInput type="number" label="Low" name="controllers.mws.low" />
      <FormikInput type="number" label="high" name="controllers.mws.high" />
      <p className="section-header" style={{ marginTop: '40px' }}>
        Show / Hide Panels
      </p>
      <FormikCheckBox
        className="help-checkbox-element"
        label="Prevent automatic show help "
        name="controllers.help.preventAutoHelp"
      />

      <p className="section-header" style={{ marginTop: '40px' }}>
        Spectra
      </p>
      <FormikInput
        type="number"
        label="Transparency of Dimmed Spectra [ 0 - 1 ]"
        name="controllers.dimmedSpectraTransparency"
        checkValue={(value) => value >= 0 && value <= 1}
      />
    </>
  );
};

export default ControllersTabContent;
