/**
 * Module dependencies.
 */
var express = require('express');
var net=require('net');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var connection= require('./models/db');
var userList=require('./models/userList');
var groupList=require('./models/groupList');
//ListenHandler���ڴ���ͻ��˸����������Ϣ
var ListenHandler = require('./models/listenHandler');
var buff=require('./models/buffer');
var log=require('./models/log');
var httpcli=require('./models/httpclient');
 
/**
 *��������
 */ 
var onlineUsers=new userList();//����Ա��socket
var onlineGuests=new userList();//�����ο�socket
var type;//�ͻ������ͣ�pc��/�ƶ���
var onlineGroups = new groupList(connection);//��������Ⱥ����Ϣ
//��ʼ��Ⱥ��
onlineGroups.initGroup();

/**
 *http������
 */
//����Ӧ�ò����г�ʼ����
var app = express();
log.use(app);
var port=process.env.PORT||3001;
app.configure(function(){
	app.set('port',port);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	//app.use(express.bodyParser({uploadDir:'./uploadfiles'}));
	app.use(express.bodyParser());
	app.use(express.urlencoded()); 
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(express.static(path.join(__dirname, '/uploadfiles')));
});

routes(app);
var server1 = http.createServer(app);
var io = require('socket.io').listen(server1,{log:false});
 
//�����������ⲿpost����
app.post('/workflow',function(req,res){
	ListenHandler.workFlowHandler(req,res,onlineUsers,onlineGroups);
});
//��ϯ��Ϣ
app.post('/agent',function(req,res){
	ListenHandler.agentHandler(req,res,onlineGuests);
});
http.createServer(function(req,res){
	console.log(req.url+' '+'connected');
   
  var itv=setInterval(function(){
    res.write(new Date+'');
  },1000);
   
  req.connection.on('close',function(){
    console.log(req.url+' '+'disconnected');
    clearInterval(itv);
  });
}).listen(3001);
//��������socket
/*
io.sockets.on('connection',function(socket){
	//console.log(req.url+' '+'connected');
	type='WEB_SOCKET'; 
	var clientIp=socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
	console.log(socket.handshake);
	//ÿ���пͻ�������ʱ����ͻ����������������Ա��������ʱ���ᶪʧ�ͻ���
	socket.emit('reLogin');
	//���յ�¼������֤��¼��Ϣ
	socket.on('login', function(data){
		ListenHandler.loginHandler(connection, data, socket,onlineGuests,onlineUsers,type); 
	});
	//������ҵ��֯�ṹ����
	socket.on('grpsCorp', function(data){ 
		ListenHandler.grpsCorpHandler(connection, data, socket,type);
	});
	//����˽���б�����
	socket.on('users', function(data){ 
		ListenHandler.usersHandler(connection, data, socket,type);
	});
	//����Ⱥ���б�����
	socket.on('groups', function(data){ 
		ListenHandler.groupsHandler(data, socket,onlineGroups,type);
	});
	//���չ˿���ѯ��ת��
	socket.on('consult',function(data){
		ListenHandler.consultHandler(data, socket,type);
	});
	//�����ڲ�˽����Ϣ��ת��
	socket.on('message', function(data){ 
		ListenHandler.messageHandler(connection, data, socket, onlineUsers,type);
	});
	//����Ⱥ��Ϣ��Ⱥ��
	socket.on('groupMessage', function(data){
		ListenHandler.groupMessageHandler(connection, data, onlineUsers,onlineGroups,socket,type);
	});
	//δ����Ϣ����
	socket.on('unreadMessages', function(data){
		ListenHandler.unreadMessagesHandler(data, socket,type);
	});
	//�����ļ�������Ϣ
	socket.on('sendFile', function(data){
		ListenHandler.sendFileHandler(connection, data, socket, onlineUsers, onlineGuests,type);
	});
	//����ͨ����¼
	socket.on('convers',function(data){
		ListenHandler.conversHandler(connection,data,socket,onlineGroups,type);
	});	
	
	//���ս�Ⱥ����
	socket.on('createGroup', function(data){
		ListenHandler.createGroupHandler(data, socket, onlineUsers,onlineGroups,type);
	});
	//���ձ༭Ⱥ����Ϣ����
	socket.on('editGroup', function(data){
		ListenHandler.editGroupHandler(socket, data, onlineUsers,onlineGroups,type);
	});	
	//����ɾ��Ⱥ������
	socket.on('deleteGroup', function(data){
		ListenHandler.deleteGroupHandler(data, socket, onlineUsers,onlineGroups,type);
	});
	//������ӳ�Ա����
	socket.on('addMember',function(data){
		ListenHandler.addMemberHandler(data, socket, onlineUsers,onlineGroups,type);
	});
	//����ɾ����Ա����
	socket.on('delMember',function(data){
		ListenHandler.delMemberHandler(data, socket, onlineUsers,onlineGroups,type);
	});
	//����Ա���ǳ���Ϣ  
	socket.on('logout',function(data){
		ListenHandler.logoutHandler(data, onlineUsers,onlineGuests,socket,type);
	});	
	//�û�δͨ���ǳ���ťʧȥ����(�������û��ر�ҳ��)
	socket.on('disconnect',function(){ 
		ListenHandler.disconnectHandler(socket, onlineUsers,onlineGuests,type);
	});
	//����Ա����Ϣ�¼�
	socket.on('login_admin',function(data){
		ListenHandler.loginAdminHandler(connection, data, socket,onlineUsers,type); 
	});
	socket.on('members',function(data){
		ListenHandler.membersHandler(connection, data, socket,type);
	});
	socket.on('grps',function(data){
		ListenHandler.grpsHandler(data, socket,onlineGroups,type);
	});
});
app.configure('development', function(){
	app.use(express.errorHandler());
});
//����δ����׽���쳣
process.on('uncaughtException', function(err){
	console.log(err);
}); 
server1.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
 */
