"use strict";

/**
 * Module dependencies.
 */

var Blog = require('../models').Blog;
var Reply = require('../models').Reply;
var sanitize = require('validator').sanitize;
var EventProxy = require('eventproxy').EventProxy;
var Util = require('../libs/util');

var http	= require('http');
var url		= require('url');



//jsonp blog

exports.jsonpBlog = function(req,res,next) {
	 
  var options = {sort: [[ 'create_at', 'desc' ]]}; 
  Blog.find(function(err,blog) {
  //先查出所有的博客数
  if(blog.length == 0) {
    render();
    return;
  }
  	Blog.find({},['_id'],options, function (err, blogs) { 
    if (err) {
      return next(err);
    }
    
    var render = function(blogs) {    		
		res.json({
	      stat:'success',
	      blogs:blogs
	      
	    });
    }
    if(blogs.length == 0) {
    	render();
    	return;
    }
    	       	
	//创建notes代理事件
	 var proxy = new EventProxy();
	 var _blog = [];
	 var count = 0;
		 		
    proxy.assign('queryed',render);
	
	for(var i = 0,j = blogs.length; i < j ;i++) {
		    		
		Blog.find({_id:blogs[i]},function(err,blog) {
			
			 count++;
			 _blog.push(blog);
			
			 if(count == j) {
			 
			 	proxy.trigger('queryed',_blog); 
			 }
		})   		
	}
  });
}) //博客数量
}
//list blog

exports.list = function(req, res, next) {
 
 
  if(req.session.user) {
  	res.local('current_user',req.session.user);
  }
  //分页，用于显示当前页面数据
  var page =  0;
  var skip =  0;
  var currentPage = 1; //默认第一页
  //手机还是pc样式
  var baseCss = '<link rel="stylesheet" href="../stylesheets/blog.css" type="text/css" media="screen" />';
  //微博模块
  var weibo = '<wb:list appkey="1867004476" titlebar="bottom" width="240" height="500" listid="515448061" uid="1367322983" ></wb:list>';
  //页面风格,默认wndow8风格
  var pageStyle = 'window8';
  
  if(req.url.indexOf('page') != -1) {
  	page = parseInt(req.url.match(/page=(.+?)/)[1]);
  	currentPage = page;
  	page = page - 1;
  	
/*   	console.log(req.url.match(/page=(.+?)/)[1]); */
    skip = page * 7;
  }
  
  if(req.url.indexOf('switch=mobile') != -1) {
  	baseCss = '<link rel="stylesheet" href="../stylesheets/blog_mobile.css" type="text/css" media="screen" />';
  	//手机端不显示微博
  	weibo = '';
  	//重置页面风格
  	pageStyle = '';
  }else if(req.url.indexOf('style') != -1) {
  	//当分页大于10，修改正则表达式(.+),否则匹配不准
  	pageStyle = req.url.match(/style=(.+)/)[1];
  	console.log('pageStyle:' + pageStyle);
  } 
  
  var options = {limit:7,sort: [[ 'create_at', 'desc' ]],skip:skip };
  
 
  Blog.find(function(err,blog) {
  //先查出所有的博客数
  if(blog.length == 0) {
    render();
    return;
  }
  var blogCount = blog.length;
  
  	Blog.find({},['_id'],options, function (err, blogs) { 
    if (err) {
      return next(err);
    }
    
    var render = function(blogs) {    		
    		 res.render('blog/list.html',{
				style:'<link rel="stylesheet" href="../stylesheets/profile.css" type="text/css" media="screen" />' + baseCss,
				blogs:blogs,
				blogCount:blogCount,
				currentPage:currentPage,
				weibo:weibo,
				pageStyle:pageStyle
			});
    }
    if(blogs.length == 0) {
    	render();
    	return;
    }
    	       	
    	//创建notes代理事件
 		 var proxy = new EventProxy();
 		 var _blog = [];
 		 var count = 0;
 		 		
 		 proxy.assign('queryed',render);

    	for(var i = 0,j = blogs.length; i < j ;i++) {
    		    		
    		Blog.find({_id:blogs[i]},function(err,blog) {
    			
    			 count++;
    			 _blog.push(blog);
    			
    			 if(count == j) {
    			 
    			 	proxy.trigger('queryed',_blog); 
    			 }
			})   		
    	}
  });
}) //博客数量
  

	
	
	
}

