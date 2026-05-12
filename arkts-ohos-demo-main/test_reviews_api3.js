// 测试热门电影的评论
const https = require('https');

// 测试几个热门电影
const movieIds = [
  '1292052',  // 肖申克的救赎
  '26752088', // 疯狂动物城
  '25823279', // 美国队长3
];

movieIds.forEach((movieId) => {
  const url = `https://api.xiaoweianbao.com/api/douban/subject/${movieId}/reviews?start=0&count=3`;
  
  console.log(`\n测试电影 ${movieId}: ${url}`);
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`状态码: ${res.statusCode}, 总评论数: ${json.total}, 当前数: ${json.reviews?.length}`);
        
        if (json.reviews && json.reviews.length > 0) {
          console.log('✅ 找到评论！');
          const review = json.reviews[0];
          console.log('  作者:', review.author?.name);
          console.log('  评分:', review.rating?.value);
          console.log('  标题:', review.title);
          console.log('  摘要:', review.abstract?.substring(0, 80));
        }
      } catch (error) {
        console.log('解析失败:', data.substring(0, 100));
      }
    });
  }).on('error', (error) => {
    console.log('错误:', error.message);
  });
});
