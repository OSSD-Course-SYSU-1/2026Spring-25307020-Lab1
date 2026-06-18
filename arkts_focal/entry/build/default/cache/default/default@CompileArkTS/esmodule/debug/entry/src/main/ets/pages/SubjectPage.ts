if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SubjectPage_Params {
    subjectId?: string;
    subject?: Subject | null;
    isDarkMode?: boolean;
    currentTabIndex?: number;
    showEditDialog?: boolean;
    tasks?: Task[];
    newTaskText?: string;
    newTaskDate?: string;
    newTaskPriority?: string;
    notes?: Note[];
    currentNoteId?: string;
    noteMode?: string;
    noteContent?: string;
    mdInput?: string;
    plainInput?: string;
    cards?: FlashCard[];
    fcIndex?: number;
    fcFlipped?: boolean;
    srsMode?: string;
    srsDeck?: FlashCard[];
    newCardFront?: string;
    newCardBack?: string;
    errors?: ErrorItem[];
    errQuestion?: string;
    errWrong?: string;
    errCorrect?: string;
    errorCounter?: number;
    resources?: Resource[];
    resFilter?: string;
    customResources?: Resource[];
    aiSessions?: AISession[];
    currentAISessionId?: string;
    aiInput?: string;
    aiMessages?: AIMessage[];
    aiCtx?: string;
    aiIsTyping?: boolean;
    aiSubTab?: string;
    pomoRunning?: boolean;
    pomoMode?: string;
    pomoRemaining?: number;
    pomoTotal?: number;
    pomoSessions?: number;
    pomoDurations?: PomoDurations;
    pomoStats?: Record<string, number>;
    pomoTimerId?: number;
    showPomoSettings?: boolean;
    tempFocusDuration?: number;
    tempShortDuration?: number;
    tempLongDuration?: number;
}
import router from "@ohos:router";
import type { Subject } from '../models/Subject';
import { StorageService } from "@bundle:com.focal.study/entry/ets/services/StorageService";
import { DateUtil } from "@bundle:com.focal.study/entry/ets/utils/DateUtil";
import { Task } from "@bundle:com.focal.study/entry/ets/models/Task";
import { Note } from "@bundle:com.focal.study/entry/ets/models/Note";
import { FlashCard } from "@bundle:com.focal.study/entry/ets/models/FlashCard";
import { ErrorItem } from "@bundle:com.focal.study/entry/ets/models/ErrorItem";
import { Resource } from "@bundle:com.focal.study/entry/ets/models/Resource";
import { Constants } from "@bundle:com.focal.study/entry/ets/utils/Constants";
import { UIDUtil } from "@bundle:com.focal.study/entry/ets/utils/UIDUtil";
import { SRSService } from "@bundle:com.focal.study/entry/ets/services/SRSService";
import { MarkdownService } from "@bundle:com.focal.study/entry/ets/services/MarkdownService";
import { AISession, AIMessage } from "@bundle:com.focal.study/entry/ets/models/AISession";
interface PomoDurations {
    focus: number;
    short: number;
    long: number;
}
interface TaskGroups {
    today: Task[];
    tomorrow: Task[];
    later: Task[];
    done: Task[];
}
class SubjectPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__subjectId = new ObservedPropertySimplePU('', this, "subjectId");
        this.__subject = new ObservedPropertyObjectPU(null, this, "subject");
        this.__isDarkMode = new ObservedPropertySimplePU(false, this, "isDarkMode");
        this.__currentTabIndex = new ObservedPropertySimplePU(0, this, "currentTabIndex");
        this.__showEditDialog = new ObservedPropertySimplePU(false
        // Tasks state
        , this, "showEditDialog");
        this.__tasks = new ObservedPropertyObjectPU([], this, "tasks");
        this.__newTaskText = new ObservedPropertySimplePU('', this, "newTaskText");
        this.__newTaskDate = new ObservedPropertySimplePU('', this, "newTaskDate");
        this.__newTaskPriority = new ObservedPropertySimplePU('normal'
        // Notes state
        , this, "newTaskPriority");
        this.__notes = new ObservedPropertyObjectPU([], this, "notes");
        this.__currentNoteId = new ObservedPropertySimplePU('', this, "currentNoteId");
        this.__noteMode = new ObservedPropertySimplePU('rich', this, "noteMode");
        this.__noteContent = new ObservedPropertySimplePU('', this, "noteContent");
        this.__mdInput = new ObservedPropertySimplePU('', this, "mdInput");
        this.__plainInput = new ObservedPropertySimplePU(''
        // Flashcards state
        , this, "plainInput");
        this.__cards = new ObservedPropertyObjectPU([], this, "cards");
        this.__fcIndex = new ObservedPropertySimplePU(0, this, "fcIndex");
        this.__fcFlipped = new ObservedPropertySimplePU(false, this, "fcFlipped");
        this.__srsMode = new ObservedPropertySimplePU('all', this, "srsMode");
        this.__srsDeck = new ObservedPropertyObjectPU([], this, "srsDeck");
        this.__newCardFront = new ObservedPropertySimplePU('', this, "newCardFront");
        this.__newCardBack = new ObservedPropertySimplePU(''
        // Error log state
        , this, "newCardBack");
        this.__errors = new ObservedPropertyObjectPU([], this, "errors");
        this.__errQuestion = new ObservedPropertySimplePU('', this, "errQuestion");
        this.__errWrong = new ObservedPropertySimplePU('', this, "errWrong");
        this.__errCorrect = new ObservedPropertySimplePU('', this, "errCorrect");
        this.__errorCounter = new ObservedPropertySimplePU(0
        // Resources state
        , this, "errorCounter");
        this.__resources = new ObservedPropertyObjectPU([], this, "resources");
        this.__resFilter = new ObservedPropertySimplePU('all', this, "resFilter");
        this.__customResources = new ObservedPropertyObjectPU([]
        // AI state
        , this, "customResources");
        this.__aiSessions = new ObservedPropertyObjectPU([], this, "aiSessions");
        this.__currentAISessionId = new ObservedPropertySimplePU('', this, "currentAISessionId");
        this.__aiInput = new ObservedPropertySimplePU('', this, "aiInput");
        this.__aiMessages = new ObservedPropertyObjectPU([], this, "aiMessages");
        this.__aiCtx = new ObservedPropertySimplePU('general', this, "aiCtx");
        this.__aiIsTyping = new ObservedPropertySimplePU(false, this, "aiIsTyping");
        this.__aiSubTab = new ObservedPropertySimplePU('chat'
        // Pomodoro state
        , this, "aiSubTab");
        this.__pomoRunning = new ObservedPropertySimplePU(false, this, "pomoRunning");
        this.__pomoMode = new ObservedPropertySimplePU('focus', this, "pomoMode");
        this.__pomoRemaining = new ObservedPropertySimplePU(25 * 60, this, "pomoRemaining");
        this.__pomoTotal = new ObservedPropertySimplePU(25 * 60, this, "pomoTotal");
        this.__pomoSessions = new ObservedPropertySimplePU(0, this, "pomoSessions");
        this.__pomoDurations = new ObservedPropertyObjectPU({ focus: 25, short: 5, long: 15 }, this, "pomoDurations");
        this.__pomoStats = new ObservedPropertyObjectPU({}, this, "pomoStats");
        this.__pomoTimerId = new ObservedPropertySimplePU(-1, this, "pomoTimerId");
        this.__showPomoSettings = new ObservedPropertySimplePU(false, this, "showPomoSettings");
        this.__tempFocusDuration = new ObservedPropertySimplePU(25, this, "tempFocusDuration");
        this.__tempShortDuration = new ObservedPropertySimplePU(5, this, "tempShortDuration");
        this.__tempLongDuration = new ObservedPropertySimplePU(15, this, "tempLongDuration");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SubjectPage_Params) {
        if (params.subjectId !== undefined) {
            this.subjectId = params.subjectId;
        }
        if (params.subject !== undefined) {
            this.subject = params.subject;
        }
        if (params.isDarkMode !== undefined) {
            this.isDarkMode = params.isDarkMode;
        }
        if (params.currentTabIndex !== undefined) {
            this.currentTabIndex = params.currentTabIndex;
        }
        if (params.showEditDialog !== undefined) {
            this.showEditDialog = params.showEditDialog;
        }
        if (params.tasks !== undefined) {
            this.tasks = params.tasks;
        }
        if (params.newTaskText !== undefined) {
            this.newTaskText = params.newTaskText;
        }
        if (params.newTaskDate !== undefined) {
            this.newTaskDate = params.newTaskDate;
        }
        if (params.newTaskPriority !== undefined) {
            this.newTaskPriority = params.newTaskPriority;
        }
        if (params.notes !== undefined) {
            this.notes = params.notes;
        }
        if (params.currentNoteId !== undefined) {
            this.currentNoteId = params.currentNoteId;
        }
        if (params.noteMode !== undefined) {
            this.noteMode = params.noteMode;
        }
        if (params.noteContent !== undefined) {
            this.noteContent = params.noteContent;
        }
        if (params.mdInput !== undefined) {
            this.mdInput = params.mdInput;
        }
        if (params.plainInput !== undefined) {
            this.plainInput = params.plainInput;
        }
        if (params.cards !== undefined) {
            this.cards = params.cards;
        }
        if (params.fcIndex !== undefined) {
            this.fcIndex = params.fcIndex;
        }
        if (params.fcFlipped !== undefined) {
            this.fcFlipped = params.fcFlipped;
        }
        if (params.srsMode !== undefined) {
            this.srsMode = params.srsMode;
        }
        if (params.srsDeck !== undefined) {
            this.srsDeck = params.srsDeck;
        }
        if (params.newCardFront !== undefined) {
            this.newCardFront = params.newCardFront;
        }
        if (params.newCardBack !== undefined) {
            this.newCardBack = params.newCardBack;
        }
        if (params.errors !== undefined) {
            this.errors = params.errors;
        }
        if (params.errQuestion !== undefined) {
            this.errQuestion = params.errQuestion;
        }
        if (params.errWrong !== undefined) {
            this.errWrong = params.errWrong;
        }
        if (params.errCorrect !== undefined) {
            this.errCorrect = params.errCorrect;
        }
        if (params.errorCounter !== undefined) {
            this.errorCounter = params.errorCounter;
        }
        if (params.resources !== undefined) {
            this.resources = params.resources;
        }
        if (params.resFilter !== undefined) {
            this.resFilter = params.resFilter;
        }
        if (params.customResources !== undefined) {
            this.customResources = params.customResources;
        }
        if (params.aiSessions !== undefined) {
            this.aiSessions = params.aiSessions;
        }
        if (params.currentAISessionId !== undefined) {
            this.currentAISessionId = params.currentAISessionId;
        }
        if (params.aiInput !== undefined) {
            this.aiInput = params.aiInput;
        }
        if (params.aiMessages !== undefined) {
            this.aiMessages = params.aiMessages;
        }
        if (params.aiCtx !== undefined) {
            this.aiCtx = params.aiCtx;
        }
        if (params.aiIsTyping !== undefined) {
            this.aiIsTyping = params.aiIsTyping;
        }
        if (params.aiSubTab !== undefined) {
            this.aiSubTab = params.aiSubTab;
        }
        if (params.pomoRunning !== undefined) {
            this.pomoRunning = params.pomoRunning;
        }
        if (params.pomoMode !== undefined) {
            this.pomoMode = params.pomoMode;
        }
        if (params.pomoRemaining !== undefined) {
            this.pomoRemaining = params.pomoRemaining;
        }
        if (params.pomoTotal !== undefined) {
            this.pomoTotal = params.pomoTotal;
        }
        if (params.pomoSessions !== undefined) {
            this.pomoSessions = params.pomoSessions;
        }
        if (params.pomoDurations !== undefined) {
            this.pomoDurations = params.pomoDurations;
        }
        if (params.pomoStats !== undefined) {
            this.pomoStats = params.pomoStats;
        }
        if (params.pomoTimerId !== undefined) {
            this.pomoTimerId = params.pomoTimerId;
        }
        if (params.showPomoSettings !== undefined) {
            this.showPomoSettings = params.showPomoSettings;
        }
        if (params.tempFocusDuration !== undefined) {
            this.tempFocusDuration = params.tempFocusDuration;
        }
        if (params.tempShortDuration !== undefined) {
            this.tempShortDuration = params.tempShortDuration;
        }
        if (params.tempLongDuration !== undefined) {
            this.tempLongDuration = params.tempLongDuration;
        }
    }
    updateStateVars(params: SubjectPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__subjectId.purgeDependencyOnElmtId(rmElmtId);
        this.__subject.purgeDependencyOnElmtId(rmElmtId);
        this.__isDarkMode.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTabIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__showEditDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__tasks.purgeDependencyOnElmtId(rmElmtId);
        this.__newTaskText.purgeDependencyOnElmtId(rmElmtId);
        this.__newTaskDate.purgeDependencyOnElmtId(rmElmtId);
        this.__newTaskPriority.purgeDependencyOnElmtId(rmElmtId);
        this.__notes.purgeDependencyOnElmtId(rmElmtId);
        this.__currentNoteId.purgeDependencyOnElmtId(rmElmtId);
        this.__noteMode.purgeDependencyOnElmtId(rmElmtId);
        this.__noteContent.purgeDependencyOnElmtId(rmElmtId);
        this.__mdInput.purgeDependencyOnElmtId(rmElmtId);
        this.__plainInput.purgeDependencyOnElmtId(rmElmtId);
        this.__cards.purgeDependencyOnElmtId(rmElmtId);
        this.__fcIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__fcFlipped.purgeDependencyOnElmtId(rmElmtId);
        this.__srsMode.purgeDependencyOnElmtId(rmElmtId);
        this.__srsDeck.purgeDependencyOnElmtId(rmElmtId);
        this.__newCardFront.purgeDependencyOnElmtId(rmElmtId);
        this.__newCardBack.purgeDependencyOnElmtId(rmElmtId);
        this.__errors.purgeDependencyOnElmtId(rmElmtId);
        this.__errQuestion.purgeDependencyOnElmtId(rmElmtId);
        this.__errWrong.purgeDependencyOnElmtId(rmElmtId);
        this.__errCorrect.purgeDependencyOnElmtId(rmElmtId);
        this.__errorCounter.purgeDependencyOnElmtId(rmElmtId);
        this.__resources.purgeDependencyOnElmtId(rmElmtId);
        this.__resFilter.purgeDependencyOnElmtId(rmElmtId);
        this.__customResources.purgeDependencyOnElmtId(rmElmtId);
        this.__aiSessions.purgeDependencyOnElmtId(rmElmtId);
        this.__currentAISessionId.purgeDependencyOnElmtId(rmElmtId);
        this.__aiInput.purgeDependencyOnElmtId(rmElmtId);
        this.__aiMessages.purgeDependencyOnElmtId(rmElmtId);
        this.__aiCtx.purgeDependencyOnElmtId(rmElmtId);
        this.__aiIsTyping.purgeDependencyOnElmtId(rmElmtId);
        this.__aiSubTab.purgeDependencyOnElmtId(rmElmtId);
        this.__pomoRunning.purgeDependencyOnElmtId(rmElmtId);
        this.__pomoMode.purgeDependencyOnElmtId(rmElmtId);
        this.__pomoRemaining.purgeDependencyOnElmtId(rmElmtId);
        this.__pomoTotal.purgeDependencyOnElmtId(rmElmtId);
        this.__pomoSessions.purgeDependencyOnElmtId(rmElmtId);
        this.__pomoDurations.purgeDependencyOnElmtId(rmElmtId);
        this.__pomoStats.purgeDependencyOnElmtId(rmElmtId);
        this.__pomoTimerId.purgeDependencyOnElmtId(rmElmtId);
        this.__showPomoSettings.purgeDependencyOnElmtId(rmElmtId);
        this.__tempFocusDuration.purgeDependencyOnElmtId(rmElmtId);
        this.__tempShortDuration.purgeDependencyOnElmtId(rmElmtId);
        this.__tempLongDuration.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__subjectId.aboutToBeDeleted();
        this.__subject.aboutToBeDeleted();
        this.__isDarkMode.aboutToBeDeleted();
        this.__currentTabIndex.aboutToBeDeleted();
        this.__showEditDialog.aboutToBeDeleted();
        this.__tasks.aboutToBeDeleted();
        this.__newTaskText.aboutToBeDeleted();
        this.__newTaskDate.aboutToBeDeleted();
        this.__newTaskPriority.aboutToBeDeleted();
        this.__notes.aboutToBeDeleted();
        this.__currentNoteId.aboutToBeDeleted();
        this.__noteMode.aboutToBeDeleted();
        this.__noteContent.aboutToBeDeleted();
        this.__mdInput.aboutToBeDeleted();
        this.__plainInput.aboutToBeDeleted();
        this.__cards.aboutToBeDeleted();
        this.__fcIndex.aboutToBeDeleted();
        this.__fcFlipped.aboutToBeDeleted();
        this.__srsMode.aboutToBeDeleted();
        this.__srsDeck.aboutToBeDeleted();
        this.__newCardFront.aboutToBeDeleted();
        this.__newCardBack.aboutToBeDeleted();
        this.__errors.aboutToBeDeleted();
        this.__errQuestion.aboutToBeDeleted();
        this.__errWrong.aboutToBeDeleted();
        this.__errCorrect.aboutToBeDeleted();
        this.__errorCounter.aboutToBeDeleted();
        this.__resources.aboutToBeDeleted();
        this.__resFilter.aboutToBeDeleted();
        this.__customResources.aboutToBeDeleted();
        this.__aiSessions.aboutToBeDeleted();
        this.__currentAISessionId.aboutToBeDeleted();
        this.__aiInput.aboutToBeDeleted();
        this.__aiMessages.aboutToBeDeleted();
        this.__aiCtx.aboutToBeDeleted();
        this.__aiIsTyping.aboutToBeDeleted();
        this.__aiSubTab.aboutToBeDeleted();
        this.__pomoRunning.aboutToBeDeleted();
        this.__pomoMode.aboutToBeDeleted();
        this.__pomoRemaining.aboutToBeDeleted();
        this.__pomoTotal.aboutToBeDeleted();
        this.__pomoSessions.aboutToBeDeleted();
        this.__pomoDurations.aboutToBeDeleted();
        this.__pomoStats.aboutToBeDeleted();
        this.__pomoTimerId.aboutToBeDeleted();
        this.__showPomoSettings.aboutToBeDeleted();
        this.__tempFocusDuration.aboutToBeDeleted();
        this.__tempShortDuration.aboutToBeDeleted();
        this.__tempLongDuration.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __subjectId: ObservedPropertySimplePU<string>;
    get subjectId() {
        return this.__subjectId.get();
    }
    set subjectId(newValue: string) {
        this.__subjectId.set(newValue);
    }
    private __subject: ObservedPropertyObjectPU<Subject | null>;
    get subject() {
        return this.__subject.get();
    }
    set subject(newValue: Subject | null) {
        this.__subject.set(newValue);
    }
    private __isDarkMode: ObservedPropertySimplePU<boolean>;
    get isDarkMode() {
        return this.__isDarkMode.get();
    }
    set isDarkMode(newValue: boolean) {
        this.__isDarkMode.set(newValue);
    }
    private __currentTabIndex: ObservedPropertySimplePU<number>;
    get currentTabIndex() {
        return this.__currentTabIndex.get();
    }
    set currentTabIndex(newValue: number) {
        this.__currentTabIndex.set(newValue);
    }
    private __showEditDialog: ObservedPropertySimplePU<boolean>;
    get showEditDialog() {
        return this.__showEditDialog.get();
    }
    set showEditDialog(newValue: boolean) {
        this.__showEditDialog.set(newValue);
    }
    // Tasks state
    private __tasks: ObservedPropertyObjectPU<Task[]>;
    get tasks() {
        return this.__tasks.get();
    }
    set tasks(newValue: Task[]) {
        this.__tasks.set(newValue);
    }
    private __newTaskText: ObservedPropertySimplePU<string>;
    get newTaskText() {
        return this.__newTaskText.get();
    }
    set newTaskText(newValue: string) {
        this.__newTaskText.set(newValue);
    }
    private __newTaskDate: ObservedPropertySimplePU<string>;
    get newTaskDate() {
        return this.__newTaskDate.get();
    }
    set newTaskDate(newValue: string) {
        this.__newTaskDate.set(newValue);
    }
    private __newTaskPriority: ObservedPropertySimplePU<string>;
    get newTaskPriority() {
        return this.__newTaskPriority.get();
    }
    set newTaskPriority(newValue: string) {
        this.__newTaskPriority.set(newValue);
    }
    // Notes state
    private __notes: ObservedPropertyObjectPU<Note[]>;
    get notes() {
        return this.__notes.get();
    }
    set notes(newValue: Note[]) {
        this.__notes.set(newValue);
    }
    private __currentNoteId: ObservedPropertySimplePU<string>;
    get currentNoteId() {
        return this.__currentNoteId.get();
    }
    set currentNoteId(newValue: string) {
        this.__currentNoteId.set(newValue);
    }
    private __noteMode: ObservedPropertySimplePU<string>;
    get noteMode() {
        return this.__noteMode.get();
    }
    set noteMode(newValue: string) {
        this.__noteMode.set(newValue);
    }
    private __noteContent: ObservedPropertySimplePU<string>;
    get noteContent() {
        return this.__noteContent.get();
    }
    set noteContent(newValue: string) {
        this.__noteContent.set(newValue);
    }
    private __mdInput: ObservedPropertySimplePU<string>;
    get mdInput() {
        return this.__mdInput.get();
    }
    set mdInput(newValue: string) {
        this.__mdInput.set(newValue);
    }
    private __plainInput: ObservedPropertySimplePU<string>;
    get plainInput() {
        return this.__plainInput.get();
    }
    set plainInput(newValue: string) {
        this.__plainInput.set(newValue);
    }
    // Flashcards state
    private __cards: ObservedPropertyObjectPU<FlashCard[]>;
    get cards() {
        return this.__cards.get();
    }
    set cards(newValue: FlashCard[]) {
        this.__cards.set(newValue);
    }
    private __fcIndex: ObservedPropertySimplePU<number>;
    get fcIndex() {
        return this.__fcIndex.get();
    }
    set fcIndex(newValue: number) {
        this.__fcIndex.set(newValue);
    }
    private __fcFlipped: ObservedPropertySimplePU<boolean>;
    get fcFlipped() {
        return this.__fcFlipped.get();
    }
    set fcFlipped(newValue: boolean) {
        this.__fcFlipped.set(newValue);
    }
    private __srsMode: ObservedPropertySimplePU<string>;
    get srsMode() {
        return this.__srsMode.get();
    }
    set srsMode(newValue: string) {
        this.__srsMode.set(newValue);
    }
    private __srsDeck: ObservedPropertyObjectPU<FlashCard[]>;
    get srsDeck() {
        return this.__srsDeck.get();
    }
    set srsDeck(newValue: FlashCard[]) {
        this.__srsDeck.set(newValue);
    }
    private __newCardFront: ObservedPropertySimplePU<string>;
    get newCardFront() {
        return this.__newCardFront.get();
    }
    set newCardFront(newValue: string) {
        this.__newCardFront.set(newValue);
    }
    private __newCardBack: ObservedPropertySimplePU<string>;
    get newCardBack() {
        return this.__newCardBack.get();
    }
    set newCardBack(newValue: string) {
        this.__newCardBack.set(newValue);
    }
    // Error log state
    private __errors: ObservedPropertyObjectPU<ErrorItem[]>;
    get errors() {
        return this.__errors.get();
    }
    set errors(newValue: ErrorItem[]) {
        this.__errors.set(newValue);
    }
    private __errQuestion: ObservedPropertySimplePU<string>;
    get errQuestion() {
        return this.__errQuestion.get();
    }
    set errQuestion(newValue: string) {
        this.__errQuestion.set(newValue);
    }
    private __errWrong: ObservedPropertySimplePU<string>;
    get errWrong() {
        return this.__errWrong.get();
    }
    set errWrong(newValue: string) {
        this.__errWrong.set(newValue);
    }
    private __errCorrect: ObservedPropertySimplePU<string>;
    get errCorrect() {
        return this.__errCorrect.get();
    }
    set errCorrect(newValue: string) {
        this.__errCorrect.set(newValue);
    }
    private __errorCounter: ObservedPropertySimplePU<number>;
    get errorCounter() {
        return this.__errorCounter.get();
    }
    set errorCounter(newValue: number) {
        this.__errorCounter.set(newValue);
    }
    // Resources state
    private __resources: ObservedPropertyObjectPU<Resource[]>;
    get resources() {
        return this.__resources.get();
    }
    set resources(newValue: Resource[]) {
        this.__resources.set(newValue);
    }
    private __resFilter: ObservedPropertySimplePU<string>;
    get resFilter() {
        return this.__resFilter.get();
    }
    set resFilter(newValue: string) {
        this.__resFilter.set(newValue);
    }
    private __customResources: ObservedPropertyObjectPU<Resource[]>;
    get customResources() {
        return this.__customResources.get();
    }
    set customResources(newValue: Resource[]) {
        this.__customResources.set(newValue);
    }
    // AI state
    private __aiSessions: ObservedPropertyObjectPU<AISession[]>;
    get aiSessions() {
        return this.__aiSessions.get();
    }
    set aiSessions(newValue: AISession[]) {
        this.__aiSessions.set(newValue);
    }
    private __currentAISessionId: ObservedPropertySimplePU<string>;
    get currentAISessionId() {
        return this.__currentAISessionId.get();
    }
    set currentAISessionId(newValue: string) {
        this.__currentAISessionId.set(newValue);
    }
    private __aiInput: ObservedPropertySimplePU<string>;
    get aiInput() {
        return this.__aiInput.get();
    }
    set aiInput(newValue: string) {
        this.__aiInput.set(newValue);
    }
    private __aiMessages: ObservedPropertyObjectPU<AIMessage[]>;
    get aiMessages() {
        return this.__aiMessages.get();
    }
    set aiMessages(newValue: AIMessage[]) {
        this.__aiMessages.set(newValue);
    }
    private __aiCtx: ObservedPropertySimplePU<string>;
    get aiCtx() {
        return this.__aiCtx.get();
    }
    set aiCtx(newValue: string) {
        this.__aiCtx.set(newValue);
    }
    private __aiIsTyping: ObservedPropertySimplePU<boolean>;
    get aiIsTyping() {
        return this.__aiIsTyping.get();
    }
    set aiIsTyping(newValue: boolean) {
        this.__aiIsTyping.set(newValue);
    }
    private __aiSubTab: ObservedPropertySimplePU<string>;
    get aiSubTab() {
        return this.__aiSubTab.get();
    }
    set aiSubTab(newValue: string) {
        this.__aiSubTab.set(newValue);
    }
    // Pomodoro state
    private __pomoRunning: ObservedPropertySimplePU<boolean>;
    get pomoRunning() {
        return this.__pomoRunning.get();
    }
    set pomoRunning(newValue: boolean) {
        this.__pomoRunning.set(newValue);
    }
    private __pomoMode: ObservedPropertySimplePU<string>;
    get pomoMode() {
        return this.__pomoMode.get();
    }
    set pomoMode(newValue: string) {
        this.__pomoMode.set(newValue);
    }
    private __pomoRemaining: ObservedPropertySimplePU<number>;
    get pomoRemaining() {
        return this.__pomoRemaining.get();
    }
    set pomoRemaining(newValue: number) {
        this.__pomoRemaining.set(newValue);
    }
    private __pomoTotal: ObservedPropertySimplePU<number>;
    get pomoTotal() {
        return this.__pomoTotal.get();
    }
    set pomoTotal(newValue: number) {
        this.__pomoTotal.set(newValue);
    }
    private __pomoSessions: ObservedPropertySimplePU<number>;
    get pomoSessions() {
        return this.__pomoSessions.get();
    }
    set pomoSessions(newValue: number) {
        this.__pomoSessions.set(newValue);
    }
    private __pomoDurations: ObservedPropertyObjectPU<PomoDurations>;
    get pomoDurations() {
        return this.__pomoDurations.get();
    }
    set pomoDurations(newValue: PomoDurations) {
        this.__pomoDurations.set(newValue);
    }
    private __pomoStats: ObservedPropertyObjectPU<Record<string, number>>;
    get pomoStats() {
        return this.__pomoStats.get();
    }
    set pomoStats(newValue: Record<string, number>) {
        this.__pomoStats.set(newValue);
    }
    private __pomoTimerId: ObservedPropertySimplePU<number>;
    get pomoTimerId() {
        return this.__pomoTimerId.get();
    }
    set pomoTimerId(newValue: number) {
        this.__pomoTimerId.set(newValue);
    }
    private __showPomoSettings: ObservedPropertySimplePU<boolean>;
    get showPomoSettings() {
        return this.__showPomoSettings.get();
    }
    set showPomoSettings(newValue: boolean) {
        this.__showPomoSettings.set(newValue);
    }
    private __tempFocusDuration: ObservedPropertySimplePU<number>;
    get tempFocusDuration() {
        return this.__tempFocusDuration.get();
    }
    set tempFocusDuration(newValue: number) {
        this.__tempFocusDuration.set(newValue);
    }
    private __tempShortDuration: ObservedPropertySimplePU<number>;
    get tempShortDuration() {
        return this.__tempShortDuration.get();
    }
    set tempShortDuration(newValue: number) {
        this.__tempShortDuration.set(newValue);
    }
    private __tempLongDuration: ObservedPropertySimplePU<number>;
    get tempLongDuration() {
        return this.__tempLongDuration.get();
    }
    set tempLongDuration(newValue: number) {
        this.__tempLongDuration.set(newValue);
    }
    aboutToAppear() {
        try {
            const params = router.getParams() as Record<string, string>;
            if (params && params['subjectId']) {
                this.subjectId = params['subjectId'];
                this.loadData();
            }
        }
        catch (e) {
            console.error('Router params error:', e);
        }
        this.isDarkMode = StorageService.loadString('theme', 'light') === 'dark';
    }
    loadData() {
        const subjects: Subject[] = StorageService.load('subjects', []) as Subject[];
        this.subject = subjects.find(s => s.id === this.subjectId) || null;
        this.loadTasks();
        this.loadNotes();
        this.loadCards();
        this.loadErrors();
        this.loadResources();
        this.loadAISessions();
        this.loadPomoStats();
        const defaultDurations: PomoDurations = { focus: 25, short: 5, long: 15 };
        const savedDurations = StorageService.load('pomo_durations', defaultDurations) as PomoDurations;
        if (savedDurations && savedDurations.focus !== undefined) {
            this.pomoDurations = savedDurations;
            this.pomoRemaining = this.getPomoDuration(this.pomoMode) * 60;
            this.pomoTotal = this.pomoRemaining;
        }
    }
    loadTasks() { this.tasks = StorageService.load(`tasks_${this.subjectId}`, []) as Task[]; }
    saveTasks() { StorageService.save(`tasks_${this.subjectId}`, this.tasks); }
    loadNotes() { this.notes = StorageService.load(`notes_${this.subjectId}`, []) as Note[]; }
    saveNotes() { StorageService.save(`notes_${this.subjectId}`, this.notes); }
    loadCards() {
        this.cards = StorageService.load(`cards_${this.subjectId}`, []) as FlashCard[];
        this.updateSRDeck();
    }
    saveCards() { StorageService.save(`cards_${this.subjectId}`, this.cards); }
    updateSRDeck() {
        if (this.srsMode === 'due')
            this.srsDeck = this.cards.filter(c => SRSService.isDue(c));
        else if (this.srsMode === 'new')
            this.srsDeck = this.cards.filter(c => !c.dueDate);
        else
            this.srsDeck = [...this.cards];
        if (this.fcIndex >= this.srsDeck.length)
            this.fcIndex = 0;
    }
    loadErrors() { this.errors = StorageService.load(`errors_${this.subjectId}`, []) as ErrorItem[]; }
    saveErrors() { StorageService.save(`errors_${this.subjectId}`, this.errors); }
    loadResources() {
        this.customResources = StorageService.load(`custom_resources_${this.subjectId}`, []) as Resource[];
        this.filterResources();
    }
    filterResources() {
        const custom = this.customResources;
        let items: Resource[] = [];
        if (this.resFilter === 'custom')
            items = custom;
        else if (this.resFilter === 'all') {
            items = [...Constants.BUILTIN_RESOURCES.map(r => new Resource(r.name, r.name, r.school, r.url, r.desc, r.cat, r.lang)), ...custom];
        }
        else {
            items = Constants.BUILTIN_RESOURCES.filter(r => r.cat === this.resFilter).map(r => new Resource(r.name, r.name, r.school, r.url, r.desc, r.cat, r.lang));
        }
        this.resources = items;
    }
    loadAISessions() { this.aiSessions = StorageService.load('ai_sessions', []) as AISession[]; }
    saveAISessions() { StorageService.save('ai_sessions', this.aiSessions); }
    loadPomoStats() {
        const emptyStats: Record<string, number> = {};
        this.pomoStats = StorageService.load(`pomo_stats_${this.subjectId}`, emptyStats) as Record<string, number>;
    }
    savePomoStats() { StorageService.save(`pomo_stats_${this.subjectId}`, this.pomoStats); }
    getBgColor(): ResourceColor { return this.isDarkMode ? '#0a0a0a' : '#F8FAFC'; }
    getInkColor(): ResourceColor { return this.isDarkMode ? '#f0f0ee' : '#0e0e0e'; }
    getInkMidColor(): ResourceColor { return this.isDarkMode ? '#9a9a96' : '#3a3a3a'; }
    getInkDimColor(): ResourceColor { return this.isDarkMode ? '#505050' : '#888'; }
    getBorderColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(20,20,20,0.08)'; }
    getBorderHiColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.17)' : 'rgba(20,20,20,0.18)'; }
    getKleinColor(): ResourceColor { return this.isDarkMode ? '#1055cc' : '#0047ab'; }
    getBg2Color(): ResourceColor { return this.isDarkMode ? '#111' : '#EEF2F7'; }
    getRedColor(): ResourceColor { return '#b03030'; }
    getGreenColor(): ResourceColor { return '#3a7a3a'; }
    getAmberColor(): ResourceColor { return '#8a6a00'; }
    // Check if color is light (for contrast text)
    isColorLight(color: string): boolean {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128;
    }
    // Get contrast text color for pomo background
    getPomoTextColor(): string {
        const bgColor = this.subject?.color || '#0047ab';
        return this.isColorLight(bgColor) ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
    }
    getPomoTextColorStrong(): string {
        const bgColor = this.subject?.color || '#0047ab';
        return this.isColorLight(bgColor) ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)';
    }
    getDaysUntil(): number | null {
        if (!this.subject)
            return null;
        return DateUtil.daysUntil(this.subject.examDate);
    }
    getDaysUntilStr(): string {
        const d = this.getDaysUntil();
        if (d === null)
            return '—';
        if (d < 0)
            return 'Past';
        if (d === 0)
            return 'Today!';
        return `${d} days`;
    }
    // ── TASKS ──
    addTask() {
        if (!this.newTaskText.trim())
            return;
        const task = new Task(UIDUtil.uid(), this.newTaskText.trim(), this.newTaskPriority, this.newTaskDate || null, 'later', DateUtil.today());
        this.tasks.push(task);
        this.saveTasks();
        this.newTaskText = '';
        this.newTaskDate = '';
    }
    toggleTask(id: string) {
        const t = this.tasks.find(x => x.id === id);
        if (t) {
            t.done = !t.done;
            this.saveTasks();
        }
    }
    deleteTask(id: string) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
    }
    getTaskGroups(): TaskGroups {
        const groups: TaskGroups = { today: [], tomorrow: [], later: [], done: [] };
        const tomStr = DateUtil.tomorrow();
        this.tasks.forEach(t => {
            if (t.done) {
                groups.done.push(t);
                return;
            }
            if (!t.due)
                groups.later.push(t);
            else if (t.due <= DateUtil.today())
                groups.today.push(t);
            else if (t.due === tomStr)
                groups.tomorrow.push(t);
            else
                groups.later.push(t);
        });
        return groups;
    }
    // ── NOTES ──
    addNote() {
        const note = new Note(UIDUtil.noteId(), 'Untitled Note', '', 'rich', DateUtil.today());
        this.notes.unshift(note);
        this.saveNotes();
        this.openNote(note.id);
    }
    openNote(id: string) {
        this.currentNoteId = id;
        const n = this.notes.find(x => x.id === id);
        if (!n)
            return;
        this.noteMode = n.mode || 'rich';
        this.noteContent = n.content || '';
        this.mdInput = n.content || '';
        this.plainInput = n.content || '';
    }
    setNoteMode(mode: string) {
        this.saveCurrentNote();
        this.noteMode = mode;
        const n = this.notes.find(x => x.id === this.currentNoteId);
        if (n) {
            n.mode = mode;
            this.saveNotes();
        }
    }
    saveCurrentNote() {
        if (!this.currentNoteId)
            return;
        const n = this.notes.find(x => x.id === this.currentNoteId);
        if (!n)
            return;
        if (this.noteMode === 'rich')
            n.content = this.noteContent;
        else if (this.noteMode === 'md')
            n.content = this.mdInput;
        else
            n.content = this.plainInput;
        n.title = MarkdownService.extractTitle(n.content, this.noteMode);
        n.updatedAt = DateUtil.today();
        this.saveNotes();
    }
    deleteCurrentNote() {
        if (!this.currentNoteId)
            return;
        this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
        this.saveNotes();
        this.currentNoteId = '';
    }
    // ── FLASHCARDS ──
    addCard() {
        if (!this.newCardFront.trim() || !this.newCardBack.trim())
            return;
        const card = new FlashCard(UIDUtil.cardId(), this.newCardFront.trim(), this.newCardBack.trim(), DateUtil.today());
        this.cards.push(card);
        this.saveCards();
        this.updateSRDeck();
        this.newCardFront = '';
        this.newCardBack = '';
    }
    flipCard(): void { this.fcFlipped = !this.fcFlipped; }
    nextCard() { if (!this.srsDeck.length)
        return; this.fcIndex = (this.fcIndex + 1) % this.srsDeck.length; this.fcFlipped = false; }
    prevCard() { if (!this.srsDeck.length)
        return; this.fcIndex = (this.fcIndex - 1 + this.srsDeck.length) % this.srsDeck.length; this.fcFlipped = false; }
    rateCard(quality: number) {
        if (!this.srsDeck.length)
            return;
        const card = this.srsDeck[this.fcIndex];
        if (!card)
            return;
        const updated = SRSService.sm2Update(card, quality);
        this.cards = this.cards.map(c => c.id === card.id ? updated : c);
        this.saveCards();
        this.fcFlipped = false;
        this.updateSRDeck();
    }
    deleteCard(id: string) {
        this.cards = this.cards.filter(c => c.id !== id);
        this.saveCards();
        this.updateSRDeck();
    }
    shuffleCards() {
        let i = this.cards.length - 1;
        while (i > 0) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
            i--;
        }
        this.saveCards();
        this.fcIndex = 0;
        this.fcFlipped = false;
    }
    // ── ERROR LOG ──
    addError() {
        if (!this.errQuestion.trim())
            return;
        this.errorCounter = StorageService.loadNumber('errorCounter', 0) + 1;
        StorageService.save('errorCounter', this.errorCounter);
        const error = new ErrorItem(UIDUtil.errorId(this.errorCounter), this.errQuestion.trim(), this.errWrong.trim(), this.errCorrect.trim(), DateUtil.today());
        this.errors.unshift(error);
        this.saveErrors();
        this.errQuestion = '';
        this.errWrong = '';
        this.errCorrect = '';
    }
    toggleErrorReveal(id: string) {
        const e = this.errors.find(x => x.id === id);
        if (e) {
            e.revealed = !e.revealed;
            this.saveErrors();
        }
    }
    deleteError(id: string) {
        this.errors = this.errors.filter(e => e.id !== id);
        this.saveErrors();
    }
    errorToCard(id: string) {
        const e = this.errors.find(x => x.id === id);
        if (!e || e.cardified)
            return;
        const back = `【正确解法】${e.correct || '—'}${e.wrong ? '\n【常见错误】' + e.wrong : ''}`;
        const card = new FlashCard(UIDUtil.cardId(), e.question, back, DateUtil.today());
        card.dueDate = DateUtil.today();
        this.cards.push(card);
        this.saveCards();
        e.cardified = true;
        this.saveErrors();
    }
    // ── RESOURCES ──
    addCustomResource(name: string, url: string, school: string, desc: string, cat: string) {
        if (!name || !url)
            return;
        const res = new Resource(UIDUtil.uid(), name, school || 'Custom', url, desc, cat, '—');
        res.custom = true;
        this.customResources.push(res);
        StorageService.save(`custom_resources_${this.subjectId}`, this.customResources);
        this.filterResources();
    }
    // ── AI ──
    newAISession() {
        const session = new AISession(UIDUtil.uid(), '新对话', 'general', [], DateUtil.today());
        this.aiSessions.unshift(session);
        this.saveAISessions();
        this.currentAISessionId = session.id;
        this.aiMessages = [];
    }
    openAISession(id: string) {
        this.currentAISessionId = id;
        const s = this.aiSessions.find(x => x.id === id);
        if (s) {
            this.aiCtx = s.ctx || 'general';
            this.aiMessages = s.messages;
        }
    }
    deleteAISession(id: string) {
        this.aiSessions = this.aiSessions.filter(s => s.id !== id);
        this.saveAISessions();
        if (this.currentAISessionId === id) {
            this.currentAISessionId = '';
            this.aiMessages = [];
        }
    }
    setAICtx(ctx: string) {
        this.aiCtx = ctx;
        if (this.currentAISessionId) {
            const s = this.aiSessions.find(x => x.id === this.currentAISessionId);
            if (s) {
                s.ctx = ctx;
                this.saveAISessions();
            }
        }
    }
    sendAIMsg() {
        const text = this.aiInput.trim();
        if (!text || this.aiIsTyping)
            return;
        if (!this.currentAISessionId)
            this.newAISession();
        const session = this.aiSessions.find(s => s.id === this.currentAISessionId);
        if (!session)
            return;
        const now = new Date();
        const h = now.getHours();
        const min = now.getMinutes();
        const nowStr = `${h < 10 ? '0' + h : '' + h}:${min < 10 ? '0' + min : '' + min}`;
        session.messages.push(new AIMessage('user', text, nowStr));
        if (!session.title || session.title === '新对话')
            session.title = text.slice(0, 22) + (text.length > 22 ? '…' : '');
        this.aiInput = '';
        this.saveAISessions();
        this.aiMessages = session.messages;
        this.aiIsTyping = true;
        // Simulate streaming response
        setTimeout(() => {
            const reply = '这是 AI 的模拟回复。在实际实现中，这里将调用 AI 服务进行流式响应。';
            session.messages.push(new AIMessage('assistant', reply, nowStr));
            this.saveAISessions();
            this.aiMessages = session.messages;
            this.aiIsTyping = false;
        }, 1500);
    }
    // ── POMODORO ──
    togglePomo() {
        if (this.pomoRunning) {
            this.pomoRunning = false;
            if (this.pomoTimerId !== -1)
                clearInterval(this.pomoTimerId);
        }
        else {
            this.pomoRunning = true;
            this.pomoTimerId = setInterval(() => {
                if (this.pomoRemaining > 0) {
                    this.pomoRemaining--;
                }
                else {
                    this.onPomoEnd();
                }
            }, 1000);
        }
    }
    onPomoEnd() {
        this.pomoRunning = false;
        if (this.pomoTimerId !== -1)
            clearInterval(this.pomoTimerId);
        if (this.pomoMode === 'focus') {
            this.pomoSessions++;
            this.pomoStats[DateUtil.today()] = (this.pomoStats[DateUtil.today()] || 0) + 1;
            this.savePomoStats();
        }
    }
    getPomoDuration(mode: string): number {
        if (mode === 'focus')
            return this.pomoDurations.focus;
        if (mode === 'short')
            return this.pomoDurations.short;
        if (mode === 'long')
            return this.pomoDurations.long;
        return this.pomoDurations.focus;
    }
    resetPomo() {
        this.pomoRunning = false;
        if (this.pomoTimerId !== -1)
            clearInterval(this.pomoTimerId);
        this.pomoRemaining = this.getPomoDuration(this.pomoMode) * 60;
        this.pomoTotal = this.pomoRemaining;
    }
    setPomoMode(mode: string) {
        this.pomoMode = mode;
        this.pomoRunning = false;
        if (this.pomoTimerId !== -1)
            clearInterval(this.pomoTimerId);
        this.pomoRemaining = this.getPomoDuration(mode) * 60;
        this.pomoTotal = this.pomoRemaining;
    }
    saveCustomDurations(focus: number, short: number, long: number): void {
        const dur: PomoDurations = {
            focus: Math.max(1, Math.min(120, focus)),
            short: Math.max(1, Math.min(60, short)),
            long: Math.max(1, Math.min(120, long))
        };
        this.pomoDurations = dur;
        StorageService.save('pomo_durations', dur);
        this.resetPomo();
    }
    // ── EDIT SUBJECT ──
    confirmEditSubject(name: string, date: string, score: string, knowledge: string) {
        if (!this.subject)
            return;
        this.subject.name = name.trim() || this.subject.name;
        this.subject.examDate = date;
        this.subject.targetScore = score.trim();
        this.subject.knowledgePoints = knowledge.trim();
        const subjects: Subject[] = StorageService.load('subjects', []) as Subject[];
        const idx = subjects.findIndex(s => s.id === this.subjectId);
        if (idx >= 0) {
            subjects[idx] = this.subject;
            StorageService.save('subjects', subjects);
        }
        this.showEditDialog = false;
    }
    // ── TASKS TAB ──
    TasksTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(24);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Tasks · 任务');
            Text.fontSize(10);
            Text.fontColor(this.getInkDimColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Add task row
            Row.create();
            // Add task row
            Row.width('100%');
            // Add task row
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.newTaskText, placeholder: 'New task…' });
            TextInput.layoutWeight(1);
            TextInput.fontSize(12);
            TextInput.fontColor(this.getInkColor());
            TextInput.backgroundColor(Color.Transparent);
            TextInput.border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.newTaskDate, placeholder: 'YYYY-MM-DD' });
            TextInput.width(120);
            TextInput.fontSize(12);
            TextInput.fontColor(this.getInkColor());
            TextInput.backgroundColor(Color.Transparent);
            TextInput.border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() });
            TextInput.margin({ left: 8 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create([{ value: 'normal' }, { value: 'critical' }, { value: 'easy' }]);
            Select.selected(this.newTaskPriority === 'normal' ? 0 : this.newTaskPriority === 'critical' ? 1 : 2);
            Select.onSelect((index: number) => {
                this.newTaskPriority = ['normal', 'critical', 'easy'][index];
            });
            Select.margin({ left: 8 });
            Select.width(100);
        }, Select);
        Select.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Add →');
            Button.fontSize(9);
            Button.fontColor('#fff');
            Button.backgroundColor(this.getInkColor());
            Button.padding({ left: 12, right: 12, top: 6, bottom: 6 });
            Button.margin({ left: 8 });
            Button.onClick(() => this.addTask());
        }, Button);
        Button.pop();
        // Add task row
        Row.pop();
        // Task groups
        this.TaskGroup.bind(this)('Today', '01', this.getTaskGroups().today);
        this.TaskGroup.bind(this)('Tomorrow', '02', this.getTaskGroups().tomorrow);
        this.TaskGroup.bind(this)('Later', '03', this.getTaskGroups().later);
        this.TaskGroup.bind(this)('Done', '04', this.getTaskGroups().done);
        Column.pop();
        Scroll.pop();
    }
    TaskGroup(label: string, id: string, items: Task[], parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (items.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`§${id}`);
                        Text.fontSize(9);
                        Text.fontColor(this.getInkMidColor());
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.color(this.getBorderColor());
                        Divider.layoutWeight(1);
                        Divider.margin({ left: 8, right: 8 });
                        Divider.strokeWidth(0.5);
                    }, Divider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(label);
                        Text.fontSize(9);
                        Text.fontColor(this.getInkColor());
                        Text.fontWeight(FontWeight.Medium);
                        Text.letterSpacing(2);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.color(this.getBorderColor());
                        Divider.layoutWeight(1);
                        Divider.margin({ left: 8, right: 8 });
                        Divider.strokeWidth(0.5);
                    }, Divider);
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const t = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.padding({ top: 8, bottom: 8 });
                                Row.border({ width: { bottom: 0.5 }, color: this.getBorderColor() });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(t.done ? '✓' : '');
                                Text.width(20);
                                Text.height(20);
                                Text.fontSize(10);
                                Text.fontColor(t.done ? '#fff' : this.getInkColor());
                                Text.backgroundColor(t.done ? this.getInkColor() : Color.Transparent);
                                Text.border({ width: 0.5, color: this.getBorderHiColor() });
                                Text.textAlign(TextAlign.Center);
                                Text.onClick(() => this.toggleTask(t.id));
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(t.text);
                                Text.fontSize(13);
                                Text.fontColor(t.done ? this.getInkDimColor() : this.getInkColor());
                                Text.decoration({ type: t.done ? TextDecorationType.LineThrough : TextDecorationType.None });
                                Text.layoutWeight(1);
                                Text.margin({ left: 8 });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (t.due) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(DateUtil.fmtDate(t.due));
                                            Text.fontSize(9);
                                            Text.fontColor(DateUtil.isOverdue(t.due) && !t.done ? this.getRedColor() : this.getInkMidColor());
                                            Text.margin({ right: 8 });
                                        }, Text);
                                        Text.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(t.priority);
                                Text.fontSize(8);
                                Text.fontColor(t.priority === 'critical' ? this.getKleinColor() :
                                    t.priority === 'easy' ? '#5a8a5a' : this.getInkDimColor());
                                Text.border({ width: 0.5, color: t.priority === 'critical' ? this.getKleinColor() : this.getInkDimColor() });
                                Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                Text.margin({ right: 8 });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('×');
                                Text.fontSize(14);
                                Text.fontColor(this.getInkDimColor());
                                Text.onClick(() => this.deleteTask(t.id));
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, items, forEachItemGenFunction, (t: Task) => t.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    // ── POMODORO TAB ──
    PomodoroTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollBar(BarState.Off);
            Scroll.backgroundColor(this.subject?.color || '#0047ab');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(24);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Timer strip
            Column.create();
            // Timer strip
            Column.width('100%');
            // Timer strip
            Column.padding({ top: 60, bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Main time display
            Text.create(this.pomoDisplay);
            // Main time display
            Text.fontSize(72);
            // Main time display
            Text.fontWeight(FontWeight.Lighter);
            // Main time display
            Text.fontColor(this.getPomoTextColorStrong());
            // Main time display
            Text.letterSpacing(-2);
            // Main time display
            Text.margin({ bottom: 8 });
        }, Text);
        // Main time display
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Mode label
            Text.create(this.pomoMode === 'focus' ? 'FOCUS · 专注' : this.pomoMode === 'short' ? 'SHORT BREAK · 短休息' : 'LONG BREAK · 长休息');
            // Mode label
            Text.fontSize(10);
            // Mode label
            Text.fontColor(this.getPomoTextColorStrong());
            // Mode label
            Text.letterSpacing(3);
            // Mode label
            Text.margin({ bottom: 20 });
        }, Text);
        // Mode label
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Session indicators
            Row.create();
            // Session indicators
            Row.margin({ bottom: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(10);
            Text.height(10);
            Text.borderRadius(5);
            Text.backgroundColor(this.pomoSessions % 4 >= 1 ? this.getPomoTextColorStrong() : 'rgba(128,128,128,0.4)');
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(10);
            Text.height(10);
            Text.borderRadius(5);
            Text.backgroundColor(this.pomoSessions % 4 >= 2 ? this.getPomoTextColorStrong() : 'rgba(128,128,128,0.4)');
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(10);
            Text.height(10);
            Text.borderRadius(5);
            Text.backgroundColor(this.pomoSessions % 4 >= 3 ? this.getPomoTextColorStrong() : 'rgba(128,128,128,0.4)');
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(10);
            Text.height(10);
            Text.borderRadius(5);
            Text.backgroundColor(this.pomoSessions % 4 >= 0 && this.pomoSessions > 0 ? this.getPomoTextColorStrong() : 'rgba(128,128,128,0.4)');
        }, Text);
        Text.pop();
        // Session indicators
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Control buttons
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('↺');
            Button.fontSize(18);
            Button.width(52);
            Button.height(52);
            Button.fontColor(this.getPomoTextColorStrong());
            Button.backgroundColor('rgba(128,128,128,0.25)');
            Button.borderRadius(26);
            Button.onClick(() => this.resetPomo());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.pomoRunning ? '⏸' : '▶');
            Button.fontSize(24);
            Button.width(72);
            Button.height(72);
            Button.fontColor(this.getPomoTextColorStrong());
            Button.backgroundColor('rgba(128,128,128,0.35)');
            Button.borderRadius(36);
            Button.margin({ left: 20, right: 20 });
            Button.onClick(() => this.togglePomo());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('⏭');
            Button.fontSize(18);
            Button.width(52);
            Button.height(52);
            Button.fontColor(this.getPomoTextColorStrong());
            Button.backgroundColor('rgba(128,128,128,0.25)');
            Button.borderRadius(26);
            Button.onClick(() => {
                if (this.pomoMode === 'focus') {
                    this.setPomoMode(this.pomoSessions % 4 === 3 ? 'long' : 'short');
                }
                else {
                    this.setPomoMode('focus');
                }
            });
        }, Button);
        Button.pop();
        // Control buttons
        Row.pop();
        // Timer strip
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Progress bar
            Row.create();
            // Progress bar
            Row.width('100%');
            // Progress bar
            Row.height(4);
            // Progress bar
            Row.backgroundColor(this.getBorderColor());
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(`${(1 - this.pomoProgress) * 100}%`);
            Text.height('100%');
            Text.backgroundColor('rgba(255,255,255,0.4)');
        }, Text);
        Text.pop();
        // Progress bar
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Mode pills
            Row.create();
            // Mode pills
            Row.width('100%');
            // Mode pills
            Row.border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('专注 · Focus');
            Button.fontSize(9);
            Button.fontColor(this.pomoMode === 'focus' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: { bottom: this.pomoMode === 'focus' ? 1.5 : 0 }, color: this.getKleinColor() });
            Button.layoutWeight(1);
            Button.onClick(() => this.setPomoMode('focus'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('短休息 · Short');
            Button.fontSize(9);
            Button.fontColor(this.pomoMode === 'short' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: { bottom: this.pomoMode === 'short' ? 1.5 : 0 }, color: this.getKleinColor() });
            Button.layoutWeight(1);
            Button.onClick(() => this.setPomoMode('short'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('长休息 · Long');
            Button.fontSize(9);
            Button.fontColor(this.pomoMode === 'long' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: { bottom: this.pomoMode === 'long' ? 1.5 : 0 }, color: this.getKleinColor() });
            Button.layoutWeight(1);
            Button.onClick(() => this.setPomoMode('long'));
        }, Button);
        Button.pop();
        // Mode pills
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Stats grid
            Grid.create();
            // Stats grid
            Grid.width('100%');
        }, Grid);
        {
            const itemCreation2 = (elmtId, isInitialRender) => {
                GridItem.create(() => { }, false);
            };
            const observedDeepRender = () => {
                this.observeComponentCreation2(itemCreation2, GridItem);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.padding(14);
                    Column.backgroundColor(this.getBgColor());
                    Column.width('100%');
                    Column.height('100%');
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('Today');
                    Text.fontSize(8);
                    Text.fontColor(this.getInkDimColor());
                    Text.letterSpacing(1);
                    Text.margin({ bottom: 6 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${this.pomoTodaySessions}`);
                    Text.fontSize(32);
                    Text.fontWeight(FontWeight.Lighter);
                    Text.fontColor(this.getKleinColor());
                    Text.letterSpacing(-2);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('sessions');
                    Text.fontSize(8);
                    Text.fontColor(this.getInkDimColor());
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.height(1);
                    Row.backgroundColor(this.getBorderHiColor());
                    Row.margin({ top: 8 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('');
                    Text.width(`${Math.min(this.pomoTodaySessions * 25, 100)}%`);
                    Text.height('100%');
                    Text.backgroundColor(this.getKleinColor());
                }, Text);
                Text.pop();
                Row.pop();
                Column.pop();
                GridItem.pop();
            };
            observedDeepRender();
        }
        {
            const itemCreation2 = (elmtId, isInitialRender) => {
                GridItem.create(() => { }, false);
            };
            const observedDeepRender = () => {
                this.observeComponentCreation2(itemCreation2, GridItem);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.padding(14);
                    Column.backgroundColor(this.getBgColor());
                    Column.width('100%');
                    Column.height('100%');
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('Streak');
                    Text.fontSize(8);
                    Text.fontColor(this.getInkDimColor());
                    Text.letterSpacing(1);
                    Text.margin({ bottom: 6 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${this.pomoStreak}`);
                    Text.fontSize(32);
                    Text.fontWeight(FontWeight.Lighter);
                    Text.fontColor(this.getInkColor());
                    Text.letterSpacing(-2);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('days');
                    Text.fontSize(8);
                    Text.fontColor(this.getInkDimColor());
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.height(1);
                    Row.backgroundColor(this.getBorderHiColor());
                    Row.margin({ top: 8 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('');
                    Text.width(`${Math.min(this.pomoStreak / 30 * 100, 100)}%`);
                    Text.height('100%');
                    Text.backgroundColor(this.getInkColor());
                }, Text);
                Text.pop();
                Row.pop();
                Column.pop();
                GridItem.pop();
            };
            observedDeepRender();
        }
        {
            const itemCreation2 = (elmtId, isInitialRender) => {
                GridItem.create(() => { }, false);
            };
            const observedDeepRender = () => {
                this.observeComponentCreation2(itemCreation2, GridItem);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.padding(14);
                    Column.backgroundColor(this.getBgColor());
                    Column.width('100%');
                    Column.height('100%');
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('Week Avg');
                    Text.fontSize(8);
                    Text.fontColor(this.getInkDimColor());
                    Text.letterSpacing(1);
                    Text.margin({ bottom: 6 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${this.pomoWeekAvg}`);
                    Text.fontSize(32);
                    Text.fontWeight(FontWeight.Lighter);
                    Text.fontColor(this.getInkColor());
                    Text.letterSpacing(-2);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('min/day');
                    Text.fontSize(8);
                    Text.fontColor(this.getInkDimColor());
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.height(1);
                    Row.backgroundColor(this.getBorderHiColor());
                    Row.margin({ top: 8 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('');
                    Text.width(`${Math.min(this.pomoWeekAvg / 120 * 100, 100)}%`);
                    Text.height('100%');
                    Text.backgroundColor(this.getInkColor());
                }, Text);
                Text.pop();
                Row.pop();
                Column.pop();
                GridItem.pop();
            };
            observedDeepRender();
        }
        {
            const itemCreation2 = (elmtId, isInitialRender) => {
                GridItem.create(() => { }, false);
            };
            const observedDeepRender = () => {
                this.observeComponentCreation2(itemCreation2, GridItem);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.padding(14);
                    Column.backgroundColor(this.getBgColor());
                    Column.width('100%');
                    Column.height('100%');
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('Total');
                    Text.fontSize(8);
                    Text.fontColor(this.getInkDimColor());
                    Text.letterSpacing(1);
                    Text.margin({ bottom: 6 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${this.pomoTotalSessions}`);
                    Text.fontSize(32);
                    Text.fontWeight(FontWeight.Lighter);
                    Text.fontColor(this.getInkColor());
                    Text.letterSpacing(-2);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('sessions');
                    Text.fontSize(8);
                    Text.fontColor(this.getInkDimColor());
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.height(1);
                    Row.backgroundColor(this.getBorderHiColor());
                    Row.margin({ top: 8 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('');
                    Text.width(`${Math.min(this.pomoTotalSessions / 50 * 100, 100)}%`);
                    Text.height('100%');
                    Text.backgroundColor(this.getInkColor());
                }, Text);
                Text.pop();
                Row.pop();
                Column.pop();
                GridItem.pop();
            };
            observedDeepRender();
        }
        // Stats grid
        Grid.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Settings button
            Button.createWithLabel('⚙ 时间设置 · Time Settings');
            // Settings button
            Button.fontSize(10);
            // Settings button
            Button.fontColor(this.getInkDimColor());
            // Settings button
            Button.backgroundColor(Color.Transparent);
            // Settings button
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            // Settings button
            Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            // Settings button
            Button.margin({ top: 16 });
            // Settings button
            Button.onClick(() => {
                this.tempFocusDuration = this.pomoDurations.focus;
                this.tempShortDuration = this.pomoDurations.short;
                this.tempLongDuration = this.pomoDurations.long;
                this.showPomoSettings = true;
            });
        }, Button);
        // Settings button
        Button.pop();
        Column.pop();
        Scroll.pop();
    }
    // ── POMODORO SETTINGS DIALOG ──
    PomoSettingsDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0,0,0,0.5)');
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => this.showPomoSettings = false);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('85%');
            Column.padding(24);
            Column.backgroundColor(this.getBgColor());
            Column.border({ width: 0.5, color: this.getBorderHiColor() });
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('时间设置 · Time Settings');
            Text.fontSize(18);
            Text.fontColor(this.getInkColor());
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Focus duration
            Column.create();
            // Focus duration
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('专注时长 · Focus Duration');
            Text.fontSize(12);
            Text.fontColor(this.getInkDimColor());
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('-');
            Button.fontSize(16);
            Button.width(40);
            Button.height(40);
            Button.fontColor(this.getInkColor());
            Button.backgroundColor(this.getBg2Color());
            Button.onClick(() => {
                if (this.tempFocusDuration > 1)
                    this.tempFocusDuration--;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.tempFocusDuration} 分钟`);
            Text.fontSize(16);
            Text.fontColor(this.getInkColor());
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.fontSize(16);
            Button.width(40);
            Button.height(40);
            Button.fontColor(this.getInkColor());
            Button.backgroundColor(this.getBg2Color());
            Button.onClick(() => {
                if (this.tempFocusDuration < 120)
                    this.tempFocusDuration++;
            });
        }, Button);
        Button.pop();
        Row.pop();
        // Focus duration
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Short break duration
            Column.create();
            // Short break duration
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('短休息时长 · Short Break');
            Text.fontSize(12);
            Text.fontColor(this.getInkDimColor());
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('-');
            Button.fontSize(16);
            Button.width(40);
            Button.height(40);
            Button.fontColor(this.getInkColor());
            Button.backgroundColor(this.getBg2Color());
            Button.onClick(() => {
                if (this.tempShortDuration > 1)
                    this.tempShortDuration--;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.tempShortDuration} 分钟`);
            Text.fontSize(16);
            Text.fontColor(this.getInkColor());
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.fontSize(16);
            Button.width(40);
            Button.height(40);
            Button.fontColor(this.getInkColor());
            Button.backgroundColor(this.getBg2Color());
            Button.onClick(() => {
                if (this.tempShortDuration < 60)
                    this.tempShortDuration++;
            });
        }, Button);
        Button.pop();
        Row.pop();
        // Short break duration
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Long break duration
            Column.create();
            // Long break duration
            Column.margin({ bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('长休息时长 · Long Break');
            Text.fontSize(12);
            Text.fontColor(this.getInkDimColor());
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('-');
            Button.fontSize(16);
            Button.width(40);
            Button.height(40);
            Button.fontColor(this.getInkColor());
            Button.backgroundColor(this.getBg2Color());
            Button.onClick(() => {
                if (this.tempLongDuration > 1)
                    this.tempLongDuration--;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.tempLongDuration} 分钟`);
            Text.fontSize(16);
            Text.fontColor(this.getInkColor());
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.fontSize(16);
            Button.width(40);
            Button.height(40);
            Button.fontColor(this.getInkColor());
            Button.backgroundColor(this.getBg2Color());
            Button.onClick(() => {
                if (this.tempLongDuration < 120)
                    this.tempLongDuration++;
            });
        }, Button);
        Button.pop();
        Row.pop();
        // Long break duration
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Buttons
            Row.create();
            // Buttons
            Row.width('100%');
            // Buttons
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消 · Cancel');
            Button.fontSize(12);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 20, right: 20, top: 10, bottom: 10 });
            Button.onClick(() => this.showPomoSettings = false);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存 · Save');
            Button.fontSize(12);
            Button.fontColor('#fff');
            Button.backgroundColor(this.getKleinColor());
            Button.padding({ left: 20, right: 20, top: 10, bottom: 10 });
            Button.margin({ left: 12 });
            Button.onClick(() => {
                this.saveCustomDurations(this.tempFocusDuration, this.tempShortDuration, this.tempLongDuration);
                this.showPomoSettings = false;
            });
        }, Button);
        Button.pop();
        // Buttons
        Row.pop();
        Column.pop();
        Column.pop();
    }
    // ── NOTES TAB ──
    NotesTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Sidebar
            Column.create();
            // Sidebar
            Column.width(200);
            // Sidebar
            Column.height('100%');
            // Sidebar
            Column.padding(16);
            // Sidebar
            Column.border({ width: { right: 0.5 }, color: this.getBorderHiColor() });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Notes · REC');
            Text.fontSize(9);
            Text.fontColor(this.getInkMidColor());
            Text.letterSpacing(2);
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.notes.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('No notes yet');
                        Text.fontSize(10);
                        Text.fontColor(this.getInkDimColor());
                        Text.padding(8);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const n = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.padding(10);
                                Row.backgroundColor(n.id === this.currentNoteId ? (this.isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,71,171,0.08)') : Color.Transparent);
                                Row.border({ width: { left: n.id === this.currentNoteId ? 2 : 0 }, color: this.getKleinColor() });
                                Row.onClick(() => this.openNote(n.id));
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.alignItems(HorizontalAlign.Start);
                                Column.layoutWeight(1);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(n.title);
                                Text.fontSize(13);
                                Text.fontColor(this.getInkColor());
                                Text.maxLines(1);
                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(n.createdAt);
                                Text.fontSize(9);
                                Text.fontColor(this.getInkMidColor());
                                Text.margin({ top: 2 });
                            }, Text);
                            Text.pop();
                            Column.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.notes, forEachItemGenFunction, (n: Note) => n.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+ New Note');
            Button.fontSize(9);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 10, right: 10, top: 6, bottom: 6 });
            Button.margin({ top: 8 });
            Button.onClick(() => this.addNote());
        }, Button);
        Button.pop();
        // Sidebar
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Editor area
            Column.create();
            // Editor area
            Column.layoutWeight(1);
            // Editor area
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Mode bar
            Row.create();
            // Mode bar
            Row.width('100%');
            // Mode bar
            Row.border({ width: { bottom: 0.5 }, color: this.getBorderColor() });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Rich Text');
            Button.fontSize(9);
            Button.fontColor(this.noteMode === 'rich' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: { bottom: this.noteMode === 'rich' ? 1.5 : 0 }, color: this.getKleinColor() });
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.onClick(() => this.setNoteMode('rich'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Markdown');
            Button.fontSize(9);
            Button.fontColor(this.noteMode === 'md' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: { bottom: this.noteMode === 'md' ? 1.5 : 0 }, color: this.getKleinColor() });
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.onClick(() => this.setNoteMode('md'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Plain Text');
            Button.fontSize(9);
            Button.fontColor(this.noteMode === 'plain' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: { bottom: this.noteMode === 'plain' ? 1.5 : 0 }, color: this.getKleinColor() });
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.onClick(() => this.setNoteMode('plain'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Delete');
            Button.fontSize(9);
            Button.fontColor(this.getRedColor());
            Button.backgroundColor(Color.Transparent);
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.onClick(() => this.deleteCurrentNote());
        }, Button);
        Button.pop();
        // Mode bar
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.noteMode === 'rich') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextArea.create({ text: this.noteContent, placeholder: 'Start writing…' });
                        TextArea.fontSize(14);
                        TextArea.fontColor(this.getInkColor());
                        TextArea.backgroundColor(Color.Transparent);
                        TextArea.layoutWeight(1);
                        TextArea.padding(16);
                        TextArea.onChange((value: string) => {
                            this.noteContent = value;
                            this.saveCurrentNote();
                        });
                    }, TextArea);
                });
            }
            else if (this.noteMode === 'md') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.layoutWeight(1);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextArea.create({ text: this.mdInput, placeholder: 'Write Markdown here…' });
                        TextArea.fontSize(13);
                        TextArea.fontColor(this.getInkColor());
                        TextArea.backgroundColor(Color.Transparent);
                        TextArea.layoutWeight(1);
                        TextArea.padding(16);
                        TextArea.onChange((value: string) => {
                            this.mdInput = value;
                            this.saveCurrentNote();
                        });
                    }, TextArea);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                        Scroll.border({ width: { left: 0.5 }, color: this.getBorderColor() });
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(MarkdownService.parse(this.mdInput));
                        Text.fontSize(14);
                        Text.fontColor(this.getInkColor());
                        Text.padding(16);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    Scroll.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextArea.create({ text: this.plainInput, placeholder: 'Plain text…' });
                        TextArea.fontSize(13);
                        TextArea.fontColor(this.getInkColor());
                        TextArea.backgroundColor(Color.Transparent);
                        TextArea.layoutWeight(1);
                        TextArea.padding(16);
                        TextArea.onChange((value: string) => {
                            this.plainInput = value;
                            this.saveCurrentNote();
                        });
                    }, TextArea);
                });
            }
        }, If);
        If.pop();
        // Editor area
        Column.pop();
        Row.pop();
    }
    // ── FLASH CARDS TAB ──
    FlashCardsTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(24);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Sub-tabs
            Row.create();
            // Sub-tabs
            Row.width('100%');
            // Sub-tabs
            Row.backgroundColor(this.getBorderColor());
            // Sub-tabs
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('知识点 · Concepts');
            Button.fontSize(9);
            Button.fontColor(this.getInkColor());
            Button.backgroundColor(Color.Transparent);
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.layoutWeight(1);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('错题 · Errors');
            Button.fontSize(9);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.layoutWeight(1);
        }, Button);
        Button.pop();
        // Sub-tabs
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // FC controls
            Row.create();
            // FC controls
            Row.width('100%');
            // FC controls
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.cards.length} 张 · 今日待复习 ${this.cards.filter(c => SRSService.isDue(c)).length}`);
            Text.fontSize(9);
            Text.fontColor(this.getInkDimColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Shuffle');
            Button.fontSize(9);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
            Button.margin({ right: 8 });
            Button.onClick(() => this.shuffleCards());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Reset');
            Button.fontSize(9);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
            Button.onClick(() => { this.fcIndex = 0; this.fcFlipped = false; });
        }, Button);
        Button.pop();
        // FC controls
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // SRS mode bar
            Row.create();
            // SRS mode bar
            Row.width('100%');
            // SRS mode bar
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('全部');
            Button.fontSize(9);
            Button.fontColor(this.srsMode === 'all' ? '#fff' : this.getInkDimColor());
            Button.backgroundColor(this.srsMode === 'all' ? this.getInkColor() : Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 10, right: 10, top: 4, bottom: 4 });
            Button.onClick(() => { this.srsMode = 'all'; this.updateSRDeck(); });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('今日待复习');
            Button.fontSize(9);
            Button.fontColor(this.srsMode === 'due' ? '#fff' : this.getInkDimColor());
            Button.backgroundColor(this.srsMode === 'due' ? this.getInkColor() : Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 10, right: 10, top: 4, bottom: 4 });
            Button.margin({ left: 6 });
            Button.onClick(() => { this.srsMode = 'due'; this.updateSRDeck(); });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('新卡片');
            Button.fontSize(9);
            Button.fontColor(this.srsMode === 'new' ? '#fff' : this.getInkDimColor());
            Button.backgroundColor(this.srsMode === 'new' ? this.getInkColor() : Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 10, right: 10, top: 4, bottom: 4 });
            Button.margin({ left: 6 });
            Button.onClick(() => { this.srsMode = 'new'; this.updateSRDeck(); });
        }, Button);
        Button.pop();
        // SRS mode bar
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Flashcard
            Column.create();
            // Flashcard
            Column.width('100%');
            // Flashcard
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.srsDeck.length > 0 && this.currentCard) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(24);
                        Column.constraintSize({ minHeight: 180 });
                        Column.border({ width: 0.5, color: this.getBorderHiColor() });
                        Column.justifyContent(FlexAlign.Center);
                        Column.onClick(() => this.flipCard());
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.fcFlipped ? 'DEFINITION · 解释' : 'CONCEPT · 概念');
                        Text.fontSize(9);
                        Text.fontColor(this.getInkMidColor());
                        Text.letterSpacing(2);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.fcFlipped ? this.currentCard.back : this.currentCard.front);
                        Text.fontSize(18);
                        Text.fontColor(this.getInkColor());
                        Text.textAlign(TextAlign.Center);
                        Text.lineHeight(1.5);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.fcFlipped ? '← Tap to flip back' : 'Tap to flip →');
                        Text.fontSize(9);
                        Text.fontColor(this.getInkDimColor());
                        Text.margin({ top: 12 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // SRS info
                        if (this.currentCard) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                    Row.margin({ top: 8 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`⏱ 间隔 ${this.currentCard.interval || 1}天`);
                                    Text.fontSize(8);
                                    Text.fontColor(this.getInkDimColor());
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`🔄 复习 ${this.currentCard.repetitions || 0}次`);
                                    Text.fontSize(8);
                                    Text.fontColor(this.getInkDimColor());
                                    Text.margin({ left: 8 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`⚡ EF ${(this.currentCard.easeFactor || 2.5).toFixed(1)}`);
                                    Text.fontSize(8);
                                    Text.fontColor(this.getInkDimColor());
                                    Text.margin({ left: 8 });
                                }, Text);
                                Text.pop();
                                Row.pop();
                            });
                        }
                        // Navigation
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Navigation
                        Row.create();
                        // Navigation
                        Row.width('100%');
                        // Navigation
                        Row.margin({ top: 12, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('← Prev');
                        Button.fontSize(9);
                        Button.fontColor(this.getInkDimColor());
                        Button.backgroundColor(Color.Transparent);
                        Button.border({ width: 0.5, color: this.getBorderHiColor() });
                        Button.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                        Button.onClick(() => this.prevCard());
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.srsDeck.length ? this.fcIndex + 1 : 0} / ${this.srsDeck.length}`);
                        Text.fontSize(9);
                        Text.fontColor(this.getInkDimColor());
                        Text.layoutWeight(1);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('Next →');
                        Button.fontSize(9);
                        Button.fontColor(this.getInkDimColor());
                        Button.backgroundColor(Color.Transparent);
                        Button.border({ width: 0.5, color: this.getBorderHiColor() });
                        Button.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                        Button.onClick(() => this.nextCard());
                    }, Button);
                    Button.pop();
                    // Navigation
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Rate buttons
                        Row.create();
                        // Rate buttons
                        Row.width('100%');
                        // Rate buttons
                        Row.margin({ bottom: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('✗ Again');
                        Button.fontSize(9);
                        Button.fontColor(this.getRedColor());
                        Button.backgroundColor(Color.Transparent);
                        Button.border({ width: 0.5, color: this.getRedColor() });
                        Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
                        Button.layoutWeight(1);
                        Button.onClick(() => this.rateCard(0));
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('△ Hard');
                        Button.fontSize(9);
                        Button.fontColor(this.getAmberColor());
                        Button.backgroundColor(Color.Transparent);
                        Button.border({ width: 0.5, color: this.getAmberColor() });
                        Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
                        Button.layoutWeight(1);
                        Button.margin({ left: 6 });
                        Button.onClick(() => this.rateCard(1));
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('✓ Good');
                        Button.fontSize(9);
                        Button.fontColor(this.getInkColor());
                        Button.backgroundColor(Color.Transparent);
                        Button.border({ width: 0.5, color: this.getBorderHiColor() });
                        Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
                        Button.layoutWeight(1);
                        Button.margin({ left: 6 });
                        Button.onClick(() => this.rateCard(2));
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('★ Easy');
                        Button.fontSize(9);
                        Button.fontColor(this.getGreenColor());
                        Button.backgroundColor(Color.Transparent);
                        Button.border({ width: 0.5, color: this.getGreenColor() });
                        Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
                        Button.layoutWeight(1);
                        Button.margin({ left: 6 });
                        Button.onClick(() => this.rateCard(3));
                    }, Button);
                    Button.pop();
                    // Rate buttons
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.srsMode === 'due' ? '🎉 今日复习完成！' : this.srsMode === 'new' ? '没有新卡片了' : '先添加闪卡吧');
                        Text.fontSize(16);
                        Text.fontColor(this.getInkDimColor());
                        Text.padding(24);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        // Flashcard
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Add card
            Text.create('§A · Add Card');
            // Add card
            Text.fontSize(9);
            // Add card
            Text.fontColor(this.getInkDimColor());
            // Add card
            Text.letterSpacing(2);
            // Add card
            Text.margin({ bottom: 8 });
        }, Text);
        // Add card
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.backgroundColor(this.getBorderColor());
            Row.margin({ bottom: 1 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ text: this.newCardFront, placeholder: 'Concept / 概念…' });
            TextArea.layoutWeight(1);
            TextArea.fontSize(13);
            TextArea.fontColor(this.getInkColor());
            TextArea.backgroundColor(Color.Transparent);
            TextArea.border({ width: 0.5, color: this.getBorderHiColor() });
            TextArea.padding(10);
            TextArea.height(80);
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ text: this.newCardBack, placeholder: 'Definition / 解释…' });
            TextArea.layoutWeight(1);
            TextArea.fontSize(13);
            TextArea.fontColor(this.getInkColor());
            TextArea.backgroundColor(Color.Transparent);
            TextArea.border({ width: 0.5, color: this.getBorderHiColor() });
            TextArea.padding(10);
            TextArea.height(80);
            TextArea.margin({ left: 1 });
        }, TextArea);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Add Card →');
            Button.fontSize(9);
            Button.fontColor('#fff');
            Button.backgroundColor(this.getInkColor());
            Button.padding({ left: 12, right: 12, top: 8, bottom: 8 });
            Button.width('100%');
            Button.margin({ bottom: 16 });
            Button.onClick(() => this.addCard());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Error log section (inline in flash tab)
            Text.create('§B · Error Log');
            // Error log section (inline in flash tab)
            Text.fontSize(9);
            // Error log section (inline in flash tab)
            Text.fontColor(this.getInkDimColor());
            // Error log section (inline in flash tab)
            Text.letterSpacing(2);
            // Error log section (inline in flash tab)
            Text.margin({ bottom: 8 });
        }, Text);
        // Error log section (inline in flash tab)
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.border({ width: 0.5, color: this.getBorderHiColor() });
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Add Error · 新增错题');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ text: this.errQuestion, placeholder: '题目内容 / Question…' });
            TextArea.fontSize(13);
            TextArea.fontColor(this.getInkColor());
            TextArea.backgroundColor(Color.Transparent);
            TextArea.border({ width: 0.5, color: this.getBorderHiColor() });
            TextArea.padding(10);
            TextArea.height(60);
            TextArea.margin({ bottom: 1 });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.backgroundColor(this.getBorderColor());
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ text: this.errWrong, placeholder: '错误原因 / Why wrong…' });
            TextArea.layoutWeight(1);
            TextArea.fontSize(13);
            TextArea.fontColor(this.getInkColor());
            TextArea.backgroundColor(Color.Transparent);
            TextArea.border({ width: 0.5, color: this.getBorderHiColor() });
            TextArea.padding(10);
            TextArea.height(60);
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ text: this.errCorrect, placeholder: '正确解法 / Correct solution…' });
            TextArea.layoutWeight(1);
            TextArea.fontSize(13);
            TextArea.fontColor(this.getInkColor());
            TextArea.backgroundColor(Color.Transparent);
            TextArea.border({ width: 0.5, color: this.getBorderHiColor() });
            TextArea.padding(10);
            TextArea.height(60);
            TextArea.margin({ left: 1 });
        }, TextArea);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Add to Log →');
            Button.fontSize(9);
            Button.fontColor('#fff');
            Button.backgroundColor(this.getInkColor());
            Button.padding({ left: 12, right: 12, top: 8, bottom: 8 });
            Button.width('100%');
            Button.margin({ bottom: 16 });
            Button.onClick(() => this.addError());
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Error list
            if (this.errors.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('No errors logged yet.');
                        Text.fontSize(10);
                        Text.fontColor(this.getInkDimColor());
                        Text.padding(8);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const e = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width('100%');
                                Column.padding({ top: 12, bottom: 12 });
                                Column.border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(e.id);
                                Text.fontSize(9);
                                Text.fontColor(this.getInkMidColor());
                                Text.width(56);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(e.question);
                                Text.fontSize(14);
                                Text.fontColor(this.getInkColor());
                                Text.layoutWeight(1);
                                Text.maxLines(2);
                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel(e.revealed ? 'Hide ↑' : 'Answer →');
                                Button.fontSize(8);
                                Button.fontColor(e.revealed ? this.getKleinColor() : this.getInkDimColor());
                                Button.backgroundColor(Color.Transparent);
                                Button.border({ width: 0.5, color: e.revealed ? this.getKleinColor() : this.getBorderHiColor() });
                                Button.padding({ left: 8, right: 8, top: 3, bottom: 3 });
                                Button.onClick(() => this.toggleErrorReveal(e.id));
                            }, Button);
                            Button.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel(e.cardified ? '✓卡片' : '→卡片');
                                Button.fontSize(8);
                                Button.fontColor(e.cardified ? this.getInkDimColor() : this.getKleinColor());
                                Button.backgroundColor(Color.Transparent);
                                Button.margin({ left: 6 });
                                Button.onClick(() => this.errorToCard(e.id));
                            }, Button);
                            Button.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('×');
                                Text.fontSize(14);
                                Text.fontColor(this.getInkDimColor());
                                Text.margin({ left: 6 });
                                Text.onClick(() => this.deleteError(e.id));
                            }, Text);
                            Text.pop();
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (e.revealed) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.width('100%');
                                            Row.backgroundColor(this.getBorderColor());
                                            Row.margin({ top: 8 });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.layoutWeight(1);
                                            Column.padding(10);
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('错误原因');
                                            Text.fontSize(8);
                                            Text.fontColor(this.getInkMidColor());
                                            Text.letterSpacing(1);
                                            Text.margin({ bottom: 6 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(e.wrong || '—');
                                            Text.fontSize(13);
                                            Text.fontColor(this.getInkMidColor());
                                            Text.lineHeight(1.6);
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.layoutWeight(1);
                                            Column.padding(10);
                                            Column.margin({ left: 1 });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('正确解法');
                                            Text.fontSize(8);
                                            Text.fontColor(this.getInkMidColor());
                                            Text.letterSpacing(1);
                                            Text.margin({ bottom: 6 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(e.correct || '—');
                                            Text.fontSize(13);
                                            Text.fontColor(this.getInkMidColor());
                                            Text.lineHeight(1.6);
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        Row.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(e.createdAt);
                                            Text.fontSize(8);
                                            Text.fontColor(this.getInkDimColor());
                                            Text.margin({ top: 6 });
                                        }, Text);
                                        Text.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.errors, forEachItemGenFunction, (e: ErrorItem) => e.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
    }
    // ── AI TAB ──
    AITab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // AI sub-tabs
            Row.create();
            // AI sub-tabs
            Row.width('100%');
            // AI sub-tabs
            Row.backgroundColor(this.getBorderColor());
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('💬 对话');
            Button.fontSize(9);
            Button.fontColor(this.aiSubTab === 'chat' ? '#fff' : this.getInkDimColor());
            Button.backgroundColor(this.aiSubTab === 'chat' ? this.getInkColor() : Color.Transparent);
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.layoutWeight(1);
            Button.onClick(() => this.aiSubTab = 'chat');
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('📄 真题批改');
            Button.fontSize(9);
            Button.fontColor(this.aiSubTab === 'paper' ? '#fff' : this.getInkDimColor());
            Button.backgroundColor(this.aiSubTab === 'paper' ? this.getInkColor() : Color.Transparent);
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.layoutWeight(1);
            Button.onClick(() => this.aiSubTab = 'paper');
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('🎯 出题预测');
            Button.fontSize(9);
            Button.fontColor(this.aiSubTab === 'predict' ? '#fff' : this.getInkDimColor());
            Button.backgroundColor(this.aiSubTab === 'predict' ? this.getInkColor() : Color.Transparent);
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.layoutWeight(1);
            Button.onClick(() => this.aiSubTab = 'predict');
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('⚡ 模板库');
            Button.fontSize(9);
            Button.fontColor(this.aiSubTab === 'prompts' ? '#fff' : this.getInkDimColor());
            Button.backgroundColor(this.aiSubTab === 'prompts' ? this.getInkColor() : Color.Transparent);
            Button.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Button.layoutWeight(1);
            Button.onClick(() => this.aiSubTab = 'prompts');
        }, Button);
        Button.pop();
        // AI sub-tabs
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiSubTab === 'chat') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.AIChatSubTab.bind(this)();
                });
            }
            else if (this.aiSubTab === 'paper') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.AIPaperSubTab.bind(this)();
                });
            }
            else if (this.aiSubTab === 'predict') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.AIPredictSubTab.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.AIPromptsSubTab.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    AIChatSubTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Sidebar
            Column.create();
            // Sidebar
            Column.width(180);
            // Sidebar
            Column.height('100%');
            // Sidebar
            Column.padding(12);
            // Sidebar
            Column.border({ width: { right: 0.5 }, color: this.getBorderHiColor() });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('历史对话');
            Text.fontSize(9);
            Text.fontColor(this.getInkMidColor());
            Text.letterSpacing(1);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.fontSize(10);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 6, right: 6, top: 2, bottom: 2 });
            Button.onClick(() => this.newAISession());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiSessions.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无历史');
                        Text.fontSize(9);
                        Text.fontColor(this.getInkDimColor());
                        Text.padding(8);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const s = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.padding(8);
                                Row.backgroundColor(s.id === this.currentAISessionId ? (this.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,71,171,0.08)') : Color.Transparent);
                                Row.border({ width: { left: s.id === this.currentAISessionId ? 2 : 0 }, color: this.getKleinColor() });
                                Row.onClick(() => this.openAISession(s.id));
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.alignItems(HorizontalAlign.Start);
                                Column.layoutWeight(1);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(s.title || '新对话');
                                Text.fontSize(12);
                                Text.fontColor(this.getInkColor());
                                Text.maxLines(1);
                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${s.messages.length}条 · ${s.date || ''}`);
                                Text.fontSize(8);
                                Text.fontColor(this.getInkDimColor());
                                Text.margin({ top: 2 });
                            }, Text);
                            Text.pop();
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('×');
                                Text.fontSize(12);
                                Text.fontColor(this.getInkDimColor());
                                Text.onClick(() => this.deleteAISession(s.id));
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.aiSessions, forEachItemGenFunction, (s: AISession) => s.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        // Sidebar
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Chat area
            Column.create();
            // Chat area
            Column.layoutWeight(1);
            // Chat area
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Context chips
            Row.create();
            // Context chips
            Row.width('100%');
            // Context chips
            Row.padding({ left: 12, right: 12, top: 8, bottom: 8 });
            // Context chips
            Row.border({ width: { bottom: 0.5 }, color: this.getBorderColor() });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('自由问答');
            Button.fontSize(8);
            Button.fontColor(this.aiCtx === 'general' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(this.aiCtx === 'general' ? 'rgba(0,71,171,0.12)' : Color.Transparent);
            Button.border({ width: 0.5, color: this.aiCtx === 'general' ? this.getKleinColor() : this.getBorderHiColor() });
            Button.padding({ left: 8, right: 8, top: 3, bottom: 3 });
            Button.onClick(() => this.setAICtx('general'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('科目知识库');
            Button.fontSize(8);
            Button.fontColor(this.aiCtx === 'subject' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(this.aiCtx === 'subject' ? 'rgba(0,71,171,0.12)' : Color.Transparent);
            Button.border({ width: 0.5, color: this.aiCtx === 'subject' ? this.getKleinColor() : this.getBorderHiColor() });
            Button.padding({ left: 8, right: 8, top: 3, bottom: 3 });
            Button.margin({ left: 6 });
            Button.onClick(() => this.setAICtx('subject'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('学习规划');
            Button.fontSize(8);
            Button.fontColor(this.aiCtx === 'plan' ? this.getKleinColor() : this.getInkDimColor());
            Button.backgroundColor(this.aiCtx === 'plan' ? 'rgba(0,71,171,0.12)' : Color.Transparent);
            Button.border({ width: 0.5, color: this.aiCtx === 'plan' ? this.getKleinColor() : this.getBorderHiColor() });
            Button.padding({ left: 8, right: 8, top: 3, bottom: 3 });
            Button.margin({ left: 6 });
            Button.onClick(() => this.setAICtx('plan'));
        }, Button);
        Button.pop();
        // Context chips
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Messages
            Scroll.create();
            // Messages
            Scroll.layoutWeight(1);
            // Messages
            Scroll.width('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(12);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiMessages.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择历史对话或点击 + 开始新对话');
                        Text.fontSize(10);
                        Text.fontColor(this.getInkDimColor());
                        Text.padding(24);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const m = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.margin({ bottom: 8 });
                                Row.direction(m.role === 'user' ? Direction.Rtl : Direction.Ltr);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.alignSelf(ItemAlign.Start);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(m.role === 'assistant' ? 'AI' : '我');
                                Text.fontSize(8);
                                Text.fontColor(m.role === 'assistant' ? '#fff' : this.getInkDimColor());
                                Text.width(24);
                                Text.height(24);
                                Text.backgroundColor(m.role === 'assistant' ? this.getKleinColor() : Color.Transparent);
                                Text.border({ width: 0.5, color: this.getBorderHiColor() });
                                Text.textAlign(TextAlign.Center);
                                Text.margin({ right: 8 });
                            }, Text);
                            Text.pop();
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.layoutWeight(1);
                                Column.padding(10);
                                Column.backgroundColor(m.role === 'assistant' ? Color.Transparent : 'rgba(0,71,171,0.08)');
                                Column.border({ width: 0.5, color: m.role === 'assistant' ? this.getBorderHiColor() : this.getKleinColor() });
                                Column.margin({ left: m.role === 'user' ? 20 : 0, right: m.role === 'user' ? 0 : 20 });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(m.content);
                                Text.fontSize(13);
                                Text.fontColor(this.getInkColor());
                                Text.lineHeight(1.7);
                                Text.maxLines(100);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(m.time || '');
                                Text.fontSize(8);
                                Text.fontColor(this.getInkDimColor());
                                Text.margin({ top: 4 });
                            }, Text);
                            Text.pop();
                            Column.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.aiMessages, forEachItemGenFunction, (m: AIMessage, i: number) => i.toString(), false, true);
                    }, ForEach);
                    ForEach.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiIsTyping) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('AI');
                        Text.fontSize(8);
                        Text.fontColor('#fff');
                        Text.width(24);
                        Text.height(24);
                        Text.backgroundColor(this.getKleinColor());
                        Text.border({ width: 0.5, color: this.getKleinColor() });
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ right: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('...');
                        Text.fontSize(13);
                        Text.fontColor(this.getInkDimColor());
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        // Messages
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Input area
            Column.create();
            // Input area
            Column.padding(12);
            // Input area
            Column.border({ width: { top: 0.5 }, color: this.getBorderHiColor() });
            // Input area
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ text: this.aiInput, placeholder: '输入问题…' });
            TextArea.layoutWeight(1);
            TextArea.fontSize(12);
            TextArea.fontColor(this.getInkColor());
            TextArea.backgroundColor(Color.Transparent);
            TextArea.border({ width: 0.5, color: this.getBorderHiColor() });
            TextArea.padding(8);
            TextArea.maxLines(4);
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发送 ↑');
            Button.fontSize(8);
            Button.fontColor('#fff');
            Button.backgroundColor(this.getInkColor());
            Button.padding({ left: 12, right: 12, top: 8, bottom: 8 });
            Button.margin({ left: 8 });
            Button.enabled(!this.aiIsTyping);
            Button.onClick(() => this.sendAIMsg());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 回答仅供参考，重要内容请自行核实');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.textAlign(TextAlign.Center);
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        // Input area
        Column.pop();
        // Chat area
        Column.pop();
        Row.pop();
    }
    AIPaperSubTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(24);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('§01 · Past Papers · 真题批改');
            Text.fontSize(9);
            Text.fontColor(this.getInkMidColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(32);
            Column.border({ width: 0.5, style: BorderStyle.Dashed, color: this.getBorderHiColor() });
            Column.justifyContent(FlexAlign.Center);
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📄');
            Text.fontSize(28);
            Text.fontColor(this.getInkDimColor());
            Text.opacity(0.5);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Upload Past Paper · 上传真题');
            Text.fontSize(10);
            Text.fontColor(this.getInkMidColor());
            Text.fontWeight(FontWeight.Medium);
            Text.letterSpacing(2);
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('PDF or Image');
            Text.fontSize(9);
            Text.fontColor(this.getInkDimColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('AI 批改 →');
            Button.fontSize(9);
            Button.fontColor('#fff');
            Button.backgroundColor(this.getKleinColor());
            Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Clear');
            Button.fontSize(9);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 12, right: 12, top: 8, bottom: 8 });
            Button.margin({ left: 8 });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
        Scroll.pop();
    }
    AIPredictSubTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(24);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('§01 · AI Prediction · 出题预测');
            Text.fontSize(9);
            Text.fontColor(this.getInkMidColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(20);
            Column.border({ width: 0.5, color: this.getBorderHiColor() });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI Exam Prediction');
            Text.fontSize(9);
            Text.fontColor(this.getInkMidColor());
            Text.letterSpacing(2);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI');
            Text.fontSize(8);
            Text.fontColor(this.getKleinColor());
            Text.border({ width: 0.5, color: this.getKleinColor() });
            Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Generate →');
            Button.fontSize(9);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 12, right: 12, top: 7, bottom: 7 });
            Button.margin({ left: 8 });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: 'Paste syllabus or key topics…' });
            TextInput.fontSize(11);
            TextInput.fontColor(this.getInkColor());
            TextInput.backgroundColor(Color.Transparent);
            TextInput.border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() });
            TextInput.margin({ bottom: 12 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Click Generate to predict likely exam questions.');
            Text.fontSize(14);
            Text.fontColor(this.getInkDimColor());
            Text.fontStyle(FontStyle.Italic);
            Text.height(60);
        }, Text);
        Text.pop();
        Column.pop();
        Column.pop();
        Scroll.pop();
    }
    AIPromptsSubTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(24);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('§01 · Mr. Ranedeer · 深度家教系统');
            Text.fontSize(9);
            Text.fontColor(this.getInkMidColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(16);
            Column.border({ width: 0.5, color: this.getBorderHiColor() });
            Column.margin({ bottom: 16 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Mr. Ranedeer AI Tutor');
            Text.fontSize(18);
            Text.fontColor(this.getInkColor());
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('高度可定制的家教系统 prompt。设定深度档位、辅导风格、语言，直接注入对话作为本次的主控系统。');
            Text.fontSize(12);
            Text.fontColor(this.getInkMidColor());
            Text.lineHeight(1.6);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.margin({ right: 6 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('深度档位');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create([{ value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, { value: '5' }, { value: '6' }, { value: '7' }, { value: '8' }]);
            Select.selected(4);
            Select.width('100%');
        }, Select);
        Select.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.margin({ right: 6 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('辅导风格');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create([{ value: 'Socratic' }, { value: 'Feynman' }, { value: 'Active' }, { value: 'Spaced' }, { value: 'Visual' }, { value: 'Debate' }]);
            Select.selected(1);
            Select.width('100%');
        }, Select);
        Select.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('回答语言');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create([{ value: 'Chinese' }, { value: 'English' }, { value: 'Bilingual' }]);
            Select.selected(0);
            Select.width('100%');
        }, Select);
        Select.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '例：帮我掌握线性代数的特征值/向量' });
            TextInput.fontSize(11);
            TextInput.fontColor(this.getInkColor());
            TextInput.backgroundColor(Color.Transparent);
            TextInput.border({ width: 0.5, color: this.getBorderHiColor() });
            TextInput.margin({ bottom: 12 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('预览 Prompt');
            Button.fontSize(9);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getBorderHiColor() });
            Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('注入 AI Chat →');
            Button.fontSize(9);
            Button.fontColor(this.getKleinColor());
            Button.backgroundColor(Color.Transparent);
            Button.border({ width: 0.5, color: this.getKleinColor() });
            Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
            Button.margin({ left: 8 });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('§02 · Awesome Prompts · 精选库');
            Text.fontSize(9);
            Text.fontColor(this.getInkMidColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Prompt library content would be loaded here from Constants.');
            Text.fontSize(12);
            Text.fontColor(this.getInkDimColor());
            Text.padding(8);
        }, Text);
        Text.pop();
        Column.pop();
        Scroll.pop();
    }
    // ── RESOURCES TAB ──
    ResourcesTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(24);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('§01 · Open Courseware · 开放课程');
            Text.fontSize(10);
            Text.fontColor(this.getInkMidColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Filter
            Row.create();
            // Filter
            Row.width('100%');
            // Filter
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const cat = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(cat === 'all' ? 'All' : cat === 'math' ? '数学' : cat === 'cs' ? '计算机' : cat === 'physics' ? '物理' : cat === 'english' ? '英语' : cat === 'econ' ? '经济' : 'My Links');
                    Button.fontSize(10);
                    Button.fontColor(this.resFilter === cat ? '#fff' : this.getInkDimColor());
                    Button.backgroundColor(this.resFilter === cat ? this.getInkColor() : Color.Transparent);
                    Button.border({ width: 0.5, color: this.getBorderHiColor() });
                    Button.padding({ left: 10, right: 10, top: 5, bottom: 5 });
                    Button.margin({ right: 6 });
                    Button.onClick(() => { this.resFilter = cat; this.filterResources(); });
                }, Button);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, ['all', 'math', 'cs', 'physics', 'english', 'econ', 'custom'], forEachItemGenFunction, (cat: string) => cat, false, false);
        }, ForEach);
        ForEach.pop();
        // Filter
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Resources grid
            if (this.resources.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('No resources in this category.');
                        Text.fontSize(12);
                        Text.fontColor(this.getInkDimColor());
                        Text.padding(16);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.columnsTemplate('1fr 1fr');
                        Grid.columnsGap(12);
                        Grid.rowsGap(12);
                        Grid.backgroundColor(this.getBorderColor());
                        Grid.width('100%');
                        Grid.margin({ bottom: 16 });
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const r = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.padding(16);
                                        Column.backgroundColor(this.isDarkMode ? 'rgba(255,255,255,0.04)' : Color.Transparent);
                                        Column.width('100%');
                                        Column.height('100%');
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(r.school);
                                        Text.fontSize(10);
                                        Text.fontColor(this.getKleinColor());
                                        Text.letterSpacing(2);
                                        Text.margin({ bottom: 6 });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(r.name);
                                        Text.fontSize(13);
                                        Text.fontColor(this.getInkColor());
                                        Text.margin({ bottom: 6 });
                                        Text.lineHeight(20);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(r.desc);
                                        Text.fontSize(12);
                                        Text.fontColor(this.getInkMidColor());
                                        Text.lineHeight(18);
                                        Text.margin({ bottom: 10 });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.width('100%');
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(r.cat);
                                        Text.fontSize(9);
                                        Text.fontColor(this.getInkDimColor());
                                        Text.border({ width: 0.5, color: this.getBorderHiColor() });
                                        Text.padding({ left: 6, right: 6, top: 3, bottom: 3 });
                                        Text.margin({ right: 8 });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(r.lang);
                                        Text.fontSize(9);
                                        Text.fontColor(this.getInkDimColor());
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Blank.create();
                                    }, Blank);
                                    Blank.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create('↗');
                                        Text.fontSize(12);
                                        Text.fontColor(this.getInkDimColor());
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    Column.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.resources, forEachItemGenFunction, (r: Resource) => r.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Add custom
            Text.create('§02 · Add Custom Link');
            // Add custom
            Text.fontSize(10);
            // Add custom
            Text.fontColor(this.getInkMidColor());
            // Add custom
            Text.letterSpacing(2);
            // Add custom
            Text.margin({ bottom: 12 });
        }, Text);
        // Add custom
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(16);
            Column.border({ width: 0.5, color: this.getBorderHiColor() });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Simplified custom resource add form
            Text.create('Add custom resource form');
            // Simplified custom resource add form
            Text.fontSize(12);
            // Simplified custom resource add form
            Text.fontColor(this.getInkDimColor());
            // Simplified custom resource add form
            Text.padding(8);
        }, Text);
        // Simplified custom resource add form
        Text.pop();
        Column.pop();
        Column.pop();
        Scroll.pop();
    }
    // ── EDIT SUBJECT DIALOG ──
    EditSubjectDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0,0,0,0.32)');
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => this.showEditDialog = false);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('90%');
            Column.constraintSize({ maxWidth: 480 });
            Column.padding(24);
            Column.backgroundColor(this.getBgColor());
            Column.border({ width: 0.5, color: this.getBorderHiColor() });
            Column.borderRadius(2);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('SUBJECT SETTINGS');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.letterSpacing(2);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Edit Subject');
            Text.fontSize(22);
            Text.fontColor(this.getInkColor());
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Subject Name · 科目名称');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.subject?.name || '', placeholder: '科目名称' });
            TextInput.fontSize(16);
            TextInput.fontColor(this.getInkColor());
            TextInput.backgroundColor(Color.Transparent);
            TextInput.border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() });
            TextInput.margin({ bottom: 16 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Exam Date · 考试日期');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.subject?.examDate || '', placeholder: 'YYYY-MM-DD' });
            TextInput.fontSize(14);
            TextInput.fontColor(this.getInkColor());
            TextInput.backgroundColor(Color.Transparent);
            TextInput.border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() });
            TextInput.margin({ bottom: 16 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('目标分数 · Target Score');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.subject?.targetScore || '', placeholder: 'e.g. 90 / A+' });
            TextInput.fontSize(14);
            TextInput.fontColor(this.getInkColor());
            TextInput.backgroundColor(Color.Transparent);
            TextInput.border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() });
            TextInput.margin({ bottom: 16 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('知识点范围 · Knowledge Scope');
            Text.fontSize(8);
            Text.fontColor(this.getInkDimColor());
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ text: this.subject?.knowledgePoints || '', placeholder: '一行一个知识点' });
            TextArea.fontSize(12);
            TextArea.fontColor(this.getInkColor());
            TextArea.backgroundColor(Color.Transparent);
            TextArea.border({ width: 0.5, color: this.getBorderHiColor() });
            TextArea.height(80);
            TextArea.margin({ bottom: 16 });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Cancel');
            Button.fontSize(10);
            Button.fontColor(this.getInkDimColor());
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => this.showEditDialog = false);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Save →');
            Button.fontSize(10);
            Button.fontColor('#fff');
            Button.backgroundColor(this.getKleinColor());
            Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Button.onClick(() => {
                // In real implementation, capture values from inputs
                this.showEditDialog = false;
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.subject) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor(this.getBgColor());
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Loading...');
                        Text.fontSize(16);
                        Text.fontColor(this.getInkDimColor());
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor(this.getBgColor());
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Detail Topbar
                        Row.create();
                        // Detail Topbar
                        Row.width('100%');
                        // Detail Topbar
                        Row.padding({ left: 24, right: 24, top: 12, bottom: 12 });
                        // Detail Topbar
                        Row.backgroundColor(this.isDarkMode ? 'rgba(10,10,10,0.88)' : 'rgba(248,250,252,0.92)');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('← Back');
                        Button.fontSize(10);
                        Button.fontColor(this.getInkDimColor());
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            try {
                                router.back();
                            }
                            catch (e) {
                                console.error('Router back error:', e);
                            }
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.subject.name);
                        Text.fontSize(18);
                        Text.fontColor(this.getInkColor());
                        Text.layoutWeight(1);
                        Text.margin({ left: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getDaysUntilStr());
                        Text.fontSize(9);
                        Text.fontColor(this.getDaysUntil() !== null && this.getDaysUntil()! <= 7 ? this.getKleinColor() : this.getInkMidColor());
                        Text.border({ width: 0.5, color: this.getBorderHiColor() });
                        Text.padding({ left: 8, right: 8, top: 3, bottom: 3 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('⚙ 设置');
                        Button.fontSize(10);
                        Button.fontColor(this.getInkDimColor());
                        Button.backgroundColor(Color.Transparent);
                        Button.margin({ left: 8 });
                        Button.onClick(() => this.showEditDialog = true);
                    }, Button);
                    Button.pop();
                    // Detail Topbar
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Module Tabs
                        Tabs.create({ barPosition: BarPosition.Start });
                        // Module Tabs
                        Tabs.width('100%');
                        // Module Tabs
                        Tabs.layoutWeight(1);
                        // Module Tabs
                        Tabs.backgroundColor(this.getBgColor());
                        // Module Tabs
                        Tabs.onChange((index: number) => this.currentTabIndex = index);
                        // Module Tabs
                        Tabs.barMode(BarMode.Scrollable);
                        // Module Tabs
                        Tabs.scrollable(true);
                    }, Tabs);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.TasksTab.bind(this)();
                        });
                        TabContent.tabBar('📋 Tasks');
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.PomodoroTab.bind(this)();
                        });
                        TabContent.tabBar('🍅 Pomodoro');
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.NotesTab.bind(this)();
                        });
                        TabContent.tabBar('📝 Notes');
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.FlashCardsTab.bind(this)();
                        });
                        TabContent.tabBar('⭐ Flash Cards');
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.AITab.bind(this)();
                        });
                        TabContent.tabBar('🤖 AI');
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.ResourcesTab.bind(this)();
                        });
                        TabContent.tabBar('📚 Resources');
                    }, TabContent);
                    TabContent.pop();
                    // Module Tabs
                    Tabs.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // Edit Subject Dialog
                        if (this.showEditDialog) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.EditSubjectDialog.bind(this)();
                            });
                        }
                        // Pomodoro Settings Dialog
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // Pomodoro Settings Dialog
                        if (this.showPomoSettings) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.PomoSettingsDialog.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
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
        return "SubjectPage";
    }
}
registerNamedRoute(() => new SubjectPage(undefined, {}), "", { bundleName: "com.focal.study", moduleName: "entry", pagePath: "pages/SubjectPage", pageFullPath: "entry/src/main/ets/pages/SubjectPage", integratedHsp: "false", moduleType: "followWithHap" });
