var mailer = require('nodemailer');
var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;
var util = require('util');
mailer.SMTP = {
  host: config.mail_host,
  port: config.mail_port,
  use_authentication: config.mail_use_authentication,
  user: config.mail_user,
  pass: config.mail_pass
};

var SITE_ROOT_URL = 'http://' + config.hostname + (config.port !== 80 ? ':' + config.port : '');

/**
 * keep all the mails to send
 * @type {Array}
 */
var mails = [];
var timer;
/**
 * control mailer
 * @type {EventProxy}
 */
var mailEvent = new EventProxy();
/**
 * when need to send an email, start to check the mails array and send all of emails.
 */
mailEvent.on("getMail", function () {

  if (mails.length === 0) {
    return;
  } else {
    //遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
    var failed = false;
    for (var i = 0, len = mails.length; i < len; ++i) {
      var message = mails[i];
      mails.splice(i, 1);
      i--;
      len--;
      var mail;
      try {
        message.debug = false;
        mail = mailer.send_mail(message, function (error, success) {
          if (error) {
            mails.push(message);
            failed = true;
          }
        });
      } catch(e) {
        mails.push(message);
        failed = true;
      }
      if (mail) {
        var oldemit = mail.emit;
        mail.emit = function () {
          oldemit.apply(mail, arguments);
        };
      }
    }
    if (failed) {
      clearTimeout(timer);
      timer = setTimeout(trigger, 60000);
    }
  }
});

/**
 * trigger email event
 * @return {[type]}
 */
function trigger() {
  mailEvent.trigger("getMail");
}

/**
 * send an email
 * @param  {mail} data [info of an email]
 */
function send_mail(data) {
  if (!data) {
    return;
  }
  /*
if (config.debug) {
    console.log('******************** 在测试环境下，不会真的发送邮件*******************');
    for (var k in data) {
      console.log('%s: %s', k, data[k]);
    }
    return;
  }
*/
  mails.push(data);
  trigger();
  console.log('debug send mail');
}

function send_active_mail(who, token, name, email, cb) {
  var sender =  config.mail_sender;
  var to = who; 
  var subject = config.name + '社区帐号激活';
  var html = '<p>您好：<p/>' +
    '<p>我们收到您在' + config.name + '社区的注册信息，请点击下面的链接来激活帐户：</p>' +
    '<a href="' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '&email=' + email + '">激活链接</a>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' +config.name +'社区 谨上。</p>';
  var data = {
    sender: sender,
    to: to,
    subject: subject,
    html: html
  };
  cb (null, true);
  send_mail(data);
}
function send_reset_pass_mail(who, token, name, cb) {
  var sender = config.mail_sender;
  var to = who; 
  var subject = config.name + '社区密码重置';
  var html = '<p>您好：<p/>' +
    '<p>我们收到您在' + config.name + '社区重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
    '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">重置密码链接</a>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name +'社区 谨上。</p>';

  var data = {
    sender: sender,
    to: to,
    subject: subject,
    html: html
  };

  cb (null, true);
  send_mail(data);
}

function send_reply_mail(who, msg) {
  var sender =  config.mail_sender;
  var to = who; 
  var subject = config.name + ' 新消息';
  var html = '<p>您好：<p/>' +
    '<p>' +
    '<a href="' + SITE_ROOT_URL + '/user/' + msg.author.name + '">' + msg.author.name + '</a>' +
    ' 在话题 ' + '<a href="' + SITE_ROOT_URL + '/topic/' + msg.topic._id + '">' + msg.topic.title + '</a>' +
    ' 中回复了你。</p>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name +'社区 谨上。</p>';

  var data = {
    sender: sender,
    to: to,
    subject: subject,
    html: html
  };

  send_mail(data);

}

//问答系统邮件模板
function send_reply_mail2(who, msg) {
  var sender =  config.mail_sender;
  var to = who; 
  var subject = config.name + ' 新消息';
  var nid = msg.note_id || msg._id;
  var site = 'http://www.liminglu.cn/wd#' + nid;
  var html = '<p>您好：<p/>' +
    '<p>' +
    
    ' 有人回复了你的 ' + '<a href="' + site + '" >' + msg.title + '</a>' +
    ' 这个问题，快去看看吧。</p>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name +'社区 谨上。</p>';

  var data = {
    sender: sender,
    to: to,
    subject: subject,
    html: html
  };
	
/*   console.log('--mail--debug--html' + data.html + ' ,sender' + data.sender); */
  send_mail(data);

}

