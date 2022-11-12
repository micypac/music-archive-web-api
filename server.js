const http = require("http");
const fs = require("fs");

/* ============================ SERVER DATA ============================ */
let artists = JSON.parse(fs.readFileSync("./seeds/artists.json"));
let albums = JSON.parse(fs.readFileSync("./seeds/albums.json"));
let songs = JSON.parse(fs.readFileSync("./seeds/songs.json"));

let nextArtistId = 2;
let nextAlbumId = 2;
let nextSongId = 2;

// returns an artistId for a new artist
function getNewArtistId() {
  const newArtistId = nextArtistId;
  nextArtistId++;
  return newArtistId;
}

// returns an albumId for a new album
function getNewAlbumId() {
  const newAlbumId = nextAlbumId;
  nextAlbumId++;
  return newAlbumId;
}

// returns an songId for a new song
function getNewSongId() {
  const newSongId = nextSongId;
  nextSongId++;
  return newSongId;
}

// response content if resource ID provided is not found
function invalidResourceRes(res, resource) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  const resBody = {
    message: `${resource} not found.`,
  };
  res.write(JSON.stringify(resBody));
  res.end();
}

/* ======================= PROCESS SERVER REQUESTS ======================= */
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // assemble the request body
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => {
    // finished assembling the entire request body
    // Parsing the body of the request depending on the "Content-Type" header
    if (reqBody) {
      switch (req.headers["content-type"]) {
        case "application/json":
          req.body = JSON.parse(reqBody);
          break;
        case "application/x-www-form-urlencoded":
          req.body = reqBody
            .split("&")
            .map((keyValuePair) => keyValuePair.split("="))
            .map(([key, value]) => [key, value.replace(/\+/g, " ")])
            .map(([key, value]) => [key, decodeURIComponent(value)])
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          break;
        default:
          break;
      }
      console.log(req.body);
    }

    /* ========================== ROUTE HANDLERS ========================== */

    // GET /artists (get all artists)
    if (req.method === "GET" && req.url === "/artists") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(artists));
      return res.end();
    }

    // GET /artists/* (get specific artist based on ID and its nested resources)
    if (req.method === "GET" && req.url.startsWith("/artists/")) {
      const urlParts = req.url.split("/");
      const artistId = urlParts[2];

      if (!(artistId in artists)) {
        invalidResourceRes(res, "Artist");
        return;
      }

      // GET /artists/:artistId
      if (urlParts.length === 3) {
        const artist = artists[artistId];

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(artist));
        return res.end();
      }

      // GET /artists/:artistId/albums
      if (urlParts.length === 4 && urlParts[3] === "albums") {
        // get all the album keys from albums where artistId = route parameter
        const albumKeys = Object.keys(albums).filter(
          (el) => Number(artistId) === albums[el].artistId
        );

        const resBody = albumKeys.map((el) => albums[el]);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(resBody));
        return res.end();
      }

      // GET /artists/:artistId/songs
      if (urlParts.length === 4 && urlParts[3] === "songs") {
        // get all the album keys from albums where artistId = route parameter
        const albumKeys = Object.keys(albums).filter(
          (el) => Number(artistId) === albums[el].artistId
        );

        // get all the song keys from songs where albumId matches the items from albumKeys above
        let songKeys = [];
        for (let item of albumKeys) {
          const temp = Object.keys(songs).filter(
            (el) => Number(item) === songs[el].albumId
          );
          songKeys = songKeys.concat(temp);
        }

        const resBody = songKeys.map((el) => songs[el]);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(resBody));
        return res.end();
      }
    }

    // GET /albums/* (get specific album based on ID and its nested resources)
    if (req.method === "GET" && req.url.startsWith("/albums/")) {
      const urlParts = req.url.split("/");
      const albumId = urlParts[2];

      if (!(albumId in albums)) {
        invalidResourceRes(res, "Album");
        return;
      }

      // GET /albums/:albumId
      if (urlParts.length === 3) {
        const artistId = albums[albumId].artistId;
        // get all the album keys from albums where artistId = route parameter
        const songKeys = Object.keys(songs).filter(
          (el) => Number(albumId) === songs[el].albumId
        );
        const albumSongs = songKeys.map((el) => songs[el]);
        const resBody = albums[albumId];
        resBody["artist"] = artists[artistId.toString()];
        resBody["songs"] = albumSongs;

        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.write(JSON.stringify(resBody));
        return res.end();
      }

      // GET /albums/:albumId/songs
      if (urlParts.length === 4 && urlParts[3] === "songs") {
        const songKeys = Object.keys(songs).filter(
          (el) => Number(albumId) === songs[el].albumId
        );
        const albumSongs = songKeys.map((el) => songs[el]);
        const resBody = albumSongs;

        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.write(JSON.stringify(resBody));
        return res.end();
      }
    }

    // GET /trackNumbers/:trackNumber/songs (get all songs based on their tracking number)
    if (req.method === "GET" && req.url.startsWith("/trackNumbers/")) {
      const urlParts = req.url.split("/");
      const trackNumId = urlParts[2];

      const songKeys = Object.keys(songs).filter(
        (el) => Number(trackNumId) === songs[el].trackNumber
      );

      const songResults = songKeys.map((el) => songs[el]);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(songResults));
      return res.end();
    }

    // GET /songs/:songId (get song based on their ID)
    if (req.method === "GET" && req.url.startsWith("/songs/")) {
      const urlParts = req.url.split("/");
      const songId = urlParts[2];

      if (!(songId in songs)) {
        invalidResourceRes(res, "Song");
        return;
      }

      const albumId = songs[songId].albumId;
      const artistId = albums[albumId.toString()].artistId;
      const resBody = songs[songId];
      resBody.album = albums[albumId.toString()];
      resBody.artist = artists[artistId.toString()];

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(resBody));
      return res.end();
    }

    // POST /artists (create new artist)
    if (req.method === "POST" && req.url === "/artists") {
      const { name } = req.body;
      let artistId = getNewArtistId();

      const newArtist = {
        artistId: artistId,
        name: name,
      };

      artists[artistId.toString()] = newArtist;

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(artists[artistId.toString()]));
      return res.end();
    }

    // POST /artists/:artistId/albums (create new album based on artist)
    if (req.method === "POST" && req.url.startsWith("/artists/")) {
      const urlParts = req.url.split("/");
      const artistId = urlParts[2];
      console.log(urlParts);

      if (!(artistId in artists)) {
        invalidResourceRes(res, "Artist");
        return;
      }

      if (urlParts[3] === "albums") {
        const newAlbumId = getNewAlbumId();
        const newAlbum = {
          albumId: newAlbumId,
          name: req.body.name,
          artistId: Number(artistId),
        };

        albums[newAlbumId.toString()] = newAlbum;

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(albums[newAlbumId.toString()]));
        return res.end();
      }
    }

    // POST /albums/:albumId/songs (create new song based on album)
    if (req.method === "POST" && req.url.startsWith("/albums/")) {
      const urlParts = req.url.split("/");
      const albumId = urlParts[2];

      if (!(albumId in albums)) {
        invalidResourceRes(res, "Album");
        return;
      }

      const { name, lyrics, trackNumber } = req.body;
      const songId = getNewSongId();

      songs[songId.toString()] = {
        songId: songId,
        name: name,
        lyrics: lyrics,
        trackNumber: trackNumber,
        albumId: Number(albumId),
      };

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(songs[songId.toString()]));
      return res.end();
    }

    // PUT /artists/:artistId (update an artist)
    if (req.method === "PUT" && req.url.startsWith("/artists/")) {
      const urlParts = req.url.split("/");
      if (urlParts.length === 3) {
        const artistId = urlParts[2];

        if (!(artistId in artists)) {
          invalidResourceRes(res, "Artist");
          return;
        }

        const { name } = req.body;
        artists[artistId]["name"] = name;

        const resBody = {
          artistId: artists[artistId].artistId,
          name: artists[artistId].name,
          // updatedAt: new Date().toJSON(),
        };

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(resBody));
        return res.end();
      }
    }

    // PUT /albums/:albumId (update an album)
    if (req.method === "PUT" && req.url.startsWith("/albums/")) {
      const urlParts = req.url.split("/");
      if (urlParts.length === 3) {
        const albumId = urlParts[2];

        if (!(albumId in albums)) {
          invalidResourceRes(res, "Album");
          return;
        }

        const { name } = req.body;
        albums[albumId]["name"] = name;

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(albums[albumId]));
        return res.end();
      }
    }

    // PUT /songs/:songId (update a song)
    if (req.method === "PUT" && req.url.startsWith("/songs/")) {
      const urlParts = req.url.split("/");
      const songId = urlParts[2];

      if (!(songId in songs)) {
        invalidResourceRes(res, "Song");
        return;
      }

      const { name, lyrics, trackNumber, albumId } = req.body;
      songs[songId].name = name;
      songs[songId].lyrics = lyrics;
      songs[songId].trackNumber = trackNumber;
      songs[songId].albumId = albumId;

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(songs[songId]));
      return res.end();
    }

    // DELETE /artists/:artistId (delete an artist)
    if (req.method === "DELETE" && req.url.startsWith("/artists/")) {
      const urlParts = req.url.split("/");
      if (urlParts.length === 3) {
        const artistId = urlParts[2];

        if (!(artistId in artists)) {
          invalidResourceRes(res, "Artist");
          return;
        }

        try {
          delete artists[artistId];
        } catch (err) {
          console.error("Can't delete artist from db.");
        }

        const resBody = {
          message: "Sucessfully deleted",
        };

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(resBody));
        return res.end();
      }
    }

    // DELETE /albums/:albumId (delete an album)
    if (req.method === "DELETE" && req.url.startsWith("/albums/")) {
      const urlParts = req.url.split("/");
      if (urlParts.length === 3) {
        const albumId = urlParts[2];

        if (!(albumId in albums)) {
          invalidResourceRes(res, "Album");
          return;
        }

        try {
          delete albums[albumId];
        } catch (err) {
          console.error("Can't delete album from db.");
        }

        const resBody = {
          message: "Sucessfully deleted",
        };

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(resBody));
        return res.end();
      }
    }

    // DELETE /songs/:songId (delete a song)
    if (req.method === "DELETE" && req.url.startsWith("/songs/")) {
      const urlParts = req.url.split("/");
      const songId = urlParts[2];

      if (!(songId in songs)) {
        invalidResourceRes(res, "Song");
        return;
      }

      try {
        delete songs[songId];
      } catch (err) {
        console.error("Can't delete song from db.");
      }

      const resBody = {
        message: "Sucessfully deleted",
      };

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(resBody));
      return res.end();
    }

    // Invalid route handler
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.write("Endpoint not found");
    return res.end();
  });
});

const port = 5001;

server.listen(port, () => console.log("Server is listening on port", port));
