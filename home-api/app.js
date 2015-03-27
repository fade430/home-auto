var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./data/db.db');

db.serialize(function(){
    db.each('select * from user where ID="1"',function(err, row){
         console.log(row.FirstName + " " + row.LastName);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/hello', hello);
app.use('/', routes);

//var room = require('./routes/room');
//app.use('/api/rooms', room);
//room getters
app.get('/api/rooms/all',function(req,res){
    var rooms = {};
    rooms.list = [];
    db.all('select * from room',function(err,rows){
        rows.forEach(function(row){
            var room = {
                id:row.ID
                ,name:row.NAME
                ,description:row.Description
            }
            rooms.list.push(room);
        });
        res.send(JSON.stringify(rooms));
        //console.log(JSON.stringify(rooms));
    });
});

app.get('/api/rooms/:id', function(req,res){
    db.each('select * from room where ID=(?)',[req.params.id],function(err,row){
        var room = {
            list:[]
        };
        room.list.push({
            id:row.ID
            ,name:row.NAME
            ,description:row.Description
        });
        res.send(JSON.stringify(room));
    });
});

//mcu getters
app.get('/api/mcu/all',function(req,res){
    var mcus = {};
    mcus.list = [];
    db.all('select * from mcu',function(err,rows){
        rows.forEach(function(row){
            var mcu = {
                id:row.ID
                ,name:row.NAME
                ,description:row.Description
                ,roomID:row.RoomID
                ,ipaddress:IPAddress
                ,macAdress:MACAddress
            }
            mcus.list.push(mcu);
        });
        res.send(JSON.stringify(mcus));
        //console.log(JSON.stringify(rooms));
    });
});

app.get('/api/mcu/:id',function(req,res){
    db.each('select * from mcu where ID=(?)',[req.params.id],function(err,row){
        var mcu = {
            list:[]
        };
        mcu.list.push({
            id:row.ID
            ,name:row.NAME
            ,description:row.Description
            ,roomID:row.RoomID
            ,ipaddress:IPAddress
            ,macAdress:MACAddress
        });
        res.send(JSON.stringify(mcu));
    });
});

//device getters
app.get('/api/device/all',function(req,res){
    var mcus = {};
    devices.list = [];
    db.all('select * from device',function(err,rows){
        rows.forEach(function(row){
            var devices = {
                id:row.ID
                ,name:row.NAME
                ,description:row.Description
                ,mcuid:row.MCUID
                ,pin:row.Pin
                ,state:row.State
            }
            devices.list.push(mcu);
        });
        res.send(JSON.stringify(mcus));
        //console.log(JSON.stringify(rooms));
    });
});

app.get('/api/device/:id',function(req,res){
    db.each('select * from device where ID=(?)',[req.params.id],function(err,row){
        var device = {
            list:[]
        };
        device.list.push({
            id:row.ID
            ,name:row.NAME
            ,description:row.Description
            ,mcuid:row.MCUID
            ,pin:row.Pin
            ,state:row.State
        });
        res.send(JSON.stringify(device));
    });
});

//start of change functions,
//exsposed to allow people to change state of device
app.get('/api/device/setState/:id/:state',function(req,res){
    db.each('select * from device where ID=(?)',[req.params.id],function(err,row){
        var device = {
            list:[]
        };
        device.list.push({
            id:row.ID
            ,name:row.NAME
            ,description:row.Description
            ,mcuid:row.MCUID
            ,pin:row.pin
            ,state:row.State
        });
        db.each('select * from mcu where ID=(?)',[1],function(err,row2){
            var mcu = {
                list:[]
            };
            mcu.list.push({
                id:row2.ID
                ,name:row2.NAME
                ,description:row2.Description
                ,roomID:row2.RoomID
                ,ipaddress:row2.IPAddress
                ,macAdress:row2.MACAddress
                ,options:JSON.parse(row2.Options)
            });
            var http = require('http');
            console.log(mcu.list[0].ipaddress);
            console.log(mcu.list[0].options.ipaddress);
            http.get(mcu.list[0].ipaddress,function(result){
                result.chunkdata = "";
                result.on('data',function(chunk){
                    this.chunkdata += chunk;
                });
                result.on('end',function(){
                    res.send(this.chunkdata);
                });
            }).on('error',function(e){
                console.log(e.message);
            });
        });
    });
});

function updateDevice(){}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
//will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('example app listening');
});

module.exports = app;
