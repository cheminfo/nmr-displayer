import initSetting from '../../constants/InitSetting';
import { getLocalStorage, getValue } from '../../utility/LocalStorage';

export const zoomDefaultValues = {
  lowStep: initSetting.controllers.mws.low,
  highStep: initSetting.controllers.mws.high,
  speedThreshold: 3,
};

export default class Spectrum1DZoomHelper {
  private scale: number;
  private speedThreshold: any;
  private slowZoomStep: any;
  private fastZoomStep: any;

  public constructor(
    scale = 1,
    options: {
      speedThreshold?: any;
      slowZoomStep?: any;
      fastZoomStep?: any;
    } = {},
  ) {
    this.scale = scale;
    this.speedThreshold =
      options.speedThreshold || zoomDefaultValues.speedThreshold;
    this.slowZoomStep = options.slowZoomStep || zoomDefaultValues.lowStep;
    this.fastZoomStep = options.fastZoomStep || zoomDefaultValues.highStep;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public wheel(deltaY, deltaMode) {
    const deltaYValue =
      Math.abs(deltaY).toString().length === 1
        ? Math.abs(deltaY)
        : Math.abs(deltaY) / 100;
    const settings = getLocalStorage('nmr-general-settings');

    const _slowZoomStep = getValue(settings, 'general.controllers.mws.low');
    const _fastZoomStep = getValue(settings, 'general.controllers.mws.high');

    const LOW_STEP = _slowZoomStep
      ? 0.01 * _slowZoomStep
      : 0.01 * this.slowZoomStep;
    const FAST_STEP = _fastZoomStep
      ? 0.05 * _fastZoomStep
      : 0.05 * this.fastZoomStep;

    let ZOOM_STEP = deltaYValue <= this.speedThreshold ? LOW_STEP : FAST_STEP;

    const direction = Math.sign(deltaY);
    const _scale =
      direction === -1 ? this.scale + ZOOM_STEP : this.scale - ZOOM_STEP;
    if (_scale >= 0 || _scale === 0) {
      this.scale = _scale;
    } else {
      this.scale = 0;
    }
  }

  public getScale() {
    return this.scale;
  }

  public setScale(scale) {
    this.scale = scale;
  }
}
