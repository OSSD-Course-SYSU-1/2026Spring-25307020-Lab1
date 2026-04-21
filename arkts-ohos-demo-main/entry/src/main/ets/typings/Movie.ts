export interface Movie {
  rating:                         Rating;
  lineticket_url:                 string;
  controversy_reason:             string;
  pubdate:                        string[];
  last_episode_number:            null;
  interest_control_info:          null;
  pic:                            Pic;
  year:                           string;
  vendor_count:                   number;
  body_bg_color:                  string;
  is_tv:                          boolean;
  card_subtitle:                  string;
  album_no_interact:              boolean;
  ticket_price_info:              string;
  pre_playable_date:              null;
  can_rate:                       boolean;
  head_info:                      null;
  forum_info:                     null;
  share_activities:               any[];
  webisode:                       null;
  id:                             string;
  gallery_topic_count:            number;
  languages:                      string[];
  genres:                         string[];
  review_count:                   number;
  variable_modules:               VariableModule[];
  title:                          string;
  intro:                          string;
  interest_cmt_earlier_tip_title: string;
  has_linewatch:                  boolean;
  comment_count:                  number;
  forum_topic_count:              number;
  ticket_promo_text:              string;
  webview_info:                   WebviewInfo;
  is_released:                    boolean;
  vendors:                        any[];
  actors:                         Ctor[];
  interest:                       null;
  subtype:                        string;
  episodes_count:                 number;
  color_scheme:                   ColorScheme;
  type:                           string;
  linewatches:                    any[];
  info_url:                       string;
  tags:                           any[];
  vendor_desc:                    string;
  durations:                      string[];
  cover:                          Cover;
  cover_url:                      string;
  trailers:                       Trailer[];
  header_bg_color:                string;
  is_douban_intro:                boolean;
  ticket_vendor_icons:            string[];
  honor_infos:                    HonorInfo[];
  sharing_url:                    string;
  subject_collections:            any[];
  wechat_timeline_share:          string;
  uri:                            string;
  restrictive_icon_url:           string;
  rate_info:                      string;
  release_date:                   null;
  countries:                      string[];
  original_title:                 string;
  is_restrictive:                 boolean;
  webisode_count:                 number;
  episodes_info:                  string;
  url:                            string;
  directors:                      Ctor[];
  is_show:                        boolean;
  vendor_icons:                   any[];
  pre_release_desc:               string;
  video:                          null;
  aka:                            string[];
  realtime_hot_honor_infos:       HonorInfo[];
  null_rating_reason:             string;
  interest_cmt_earlier_tip_desc:  string;
}

export interface Ctor {
  name: string;
}

export interface ColorScheme {
  is_dark:             boolean;
  primary_color_light: string;
  _base_color:         number[];
  secondary_color:     string;
  _avg_color:          number[];
  primary_color_dark:  string;
}

export interface Cover {
  description: string;
  author:      Author;
  url:         string;
  image:       Image;
  uri:         string;
  create_time: Date;
  position:    number;
  owner_uri:   string;
  type:        string;
  id:          string;
  sharing_url: string;
}

export interface Author {
  loc:      LOC;
  kind:     string;
  name:     string;
  reg_time: Date;
  url:      string;
  uri:      string;
  avatar:   string;
  is_club:  boolean;
  type:     string;
  id:       string;
  uid:      string;
}

export interface LOC {
  id:   string;
  name: string;
  uid:  string;
}

export interface Image {
  normal:        Large;
  large:         Large;
  raw:           null;
  small:         Large;
  primary_color: string;
  is_animated:   boolean;
}

export interface Large {
  url:    string;
  width:  number;
  height: number;
  size:   number;
}

export interface HonorInfo {
  kind:   string;
  uri:    string;
  rank:   number;
  title:  string;
  score?: number;
}

export interface Pic {
  large:  string;
  normal: string;
}

export interface Rating {
  count:      number;
  max:        number;
  star_count: number;
  value:      number;
}

export interface Trailer {
  sharing_url: string;
  video_url:   string;
  title:       string;
  type_name:   string;
  uri:         string;
  cover_url:   string;
  term_num:    number;
  n_comments:  number;
  create_time: Date;
  file_size:   number;
  runtime:     string;
  type:        string;
  id:          string;
  desc:        string;
}

export interface VariableModule {
  sub_modules: SubModule[];
  id:          string;
}

export interface SubModule {
  id:         string;
  data?:      Datum[] | DataClass;
  data_type?: string;
}

export interface Datum {
  name: string;
  id:   string;
}

export interface DataClass {
  count?:   number;
  title:    string;
  uri?:     string;
  source:   string;
  type:     string;
  id?:      string;
  sort_by?: Datum[];
}

export interface WebviewInfo {
}
