const { validatePasswort } = require('../utils/encryption');

module.exports = function (req, res, next) {

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
            res.json({ "error": "invalid password or email" });
        }
    })
}