//问答系统newsletter
function send_newsletter(msg) {
	var sender = config.mail_sender;
	var test = 'minglu.li@alipay.com';
	var to = 'minglu.li@alipay.com,qi.lqlq@alipay.com,yuanze@alipay.com,xiaoming.wang@alipay.com,hua.lu@alipay.com,feng.cheng@alipay.com'; 
	var subject = '个人应用-问道简报';
	var cnt = '';
	//遍历msg内容
	for(var i = 0,j = msg.length;i < j;i++) {
		var answer = '';
		//先遍历答案
		if(msg[i][0].content && msg[i][0].content.length > 0) {
			for(var m = 0,n = msg[i][0].content.length;m < n;m++) {
				//先遍历评论
				var shit = '';
				
				if(msg[i][0].content[m].shit != '' && typeof msg[i][0].content[m].shit != 'undefined') {
/* 					console.log('debug-shit :' + msg[i][0].content[m].shit); */
					shit += '<div class="p-excerpt excerpt-bg" style="margin:20px;color: #666;line-height: 1.6;-webkit-box-shadow: inset 0 1px 0 white,0 1px 5px #EEE;-moz-box-shadow: inset 0 1px 0 white,0 1px 5px #eee;box-shadow: inset 0 1px 0 white,0 1px 5px #EEE;background-color: #FAFAFA;border: 1px solid #E6E6E6;border-bottom-color: #D6D6D6;padding: 10px;min-height: 50px;"><p>' + msg[i][0].content[m].shit + '</p></div>';
				}
				answer += '<div class="p-excerpt excerpt-bg" style="margin: 15px 0 2px;color: #666;line-height: 1.6;-webkit-box-shadow: inset 0 1px 0 white,0 1px 5px #EEE;-moz-box-shadow: inset 0 1px 0 white,0 1px 5px #eee;box-shadow: inset 0 1px 0 white,0 1px 5px #EEE;background-color: #FAFAFA;border: 1px solid #E6E6E6;border-bottom-color: #D6D6D6;padding: 10px;min-height: 50px;"><p>' + msg[i][0].content[m].content + '</p>' + shit +'</div>';
			}
		}
		var label = msg[i][0].label ? msg[i][0].label : '';
		cnt += '<article class="post" style="border-bottom: 1px solid #E6E6E6;padding: 14px 10px;word-wrap: break-word;"id="'+ msg[i][0]._id + '">' + '<h2 style="font-size: 15px;margin: 0 0 10px;"><a href="http://www.liminglu.cn/wd#' + msg[i][0]._id + '" title=' + msg[i][0].title + '>' + msg[i][0].title + '</a><sup style="position: relative;top: -10px;color: red;font-weight: 600;">' + label + '</sup></h2>' + answer + '</article>'; 
	}
	var html = '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse !important;border-spacing: 0 !important;">'
	+ 
	'<tbody>'+
        '<tr>'+
            '<td align="center" valign="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse !important;border-spacing: 0 !important;">'+
                '<table align="left" border="0" cellpadding="0" cellspacing="0" id="templateTitleContainer" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse !important;border-spacing: 0 !important;">'+
       '<tbody>'+
         '<tr>'+
           '<td valign="top" class="headerContent" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;color: #3f3f38;font-family: Arial;font-size: 14px;font-weight: normal;line-height: 150%;text-align: left;border-collapse: collapse !important;border-spacing: 0 !important;">'+
               '<h1 class="h1" style="color: #394a57;display: block;font-family: Arial;font-size: 30px;font-style: normal;font-weight: normal;line-height: 100%;letter-spacing: normal;margin-top: 0;margin-right:0;margin-bottom: 10px;margin-left: 0;text-align: left;">个人应用-问道简报</h1>'+
			'<h4 class="h4" style="display: block;font-family: Georgia;font-size: 16px;font-style: italic;font-weight: normal;line-height: 100%;letter-spacing: normal;text-shadow: 0 1px 0 #FFFFFF;margin-top: 0;margin-right: 0;margin-bottom: 10px;margin-left: 0;text-align: left;color: #0067b1 !important;">'+
			'<span style="color:3f3f38;">December 2012</span></h4>' +
               '<div id="magicdomid6">' +
                   '<div id="magicdomid4">问道-通过问答的形式来解决日常中遇到的问题。但这并不是我们的初衷，我们是想让大家的思想传播的更远、保持的更久，帮助到更多的人!如果你也是这样的一群人，那快快加入我们吧!</div>' +
                     '<div id="magicdomid5"></div>' +
                         '<div id="magicdomid6">我们会定期发送社区中有营养的问题,供大家参考、消遣 <a href="http://www.liminglu.cn/wd" style="color: #08C;font-weight: normal;text-decoration: underline;">问道社区</a></div></div><div>'+ cnt +'</div>'+
       '<div id="magicdomid8">-个人应用前端小组</div>'+
       '</td></tr></tbody></table>'+
            '</td>'+
        '</tr>'+
    '</tbody>'+
'</table>';

var data = {
    sender: sender,
    to: to,
    subject: subject,
    html: html
  };

  send_mail(data);

}

function send_at_mail(who, msg) {
  var sender =  config.mail_sender;
  var to = who; 
  var subject = config.name + ' 新消息';
  var html = '<p>您好：<p/>' +
    '<p>' +
    '<a href="' + SITE_ROOT_URL + '/user/' + msg.author.name + '">' + msg.author.name + '</a>' +
    ' 在话题 ' + '<a href="' + SITE_ROOT_URL + '/topic/' + msg.topic._id + '">' + msg.topic.title + '</a>' +
    ' 中@了你。</p>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' +config.name +'社区 谨上。</p>';

  var data = {
    sender: sender,
    to: to,
    subject: subject,
    html: html
  };

  send_mail(data);
}

exports.send_active_mail = send_active_mail;
exports.send_reset_pass_mail = send_reset_pass_mail;
exports.send_reply_mail = send_reply_mail;
exports.send_reply_mail2 = send_reply_mail2; //问答系统邮件模板
exports.send_at_mail = send_at_mail;
exports.send_newsletter = send_newsletter; //发送问答简报