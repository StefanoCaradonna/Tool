
import dayjs from "dayjs";

const URL = 'http://localhost:5001/api';

async function getAllFilms() {
  // call  /api/films
  const response = await fetch(URL + '/films');
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate)
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getFavorite() {
  // call  /api/filter/Favorites
  const response = await fetch(URL + '/filter/Favorites');
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate)
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getBestRates() {
  // call  /api/filter/Best%20Rates
  const response = await fetch(URL + '/filter/Best%20Rates');
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate)
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getSeenLastMonth() {
  // call  /api/filter/Seen%20Last%20Month
  const response = await fetch(URL + '/filter/Seen%20Last%20Month');
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate)
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getUnseen() {
  // call  /api/filter/Unseen
  const response = await fetch(URL + '/filter/Unseen');
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate)
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

function addFilm(film) {
  // call  POST /api/films 
  return new Promise((resolve, reject) => {
    fetch(URL+`/films`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, film, {watchdate: dayjs(film.date).format("YYYY-MM-DD"), user: 1})), //user default
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function editFilm(film) {
  // call  PUT /api/films/<id>
  return new Promise((resolve, reject) => {
    fetch(URL + `/films/${film.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, film, { watchdate: film.date !== undefined ?dayjs(film.date).format("YYYY-MM-DD") : null, user: 1 })), //user default
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}


/*
function toggleFavorite(film) {
  // call  PUT /api/films/<id>/toggleFavorite
  return new Promise((resolve, reject) => {
    fetch(URL+`/films/${film.id}/toggleFavorite`, {
      method: 'POST',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}
function updateRating(film, newRating) {
  // call  PUT /api/films/<id>/rating
  return new Promise((resolve, reject) => {
    fetch(URL+`/films/${film.id}/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, film, {rating: newRating})),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}
*/
async function deleteFilm(id) {
  // call  /api/films/<id>
  const response = await fetch(URL + `/films/${id}`, {
    method: 'DELETE',
  });
  const films = await response.json();
  if (response.ok) {
    if (films >= 1) {
      //trovato
    }
  } else {
    response.json()
      .then((message) => { reject(message); }) // error message in the response body
      .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
  }
}

const API = {
  getAllFilms, getFavorite, getBestRates, getSeenLastMonth, getUnseen,
  deleteFilm, addFilm, editFilm, /*toggleFavorite, updateRating*/
};
export default API;