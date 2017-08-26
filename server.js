const express = require("express");
var bodyParser  = require('body-parser');

const fs = require("fs");
const sqlite = require("sql.js");

const filebuffer = fs.readFileSync("db/usda-nnd.sqlite3");

const db = new sqlite.Database(filebuffer);

const app = express();

var game = {
  playerA: {},
  playerB: {},
  board: [
    [' ','B',' '],
    [' ',' ','A'],
    [' ',' ',' '],
  ],
  status: "progress", // progress, done
  player: "A"
};




app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(bodyParser.json());

app.get("/api/game", (req, res) => {
  res.json(game);
});

app.post("/api/move", (req, res) => {

  var row = parseInt(req.body.row);
  var col = parseInt(req.body.col);

  if ( 
      game.status === "progress" &&
      game.player === req.body.user &&
      game.board[row][col] === ' ' ) {

    console.log( "Move!" );
    game.board[row][col] = game.player;

    if (game.player === "A") { game.player = "B"; }
    else { game.player = "A"; }

  } else {
    console.log( "no move." );
    console.log( JSON.stringify(game) );
    console.log( JSON.stringify(req.body) );
  }

  res.json(game);
});



const COLUMNS = [
  "carbohydrate_g",
  "protein_g",
  "fa_sat_g",
  "fa_mono_g",
  "fa_poly_g",
  "kcal",
  "description"
];


app.get("/api/food", (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.
  const r = db.exec(
    `
    select ${COLUMNS.join(", ")} from entries
    where description like '%${param}%'
    limit 100
  `
  );

  if (r[0]) {
    res.json(
      r[0].values.map(entry => {
        const e = {};
        COLUMNS.forEach((c, idx) => {
          // combine fat columns
          if (c.match(/^fa_/)) {
            e.fat_g = e.fat_g || 0.0;
            e.fat_g = (parseFloat(e.fat_g, 10) +
              parseFloat(entry[idx], 10)).toFixed(2);
          } else {
            e[c] = entry[idx];
          }
        });
        return e;
      })
    );
  } else {
    res.json([]);
  }
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