/**
 *tcp������
 */
var server2=net.createServer();
server2.on('connection',function(socket){
	console.log('got a new connection');
	type='SOCKET';
	var buf=new buff(1024);
	socket.on('data',function(data){
		console.log('got data:'+data);
		buf.setCont(data);
		console.log(buf.getLen());
		while(buf.length){
			var info=buf.get();
			if(info){
				console.log(info);
				//��������
				regularize(socket,info,type);
			}
		}
		
	});
	socket.on('close',function(){
		console.log('connection closed');
		ListenHandler.disconnectHandler(socket, onlineUsers, onlineAgents,onlineGuests, help,type);
		console.log('del socket');
	});
});
server2.on('error',function(err){
	console.log('Server error:'+err.message);
});
server2.on('close',function(){
	console.log('Server closed!');
});

server2.listen(4002,function(){
	console.log('Tcp server listening on port 4002');
});
/**
 *��������
 */
 function regularize(socket,data,type){
	var cmd_re=/(\w+)[:](.*)/;
	var cmd_match=cmd_re.exec(data);
			 
	if(cmd_match){
		var command=cmd_match[1];
		var args=cmd_match[2];
		args=JSON.parse(args);
		exec_cmd(socket,command,args,type);
	}
	 
 }
function exec_cmd(socket,command,args,type){
	console.log("command:"+command);
	switch(command){
		case 'login':
			ListenHandler.loginHandler(connection, args, socket,onlineAgents,onlineGuests,onlineUsers,type);
			break;
		case 'users':
			ListenHandler.usersHandler(connection, args, socket,type);
			break;
		case 'groups':
			ListenHandler.groupsHandler(args, socket,onlineGroups,type);
			break;
		case 'msg':
			ListenHandler.messageHandler(connection, args, socket, onlineUsers, onlineGuests, onlineAgents, help,type);
			break;
		case 'groupMsg':
			ListenHandler.groupMessageHandler(connection, args, onlineUsers,onlineGroups,socket,type);
			break;
		case 'unread':
			ListenHandler.unreadMessagesHandler(args, socket,type);
			break;
		case 'sendFile':
			ListenHandler.sendFileHandler(connection, args, socket, onlineUsers, onlineGuests, onlineAgents, help,type);
			break;
		case 'convers':
			ListenHandler.conversHandler(connection,args,socket,onlineGroups,type);
			break;
		case 'creGroup':
			ListenHandler.createGroupHandler(args, socket, onlineUsers,onlineGroups,type);
			break;
		case 'editGroup':
			ListenHandler.editGroupHandler(socket, args, onlineUsers,onlineGroups,type);
			break;
		case 'delGroup':
			ListenHandler.deleteGroupHandler(args.groupName,args.corpId, socket, onlineUsers,onlineGroups,type);
			break;
		case 'addMember':
			ListenHandler.addMemberHandler(args, socket, onlineUsers,onlineGroups,type);
			break;
		case 'delMember':
			ListenHandler.delMemberHandler(args, socket, onlineUsers,onlineGroups,type);
			break;
		case 'logout':
			ListenHandler.logoutHandler(args, onlineUsers, onlineAgents, help,socket,type);
			break;
	}
}

