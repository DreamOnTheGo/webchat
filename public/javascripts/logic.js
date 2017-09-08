Logic=function(msg,corpId,roleKey,empId,pw){
	this.msg=msg;
	this.isLogin=false;
	this.firstConnect=true;
	this.connect;
	this.socket=this.initSocket();
	this.empId=empId||'';
	this.pw=pw||'';
	this.corpId=corpId;
	this.roleKey=roleKey;
	//由view触发
	this.msg.on("login",this.login,this);
	this.msg.on('login_admin',this.login_admin,this);
};
/**
 *请求企业组织结构
 */
 Logic.prototype.grpsCorp=function(){
	if(this.isLogin)
		this.socket.emit('grpsCorp',{corpId:this.corpId,empId:this.empId});
};
Logic.prototype.returnGrps=function(data){
	console.log(data);
	this.msg.fireEvent('returnGrps',data);
};
/**
 *管理员模块
 */
 Logic.prototype.members=function(){
	 if(this.isLogin)
		this.socket.emit('members',{empId:this.empId,corpId:this.corpId});
 };
 Logic.prototype.grps=function(){
	 if(this.isLogin)
		this.socket.emit('grps',{empId:this.empId,corpId:this.corpId});
 };
/**
 *返回用户列表
 */
Logic.prototype.persons=function(){
	if(this.isLogin)
		this.socket.emit('users',{empId:this.empId,corpId:this.corpId});
};
Logic.prototype.returnPersons=function(data){
	console.log(data);
	this.msg.fireEvent('returnPersons',data);
	
};
/**
 *返回群组列表
 */
Logic.prototype.groups=function(){
	if(this.isLogin)
		this.socket.emit('groups',{empId:this.empId,corpId:this.corpId});
};
Logic.prototype.returnGroups=function(data){
	console.info(data);
	this.msg.fireEvent('returnGroups',data);
};
/**
 *监听窗口状态
 */
 
 Logic.prototype.winOpen=function(winId){
	console.log('logic open');
	this.msg.fireEvent('modStatus_open',winId);
 };
 Logic.prototype.winClose=function(winId){
	console.log('logic close');
	this.msg.fireEvent('modStatus_close',winId);
 };
 Logic.prototype.delConversation=function(winId){
	this.msg.fireEvent('delWin',winId);
 };
 
 /**
 *获取会话历史记录
 */
Logic.prototype.getSession=function(id,count){
	this.msg.fireEvent('getHistory',id,count);
};
/**
 *发送私信消息
 */
Logic.prototype.sendMsg=function(send_name,rece,rece_name,cont){
	console.log('msg',rece);
	if(this.isLogin)
		this.socket.emit('message',{sender:this.empId,sender_name:send_name,corpId:this.corpId,receiver:rece,receiver_name:rece_name,content: cont});
};
Logic.prototype.msg_succeed=function(data){ 
	var msg;
	if(data.sender_name!='GUEST'){
		msg={'id':data.receiver,'name':data.receiver_name,'content':data.content,'time':data.time,'ty':2};
		this.msg.fireEvent('rcv',msg);
	}
	this.msg.fireEvent('sendMsg_succeed',data);
};
Logic.prototype.recMsg=function(data){
	console.log(data);
	var msg;
	if(data.receiver_name=='GUEST'){
		msg={'id':data.sender,'name':data.sender_name,'content':data.content,'time':data.time,'ty':3};
		this.msg.fireEvent('winStatus',msg,data.receiver);
	}
	else {
		msg={'id':data.sender,'name':data.sender_name,'content':data.content,'time':data.time,'ty':2};
		this.msg.fireEvent('snd',msg);
		this.msg.fireEvent('winStatus',msg);
	} 
};
Logic.prototype.sendMsg_guest=function(cont){
	if(this.isLogin){
		this.socket.emit('consult',{sender:this.empId,sender_name:this.roleKey,content:cont,corpId:this.corpId});
	}	
};
/**
 *发送群组消息
 */
