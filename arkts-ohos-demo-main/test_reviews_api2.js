// 测试不同的评论API路径
const https = require('https');

const movieId = '35269032';

const urls = [
  `https://api.xiaoweianbao.com/api/douban/movie/${movieId}/reviews?start=0&count=5`,
  `https://api.xiaoweianbao.com/api/douban/movie/${movieId}/comments?start=0&count=5`,
  `https://api.xiaoweianbao.com/api/douban/subject/${movieId}/reviews?start=0&count=5`,
  `https://api.xiaoweianbao.com/api/douban/subject/${movieId}/comments?start=0&count=5`,
];

urls.forEach((url, index) => {
  console.log(`\n测试路径${index + 1}: ${url}`);
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`状态码: ${res.statusCode}`);
      try {
        const json = JSON.parse(data);
        if (json.reviews || json.comments) {
          console.log('✅ 找到评论数据！');
          console.log('数据结构:', JSON.stringify(json, null, 2).substring(0, 500));
        } else {
          console.log('响应:', JSON.stringify(json));
        }
      } catch (error) {
        console.log('响应:', data.substring(0, 200));
      }
    });
  }).on('error', (error) => {
    console.log('错误:', error.message);
  });
});
