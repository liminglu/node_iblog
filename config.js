/**
 * config
 */

exports.config = {
  name: '个人应用前端小站',
  description: 'waylon',
  version: '0.9',
  title:'玩意儿',
  // site settings
  site_headers: [
    '<meta name="author" content="@俊孺生" />',
    '<meta name="keywords" content="liminglu,waylon,百变衣橱，百变，个人应用，前端" />'
  ],
  host: '',
  site_logo: '', // default is `name`
  site_navs: [
    // [ path, title, [target=''] ]
    [ '/photo', '分享图片' ],
    [ '/wd', '分享问题'],
  ],
  site_static_host: '', // 静态文件存储域名

  db: 'mongodb://waylon:123456@42.121.3.64/node',
  session_secret: 'waylon',
  auth_cookie_name: 'waylon',
  port: 3000, //8080

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

  // mail SMTP
  mail_port: 25,
  mail_user: 'app_wd',
  mail_pass: 'zhuzhijia1985',
  mail_host: 'smtp.126.com',
  mail_sender: 'app_wd@126.com',
  mail_use_authentication: true,
  
  //weibo app key
  weibo_key: 10000000,

  // admin 可删除话题，编辑标签，设某人为达人
  admins: { admin: true },

  // [ { name: 'plugin_name', options: { ... }, ... ]
  plugins: [
 
  ]
};