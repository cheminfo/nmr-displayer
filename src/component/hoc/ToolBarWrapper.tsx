import { useMemo, memo, forwardRef } from 'react';

import { useChartData } from '../context/ChartContext';
import nucluesToString from '../utility/nucluesToString';

export default function ToolBarWrapper(WrappedComponent) {
  function Wrapper(props) {
    const { data, activeSpectrum, verticalAlign, displayerMode, activeTab } =
      useChartData();

    const {
      info = {},
      ftCounter = 0,
      fidCounter = 0,
    } = useMemo(() => {
      if (data) {
        let info = null;
        let ftCounter = 0;
        let fidCounter = 0;

        for (const dataInfo of data) {
          const { isFid, isFt, nucleus } = dataInfo.info;

          if (activeTab === nucluesToString(nucleus)) {
            if (isFid) {
              fidCounter++;
            }
            if (isFt) {
              ftCounter++;
            }
            if (activeSpectrum && dataInfo.id === activeSpectrum.id) {
              info = dataInfo.info;
            }
          }
        }

        return {
          info: info ? info : {},
          ftCounter,
          fidCounter,
        };
      }
      return {};
    }, [activeSpectrum, data, activeTab]);

    const { forwardedRef, ...rest } = props;
    return (
      <WrappedComponent
        {...rest}
        {...{
          info,
          activeSpectrum,
          verticalAlign,
          displayerMode,
          ftCounter,
          fidCounter,
        }}
        ref={forwardedRef}
      />
    );
  }

  return memo(
    forwardRef((props: any, ref) => {
      return <Wrapper {...props} forwardedRef={ref} />;
    }),
  );
}