//add blog

exports.add = function(req, res, next) {
	
	//show all blog by asc 
	
	//var options = { sort: [ [ 'finished', 'asc' ], [ '_id', 'desc' ] ] };
	
	res.render('blog/create.html',{
		style:'<link rel="stylesheet" href="../stylesheets/profile.css" type="text/css" media="screen" />'
	});
	
}

//create blog

exports.create = function(req, res, next) {
	
	//method
	var method = req.method.toLowerCase();
	
	if(method == 'post') {
		
		var title = sanitize(req.body.title).trim();
    	title = sanitize(title).xss();
    	
    	var content = sanitize(req.body.content).trim();
    	content = sanitize(content).xss();
    	
    	var blog = new Blog();
    	
	    blog.title = title;
	    blog.content = content;
	    
	    blog.created_at = new Date();
    	
		blog.save(function (err) {
		    if (err) {
		       
		      return next(err);
		    }
		    
		    
		    res.json({
		      stat:'success'
		    });
		    
		  });
		  
	}
	
	
}

//read blog 继续阅读 
// 如果有评论添加评论

exports.read = function(req, res, next) {
	
	//blog id
	var blog_id = req.params.tid;
	
	Blog.find({_id:blog_id},function(err,blog) {
    			
    	//加载博客评论
    	Reply.find({topic_id:blog_id},function(err,reply) {
    		res.render('blog/read.html',{
				style:'<link rel="stylesheet" href="/stylesheets/profile.css" type="text/css" media="screen" />',
				blogs:blog,
				replys:reply
			});	
    	})		
	}) 
	
	
}

//reply blog 评论

exports.reply = function(req, res, next) {
	
	//blog id
	var blog_id = req.params.tid;
	
	//reply author
	var author = req.body.author;
	// reply content
	var content = req.body.comment;
    

  var str = sanitize(content).trim();
  if(str == ''){
    res.render('notify/notify',{error:'回复内容不能为空！'});
    return;
  }
  
  var render = function(){
    res.redirect('/blog/' + blog_id);
  };
  var proxy = new EventProxy();
  proxy.assign('reply_saved',render);

  var reply = new Reply();
  reply.nickname = author;
  reply.content = content;
  reply.topic_id = blog_id; 
/*   reply.author_id = req.session.user._id; */
  reply.save(function(err){
    if(err) return next(err);
    Blog.findOne({_id:blog_id},function(err,blog){
      if(err) return next(err);
      blog.last_reply = reply._id;
      blog.last_reply_at = new Date();
      blog.reply_count += 1;
      blog.save()
      proxy.trigger('reply_saved');
      //发送at消息
/*       at_ctrl.send_at_message(content,topic_id,req.session.user._id); */
    });
  });

	
	
}

//fetch photo 

