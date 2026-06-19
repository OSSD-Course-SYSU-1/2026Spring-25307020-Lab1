import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import type window from "@ohos:window";
import { StorageService } from "@bundle:com.focal.study/entry/ets/services/StorageService";
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        try {
            StorageService.init(this.context);
            console.info('StorageService initialized');
        }
        catch (e) {
            console.error('StorageService init failed: ' + JSON.stringify(e));
        }
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        windowStage.loadContent('pages/HomePage', (err) => {
            if (err.code) {
                console.error('Failed to load HomePage: ' + err.code + ', message: ' + err.message);
                return;
            }
            console.info('HomePage loaded successfully');
        });
    }
}
