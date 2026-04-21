class ImageSize {
  url: string = '';
  width: number = 0;
  size: number = 0;
  height: number = 0;
}

class Image {
  normal: ImageSize = new ImageSize();
  large: ImageSize = new ImageSize();
  raw: ImageSize | null = null;
  small: ImageSize = new ImageSize();
  primary_color: string = '';
  is_animated: boolean = false;
}

class AuthorLoc {
  uid: string = '';
  id: string = '';
  name: string = '';
}

class Author {
  loc: AuthorLoc = new AuthorLoc();
  kind: string = '';
  name: string = '';
  reg_time: string = '';
  url: string = '';
  uri: string = '';
  avatar: string = '';
  is_club: boolean = false;
  type: string = '';
  id: string = '';
  uid: string = '';
}

export class Photo {
  read_count: number = 0;
  image: Image = new Image();
  create_time: string = '';
  collections_count: number = 0;
  reshares_count: number = 0;
  id: string = '';
  author: Author = new Author();
  is_collected: boolean = false;
  subtype: string = '';
  type: string = '';
  owner_uri: string = '';
  // status: any = null; // 这里使用了 any，因为 JSON 中是 null
  reaction_type: number = 0;
  description: string = '';
  sharing_url: string = '';
  likers_count: number = 0;
  reply_limit: string = '';
  uri: string = '';
  url: string = '';
  reactions_count: number = 0;
  comments_count: number = 0;
  position: number = 0;
}

export class PhotoResponse {
  count: number = 0;
  photos: Photo[] = [];
  w: number = 0;
  // ad_list: any[] = []; // 这里使用了 any[]，因为 JSON 中是空数组
  total: number = 0;
  start: number = 0;
}