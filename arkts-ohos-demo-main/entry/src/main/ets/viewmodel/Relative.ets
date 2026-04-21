class Rating {
  count: number = 0; // 评分人数
  max: number = 0; // 最大评分值
  star_count: number = 0; // 星级评分个数
  value: number = 0; // 平均评分值
}

class Pic {
  large: string = ''; // 大图URL
  normal: string = ''; // 正常尺寸图URL
}

export class Relative {
  rating: Rating = new Rating();
  alg_json: string = '{}'; // 算法相关JSON字符串
  sharing_url: string = ''; // 分享链接
  title: string = ''; // 电影标题
  url: string = ''; // 详情页链接
  pic: Pic = new Pic();
  uri: string = ''; // 应用内部链接
  card_subtitle: string = ''; // 卡片副标题
  type: string = 'movie'; // 类型，默认为'movie'
  id: string = ''; // 唯一标识符
}