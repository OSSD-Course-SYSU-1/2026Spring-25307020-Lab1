export class Subject {
    id: string;
    name: string;
    color: string;
    examDate: string | undefined;
    createdAt: string;
    targetScore?: string;
    knowledgePoints?: string;
    sections?: Section[];
    constructor(id: string, name: string, color: string, examDate: string, createdAt: string) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.examDate = examDate;
        this.createdAt = createdAt;
    }
}
export class Section {
    id: string;
    name: string;
    priority: string;
    weight?: string;
    constructor(id: string, name: string, priority: string, weight?: string) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.weight = weight;
    }
}
