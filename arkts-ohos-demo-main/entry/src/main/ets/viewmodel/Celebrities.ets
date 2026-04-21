class Location {
  id: string = '';
  name: string = '';
  uid: string = '';
}

class User {
  loc: Location = new Location();
  kind: string = '';
  name: string = '';
  url: string = '';
  verify_type: number = 0;
  reg_time: string = '';
  uri: string = '';
  avatar: string = '';
  is_club: boolean = false;
  type: string = '';
  id: string = '';
  uid: string = '';
}

class Avatar {
  large: string = '';
  normal: string = '';
}

export class Celebrity {
  name: string = '';
  roles: string[] = [];
  title: string = '';
  url: string = '';
  user: User | null = null;
  character: string = '';
  uri: string = '';
  simple_character: string = '';
  avatar: Avatar = new Avatar();
  sharing_url: string = '';
  type: string = '';
  id: string = '';
  latin_name: string = '';
}

class Director extends Celebrity {
  // 可以在这里添加导演特有的属性
}

class Actor extends Celebrity {
  // 可以在这里添加演员特有的属性
}

export class Celebrities {
  directors: Director[] = [];
  total: number = 0;
  actors: Actor[] = [];
}