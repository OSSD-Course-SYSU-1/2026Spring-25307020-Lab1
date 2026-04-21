export interface MovieShowingResponse {
  count: number
  subject_collection: SubjectCollection
  subject_collection_items: SubjectCollectionItem[]
  total: number
  start: number
}

export interface SubjectCollection {
  subject_type: string
  subtitle: string
  background_color_scheme: BackgroundColorScheme
  sharing_title: string
  updated_at: any
  screenshot_title: string
  screenshot_url: string
  total: number
  screenshot_type: string
  id: string
  name: string
  show_header_mask: boolean
  medium_name: string
  badge: any
  description: string
  short_name: string
  n_followers: any
  cover_url: string
  show_rank: boolean
  done_count: number
  sharing_url: string
  subject_count: number
  wechat_timeline_share: string
  collect_count: number
  url: string
  uri: string
  icon_fg_image: string
  more_description: string
  display: Display
}

export interface BackgroundColorScheme {
  is_dark: boolean
  primary_color_light: string
  secondary_color: string
  primary_color_dark: string
}

export interface Display {
  layout: string
}

export interface SubjectCollectionItem {
  original_price: any
  rating?: Rating
  cover: Cover
  actions: any[]
  year: string
  card_subtitle: string
  id: string
  title: string
  comments?: Comment[]
  label: any
  actors: string[]
  interest: any
  type: string
  description: string
  has_linewatch: boolean
  price: any
  date: any
  info: string
  rating_data?: RatingData
  url: string
  release_date: string
  original_title?: string
  uri: string
  subtype: string
  directors: string[]
  reviewer_name: string
  null_rating_reason: string
}

export interface Rating {
  count: number
  max: number
  value: number
  star_count: number
}

export interface Cover {
  url: string
  width: number
  shape: string
  height: number
}

export interface Comment {
  comment: string
  rating: Rating2
  sharing_url: string
  show_time_tip: boolean
  is_voted: boolean
  uri: string
  platforms: any[]
  vote_count: number
  create_time: string
  status: string
  user: User
  ip_location: string
  recommend_reason: string
  user_done_desc: string
  id: string
  wechat_timeline_share: string
}

export interface Rating2 {
  count: number
  max: number
  star_count: number
  value: number
}

export interface User {
  loc: Loc
  reg_time: string
  followed: boolean
  name: string
  in_blacklist: boolean
  url: string
  gender: string
  uri: string
  id: string
  remark: string
  avatar: string
  is_club: boolean
  type: string
  kind: string
  uid: string
}

export interface Loc {
  id: string
  name: string
  uid: string
}

export interface RatingData {
  stats: number[]
  type_ranks: TypeRank[]
}

export interface TypeRank {
  type: string
  rank: number
}
