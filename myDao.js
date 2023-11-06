'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if(err) throw err;
});

// get all films
exports.listFilms = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM films';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const films = rows.map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), rating: e.rating }));
        resolve(films);
      });
    });
  };

  
// get list favorites films
exports.getFavorite = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM films WHERE favorite=1';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), rating: e.rating }));
            resolve(films);
        });
    });
};


//get list of Best Rated films 
exports.getBestRate = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM films WHERE rating=5';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), rating: e.rating }));
            resolve(films);
        });
    });
};

//get list of films watched last month
exports.getSeenLastMonth = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM films';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.filter(f => {
                let now = dayjs().unix(); //secondi
                let lastMonth = now - 2592000; //30 giorni
                if (dayjs(f.watchdate) == undefined)
                    return false;

                if (dayjs(f.watchdate).unix() > lastMonth && dayjs(f.watchdate).unix() <= now)
                    return true;
                else return false;
            }).map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), rating: e.rating }));
            resolve(films);
        });
    });
};

//get list of unseen films  
exports.getUnseen = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM films WHERE watchdate IS NULL OR watchdate=""';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), rating: e.rating }));
            resolve(films);
        });
    });
};

//return an existing film by id
exports.getFilmById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM films WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) { //es. se inserisco nella richiesta un id che non esiste
                resolve({ error: 'Film not found.' });
            } else {
                const film = {
                    id: row.id,
                    title: row.title,
                    favorite: row.favorite,
                    watchdate: dayjs(row.watchdate).format("MMMM D, YYYY"),
                    rating: row.rating
                }
                resolve(film);
            }
        });
    });
};

//create a new film
exports.createFilm = (film) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO films(title, favorite, watchdate, rating, user) VALUES(?, ?, DATE(?), ?, ?)';
        db.run(sql, [film.title, film.favorite, film.watchdate, film.rating, film.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// update an existing film
exports.updateFilm = (film) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET title=?, favorite=?, watchdate=DATE(?), rating=?, user=?  WHERE id=?";
        db.run(sql, [film.title, film.favorite, film.watchdate, film.rating, film.user, film.id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
};


// update rating of an existing film
exports.updateRatingById = (filmId, rating) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET rating=?  WHERE id=?";
        db.run(sql, [rating, filmId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
};

// update rating of an existing film
exports.toggleFavorite = (filmId, newFav) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET favorite=?  WHERE id=?";
        db.run(sql, [newFav, filmId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
};

exports.deleteFilm = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM films WHERE id=?';
        db.run(sql, [id], function (err) {
        if (err) {
            reject(err);
            return;
        }
        resolve(this.changes);
        });
    });
};