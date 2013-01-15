/**
 * config
 */

exports.config = {
  name: '个人应用前端小站',
  description: 'waylon',
  version: '0.9',
  title:'个人应用前端小站',
  // site settings
  site_headers: [
    '<meta name="keywords" content="个人应用，前端，分享" />'
  ],
  host: '',
  site_logo: '', // default is `name`
  site_navs: [
    // [ path, title, [target=''] ]
    [ '/photo', '分享图片' ],
    [ '/wd', '分享问题'],
  ],
  site_static_host: '', // 静态文件存储域名

  db: 'mongodb://node_iblog:123456@42.121.3.64/node', //node_iblog readOnly account
  session_secret: 'waylon',
  auth_cookie_name: 'waylon',
  port: 3000, //8080 会于本地nginx端口冲突

  // 话题列表显示的话题数量
  list_topic_count: 20,

  // RSS
  rss: {
    title: '',
    link: '',
    language: '',
    description: '',

    //最多获取的RSS Item数量
    max_rss_items: 50
  },

  // [ { name: 'plugin_name', options: { ... }, ... ]
  plugins: [
 
  ]
};