const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { get } = require('express/lib/response');
const Connection = require('mysql/lib/Connection');



require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// parsing middleware
// parse app/ x-www-from-urlencoded www.npmjs.com/package/body-parser
app.use(bodyParser.urlencoded( {extended: false}));

//Parse app/json
app.use(bodyParser.json());

//static files
app.use(express.static('public'));

//set up engine 
app.engine('hbs', exphbs.engine( {extname: '.hbs', defaultLayout: "main"}));
app.set('view engine', 'hbs');

// Creating Poll connection
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    database        : process.env.DB_NAME,
});

// Connection to database
pool.getConnection((err, connection) =>{
    if(err) throw err; // connection failed
    console.log('Connected as ID' + connection.threadId);
});


const routes = require('./serwer/routes/user');
app.use('/', routes);






app.listen(port, () => console.log(`Nasluch na porcie ${port}`)); 