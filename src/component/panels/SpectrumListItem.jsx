import React from 'react';
import { FaEye, FaMinus, FaPaintBrush } from 'react-icons/fa';

const styles = {
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    width: '24px',
  },
  row: {
    display: 'flex',
    alignContent: 'center',
    height: '25px',
    borderBottom: '0.55px solid #f1f1f1',
  },
  name: {
    flex: 1,
    height: '100%',
    display: 'flex',
    // alignItems: 'center',
  },
  info: {
    flex: '1 1 1px',
    height: '100%',
    display: 'block',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '24px',
  },
  icon: {
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '18px 18px',
  },
};

const SpectrumListItem = ({
  visible,
  activated,
  markersVisible,
  data,
  onChangeVisibility,
  onChangeMarkersVisibility,
  onChangeActiveSpectrum,
  onOpenColorPicker,
}) => {
  const isVisible = (id) => {
    return visible.findIndex((v) => v.id === id) !== -1 ? true : false;
  };

  const isActivated = (id) => {
    return activated && activated.id === id;
  };

  const isMarkerVisible = (id) => {
    return markersVisible.findIndex((v) => v.id === id) !== -1 ? true : false;
  };

  const formatValueAsHTML = (value) => {
    if (value) {
      // eslint-disable-next-line prefer-named-capture-group
      value = value.replace(/([0-9]+)/g, '<sub>$1</sub>');
    }
    return value;
  };

  return (
    <div style={styles.row} key={`slist${data.id}`}>
      <button
        style={styles.button}
        type="button"
        onClick={() => onChangeVisibility(data)}
      >
        <FaEye
          style={
            isVisible(data.id)
              ? { opacity: 1, strokeWidth: '1px', fill: data.color }
              : { opacity: 0.1, fill: data.color }
          }
        />
      </button>
      <div style={styles.name} onClick={() => onChangeActiveSpectrum(data)}>
        <span style={styles.info}>{data.name}</span>
        <div
          style={styles.info}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: data.info && formatValueAsHTML(data.info.solvent),
          }}
        />
        {/* {data.info && data.info.solvent} */}
        {/* </div> */}
        <span style={styles.info}>{data.info && data.info.pulse}</span>
      </div>
      <button
        style={{
          ...styles.button,
          ...styles.icon,
          opacity:
            isMarkerVisible(data.id) && data.peaks && data.peaks.length > 0
              ? 1
              : 0.1,
        }}
        type="button"
        onClick={() => onChangeMarkersVisibility(data)}
        className="ci-icon-nmr-peaks"
        disabled={data.peaks && data.peaks.length === 0}
      />
      <button
        style={styles.button}
        type="button"
        onClick={() => onChangeActiveSpectrum(data)}
      >
        <FaMinus
          style={
            isActivated(data.id)
              ? { fill: data.color, height: '15px' }
              : { fill: data.color, opacity: 0.1 }
          }
        />
      </button>
      <button
        style={styles.button}
        type="button"
        className="color-change-bt"
        onClick={(event) => onOpenColorPicker(data, event)}
      >
        <FaPaintBrush />
      </button>
    </div>
  );
};

export default SpectrumListItem;
