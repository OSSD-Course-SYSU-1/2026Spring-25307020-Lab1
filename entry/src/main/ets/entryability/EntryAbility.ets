import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import window from '@ohos.window';
import hilog from '@ohos.hilog';
import { StorageService } from '../services/StorageService';

const TAG = 'EntryAbility';
const DOMAIN = 0xFF00;

// 接续数据存储
let continueData: Record<string, Object> = {};

export default class EntryAbility extends UIAbility {
  storage: LocalStorage = new LocalStorage();

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(DOMAIN, TAG, '>>> onCreate called, launchReason: %{public}d', launchParam.launchReason);
    
    try {
      StorageService.init(this.context);
      hilog.info(DOMAIN, TAG, '>>> StorageService initialized');
    } catch (e) {
      hilog.error(DOMAIN, TAG, '>>> StorageService init failed: %{public}s', JSON.stringify(e));
    }

    // 处理接续启动
    if (launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
      hilog.info(DOMAIN, TAG, '>>> Launched by continuation');
      this.restoreContinueData(want);
      // 恢复窗口
      this.context.restoreWindowStage(this.storage);
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

  onWindowStageRestore(windowStage: window.WindowStage): void {
    hilog.info(DOMAIN, TAG, '>>> onWindowStageRestore called');
    // 接续恢复时加载页面
    windowStage.loadContent('pages/HomePage', (err) => {
      if (err) {
        hilog.error(DOMAIN, TAG, '>>> Failed to restore: %{public}s', JSON.stringify(err));
        return;
      }
      hilog.info(DOMAIN, TAG, '>>> HomePage restored');
    });
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

  // ── 应用接续：保存数据 ──
  onContinue(wantParam: Record<string, Object>): AbilityConstant.OnContinueResult {
    hilog.info(DOMAIN, TAG, '>>> onContinue called');
    
    // 保存当前页面状态
    try {
      // 保存当前选中的科目ID
      const currentSubjectId = AppStorage.get<string>('continueSubjectId') || '';
      wantParam['currentSubjectId'] = currentSubjectId;
      
      // 保存当前标签页
      const currentTab = AppStorage.get<string>('continueTab') || 'home';
      wantParam['currentTab'] = currentTab;
      
      hilog.info(DOMAIN, TAG, '>>> Continue data saved: subjectId=%{public}s, tab=%{public}s', 
        currentSubjectId, currentTab);
      
      return AbilityConstant.OnContinueResult.AGREE;
    } catch (e) {
      hilog.error(DOMAIN, TAG, '>>> onContinue failed: %{public}s', JSON.stringify(e));
      return AbilityConstant.OnContinueResult.REJECT;
    }
  }

  // ── 应用接续：恢复数据 ──
  restoreContinueData(want: Want): void {
    hilog.info(DOMAIN, TAG, '>>> restoreContinueData called');
    
    if (want.parameters) {
      // 恢复科目ID
      const subjectId = want.parameters['currentSubjectId'] as string;
      if (subjectId) {
        AppStorage.setOrCreate('continueSubjectId', subjectId);
        hilog.info(DOMAIN, TAG, '>>> Restored subjectId: %{public}s', subjectId);
      }
      
      // 恢复标签页
      const tab = want.parameters['currentTab'] as string;
      if (tab) {
        AppStorage.setOrCreate('continueTab', tab);
        hilog.info(DOMAIN, TAG, '>>> Restored tab: %{public}s', tab);
      }
    }
  }

  // ── 单实例热启动 ──
  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(DOMAIN, TAG, '>>> onNewWant called, launchReason: %{public}d', launchParam.launchReason);
    
    // 处理接续启动
    if (launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
      hilog.info(DOMAIN, TAG, '>>> NewWant by continuation');
      this.restoreContinueData(want);
      this.context.restoreWindowStage(this.storage);
    }
  }
}
