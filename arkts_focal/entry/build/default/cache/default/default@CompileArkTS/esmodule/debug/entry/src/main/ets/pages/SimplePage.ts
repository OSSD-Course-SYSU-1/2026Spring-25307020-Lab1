if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SimplePage_Params {
    message?: string;
}
class SimplePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new ObservedPropertySimplePU('Hello World', this, "message");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SimplePage_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
    }
    updateStateVars(params: SimplePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#ff0000');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('SIMPLE PAGE');
            Text.fontSize(40);
            Text.fontColor('#000000');
            Text.backgroundColor('#ffff00');
            Text.margin({ top: 100 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('This should be visible');
            Text.fontSize(20);
            Text.fontColor('#000000');
            Text.backgroundColor('#00ff00');
            Text.margin({ top: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Click');
            Button.margin({ top: 30 });
            Button.onClick(() => this.message = 'Clicked');
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SimplePage";
    }
}
registerNamedRoute(() => new SimplePage(undefined, {}), "", { bundleName: "com.focal.study", moduleName: "entry", pagePath: "pages/SimplePage", pageFullPath: "entry/src/main/ets/pages/SimplePage", integratedHsp: "false", moduleType: "followWithHap" });
