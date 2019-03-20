// inbuilt modules;
let path = require('path');
let http = require('http');

// installed modules;
let express = require('express');
let cors = require('cors')
let bodyParser = require('body-parser');
let socketIO = require('socket.io');

// configuration;
require('dotenv').config();
let { PORT, BASE_URL } = require('./config.json');

// custom modules;
let { routes } = require('./main');
let { oMySql } = require('./classes/MySql');
let { defaultProps } = require('./utils/index');

PORT = (process.env.PORT || PORT); // handling PORT for heroku;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.io = io;

console.log('Express app is create;');

io.on('connection',(socket)=> {
    console.log('io connection');
    socket.on('disconnect',()=> {
        console.log('io disconnect');
    });
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// registering default output handlers;
app.use((req, res, next)=> {
    res.toUi = (o)=> { // default output handlers;
        o = defaultProps(o, {s: 's', m: [], d: {}});
        if (o.s == "w" && (!o.m || !o.m.length)) { o.m = ['Oopsy.. Something went wrong, Please try again!']; }
        if (o.s == "e" && (!o.m || !o.m.length)) { o.m = ['Seems like there is some problem, Please try again later!']; }
        res.send(o);
        console.log(`Route '${req.url}' is executed;`);
        oMySql.release();
    };
    res.successToUi = (o)=> { // output handler for success;
        o = defaultProps(o, {s: 's', m: [], d: {}});
        res.toUi(o);
    };
    res.warningToUi = (o)=> { // output handler for warning;
        o = defaultProps(o, {s: 'w', m: [], d: {}});
        res.toUi(o);
    };
    res.errorToUi = (o)=> { // output handler for error;
        o = defaultProps(o, {s: 'e', m: [], d: {}});
        res.toUi(o);
    };
    next();
});

server.listen(PORT, ()=> {
  console.log(`Server is up and running on port ${PORT};`);
});

// routes registered;
routes({ app, BASE_URL });

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});