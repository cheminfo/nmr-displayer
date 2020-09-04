import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  Fragment,
  useEffect,
} from 'react';
import { useAlert } from 'react-alert';

import { useDispatch } from '../../context/DispatchContext';
import ContextMenu from '../../elements/ContextMenu';
import { Tabs } from '../../elements/Tab';
import ContextWrapper from '../../hoc/ContextWrapper';
import {
  CHANGE_PEAKS_MARKERS_VISIBILITY,
  SET_ACTIVE_TAB,
  CHANGE_VISIBILITY,
  CHANGE_ACTIVE_SPECTRUM,
  CHANGE_SPECTRUM_COLOR,
} from '../../reducer/types/Types';
import { copyTextToClipboard } from '../../utility/Export';
import GroupByInfoKey from '../../utility/GroupByInfoKey';

import ColorPicker from './ColorPicker';
import SpectrumListItem from './SpectrumListItem';

const SpectrumsTabs = ({ data, activeSpectrum, activeTab, onTabChange }) => {
  const contextRef = useRef();

  const [activated, setActivated] = useState(null);
  const [markersVisible, setMarkersVisible] = useState([]);
  const [selectedSpectrumData, setSelectedSpectrum] = useState(null);
  const [colorPickerPosition, setColorPickerPosition] = useState(null);
  const [isColorPickerDisplayed, setIsColorPickerDisplayed] = useState(false);

  const alert = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    setActivated(activeSpectrum);
  }, [activeSpectrum]);

  useEffect(() => {
    if (data) {
      const visibleMarkers = data
        ? data.filter((d) => d.display.isPeaksMarkersVisible === true)
        : [];

      setMarkersVisible(visibleMarkers);
    }
  }, [data, dispatch]);

  const spectrumsGroupByNucleus = useMemo(() => {
    if (!data) return [];

    const groupByNucleus = GroupByInfoKey('nucleus');
    return groupByNucleus(data);
  }, [data]);

  useEffect(() => {
    onTabChange({
      tab: activeTab,
      data: spectrumsGroupByNucleus[activeTab],
    });
  }, [activeTab, onTabChange, spectrumsGroupByNucleus]);

  const handleChangeMarkersVisibility = useCallback(
    (d) => {
      const currentIndex = markersVisible.findIndex((v) => v.id === d.id);
      const newChecked = [...markersVisible];
      if (currentIndex === -1) {
        newChecked.push({ id: d.id });
      } else {
        newChecked.splice(currentIndex, 1);
      }
      dispatch({ type: CHANGE_PEAKS_MARKERS_VISIBILITY, data: newChecked });
      setMarkersVisible(newChecked);
    },
    [dispatch, markersVisible],
  );

  const onTabChangeHandler = useCallback(
    (tab) => {
      onTabChange({ tab: tab.tabid, data: spectrumsGroupByNucleus[tab.tabid] });
      dispatch({ type: SET_ACTIVE_TAB, tab: tab.tabid });
    },
    [dispatch, onTabChange, spectrumsGroupByNucleus],
  );

  const contextMenu = useMemo(
    () => [
      {
        label: 'Copy to Clipboard',
        onClick: (spectrumData) => {
          const { x, y, info } = spectrumData;
          const success = copyTextToClipboard(
            JSON.stringify({ x, y, info }, undefined, 2),
          );

          if (success) {
            alert.success('Data copied to clipboard');
          } else {
            alert.error('Copy to clipboard failed');
          }
        },
      },
    ],
    [alert],
  );

  const contextMenuHandler = useCallback(
    (e, rowData) => {
      e.preventDefault();
      contextRef.current.handleContextMenu(e, rowData);
    },
    [contextRef],
  );

  const handleOpenColorPicker = useCallback((selectedSpectrum, event) => {
    setColorPickerPosition({
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    });
    setSelectedSpectrum(selectedSpectrum);
    setIsColorPickerDisplayed(true);
  }, []);

  const handleChangeVisibility = useCallback(
    (d, key) => {
      dispatch({
        type: CHANGE_VISIBILITY,
        id: d.id,
        key,
        value: !d.display[key],
      });
    },
    [dispatch],
  );

  const handleChangeActiveSpectrum = useCallback(
    (d) => {
      if (activated && activated.id === d.id) {
        dispatch({ type: CHANGE_ACTIVE_SPECTRUM, data: null });
      } else {
        dispatch({ type: CHANGE_ACTIVE_SPECTRUM, data: { id: d.id } });
      }
    },
    [activated, dispatch],
  );

  const handleCloseColorPicker = useCallback(() => {
    setIsColorPickerDisplayed(false);
  }, []);

  const handleOnColorChanged = useCallback(
    (color, key) => {
      if (selectedSpectrumData !== null) {
        dispatch({
          type: CHANGE_SPECTRUM_COLOR,
          data: {
            id: selectedSpectrumData.id,
            color: `${color.hex}${Math.round(color.rgb.a * 255).toString(16)}`,
            key,
          },
        });
      }
    },
    [dispatch, selectedSpectrumData],
  );

  return (
    <Fragment>
      <Tabs defaultTabID={activeTab} onClick={onTabChangeHandler}>
        {spectrumsGroupByNucleus &&
          Object.keys(spectrumsGroupByNucleus).map((group) => (
            <div tablabel={group} tabid={group} key={group}>
              {spectrumsGroupByNucleus[group] &&
                spectrumsGroupByNucleus[group].map((d) => (
                  <SpectrumListItem
                    key={d.id}
                    activated={activated}
                    markersVisible={markersVisible}
                    data={d}
                    onChangeVisibility={handleChangeVisibility}
                    onChangeMarkersVisibility={handleChangeMarkersVisibility}
                    onChangeActiveSpectrum={handleChangeActiveSpectrum}
                    onOpenColorPicker={handleOpenColorPicker}
                    onContextMenu={(e) =>
                      d.info.dimension === 1 ? contextMenuHandler(e, d) : null
                    }
                  />
                ))}
            </div>
          ))}
      </Tabs>
      <ContextMenu ref={contextRef} context={contextMenu} />

      {isColorPickerDisplayed ? (
        <ColorPicker
          onMouseLeave={handleCloseColorPicker}
          selectedSpectrumData={selectedSpectrumData}
          colorPickerPosition={colorPickerPosition}
          onColorChanged={handleOnColorChanged}
        />
      ) : null}
    </Fragment>
  );
};

export default ContextWrapper(SpectrumsTabs, [
  'data',
  'activeSpectrum',
  'activeTab',
]);
