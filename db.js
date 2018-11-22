"use strict";
const sqlite3 = require('sqlite3').verbose();

class Db {
    constructor(file) {
        this.db = new sqlite3.Database(file);
        this.createTable()
    }

    createTable() {
        const sql1 = `
            CREATE TABLE IF NOT EXISTS user (
                id integer PRIMARY KEY, 
                first_name text, 
                last_name text,
                phone text UNIQUE,
                adresse text, 
                code_postale text,
                date_de_naissance text,
                email text UNIQUE, 
                user_pass text,
                role text)`;
        const sql2 = `
              CREATE TABLE IF NOT EXISTS evenement(
                  id integer PRIMARY KEY,
                  titre text,
                  type text,
                  statut text,
                  date text,
                  user int,
                  FOREIGN KEY(user) REFERENCES user(id)
              )`
        this.db.run(sql1);
        this.db.run(sql2);
    }

    selectByEmail(email, callback) {
        return this.db.get(
            `SELECT * FROM user WHERE email = ?`,
            [email],
            function (err, row) {
                callback(err, row)
            })
    }

    selectAllUsers(callback) {
        return this.db.all(`SELECT * FROM user`, function (err, rows) {
            callback(err, rows)
        })
    }

    insertUser(user, callback) {
        return this.db.run(
            'INSERT INTO user (first_name, last_name,email,phone,adresse,code_postale,date_de_naissance,user_pass, role) VALUES (?,?,?,?,?,?,?,?,?)',
            user, (err) => {
                callback(err)
            })
    }

    insertEvent(event, callback) {
        return this.db.run(
            'INSERT INTO evenement (titre, type,statut,date, user) VALUES (?,?,?,?,?)',
            event, (err) => {
                callback(err)
            })
    }

    getAllEvent(callback) {
        return this.db.all(`SELECT * FROM evenement`, function (err, rows) {
            callback(err, rows)
        })
    }
}

module.exports = Db