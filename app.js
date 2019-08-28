const odata = require('node-odata');
const config = require('config');

// utils
const { encryptPasswort, validatePasswort } = require('./utils/encryption');

//models
const usersModel = require('./models/users');
const cardsModel = require('./models/cards');
const coffeesModel = require('./models/coffees');
const departmentsModel = require('./models/departments');
const paymentsModel = require('./models/payments');

//routes
//const loginRoute = require('./routes/login');

//connect server to database
const db_path = config.get('odata.db_path');
var server = odata(db_path);

//TODO: specifi models (#7)
server.resource('users', usersModel);
server.resource('cards', cardsModel);
server.resource('coffees', coffeesModel);
server.resource('departments', departmentsModel);
server.resource('payments', paymentsModel);

server.post('/login', function (req, res, next) {

    var email = req.body['email'];
    var password = req.body['password'];

    console.log(req.body);

    if (email == undefined || password == undefined) {
        res.json({ "error": "email or password missing" }).status(404);
    }

    server._db.collection('users').findOne({ "email": email }, (err, result) => {
        if (err) throw err;

        if (result && result.password == password) {
            res.json({ "id": result._id }).status(201);
        } else {
            res.json({ "error": "invalid password or email" }).status(403);
        }
    })
});

server.get('/coffeesPerUser', function (req, res, next) {
    let uid = req.query.uid;

    server._db.collection('coffees').find({ "uid": uid }).toArray((err, result) => {
        if (err) throw err;

        //get all coffees for user
        let count = result.length;

        //add all amount to one price
        let price = 0
        for (let item of result) {
            price = price + item['amount'];
        }

        //get latest date
        let date = result[result.length - 1]['date'];

        res.json({ "count": count, "price": price, "lastCoffee": date });

    })

});

module.exports = server;