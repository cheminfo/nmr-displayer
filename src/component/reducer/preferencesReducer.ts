import { produce } from 'immer';
import lodashMerge from 'lodash/merge';

import { NMRiumMode } from '../NMRium';
import basic from '../nmriumMode/basic';
import exercise1D from '../nmriumMode/exercise1D';
import process1D from '../nmriumMode/process1D';
import {
  getLocalStorage,
  removeData,
  storeData,
} from '../utility/LocalStorage';

export const INIT_PREFERENCES = 'INIT_PREFERENCES';
export const SET_PREFERENCES = 'SET_PREFERENCES';
export const SET_PANELS_PREFERENCES = 'SET_PANELS_PREFERENCES';

const LOCAL_STORGAE_VERSION = '1.1';

function getPreferencesbyMode(mode) {
  switch (mode) {
    case NMRiumMode.EXERCISE_1D:
      return exercise1D;
    case NMRiumMode.PROCESS_1D:
      return process1D;
    default:
      return basic;
  }
}

export const preferencesInitialState = {
  basePreferences: {},
  display: basic,
  controllers: {
    mws: { low: 2, high: 20 },
    help: {
      preventAutoHelp: true,
    },
    dimmedSpectraTransparency: 0.1,
  },
  formatting: {
    nucleus: [
      { key: '1H', name: '1H', ppm: '0.00', hz: '0.00' },
      { key: '13C', name: '13C', ppm: '0.00', hz: '0.00' },
      { key: '15N', name: '15N', ppm: '0.00', hz: '0.00' },
      { key: '19F', name: '19F', ppm: '0.00', hz: '0.00' },
      { key: '29Si', name: '29Si', ppm: '0.00', hz: '0.00' },
      { key: '31P', name: '31P', ppm: '0.00', hz: '0.00' },
    ],
    nucleusByKey: {},
    panels: {},
  },
  dispatch: null,
};

function mapNucleus(draft) {
  if (draft.formatting.nucleus && Array.isArray(draft.formatting.nucleus)) {
    draft.formatting.nucleusByKey = draft.formatting.nucleus.reduce(
      (acc, item) => {
        acc[item.name.toLowerCase()] = item;
        return { ...acc };
      },
      {},
    );
  }
}

export function preferencesReducer(state, action) {
  switch (action.type) {
    case INIT_PREFERENCES: {
      const nmrLocalStorageVersion = getLocalStorage(
        'nmr-local-storage-version',
        false,
      );
      if (
        !nmrLocalStorageVersion ||
        nmrLocalStorageVersion !== LOCAL_STORGAE_VERSION
      ) {
        removeData('nmr-general-settings');
        storeData('nmr-local-storage-version', LOCAL_STORGAE_VERSION);
      }

      const localData = getLocalStorage('nmr-general-settings');

      return produce(state, (draft) => {
        if (action.payload) {
          const { dispatch, mode, ...resProps } = action.payload;

          draft.basePreferences = lodashMerge(
            {},
            {
              display:
                mode === NMRiumMode.DEFAULT ? {} : getPreferencesbyMode(mode),
            },
            resProps,
          );

          const hiddenFeatures = JSON.parse(
            JSON.stringify(draft.basePreferences.display),
            (key, value) => {
              if (value) {
                return value;
              }
            },
          );

          draft.display = lodashMerge(
            {},
            getPreferencesbyMode(NMRiumMode.DEFAULT),
            hiddenFeatures,
          );
          draft.dispatch = dispatch;
          if (localData) {
            Object.entries(localData).forEach(([k, v]) => {
              if (!['dispatch', 'basePreferences'].includes(k)) {
                draft[k] = lodashMerge({}, resProps[k] ? resProps[k] : {}, v);
              }
            });
            mapNucleus(draft);
          }
        }
      });
    }
    case SET_PREFERENCES:
      return produce(state, (draft) => {
        if (action.payload) {
          const data = action.payload;
          draft.controllers = data.controllers;
          draft.formatting = data.formatting;
          draft.display.panels = data.display.panels;
          mapNucleus(draft);
        }
      });
    case SET_PANELS_PREFERENCES:
      return produce(state, (draft) => {
        if (action.payload) {
          const { key, value } = action.payload;
          draft.formatting.panels[key] = value;
        }
      });
    default:
      return state;
  }
}
