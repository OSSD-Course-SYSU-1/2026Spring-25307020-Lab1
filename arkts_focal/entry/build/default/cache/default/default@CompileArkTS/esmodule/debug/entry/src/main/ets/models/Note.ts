export class Note {
    id: string;
    title: string;
    content: string;
    mode: string;
    attachments: Attachment[];
    createdAt: string;
    updatedAt: string;
    constructor(id: string, title: string = 'Untitled Note', content: string = '', mode: string = 'rich', createdAt: string = '') {
        this.id = id;
        this.title = title;
        this.content = content;
        this.mode = mode;
        this.attachments = [];
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }
}
export class Attachment {
    name: string;
    type: string;
    data: string;
    addedAt: string;
    constructor(name: string, type: string, data: string, addedAt: string) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.addedAt = addedAt;
    }
}
