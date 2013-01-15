/*!
 * 
 * MIT Licensed
 */

/**
 * Module dependencies.
 */


var blog = require('./controllers/blog');


//auth_user 会调用message
//var message = require('./controllers/message');

var fs = require('fs');

exports = module.exports = function(app) {
  // home page

   
   app.get('/photo', blog.photo);
   app.post('/photo', blog.photo);
   app.get('/blog', blog.list);
   app.get('/jpblog',blog.jsonpBlog) //jsonp blog
   app.get('/blog/add', blog.add);
   app.get('/blog/:tid', blog.read);
   app.post('/blog/create', blog.create);
   app.post('/blog/:tid/reply', blog.reply);


  
/*
   app.get('/download', function(req, res){
	  var filename = '/home/waylon/nodeApp/public/BaiBianYiChuSVN_demo.apk';
	  res.attachment(filename);
	  fs.readFile(filename, function (err, data) {
		  if (err) throw err;
		  res.write(data, 'binary');
		  res.end();
		});
	
	});
*/

	
	/* 404 */
	app.get('*',function(req,res) {
		res.render('404.html');
	})
   
};
