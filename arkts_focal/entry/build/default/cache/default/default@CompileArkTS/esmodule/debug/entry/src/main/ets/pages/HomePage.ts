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
    currentBreakpoint?: BreakpointType;
}
import router from "@ohos:router";
import { Subject } from "@bundle:com.focal.study/entry/ets/models/Subject";
import { StorageService } from "@bundle:com.focal.study/entry/ets/services/StorageService";
import { DateUtil } from "@bundle:com.focal.study/entry/ets/utils/DateUtil";
import { Constants } from "@bundle:com.focal.study/entry/ets/utils/Constants";
import type { ColorDef } from "@bundle:com.focal.study/entry/ets/utils/Constants";
import { UIDUtil } from "@bundle:com.focal.study/entry/ets/utils/UIDUtil";
import { BreakpointSystem, BreakpointType } from "@bundle:com.focal.study/entry/ets/utils/BreakpointSystem";
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
        this.__currentBreakpoint = new ObservedPropertySimplePU(BreakpointType.SM, this, "currentBreakpoint");
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
        if (params.currentBreakpoint !== undefined) {
            this.currentBreakpoint = params.currentBreakpoint;
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
        this.__currentBreakpoint.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__subjects.aboutToBeDeleted();
        this.__isDarkMode.aboutToBeDeleted();
        this.__selectedColor.aboutToBeDeleted();
        this.__newSubjectName.aboutToBeDeleted();
        this.__newSubjectDate.aboutToBeDeleted();
        this.__showAddDialog.aboutToBeDeleted();
        this.__currentBreakpoint.aboutToBeDeleted();
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
    private __currentBreakpoint: ObservedPropertySimplePU<BreakpointType>;
    get currentBreakpoint() {
        return this.__currentBreakpoint.get();
    }
    set currentBreakpoint(newValue: BreakpointType) {
        this.__currentBreakpoint.set(newValue);
    }
    aboutToAppear() {
        try {
            this.isDarkMode = StorageService.loadString('theme', 'light') === 'dark';
            this.loadSubjects();
            // 设置接续状态
            AppStorage.setOrCreate('continueTab', 'home');
        }
        catch (e) {
            console.error('HomePage init error:', e);
        }
    }
    // 响应式布局更新
    updateBreakpoint(width: number): void {
        BreakpointSystem.updateWidth(width);
        this.currentBreakpoint = BreakpointSystem.getBreakpoint();
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
    // 响应式获取网格列数
    getGridColumns(): string {
        switch (this.currentBreakpoint) {
            case BreakpointType.SM:
                return '1fr 1fr';
            case BreakpointType.MD:
                return '1fr 1fr 1fr';
            case BreakpointType.LG:
                return '1fr 1fr 1fr 1fr';
            default:
                return '1fr 1fr';
        }
    }
    // 响应式获取标题字体大小
    getTitleSize(): number {
        switch (this.currentBreakpoint) {
            case BreakpointType.SM:
                return 30;
            case BreakpointType.MD:
                return 36;
            case BreakpointType.LG:
                return 42;
            default:
                return 30;
        }
    }
    // 响应式获取内边距
    getPaddingValue(): number {
        switch (this.currentBreakpoint) {
            case BreakpointType.SM:
                return 16;
            case BreakpointType.MD:
                return 24;
            case BreakpointType.LG:
                return 32;
            default:
                return 16;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.getBgColor());
            Column.onAreaChange((oldValue: Area, newValue: Area) => {
                // 响应式布局：监听区域变化
                const width = newValue.width as number;
                if (width) {
                    this.updateBreakpoint(width);
                }
            });
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
            // 设备类型指示器（调试用）
            Text.create(`[${this.currentBreakpoint}]`);
            // 设备类型指示器（调试用）
            Text.fontSize(10);
            // 设备类型指示器（调试用）
            Text.fontColor(this.getInkDimColor());
            // 设备类型指示器（调试用）
            Text.margin({ right: 12 });
        }, Text);
        // 设备类型指示器（调试用）
        Text.pop();
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
            Text.fontSize(this.getTitleSize());
            // Title
            Text.fontColor(this.getKleinColor());
            // Title
            Text.margin({ top: 20 });
        }, Text);
        // Title
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('v7.0 - ArkTS Edition | 自由流转 & 响应式布局');
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
            // Subject Grid (响应式网格)
            Scroll.create();
            // Subject Grid (响应式网格)
            Scroll.width('100%');
            // Subject Grid (响应式网格)
            Scroll.layoutWeight(1);
            // Subject Grid (响应式网格)
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.columnsTemplate(this.getGridColumns());
            Grid.columnsGap(16);
            Grid.rowsGap(16);
            Grid.width('100%');
            Grid.padding(this.getPaddingValue());
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const s = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.width('100%');
                            Column.padding(16);
                            Column.backgroundColor(this.getSurfaceColor());
                            Column.borderRadius(12);
                            Column.onClick(() => {
                                // 保存接续状态
                                AppStorage.setOrCreate('continueSubjectId', s.id);
                                router.pushUrl({
                                    url: 'pages/SubjectPage',
                                    params: { subjectId: s.id }
                                });
                            });
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 颜色指示器
                            Text.create('');
                            // 颜色指示器
                            Text.width(32);
                            // 颜色指示器
                            Text.height(32);
                            // 颜色指示器
                            Text.borderRadius(16);
                            // 颜色指示器
                            Text.backgroundColor(s.color);
                            // 颜色指示器
                            Text.margin({ bottom: 12 });
                        }, Text);
                        // 颜色指示器
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 科目名称
                            Text.create(s.name);
                            // 科目名称
                            Text.fontSize(16);
                            // 科目名称
                            Text.fontColor(this.getInkColor());
                            // 科目名称
                            Text.maxLines(2);
                            // 科目名称
                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        }, Text);
                        // 科目名称
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            // 考试日期
                            if (s.examDate) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(s.examDate);
                                        Text.fontSize(12);
                                        Text.fontColor(this.getInkDimColor());
                                        Text.margin({ top: 4 });
                                    }, Text);
                                    Text.pop();
                                });
                            }
                            // 删除按钮
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 删除按钮
                            Button.createWithLabel('Delete');
                            // 删除按钮
                            Button.fontSize(10);
                            // 删除按钮
                            Button.fontColor('#b03030');
                            // 删除按钮
                            Button.backgroundColor(Color.Transparent);
                            // 删除按钮
                            Button.margin({ top: 8 });
                            // 删除按钮
                            Button.onClick(() => this.deleteSubject(s.id));
                        }, Button);
                        // 删除按钮
                        Button.pop();
                        Column.pop();
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.subjects, forEachItemGenFunction, (s: Subject) => s.id, true, false);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        // Subject Grid (响应式网格)
        Scroll.pop();
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
