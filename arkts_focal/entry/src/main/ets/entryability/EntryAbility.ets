import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import window from '@ohos.window';
import hilog from '@ohos.hilog';
import { StorageService } from '../services/StorageService';

const TAG = 'EntryAbility';
const DOMAIN = 0xFF00;

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(DOMAIN, TAG, '>>> onCreate called');
    try {
      StorageService.init(this.context);
      hilog.info(DOMAIN, TAG, '>>> StorageService initialized');
    } catch (e) {
      hilog.error(DOMAIN, TAG, '>>> StorageService init failed: %{public}s', JSON.stringify(e));
    }
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    hilog.info(DOMAIN, TAG, '>>> onWindowStageCreate called');
    try {
      windowStage.loadContent('pages/HomePage', (err) => {
        hilog.info(DOMAIN, TAG, '>>> loadContent callback');
        if (err) {
          hilog.error(DOMAIN, TAG, '>>> Failed: %{public}s', JSON.stringify(err));
          return;
        }
        hilog.info(DOMAIN, TAG, '>>> HomePage loaded');
      });
    } catch (e) {
      hilog.error(DOMAIN, TAG, '>>> loadContent exception: %{public}s', JSON.stringify(e));
    }
  }

  onDestroy(): void {
    hilog.info(DOMAIN, TAG, '>>> onDestroy called');
  }

  onForeground(): void {
    hilog.info(DOMAIN, TAG, '>>> onForeground called');
  }

  onBackground(): void {
    hilog.info(DOMAIN, TAG, '>>> onBackground called');
  }
}
