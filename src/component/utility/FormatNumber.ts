import lodashGet from 'lodash/get';
import Numeral from 'numeral';
import { useMemo } from 'react';

import { usePreferences } from '../context/PreferencesContext';

function FormatNumber(value, format, prefix = '', suffix = '') {
  return prefix + Numeral(value).format(format) + suffix;
}

type ReturnFunction = (
  value?: number | string,
  formatKey?: string,
  prefix?: string,
  suffix?: string,
) => string;

export function useFormatNumberByNucleus(
  nucleus?: Array<string>,
): Array<ReturnFunction>;
export function useFormatNumberByNucleus(nucleus?: string): ReturnFunction;
export function useFormatNumberByNucleus(nucleus?: string | Array<string>) {
  const preferences = usePreferences();
  const nucleusByKey = lodashGet(preferences, `formatting.nucleusByKey`, {
    ppm: '0.0',
    hz: '0.0',
  });

  return useMemo(() => {
    function formatFun(n: string) {
      return function (
        value: any,
        formatKey = 'ppm',
        prefix = '',
        suffix = '',
      ) {
        return (
          prefix +
          Numeral(Number(value)).format(
            lodashGet(nucleusByKey, `${n.toLowerCase()}.${formatKey}`, '0.0'),
          ) +
          suffix
        );
      };
    }

    if (!nucleus) {
      return () => undefined;
    }

    if (typeof nucleus === 'string') {
      return formatFun(nucleus);
    } else if (Array.isArray(nucleus)) {
      return nucleus.map((n) => formatFun(n));
    } else {
      throw Error('nuclus must be string or array of string');
    }
  }, [nucleus, nucleusByKey]);
}

export function getNumberOfDecimals(value: number | string) {
  value = String(value).trim();
  const lastIndex = value.lastIndexOf('.');
  return lastIndex > 0 ? value.substr(lastIndex).split('').length - 1 : 0;
}

export default FormatNumber;
