var upload = require('./upload');
module.exports = function(app){
	
	//Ĭ��
	app.get('/', function(req, res){
		res.sendfile('views/test2.html');
	});
	app.get('/vol', function(req, res){
		res.sendfile('views/vol_test.html');
	});
	app.get('/test', function(req, res){
		res.sendfile('views/test.html');
	});
	app.get('/guest', function(req, res){
		res.sendfile('views/guest.html');
	});
	app.get('/manager', function(req, res){
		res.sendfile('views/manager.html');
	});
	//�ϴ��ļ�
	app.post('/upload', upload.upload);
	//�����ļ�
	app.get('/uploadfiles/:fileName', function(req, res){
		var fileName=req.params.fileName;
		res.sendfile('./uploadfiles/'+fileName);
		res.end('ok');
	});
};