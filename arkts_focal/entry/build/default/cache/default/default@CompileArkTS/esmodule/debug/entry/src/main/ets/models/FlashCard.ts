export class FlashCard {
    id: string;
    front: string;
    back: string;
    created: string;
    interval: number;
    repetitions: number;
    easeFactor: number;
    dueDate: string | null;
    lastReviewed?: string;
    constructor(id: string, front: string, back: string, created: string = '') {
        this.id = id;
        this.front = front;
        this.back = back;
        this.created = created;
        this.interval = 1;
        this.repetitions = 0;
        this.easeFactor = 2.5;
        this.dueDate = null;
    }
}