Logic.prototype.sendGroupMsg=function(send_name,gro,type,cont,ti,admin){
	if(this.isLogin)
		this.socket.emit('groupMessage', {sender: this.empId,sender_name:send_name,corpId:this.corpId,groupName: gro,groupType:type,chairMen:admin, content: cont, time: ti});
};
Logic.prototype.recGroupMsg=function(data){
	var msg={'id':data.groupName,'chair':data.chairMen,'name':data.sender_name,'content':data.content,'time':data.time,'ty':data.groupType};
	this.msg.fireEvent('snd',msg);
	this.msg.fireEvent('winStatus',msg); 
};
Logic.prototype.groupMsg_succeed=function(data){
	var msg={'id':data.groupName,'chair':data.chairMen,'name':data.sender_name,'content':data.content,'time':data.time,'ty':data.groupType};
	this.msg.fireEvent('rcv',msg);
	this.msg.fireEvent('sendGroupMsg_succeed',data);
};
/**
 *消息处理
 */
 Logic.prototype.winStatus_suc=function(status,data){
	if(status){
		if(data.ty==2||data.ty==3)this.msg.fireEvent('recMsg',data);
		else this.msg.fireEvent('recGroupMsg',data);
	}
	else{
		 this.msg.fireEvent('modCount',data.id,data.ty,data.name);
	}
};
/**
 *请求未读消息
 **/
 Logic.prototype.unreadMsg=function(){
	if(this.isLogin)
		this.socket.emit('unreadMessages',{empId:this.empId,corpId:this.corpId});
 };
/**
 *发送文件
 */
Logic.prototype.sendFile=function(send_name,fileId,fileName){
	if(this.isLogin)
		this.socket.emit('sendFile',{sender:this.empId,sender_name:send_name,corpId:this.corpId,receiver:fileId,fileName:fileName});
};
Logic.prototype.recFile=function(data){
	this.msg.fireEvent('recFile',data);
};
/**
 *通话记录
 */
 //服务器获取最近通话列表
Logic.prototype.conversations=function(){
	if(this.isLogin)
		this.socket.emit('convers',{empId:this.empId,corpId:this.corpId});
 };
Logic.prototype.returnConvers_per=function(data){
	this.msg.fireEvent('retConversations_per',data);
};
Logic.prototype.returnConvers_gro=function(data){
	console.log(data);
	this.msg.fireEvent('retConversations_gro',data);
};
//本地获取最近通话列表
Logic.prototype.localConversations=function(){
	this.msg.fireEvent('localConvers');
};
 /**
 *添加群组
 */
Logic.prototype.addGroup=function(data){
	if(this.isLogin)
		this.socket.emit('createGroup',{groupName:data.groupName,groupType:data.groupType,Members:data.Members,chairMen:data.chairMen,names:data.names,corpId:this.corpId});
};
Logic.prototype.addGroup_res=function(data){
	this.msg.fireEvent('creGroupResToMem',data);
};
Logic.prototype.newGroup_succeed=function(data){
	this.msg.fireEvent('creGroupRes',data);
};
 /**
 *删除群组
 */
Logic.prototype.delGroup=function(data){
	if(this.isLogin)
		this.socket.emit('deleteGroup',{groupName:data.groupName,groupType:data.groupType,corpId:this.corpId});
};
Logic.prototype.delGroup_res=function(data){
	this.msg.fireEvent('delGroupResToMem',data);
};
Logic.prototype.delGroup_succeed=function(data){
	console.log(data);
	this.msg.fireEvent('delGroupRes',data);
};
 /**
 *修改群组
 */
Logic.prototype.editGroup=function(data){
	if(this.isLogin)
		this.socket.emit('editGroup',{groupName:data.groupName,newGrpName:data.newGrpName,groupType:data.groupType,Members:data.Members,chairMen:data.chairMen,names:data.names,corpId:this.corpId});
};
Logic.prototype.updateGroup_res=function(data){
	console.log('del',data);
	this.msg.fireEvent('editGroupResToMem',data);
};
 
