export class AISession {
    id: string;
    title: string;
    ctx: string;
    messages: AIMessage[];
    date: string;
    ranedeerSystem?: string;
    constructor(id: string, title: string = '新对话', ctx: string = 'general', messages: AIMessage[] = [], date: string = '') {
        this.id = id;
        this.title = title;
        this.ctx = ctx;
        this.messages = messages;
        this.date = date;
    }
}
export class AIMessage {
    role: string;
    content: string;
    time: string;
    constructor(role: string, content: string, time: string = '') {
        this.role = role;
        this.content = content;
        this.time = time;
    }
}
