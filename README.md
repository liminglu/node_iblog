node_iblog
==========

用nodejs+express打造的轻量级博客系统，通过这个项目可以让新手了解nodejs在实际项目的运用

系统自带一个mongodb数据源，如果你本地mongodb数据库，当然你可以在config.js中修改mongodb配置。

环境
==========

如果需要更换系统自带mongdb配置，请首先确认本机已经正确安装mongdb，然后修改系统自带配置(config.js)，最后正确启动mongdb!

如果使用系统自带mongdb配置,请注意，系统默认的mongdb帐号只有读权限.

确保你本机正确安装了nginx和node

如果你本机没有正确安装nginx,请在本次运行brew install nginx,如果本机没有brew命令.

请运行ruby -e "$(curl -fsSkL raw.github.com/mxcl/homebrew/go)" 查考http://mxcl.github.com/homebrew/

安装
==========

将源码clone到本地

将源码中的nginx.conf配置文件复制到你本地的nginx配置文件中，如果你不确定你的配置文件放在哪里，可以使用nginx -V参看详细的nginx配置文件信息


启动

path/to/your/node_iblog/中，使用 node app.js 启动应用

 

