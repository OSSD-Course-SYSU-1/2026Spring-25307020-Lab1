if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    subjects?: Subject[];
    isDarkMode?: boolean;
    selectedColor?: ColorDef;
    newSubjectName?: string;
    newSubjectDate?: string;
    showAddDialog?: boolean;
}
import router from "@ohos:router";
import { Subject } from "@bundle:com.focal.study/entry/ets/models/Subject";
import { StorageService } from "@bundle:com.focal.study/entry/ets/services/StorageService";
import { DateUtil } from "@bundle:com.focal.study/entry/ets/utils/DateUtil";
import { Constants } from "@bundle:com.focal.study/entry/ets/utils/Constants";
import type { ColorDef } from "@bundle:com.focal.study/entry/ets/utils/Constants";
import { UIDUtil } from "@bundle:com.focal.study/entry/ets/utils/UIDUtil";
class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__subjects = new ObservedPropertyObjectPU([], this, "subjects");
        this.__isDarkMode = new ObservedPropertySimplePU(false, this, "isDarkMode");
        this.__selectedColor = new ObservedPropertyObjectPU(Constants.DEFAULT_COLORS[5], this, "selectedColor");
        this.__newSubjectName = new ObservedPropertySimplePU('', this, "newSubjectName");
        this.__newSubjectDate = new ObservedPropertySimplePU('', this, "newSubjectDate");
        this.__showAddDialog = new ObservedPropertySimplePU(false, this, "showAddDialog");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.subjects !== undefined) {
            this.subjects = params.subjects;
        }
        if (params.isDarkMode !== undefined) {
            this.isDarkMode = params.isDarkMode;
        }
        if (params.selectedColor !== undefined) {
            this.selectedColor = params.selectedColor;
        }
        if (params.newSubjectName !== undefined) {
            this.newSubjectName = params.newSubjectName;
        }
        if (params.newSubjectDate !== undefined) {
            this.newSubjectDate = params.newSubjectDate;
        }
        if (params.showAddDialog !== undefined) {
            this.showAddDialog = params.showAddDialog;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__subjects.purgeDependencyOnElmtId(rmElmtId);
        this.__isDarkMode.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedColor.purgeDependencyOnElmtId(rmElmtId);
        this.__newSubjectName.purgeDependencyOnElmtId(rmElmtId);
        this.__newSubjectDate.purgeDependencyOnElmtId(rmElmtId);
        this.__showAddDialog.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__subjects.aboutToBeDeleted();
        this.__isDarkMode.aboutToBeDeleted();
        this.__selectedColor.aboutToBeDeleted();
        this.__newSubjectName.aboutToBeDeleted();
        this.__newSubjectDate.aboutToBeDeleted();
        this.__showAddDialog.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __subjects: ObservedPropertyObjectPU<Subject[]>;
    get subjects() {
        return this.__subjects.get();
    }
    set subjects(newValue: Subject[]) {
        this.__subjects.set(newValue);
    }
    private __isDarkMode: ObservedPropertySimplePU<boolean>;
    get isDarkMode() {
        return this.__isDarkMode.get();
    }
    set isDarkMode(newValue: boolean) {
        this.__isDarkMode.set(newValue);
    }
    private __selectedColor: ObservedPropertyObjectPU<ColorDef>;
    get selectedColor() {
        return this.__selectedColor.get();
    }
    set selectedColor(newValue: ColorDef) {
        this.__selectedColor.set(newValue);
    }
    private __newSubjectName: ObservedPropertySimplePU<string>;
    get newSubjectName() {
        return this.__newSubjectName.get();
    }
    set newSubjectName(newValue: string) {
        this.__newSubjectName.set(newValue);
    }
    private __newSubjectDate: ObservedPropertySimplePU<string>;
    get newSubjectDate() {
        return this.__newSubjectDate.get();
    }
    set newSubjectDate(newValue: string) {
        this.__newSubjectDate.set(newValue);
    }
    private __showAddDialog: ObservedPropertySimplePU<boolean>;
    get showAddDialog() {
        return this.__showAddDialog.get();
    }
    set showAddDialog(newValue: boolean) {
        this.__showAddDialog.set(newValue);
    }
    aboutToAppear() {
        try {
            this.isDarkMode = StorageService.loadString('theme', 'light') === 'dark';
            this.loadSubjects();
        }
        catch (e) {
            console.error('HomePage init error:', e);
        }
    }
    loadSubjects(): void {
        try {
            this.subjects = StorageService.load('subjects', []) as Subject[];
        }
        catch (e) {
            this.subjects = [];
        }
    }
    saveSubjects(): void {
        try {
            StorageService.save('subjects', this.subjects);
        }
        catch (e) { }
    }
    toggleTheme(): void {
        this.isDarkMode = !this.isDarkMode;
        try {
            StorageService.save('theme', this.isDarkMode ? 'dark' : 'light');
        }
        catch (e) { }
    }
    confirmAddSubject(): void {
        if (!this.newSubjectName.trim())
            return;
        const subject = new Subject(UIDUtil.uid(), this.newSubjectName.trim(), this.selectedColor.hex, this.newSubjectDate || '', DateUtil.today());
        this.subjects.push(subject);
        this.saveSubjects();
        this.newSubjectName = '';
        this.newSubjectDate = '';
        this.showAddDialog = false;
    }
    deleteSubject(id: string): void {
        const newSubjects: Subject[] = [];
        for (let i = 0; i < this.subjects.length; i++) {
            if (this.subjects[i].id !== id) {
                newSubjects.push(this.subjects[i]);
            }
        }
        this.subjects = newSubjects;
        this.saveSubjects();
    }
    getBgColor(): ResourceColor {
        return this.isDarkMode ? '#0a0a0a' : '#F8FAFC';
    }
    getInkColor(): ResourceColor {
        return this.isDarkMode ? '#f0f0ee' : '#0e0e0e';
    }
    getInkDimColor(): ResourceColor {
        return this.isDarkMode ? '#505050' : '#888';
    }
    getKleinColor(): ResourceColor {
        return this.isDarkMode ? '#1055cc' : '#0047ab';
    }
    getSurfaceColor(): ResourceColor {
        return this.isDarkMode ? 'rgba(20,20,20,0.7)' : 'rgba(255,255,255,0.5)';
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.getBgColor());
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Topbar
            Row.create();
            // Topbar
            Row.width('100%');
            // Topbar
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Focal');
            Text.fontSize(18);
            Text.fontColor(this.getInkColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isDarkMode ? 'LIGHT' : 'DARK');
            Button.fontSize(10);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => this.toggleTheme());
        }, Button);
        Button.pop();
        // Topbar
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Title
            Text.create('Focal Study System');
            // Title
            Text.fontSize(30);
            // Title
            Text.fontColor(this.getKleinColor());
            // Title
            Text.margin({ top: 20 });
        }, Text);
        // Title
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('v7.0 - ArkTS Edition');
            Text.fontSize(14);
            Text.fontColor(this.getInkDimColor());
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Add Button
            Button.createWithLabel('+ Add Subject');
            // Add Button
            Button.margin({ top: 20 });
            // Add Button
            Button.fontColor('#ffffff');
            // Add Button
            Button.backgroundColor(this.getKleinColor());
            // Add Button
            Button.onClick(() => this.showAddDialog = true);
        }, Button);
        // Add Button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Subject List
            Column.create();
            // Subject List
            Column.width('100%');
            // Subject List
            Column.padding(24);
            // Subject List
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.subjects.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('No subjects yet');
                        Text.fontSize(14);
                        Text.fontColor(this.getInkDimColor());
                        Text.margin({ top: 20 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const s = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.padding(12);
                                Row.backgroundColor(this.getSurfaceColor());
                                Row.margin({ top: 8 });
                                Row.onClick(() => {
                                    router.pushUrl({
                                        url: 'pages/SubjectPage',
                                        params: { subjectId: s.id }
                                    });
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('');
                                Text.width(12);
                                Text.height(12);
                                Text.borderRadius(6);
                                Text.backgroundColor(s.color);
                                Text.margin({ right: 12 });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(s.name);
                                Text.fontSize(14);
                                Text.fontColor(this.getInkColor());
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('Delete');
                                Button.fontSize(10);
                                Button.fontColor('#b03030');
                                Button.backgroundColor(Color.Transparent);
                                Button.onClick(() => this.deleteSubject(s.id));
                            }, Button);
                            Button.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.subjects, forEachItemGenFunction, (s: Subject) => s.id, true, false);
                    }, ForEach);
                    ForEach.pop();
                });
            }
        }, If);
        If.pop();
        // Subject List
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Add Dialog
            if (this.showAddDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.padding(24);
                        Column.backgroundColor('#ffffff');
                        Column.border({ width: 1, color: '#cccccc' });
                        Column.width('90%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Add New Subject');
                        Text.fontSize(18);
                        Text.fontColor(this.getInkColor());
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ text: this.newSubjectName, placeholder: 'Subject name' });
                        TextInput.fontSize(16);
                        TextInput.margin({ bottom: 8 });
                        TextInput.onChange((value: string) => this.newSubjectName = value);
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ text: this.newSubjectDate, placeholder: 'Exam date (YYYY-MM-DD)' });
                        TextInput.fontSize(14);
                        TextInput.margin({ bottom: 8 });
                        TextInput.onChange((value: string) => this.newSubjectDate = value);
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ bottom: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, idx: number) => {
                            const c = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('');
                                Text.width(24);
                                Text.height(24);
                                Text.borderRadius(12);
                                Text.backgroundColor(c.hex);
                                Text.border({ width: this.selectedColor.name === c.name ? 2 : 0, color: '#000' });
                                Text.margin({ right: 8 });
                                Text.onClick(() => this.selectedColor = c);
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, Constants.DEFAULT_COLORS, forEachItemGenFunction, (c: ColorDef) => c.name, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('Cancel');
                        Button.onClick(() => this.showAddDialog = false);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('Create');
                        Button.fontColor('#ffffff');
                        Button.backgroundColor(this.getKleinColor());
                        Button.margin({ left: 8 });
                        Button.onClick(() => this.confirmAddSubject());
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "HomePage";
    }
}
registerNamedRoute(() => new HomePage(undefined, {}), "", { bundleName: "com.focal.study", moduleName: "entry", pagePath: "pages/HomePage", pageFullPath: "entry/src/main/ets/pages/HomePage", integratedHsp: "false", moduleType: "followWithHap" });