Logic.prototype.updateGroup_succeed=function(data){
	console.log(data);
	this.msg.fireEvent('editGroupRes',data);
};
/**
 *添加群成员
 */
 Logic.prototype.addMember=function(groupName,groupType,empId,name,flag){
	if(this.isLogin)
		this.socket.emit('addMember',{groupName:groupName,groupType:groupType,empId:empId,name:name,flag:flag,corpId:this.corpId});
};
Logic.prototype.addMember_res=function(data){
	console.log(data);
	this.msg.fireEvent('addMemberResToMem',data);
};
Logic.prototype.addMember_succeed=function(data){
	this.msg.fireEvent('addMemberRes',data);
};
 /**
 *删除群成员
 */
 Logic.prototype.delMember=function(groupName,groupType,empId,name,flag){
	if(this.isLogin)
		this.socket.emit('delMember',{groupName:groupName,groupType:groupType,empId:empId,name:name,flag:flag,corpId:this.corpId});
};
Logic.prototype.delMember_res=function(data){
	console.log(data);
	this.msg.fireEvent('delMemberResToMem',data);
};
Logic.prototype.delMember_succeed=function(data){
	this.msg.fireEvent('delMemberRes',data);
};
/**
 *工作流消息
 */
Logic.prototype.workflow=function(data){
	console.log(data);
	this.msg.fireEvent('workflow',data);
};
 /**
 *登出
 */
 Logic.prototype.logout=function(){
	if(this.isLogin)
		this.socket.emit('logout',{empId:this.empId,corpId:this.corpId,roleKey:this.roleKey});
 };
 Logic.prototype.logoutResponse=function(data){
	this.msg.fireEvent('logoutRes',data);
 };
 /**
  *管理员登录
  */
Logic.prototype.login_admin=function(){
	if(!this.isLogin)
		this.socket.emit('login_admin', {empId: this.empId,password: this.pw,corpId:this.corpId, roleKey: this.roleKey}); 
};
/**
 *登录
 */
Logic.prototype.login=function(){
	if(!this.isLogin)
		this.socket.emit('login', {empId: this.empId,password: this.pw,corpId:this.corpId, roleKey: this.roleKey}); 
};
Logic.prototype.loginResponse=function(data){
	console.log(data);
	if(data.isLogin=='success'){
		this.isLogin=true;
		if(this.firstConnect){
			this.initMsgEvents();
			this.initSocketEvents();
			this.msg.fireEvent('loginResponse',data);
		}
	}
	else {
		console.log('failed');
		this.msg.fireEvent('loginResponse',data);
		//注销相关登录事件
		this.msg.un('login',this.login,this);
		this.socket.removeAllListeners('loginResponse',this.loginResponse.bind(this));
	}
};
Logic.prototype.reLogin=function(){
	if(!this.firstConnect){
		this.socket.emit('login', {empId: this.empId,password: this.pw,corpId:this.corpId, roleKey: this.roleKey}); 
	}
};
/**
 *服务器端断开
 */