exports.photo = function(req, res, next) {

		/*
		 * Starting Link
		*/
		//method
	var method = req.method.toLowerCase();
	
	
		var imgRegex = new RegExp("<img(.*?)(/?)>","gi");
		//img package
		var packages = [];
		//buffer info
		var stack = '';
		//no fetch data tip
		var tip = '';
		
		//fetch site
		if(method == 'post') {
		
		var url = req.body.url.replace('http://','');

		var host = null;
		var path = null;
		
		console.log('访问者正在访问的是: ' + url);
		
		if(url.indexOf('/') == -1) {
			url += '/';
		}
		
		if(url.indexOf('.com') != -1 && url.indexOf('.com.cn') == -1 && url.indexOf('.com.hk') == -1) {
			host = url.split('.com/')[0] + '.com';
			path = url.split('.com/')[1];
			if(path != '') {
				path = '/' + path;
			}
		}else if(url.indexOf('.cn') != -1 && url.indexOf('.com.cn') == -1 ){
			host = url.split('.cn/')[0] + '.cn';
			path = url.split('.cn/')[1];
			if(path != '') {
				path = '/' + path;
			}
		}else if(url.indexOf('.com.cn') != -1 ) {
			host = url.split('.com.cn/')[0] + '.com.cn';
			path = url.split('.com.cn/')[1];
			if(path != '') {
				path = '/' + path;
			}
		}else if(url.indexOf('.com.hk') != -1 ) {
			host = url.split('.com.hk/')[0] + '.com.hk';
			path = url.split('.com.hk/')[1];
			if(path != '') {
				path = '/' + path;
			}
		}
		
		
		
		var baseOptions = {
			host : host,
			port : 80,
			path : path
		};
		
		console.log('debug fetch photo host' + host + ' path ' + path );
		
		http.get(baseOptions, function(response){
			
/* 			console.log('HEADERS: ' + JSON.stringify(response.headers));		 */
			if(response.statusCode != 200 && response.statusCode == 302)
			{
				console.error("302 redirect " + response.headers.location);
/* 				process.exit(); */
				//如果302跳转，发起login
				var data = JSON.stringify({'email':'zuccliminglu@yahoo.com.cn','origURL':'photo.renren.com/photo/230603203/album-354567931','password':'7c64807d41383a5591e76677b35741fc983b825e2e76b26a34012bf8e29bf85f','rkey':'d0cf42c2d3d337f9e5d14083f2d52cb2','domain':'renren.com','key_id':'1','captcha_type':'web_login','icode':'1111'});
				
				var _options = {
				  host: 'www.renren.com',
				  port: 80,
				  path: '/ajaxLogin/login?1=1&uniqueTimestamp=2012104956463',
				  method: 'POST'
				};
				
				var _req = http.request(_options, function(_res) {
				
													  
/* 				  console.log('STATUS: ' + _res.statusCode); */
/* 				  console.log('HEADERS: ' + JSON.stringify(_res.headers)); */
				  _res.setEncoding('utf8');
				  
				  
				  _res.on('data', function (chunk) {
				    console.log('BODY: ' + chunk);
				  });
				  
				  _res.on('end',function() {
				  		//暂时不做登陆处理
				  		
				  		tip = '朋友,门口买票才能进!!'
/* 				  		console.log('302 ' + tip); */
				  		res.render('blog/photo.html',{
							packages:packages,
							tip:tip,
							style:'<link rel="stylesheet" href="/stylesheets/profile.css" type="text/css" media="screen" />'
						});
/* 						return; */
				  })
				  
				});
				
/*
				_req.on('socket',function(socket) {
					for(var key in socket) {
						console.log(socket[key]);
					}
				})
*/
				
				_req.on('error', function(e) {
				  console.log('problem with request: ' + e.message);
				});
				
				// write data to request body
				_req.write(data + '\n');
				_req.end();
				
			};
			
			
			response.on('data', function(chunk){
				stack += chunk;
			
			});
			
			response.on('end', function(){
			
/* 				console.log('debug respone data' + stack); */
				
				var match = null;
		
				while(match = imgRegex.exec(stack))
				{
					//清除图片上的onload事件
					var img = match[0].replace('onload','offload');
					//douban shit! data-src 
					if(img.indexOf('data-src') != -1) {
						img = img.replace('src','waylon');
						img = img.replace('data-src','src');
					}
					
					packages.push(img);
				}
				
				if(packages.length == 0) {
					tip = '忍了吧,人家不让抓!!';
				}

				res.render('blog/photo.html',{
					packages:packages,
					tip:tip,
					style:'<link rel="stylesheet" href="/stylesheets/profile.css" type="text/css" media="screen" />'
				});
			});
		}).on('error', function(e) {
		    console.log("Got error<getting base>: " + e.message);
		});
	    			
		
	}else {
		res.render('blog/photo.html',{
					packages:packages,
					tip:tip,
					style:'<link rel="stylesheet" href="/stylesheets/profile.css" type="text/css" media="screen" />'
		});
	}
}


//alipay temp 

exports.temp = function(req, res, next) {
	    			
		res.render('blog/temp.html');

}