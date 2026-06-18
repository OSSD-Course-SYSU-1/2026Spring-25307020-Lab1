export class Resource {
    id: string;
    name: string;
    school: string;
    url: string;
    desc: string;
    cat: string;
    lang: string;
    custom?: boolean;
    constructor(id: string, name: string, school: string, url: string, desc: string, cat: string, lang: string = 'EN') {
        this.id = id;
        this.name = name;
        this.school = school;
        this.url = url;
        this.desc = desc;
        this.cat = cat;
        this.lang = lang;
    }
}
