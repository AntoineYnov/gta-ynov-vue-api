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
                  date_debut text,
                  date_fin text,
                  user int,
                  FOREIGN KEY(user) REFERENCES user(id)
              )`
        this.db.run(sql1);
        this.db.run(sql2);
    }

    // UTILISATEUR

    selectByEmail(email, callback) {
        return this.db.get(
            `SELECT * FROM user WHERE email = ?`,
            [email],
            function (err, row) {
                callback(err, row)
            })
    }

    selectUserById(id, callback) {
        return this.db.get(
            `SELECT * FROM user WHERE id = ?`,
            id,
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

    putUser(user, callback) {
        return this.db.run(
            `UPDATE user SET 
                first_name = ?,
                last_name = ?,
                email = ?,
                phone = ? , 
                adresse = ? , 
                code_postale = ? , 
                date_de_naissance = ? ,
                role = ? 
                where id = ?
               `,
            user, (err) => {
                callback(err)
            })
    }

    deleteUser(userID, callback) {
        return this.db.run(
            `DELETE FROM user where id = ?`,
            userID, (err) => {
                callback(err)
            })
    }

    // EVENEMENT 

    insertEvent(event, callback) {
        return this.db.run(
            'INSERT INTO evenement (titre, type,date_debut, date_fin,statut, user) VALUES (?,?,?,?,?,?)',
            event, (err) => {
                callback(err)
            })
    }

    selectEventByUserID(id, callback) {
        return this.db.all(
            `SELECT * FROM evenement WHERE user = ?`,
            id,
            function (err, row) {
                callback(err, row)
            })
    }

    selectAllEventEnAttenteForOtherUser(id, callback) {
        return this.db.all(
            `SELECT * FROM evenement WHERE statut = 'en attente' AND NOT user = ?`,
            id,
            function (err, row) {
                callback(err, row)
            })
    }


    getAllEvent(callback) {
        return this.db.all(`SELECT * FROM evenement`, function (err, rows) {
            callback(err, rows)
        })
    }

    putEvent(event, callback) {
        return this.db.run(
            `UPDATE evenement SET 
                titre = ? ,
                type = ? ,
                statut = ? ,
                date_debut = ? ,
                date_fin = ? , 
                where id = ?
               `,
            user, (err) => {
                callback(err)
            })
    }

    putStatutEvent(event, callback) {
        return this.db.run(
            `UPDATE evenement SET 
                statut = ? ,
                where id = ?
               `,
            user, (err) => {
                callback(err)
            })
    }

    deleteEvent(eventID, callback) {
        return this.db.run(
            `DELETE FROM evenement where id = ?`,
            eventID, (err) => {
                callback(err)
            })
    }
}

module.exports = Db