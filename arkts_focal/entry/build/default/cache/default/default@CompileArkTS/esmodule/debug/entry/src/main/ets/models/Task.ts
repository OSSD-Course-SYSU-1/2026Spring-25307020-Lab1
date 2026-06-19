export class Task {
    id: string;
    text: string;
    done: boolean;
    priority: string;
    due: string | null;
    level: string;
    createdAt: string;
    subjectId?: string;
    constructor(id: string, text: string, priority: string = 'normal', due: string | null = null, level: string = 'later', createdAt: string = '') {
        this.id = id;
        this.text = text;
        this.done = false;
        this.priority = priority;
        this.due = due;
        this.level = level;
        this.createdAt = createdAt;
    }
}
