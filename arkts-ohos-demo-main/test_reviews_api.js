// 测试电影评论API
const https = require('https');

const movieId = '35269032';
const url = `https://api.xiaoweianbao.com/api/douban/movie/${movieId}/reviews?start=0&count=5`;

console.log('测试评论API: ' + url);

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n=== API响应 ===');
    console.log('状态码:', res.statusCode);
    
    try {
      const json = JSON.parse(data);
      console.log('\n=== 数据结构 ===');
      console.log('总评论数:', json.total);
      console.log('当前页评论数:', json.reviews?.length);
      
      if (json.reviews && json.reviews.length > 0) {
        console.log('\n=== 第一条评论示例 ===');
        const review = json.reviews[0];
        console.log('评论ID:', review.id);
        console.log('作者:', review.author?.name);
        console.log('评分:', review.rating?.value);
        console.log('有用数:', review.useful_count);
        console.log('评论标题:', review.title);
        console.log('评论摘要:', review.abstract?.substring(0, 100));
        console.log('创建时间:', review.created_at);
      }
      
      console.log('\n=== 完整响应 ===');
      console.log(JSON.stringify(json, null, 2));
    } catch (error) {
      console.error('解析JSON失败:', error.message);
      console.log('原始数据:', data);
    }
  });
}).on('error', (error) => {
  console.error('请求失败:', error.message);
});
