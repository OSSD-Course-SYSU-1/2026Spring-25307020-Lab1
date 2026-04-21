/**
 * 评论作者信息
 */
export class ReviewAuthor {
  uid: string = '';
  name: string = '';
  avatar: string = '';
  signature: string = '';
  
  constructor(uid: string = '', name: string = '', avatar: string = '', signature: string = '') {
    this.uid = uid;
    this.name = name;
    this.avatar = avatar;
    this.signature = signature;
  }
}

/**
 * 评论评分信息
 */
export class ReviewRating {
  max: number = 5;
  min: number = 1;
  value: number = 0;
  
  constructor(max: number = 5, min: number = 1, value: number = 0) {
    this.max = max;
    this.min = min;
    this.value = value;
  }
}

/**
 * 单条评论信息
 */
export class Review {
  id: string = '';
  author: ReviewAuthor = new ReviewAuthor();
  rating: ReviewRating = new ReviewRating();
  title: string = '';
  abstract: string = '';
  content: string = '';
  useful_count: number = 0;
  useless_count: number = 0;
  created_at: string = '';
  updated_at: string = '';
  
  constructor(
    id: string = '',
    author: ReviewAuthor = new ReviewAuthor(),
    rating: ReviewRating = new ReviewRating(),
    title: string = '',
    abstract: string = '',
    content: string = '',
    useful_count: number = 0,
    useless_count: number = 0,
    created_at: string = '',
    updated_at: string = ''
  ) {
    this.id = id;
    this.author = author;
    this.rating = rating;
    this.title = title;
    this.abstract = abstract;
    this.content = content;
    this.useful_count = useful_count;
    this.useless_count = useless_count;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

/**
 * 评论列表响应
 */
export class ReviewsResponse {
  count: number = 0;
  start: number = 0;
  total: number = 0;
  reviews: Review[] = [];
  
  constructor(count: number = 0, start: number = 0, total: number = 0, reviews: Review[] = []) {
    this.count = count;
    this.start = start;
    this.total = total;
    this.reviews = reviews;
  }
}
