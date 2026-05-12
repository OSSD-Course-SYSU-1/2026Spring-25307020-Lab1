export class Movie {
  rating: Rating = new Rating();
  lineticket_url: string = '';
  controversy_reason: string = '';
  pubdate: string[] = [];
  last_episode_number: number | null = null;
  // interest_control_info: unknown | null = null; // 使用unknown代替无法确定的类型
  pic: Pic = new Pic();
  year: string = '';
  vendor_count: number = 0;
  body_bg_color: string = '';
  is_tv: boolean = false;
  card_subtitle: string = '';
  album_no_interact: boolean = false;
  ticket_price_info: string = '';
  pre_playable_date: string | null = null;
  can_rate: boolean = false;
  // head_info: unknown | null = null; // 使用unknown代替无法确定的类型
  // forum_info: unknown | null = null; // 使用unknown代替无法确定的类型
  // share_activities: unknown[] = []; // 使用unknown代替无法确定的类型
  // webisode: unknown | null = null; // 使用unknown代替无法确定的类型
  id: string = '';
  gallery_topic_count: number = 0;
  languages: string[] = [];
  genres: string[] = [];
  review_count: number = 0;
  variable_modules: VariableModule[] = [];
  title: string = '';
  intro: string = '';
  interest_cmt_earlier_tip_title: string = '';
  has_linewatch: boolean = false;
  comment_count: number = 0;
  forum_topic_count: number = 0;
  ticket_promo_text: string = '';
  // webview_info: unknown = {}; // 使用unknown代替无法确定的类型
  is_released: boolean = false;
  // vendors: unknown[] = []; // 使用unknown代替无法确定的类型
  actors: Actor[] = [];
  // interest: unknown | null = null; // 使用unknown代替无法确定的类型
  subtype: string = '';
  episodes_count: number = 0;
  color_scheme: ColorScheme = new ColorScheme();
  type: string = '';
  // linewatches: unknown[] = []; // 使用unknown代替无法确定的类型
  info_url: string = '';
  tags: string[] = [];
  vendor_desc: string = '';
  durations: string[] = [];
  cover: Cover = new Cover();
  cover_url: string = '';
  trailers: Trailer[] = [];
  header_bg_color: string = '';
  is_douban_intro: boolean = false;
  ticket_vendor_icons: string[] = [];
  honor_infos: HonorInfo[] = [];
  sharing_url: string = '';
  // subject_collections: unknown[] = []; // 使用unknown代替无法确定的类型
  wechat_timeline_share: string = '';
  uri: string = '';
  restrictive_icon_url: string = '';
  rate_info: string = '';
  release_date: string | null = null;
  countries: string[] = [];
  original_title: string = '';
  is_restrictive: boolean = false;
  webisode_count: number = 0;
  episodes_info: string = '';
  url: string = '';
  directors: Director[] = [];
  is_show: boolean = false;
  // vendor_icons: unknown[] = []; // 使用unknown代替无法确定的类型
  pre_release_desc: string = '';
  // video: unknown | null = null; // 使用unknown代替无法确定的类型
  aka: string[] = [];
  realtime_hot_honor_infos: RealtimeHotHonorInfo[] = [];
  null_rating_reason: string = '';
  interest_cmt_earlier_tip_desc: string = '';
  freePlatforms: string[] = [];
  boxOffice: number = 0; // 票房，单位：万元
  liked: boolean = false; // 是否已点赞
  likeCount: number = 0; // 点赞数

  constructor() {}
}

class Rating {
  count: number = 0;
  max: number = 0;
  star_count: number = 0;
  value: number = 0;

  constructor() {}
}

class Pic {
  large: string = '';
  normal: string = '';

  constructor() {}
}

class VariableModule {
  sub_modules: SubModule[] = [];
  id: string = '';

  constructor() {}
}

class SubModule {
  id: string = '';

  constructor() {}
}

class Actor {
  name: string = '';

  constructor() {}
}

class ColorScheme {
  is_dark: boolean = false;
  primary_color_light: string = '';
  _base_color: number[] = [];
  secondary_color: string = '';
  _avg_color: number[] = [];
  primary_color_dark: string = '';

  constructor() {}
}

class Cover {
  description: string = '';
  author: Author = new Author();
  url: string = '';
  image: Image = new Image();
  uri: string = '';
  create_time: string = '';
  position: number = 0;
  owner_uri: string = '';
  type: string = '';
  id: string = '';
  sharing_url: string = '';

  constructor() {}
}

class Author {
  loc: Loc = new Loc();
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

  constructor() {}
}

class Loc {
  id: string = '';
  name: string = '';
  uid: string = '';

  constructor() {}
}

class Image {
  normal: NormalImage = new NormalImage();
  large: LargeImage = new LargeImage();
  // raw: unknown | null = null; // 使用unknown代替无法确定的类型
  small: SmallImage = new SmallImage();
  primary_color: string = '';
  is_animated: boolean = false;

  constructor() {}
}

class NormalImage {
  url: string = '';
  width: number = 0;
  height: number = 0;
  size: number = 0;

  constructor() {}
}

class LargeImage extends NormalImage {}

class SmallImage extends NormalImage {}

class Trailer {
  sharing_url: string = '';
  video_url: string = '';
  title: string = '';
  type_name: string = '';
  uri: string = '';
  cover_url: string = '';
  term_num: number = 0;
  n_comments: number = 0;
  create_time: string = '';
  file_size: number = 0;
  runtime: string = '';
  type: string = '';
  id: string = '';
  desc: string = '';

  constructor() {}
}

class HonorInfo {
  kind: string = '';
  uri: string = '';
  rank: number = 0;
  title: string = '';

  constructor() {}
}

class RealtimeHotHonorInfo extends HonorInfo {
  score: number = 0;
}

class Director {
  name: string = '';

  constructor() {}
}