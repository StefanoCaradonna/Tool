'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./myDao'); // module for accessing the DB
const cors = require('cors');
const http = require('http');
const path = require('path');
const Server = require("socket.io").Server;


// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
//app.use(express.json());  //per quando riceveremo richieste
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
      origin:"*"
    }
})

const _dirname = path.dirname("");
const buildPath = path.join(_dirname , "../client/build")

app.use(express.static(buildPath)); 

app.get("/*", (req, res)=>{
  res.sendFile(
    path.join(_dirname, "../client/build/index.html"),
    function(err){
      if (err){
        res.status(500).send(err);
      }
    }
  );
})

//APP
const answerDelay = 1000;



// GET /api/films
app.get('/api/films', (req, res) => {
    dao.listFilms()
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });


// GET /api/filter/Favorites
app.get('/api/filter/Favorites', (req, res) => {
    dao.getFavorite()
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });

// GET /api/filter/Best%20Rates
app.get('/api/filter/Best%20Rates', (req, res) => {
    dao.getBestRate()
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });
  
// GET /api/filter/Seen%20Last%20Month
app.get('/api/filter/Seen%20Last%20Month', (req, res) => {
    dao.getSeenLastMonth()
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });

  // GET /api/filter/Unseen
app.get('/api/filter/Unseen', (req, res) => {
    dao.getUnseen()
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });

  
// GET /api/films/<id>
app.get('/api/films/:id', async (req, res) => {
    try {
      const result = await dao.getFilmById(req.params.id);
      if(result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch(err) {
      res.status(500).end();
    }
  });

  
// POST /api/films
app.post('/api/films', [
    check('rating').isInt(),
    check('title').isLength({min: 1}),
    check('watchdate').isDate({format: "YYYY-MM-DD", strictMode: true})
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }

    const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        watchdate: req.body.watchdate,
        rating: req.body.rating,
        user: req.body.user,
    };

    try {
        const filmId = await dao.createFilm(film);
        // Return the newly created id of the film to the caller. 
        // A more complex object can also be returned (e.g., the original one with the newly created id)
        setTimeout(()=> answerDelay);
        res.status(201).json(filmId);
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of film ${film.title}.` });
    }
    
  });

  //UPDATE
  
// PUT /api/answers/<id>
app.put('/api/films/:id', [
    check('rating').isInt(),
    check('title').isLength({min: 1}),
    //check('watchdate').isDate({format: "YYYY-MM-DD", strictMode: true}),
    check('id').isInt()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
  
    const film = req.body;
    // you can also check here if the id passed in the URL matches with the id in req.body,
    // and decide which one must prevail, or return an error
    film.id = req.params.id;
  
    try {
      const numRowChanges = await dao.updateFilm(film);
      setTimeout(()=> answerDelay);
      res.json(numRowChanges);
      //res.status(200).end();
    } catch(err) {
      res.status(503).json({error: `Database error during the update of answer ${req.params.id}.`});
    }
  
  });

  
// POST /api/films/<id>/rating
app.post('/api/films/:id/rating', [
    check('id').isInt(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
  
    try {
      const numRowChanges = await dao.updateRatingById(req.params.id, req.body.rating);
      // number of changed rows is sent to client as an indicator of success
      setTimeout(()=> answerDelay);
      res.json(numRowChanges);
    } catch (err) {
      res.status(503).json({ error: `Database error during the vote of answer ${req.params.id}.` });
    }
  
  });

// POST /api/films/<id>/toggleFavorite
app.post('/api/films/:id/toggleFavorite', [
    check('id').isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        //retrieve old value of favorite to toggle it
        const result = await dao.getFilmById(req.params.id);  // needed to ensure db consistency
        if (result.error)
            res.status(404).json(result);   // filmId does not exist
        else {
            let newFav = 0;
            //toggle
            if (result.favorite == 1)
                newFav = 0;
            else newFav = 1;

            try {
                const numRowChanges = await dao.toggleFavorite(req.params.id, newFav);
                setTimeout(() => answerDelay);
                res.json(numRowChanges);
            } catch (err) {
                res.status(503).json({ error: `Database error during the vote of answer ${req.params.id}.` });
            }
        }
    }
    catch (err) {
        res.status(500).end();
    }
});

// DELETE /api/films/<id>
app.delete('/api/films/:id', async (req, res) => {
    try {
        const numRowChanges = await dao.deleteFilm(req.params.id);
        // number of changed rows is sent to client as an indicator of success
        setTimeout(()=> answerDelay);
        res.json(numRowChanges);
    } catch (err) {
        console.log(err);
        res.status(503).json({ error: `Database error during the deletion of answer ${req.params.id}.` });
    }
});


/*** Other express-related instructions ***/

io.on("connection" , (socket) => {
  console.log('We are connected')

  socket.on("chat" , chat => {
     io.emit('chat' , chat)
  } )

  socket.on('disconnect' , ()=> {
   console.log('disconnected')
  })
})


// Activate the server
server.listen(port, () => {
    console.log(`react-qa-server listening at http://localhost:${port}`);
});