Logic.prototype.disconnect=function(){
	this.firstConnect=false;
	this.isLogin=false;
	this.connect=setInterval(this.socket.socket.reconnect(),3000,"每隔3s");
};
Logic.prototype.reconnect=function(){
	this.isLogin=true;
	clearInterval(this.connect);
	this.msg.fireEvent('reconnectSucceed');
};
 /**
  *初始化socket
  */
 Logic.prototype.initSocket=function(){	
		//for(var i=0;i<1000;i++){
	 
		var socket;
		if (/Firefox\/\s/.test(navigator.userAgent)){
			socket = io.connect({transports:['xhr-polling']}); 
		}else if(/MSIE (\d+.\d+);/.test(navigator.userAgent)){
			socket = io.connect({transports:['jsonp-polling']}); 
		}else{ 
			var ip=window.location.host;
			//var IP=ip.split(':');
			//socket = io.connect(IP[0]+':3001',{reconnect:true}); 
			socket = io.connect('127.0.0.1:3001/100'); 
		}
		//socket.on('loginResponse',this.loginResponse.bind(this));
		//console.log(socket);
		//return socket;
		//}
 };
 Logic.prototype.initMsgEvents=function(){
	this.msg.on("grpsCorp",this.grpsCorp,this);
	this.msg.on("persons",this.persons,this);
	this.msg.on("groups",this.groups,this);
	this.msg.on("sendMsg",this.sendMsg,this);
	this.msg.on("sendGroupMsg",this.sendGroupMsg,this);
	this.msg.on("sendMsg_guest",this.sendMsg_guest,this);
	this.msg.on("unreadMsg",this.unreadMsg,this);
	this.msg.on("sendFile",this.sendFile,this);
	//服务器获取最近通话列表
	this.msg.on("conversations",this.conversations,this);
	//本地获取最近通话列表
	this.msg.on("localConversations",this.localConversations,this);
	this.msg.on('winOpen',this.winOpen,this);
	this.msg.on('winClose',this.winClose,this);
	this.msg.on('delConversation',this.delConversation,this);
	this.msg.on('getSession',this.getSession,this);
	
	this.msg.on("addGroup",this.addGroup,this);
	this.msg.on("delGroup",this.delGroup,this);
	this.msg.on("editGroup",this.editGroup,this);
	this.msg.on("addMember",this.addMember,this);
	this.msg.on("delMember",this.delMember,this);
	
	this.msg.on("logout",this.logout,this);
	//由session触发
	this.msg.on('winStatus_suc',this.winStatus_suc,this);
	
	//管理员模块
	this.msg.on('members',this.members,this);
	this.msg.on('grps',this.grps,this);
 };
 Logic.prototype.initSocketEvents=function(){
	this.socket.on('returnGrpsCorp',this.returnGrps.bind(this));
	this.socket.on('returnUsers',this.returnPersons.bind(this));
	this.socket.on('returnGroups',this.returnGroups.bind(this));
	this.socket.on('returnMembers',this.returnPersons.bind(this));
	this.socket.on('returnGrps',this.returnGroups.bind(this));
	this.socket.on('recMsg',this.recMsg.bind(this));
	this.socket.on('msg_succeed',this.msg_succeed.bind(this));
	this.socket.on('recGroupMsg',this.recGroupMsg.bind(this));
	this.socket.on('groupMsg_succeed',this.groupMsg_succeed.bind(this));
	this.socket.on('recFile',this.recFile.bind(this));
	this.socket.on('returnPerConvers',this.returnConvers_per.bind(this));
	this.socket.on('returnGroConvers',this.returnConvers_gro.bind(this));
	this.socket.on('newGroup',this.addGroup_res.bind(this));
	this.socket.on('delGroup',this.delGroup_res.bind(this));
	this.socket.on('updateGroup',this.updateGroup_res.bind(this));
	this.socket.on('add_member',this.addMember_res.bind(this));
	this.socket.on('del_member',this.delMember_res.bind(this));
	this.socket.on('newGroup_succeed',this.newGroup_succeed.bind(this));
	this.socket.on('delGroup_succeed',this.delGroup_succeed.bind(this));
	this.socket.on('updateGroup_succeed',this.updateGroup_succeed.bind(this));
	this.socket.on('addMember_succeed',this.addMember_succeed.bind(this));
	this.socket.on('delMember_succeed',this.delMember_succeed.bind(this));
	this.socket.on('logout',this.logoutResponse.bind(this));
	this.socket.on('disconnect',this.disconnect.bind(this));
	this.socket.on('reconnect',this.reconnect.bind(this));
	this.socket.on('reLogin',this.reLogin.bind(this));
	this.socket.on('workflow',this.workflow.bind(this));
 };


 
