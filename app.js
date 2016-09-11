var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var redis = require('redis');

var app = express();
//the order of parameter is port,host!
var client = redis.createClient('6379','104.131.77.161');

client.on('connect',()=>{
	console.log('t');
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
	var title = 'tasks';
	client.lrange('tasks',0,-1,(err,reply)=>{
		res.render('index',{
			title:title,
			tasks:reply
		});
	})
})

app.listen(3000);
module.exports =app;