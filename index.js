"use strict";
const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors')

const db = new DB("sqlitedb")
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

app.use(cors())

router.post('/register', function (req, res) {
    db.insertUser([
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            req.body.phone,
            req.body.adresse,
            req.body.codePostale,
            req.body.dateNaissance,
            bcrypt.hashSync(req.body.password, 8),
            req.body.role
        ],
        function (err) {
            console.log(err)
            if (err) return res.status(500).send("There was a problem registering the user.")
            db.selectByEmail(req.body.email, (err, user) => {
                if (err) return res.status(500).send("There was a problem getting user")
                let token = jwt.sign({
                    id: user.id
                }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({
                    auth: true,
                    token: token,
                    user: user
                });
            });
        });
});


router.post('/login', (req, res) => {
    db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({
            auth: false,
            token: null
        });
        let token = jwt.sign({
            id: user.id
        }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({
            auth: true,
            token: token,
            user: user
        });
    });
})

router.delete('/user', (req, res) => {
    db.deleteUser(req.body.id, (err, events) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).send(events);
    });
})

router.get('/user/:id', (req, res) => {
    db.deleteUser(req.body.id, (err, events) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).send(events);
    });
})

router.get('/users', (req, res) => {
    db.selectUserById(req.params.id, (err, users) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!users) return res.status(404).send('No users');
        res.status(200).send(users);
    });
})

router.put('/user', function (req, res) {
    db.putUser([
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            req.body.phone,
            req.body.adresse,
            req.body.codePostale,
            req.body.dateNaissance,
            req.body.role,
            req.body.id
        ],
        function (err, data) {
            if (err) return res.status(500).send("There was a proble while modify the user.")
            res.status(200).send(data)
        });
});


router.post('/event', function (req, res) {
    db.insertEvent([
            req.body.titre,
            req.body.type,
            req.body.date_debut,
            req.body.date_fin,
            req.body.statut,
            req.body.user
        ],
        function (err, data) {
            console.log(err)
            if (err) return res.status(500).send("There was a problem registering the event.")
            res.status(200).send(data)
        });
});

router.put('/event', function (req, res) {
    db.putEvent([
            req.body.titre,
            req.body.type,
            req.body.date_debut,
            req.body.date_fin,
            req.body.statut,
            req.body.id,
        ],
        function (err, data) {
            if (err) return res.status(500).send("There was a proble while change the event.")
            res.status(200).send(data)
        });
});

router.put('/event/statut', function (req, res) {
    db.putStatutEvent([
            req.body.statut,
            req.body.id,
        ],
        function (err, data) {
            if (err) return res.status(500).send("There was a proble while change the event.")
            res.status(200).send(data)
        });
});

router.get('/event', (req, res) => {
    db.deleteEvent(req.body.id, (err, events) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).send(events);
    });
})

router.delete('/event', (req, res) => {
    db.getAllEvent((err, events) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!events) return res.status(404).send('No event');
        res.status(200).send(events);
    });
})

router.get('/event/user/:id', (req, res) => {
    db.selectEventByUserID(req.params.id, (err, events) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!events) return res.status(404).send('No event');
        res.status(200).send(events);
    });
})

router.get('/event/user/:id/attente', (req, res) => {
    db.selectAllEventEnAttenteForOtherUser(req.params.id, (err, events) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!events) return res.status(404).send('No event');
        res.status(200).send(events);
    });
})

app.use(router)

let port = process.env.PORT || 3000;

let server = app.listen(port, function () {
    console.log('Express server listening on port ' + port)
});