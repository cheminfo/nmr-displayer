import lodash from 'lodash';
import { xGetFromToIndex } from 'ml-spectra-processing';
import React, { useCallback, useMemo, memo, useState, useRef } from 'react';
import { useAlert } from 'react-alert';
import ReactCardFlip from 'react-card-flip';

import { useAssignmentData } from '../../assignment';
import { useDispatch } from '../../context/DispatchContext';
import RangesWrapper from '../../hoc/RangesWrapper';
import { CHANGE_RANGE_DATA } from '../../reducer/types/Types';
import { copyTextToClipboard } from '../../utility/Export';
import { HighlightSignalConcatenation } from '../extra/constants/ConcatenationStrings';
import NoTableData from '../extra/placeholder/NoTableData';
import { rangeDefaultValues } from '../extra/preferences/defaultValues';
import { unlink } from '../extra/utilities/RangeUtilities';
import PreferencesHeader from '../header/PreferencesHeader';

import RangesHeader from './RangesHeader';
import RangesPreferences from './RangesPreferences';
import RangesTable from './RangesTable';

const styles = {
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '0.55px solid rgb(240, 240, 240)',
  },
  sumButton: {
    borderRadius: '5px',
    marginTop: '3px',
    color: 'white',
    backgroundColor: '#6d6d6d',
    border: 'none',
    height: '16px',
    width: '18px',
    fontSize: '12px',
    padding: 0,
  },
  removeAssignmentsButton: {
    borderRadius: '5px',
    marginTop: '3px',
    marginLeft: '2px',
    border: 'none',
    height: '16px',
    width: '18px',
    fontSize: '12px',
    padding: 0,
  },
  setShowMultiplicityTreesButton: {
    borderRadius: '5px',
    marginTop: '3px',
    marginLeft: '5px',
    color: 'black',
    backgroundColor: 'transparent',
    border: 'none',
    height: '16px',
    width: '18px',
    fontSize: '12px',
    padding: 0,
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
  },
};

const RangesTablePanel = memo(
  ({
    ranges,
    x,
    y,
    xDomain,
    preferences,
    activeTab,
    molecules,
    showMultiplicityTrees,
    nucleus,
  }) => {
    const [isFilterActive, setFilterIsActive] = useState(false);
    const assignmentData = useAssignmentData();

    const dispatch = useDispatch();
    const alert = useAlert();
    const [isFlipped, setFlipStatus] = useState(false);
    const settingRef = useRef();

    const rangesData = useMemo(() => {
      const isInView = (from, to) => {
        const factor = 10000;
        to = to * factor;
        from = from * factor;
        return (
          (to >= xDomain[0] * factor && from <= xDomain[1] * factor) ||
          (from <= xDomain[0] * factor && to >= xDomain[1] * factor)
        );
      };

      const getFilteredRanges = (ranges) => {
        return ranges.filter((range) => isInView(range.from, range.to));
      };

      if (ranges.values) {
        const _ranges = isFilterActive
          ? getFilteredRanges(ranges.values)
          : ranges.values;

        return _ranges.map((range) => {
          return {
            ...range,
            tableMetaInfo: {
              isConstantlyHighlighted: isInView(range.from, range.to),
            },
          };
        });
      }
      return [];
    }, [isFilterActive, ranges.values, xDomain]);

    const unlinkRangeHandler = useCallback(
      (range, isOnRangeLevel, signalIndex) => {
        // remove assignments in assignment hook data
        if (isOnRangeLevel !== undefined) {
          if (isOnRangeLevel === true) {
            assignmentData.dispatch({
              type: 'REMOVE_ALL',
              payload: { id: range.id, axis: 'x' },
            });
          } else if (signalIndex !== undefined) {
            assignmentData.dispatch({
              type: 'REMOVE_ALL',
              payload: {
                id: `${range.id}${HighlightSignalConcatenation}${signalIndex}`,
                axis: 'x',
              },
            });
          }
        } else {
          assignmentData.dispatch({
            type: 'REMOVE_ALL',
            payload: { id: range.id, axis: 'x' },
          });
          range.signal.forEach((_signal, i) =>
            assignmentData.dispatch({
              type: 'REMOVE_ALL',
              payload: {
                id: `${range.id}${HighlightSignalConcatenation}${i}`,
                axis: 'x',
              },
            }),
          );
        }

        // remove assignments in global state
        const _range = lodash.cloneDeep(range);
        unlink(_range, isOnRangeLevel, signalIndex);
        dispatch({ type: CHANGE_RANGE_DATA, data: _range });
      },
      [assignmentData, dispatch],
    );

    const saveJSONToClipboardHandler = useCallback(
      (value) => {
        if (x && y) {
          const { from, to } = value;
          const { fromIndex, toIndex } = xGetFromToIndex(x, {
            from,
            to,
          });

          const dataToClipboard = {
            x: x.slice(fromIndex, toIndex),
            y: y.slice(fromIndex, toIndex),
            ...value,
          };

          const success = copyTextToClipboard(
            JSON.stringify(dataToClipboard, undefined, 2),
          );

          if (success) {
            alert.show('Data copied to clipboard');
          } else {
            alert.error('copy to clipboard failed');
          }
        }
      },
      [x, y, alert],
    );

    const rangesPreferences = useMemo(() => {
      const _preferences =
        lodash.get(preferences, `panels.ranges.[${activeTab}]`) ||
        rangeDefaultValues;

      return _preferences;
    }, [activeTab, preferences]);

    const contextMenu = useMemo(
      () => [
        {
          label: 'Copy to clipboard',
          onClick: saveJSONToClipboardHandler,
        },
      ],
      [saveJSONToClipboardHandler],
    );

    const filterHandler = useCallback(() => {
      setFilterIsActive(!isFilterActive);
    }, [isFilterActive]);

    const settingsPanelHandler = useCallback(() => {
      setFlipStatus(!isFlipped);
    }, [isFlipped]);

    const saveSettingHandler = useCallback(() => {
      settingRef.current.saveSetting();
      setFlipStatus(false);
    }, []);

    return (
      <>
        <div style={styles.container}>
          {!isFlipped && (
            <RangesHeader
              ranges={ranges}
              activeTab={activeTab}
              molecules={molecules}
              onUnlink={unlinkRangeHandler}
              onFilterActivated={filterHandler}
              onSettingClick={settingsPanelHandler}
              isFilterActive={isFilterActive}
              filterCounter={rangesData.length}
              showMultiplicityTrees={showMultiplicityTrees}
            />
          )}
          {isFlipped && (
            <PreferencesHeader
              onSave={saveSettingHandler}
              onClose={settingsPanelHandler}
            />
          )}
          <ReactCardFlip
            isFlipped={isFlipped}
            infinite={true}
            containerStyle={{ height: '100%' }}
          >
            <div>
              {rangesData && rangesData.length > 0 ? (
                <RangesTable
                  tableData={rangesData}
                  onUnlink={unlinkRangeHandler}
                  context={contextMenu}
                  preferences={rangesPreferences}
                  element={activeTab && activeTab.replace(/[0-9]/g, '')}
                />
              ) : (
                <NoTableData />
              )}
            </div>
            <RangesPreferences
              ranges={ranges}
              ref={settingRef}
              nucleus={nucleus}
              preferences={preferences}
            />
          </ReactCardFlip>
        </div>
      </>
    );
  },
);

export default RangesWrapper(RangesTablePanel);
