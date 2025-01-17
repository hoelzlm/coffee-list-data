const odata = require('node-odata');
const config = require('config');
var braintree = require("braintree");

// utils
const {
    encryptPasswort,
    validatePasswort
} = require('./utils/encryption');

//models
const usersModel = require('./models/users');
const cardsModel = require('./models/cards');
const coffeesModel = require('./models/coffees');
const departmentsModel = require('./models/departments');
const paymentsModel = require('./models/payments');
const favoritesModel = require('./models/favorites');
//routes
//const loginRoute = require('./routes/login');

//connect server to database
const db_path = config.get('odata.db_path');
var server = odata(db_path);

server.resource('users', usersModel);
server.resource('cards', cardsModel);
server.resource('coffees', coffeesModel);
server.resource('departments', departmentsModel);
server.resource('payments', paymentsModel);
server.resource('favorites', favoritesModel);

server.post('/login', function (req, res, next) {

    var email = req.body['email'];
    var password = req.body['password'];

    console.log(req.body);

    if (email == undefined || password == undefined) {
        res.json({
            "error": "email or password missing"
        }).status(404);
    }

    server._db.collection('users').findOne({
        "email": email
    }, (err, result) => {
        if (err) throw err;

        if (result && result.password == password) {
            res.json({
                "id": result._id
            }).status(201);
        } else {
            res.json({
                "error": "invalid password or email"
            }).status(403);
        }
    })
});

server.get('/checkout', function (req, res, next) {
    var gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
        merchantId: '4n5xcdjfmnhjv3xx',
        publicKey: 'n85pk78ztg73sywy',
        privateKey: '432032d0f7ee6ae8630a4587a7ed2cd9'
    });

    gateway.clientToken.generate({}, function (err, response) {
        res.json({
            'token': response.clientToken
        });
    });
})

server.post('/checkout', function (req, res, next) {
    var gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
        merchantId: '4n5xcdjfmnhjv3xx',
        publicKey: 'n85pk78ztg73sywy',
        privateKey: '432032d0f7ee6ae8630a4587a7ed2cd9'
    });

    var nonceFromTheClient = req.body.paymentMethodNonce;


    var newTransaction = gateway.transaction.sale({
        // TODO: adding amount from app
        amount: "10",
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, function (error, result) {
        if (result) {
            res.send(result);
        } else {
            res.status(500).send(error);
        }
    });
})

server.get('/coffees/current', function (req, res, next) {
    let uid = req.query.uid;

    let date = new Date();
    let firstDayThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    server._db.collection('coffees').find({
        "uid": uid,
        "date": {
            $gt: firstDayThisMonth
        }
    }).sort({
        date: 1
    }).toArray((err, result) => {
        if (err) throw err;

        if (result.length > 0) {

            //get all coffees for user
            let count = result.length;

            //add all amount to one price
            let price = 0
            for (let item of result) {
                price = price + item['amount'];
            }

            //get latest date
            let date = result[result.length - 1]['date'];
            let user = result[result.length - 1]['added_by'];

            //get coffes split in days
            let coffees = {};

            let allDaysAsTimestamp = Array.from(result, (item) => item['date']);
            let allDaysDayBased = Array.from(allDaysAsTimestamp, (item) => new Date(item.getFullYear(), item.getMonth(), item.getDate(), 0, 0, 0))
            let uniqeDaysOfMonth = allDaysDayBased.map((date) => date.getTime())
                .filter((item, index, array) => array.indexOf(item) === index)
                .map((time) => new Date(time));

            for (day of uniqeDaysOfMonth) {
                console.log(day)
                coffees[day] = 0;
            }

            for (day of allDaysDayBased) {
                coffees[day]++
            }

            res.json({
                "count": count,
                "price": price,
                "coffees": coffees,
                "lastCoffee": date,
                "added_by": user
            });
        } else {
            res.json({
                "count": 0,
                "price": 0,
                "coffees": 0,
                "lastCoffee": 0,
                "added_by": 0
            });
        }
    })

})

server.get('/coffees/last', function (req, res, next) {
    let uid = req.query.uid;

    let date = new Date();
    let firstDayLastMonth = new Date(date.getFullYear(), (date.getMonth() - 1), 1);
    let firstDayThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    server._db.collection('coffees').find({
        "uid": uid,
        "date": {
            $gt: firstDayLastMonth,
            $lt: firstDayThisMonth
        }
    }).sort({
        date: 1
    }).toArray((err, result) => {
        if (err) throw err;

        if (result.length > 0) {

            //get all coffees for user
            let count = result.length;

            //add all amount to one price
            let price = 0
            for (let item of result) {
                price = price + item['amount'];
            }

            //get latest date
            let date = result[result.length - 1]['date'];
            let user = result[result.length - 1]['added_by'];

            //get coffes split in days
            let coffees = {};

            let allDaysAsTimestamp = Array.from(result, (item) => item['date']);
            let allDaysDayBased = Array.from(allDaysAsTimestamp, (item) => new Date(item.getFullYear(), item.getMonth(), item.getDate(), 0, 0, 0))
            let uniqeDaysOfMonth = allDaysDayBased.map((date) => date.getTime())
                .filter((item, index, array) => array.indexOf(item) === index)
                .map((time) => new Date(time));

            for (day of uniqeDaysOfMonth) {
                coffees[day] = 0;
            }

            for (day of allDaysDayBased) {
                coffees[day]++
            }

            res.json({
                "count": count,
                "price": price,
                "coffees": coffees,
                "lastCoffee": date,
                "added_by": user
            });
        } else {
            res.json({
                "count": 0,
                "price": 0,
                "coffees": 0,
                "lastCoffee": 0,
                "added_by": 0
            });
        }

    })

})

module.exports = server