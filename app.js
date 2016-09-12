"use strict";
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var redis = require('redis');

var app = express();
//the order of parameter is port,host!
var client = redis.createClient(p,h);

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
		client.hgetall('call',(err,call)=>{
				res.render('index',{
					title:title,
					tasks:reply,
					call:call
				});
		})
	})
})

app.post('/task/add',(req,res)=>{
	var task = req.body.task;
	client.rpush('tasks',task,(err,reply)=>{
		if(err){
			console.log('err');
		}
		res.redirect('/');
	})
})

app.post('/task/delete',(req,res)=>{
	var taskTodel = req.body.tasks;
	client.lrange('tasks',0,-1,(err,reply)=>{
		if(err){
			console.log('err');
		}
		for(let i=0;i<reply.length;i++){
			if(taskTodel.indexOf(reply[i])>-1){
				//refer http://redis.io/commands/lrem
				client.lrem('tasks',0,reply[i],()=>{

				})
			}
		}
		res.redirect('/');
	})
})

app.post('/call/add',(req,res)=>{
	var newcall = {};
	newcall.name = req.body.name;
	newcall.company = req.body.company;
	newcall.phone = req.body.phone;
	newcall.time = req.body.time;
	//note all params should be comma seperated. not colon
	client.hmset('call','name',newcall.name,'company',newcall.company,'phone',newcall.phone,'time',newcall.time, (err,reply)=>{
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
})
app.listen(3000);
module.exports =app;