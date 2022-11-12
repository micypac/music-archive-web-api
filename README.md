# API Server for Music Archive using HTTP

## Set up

Run server using `npm start`.

## Instructions

Take a look at the server code in **server.js**.
The seed data for artists, albums, and songs are imported
from the JSON files in the **seeds** folder. The seed data for `artists`,
`albums`, and `songs` saved to variables at the top of the **server.js** file.

Run every endpoints with Postman
and/or in the browser's "Console" tab using `fetch`.

Make sure the server's request-response for every endpoint matches the below API documentation.

```json
{
  "1": {
    "endpoint": "Get all the artists",
    "request": {
      "method": "GET",
      "URL": "/artists",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": [
        {
          "artistId": 1,
          "name": "Red Hot Chili Peppers"
        }
      ]
    }
  },
  "2": {
    "endpoint": "Get a specific artist's details based on artistId",
    "request": {
      "method": "GET",
      "URL": "/artists/:artistId",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": {
        "name": "Red Hot Chili Peppers",
        "artistId": 1,
        "albums": [{ "name": "Stadium Arcadium", "albumId": 1, "artistId": 1 }]
      }
    }
  },
  "3": {
    "endpoint": "Add an artist",
    "request": {
      "method": "POST",
      "URL": "/artists",
      "headers": "application/json",
      "body": {
        "name": "Eminem"
      }
    },
    "response": {
      "headers": "application/json",
      "statusCode": 201,
      "body": {
        "name": "Eminem",
        "artistId": 2
      }
    }
  },
  "4": {
    "endpoint": "Edit a specified artist by artistId",
    "request": {
      "method": "PUT",
      "URL": "/artists/:artistId",
      "headers": "application/json",
      "body": {
        "name": "Limp Bizkit"
      }
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": {
        "name": "Limp Bizkit",
        "artistId": 2
      }
    }
  },
  "5": {
    "endpoint": "Delete a specified artist by artistId",
    "request": {
      "method": "DELETE",
      "URL": "/artists/:artistId",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": {
        "message": "Sucessfully deleted"
      }
    }
  },
  "6": {
    "endpoint": "Get all albums of a specific artist based on artistId",
    "request": {
      "method": "GET",
      "URL": "/artists/:artistId/albums",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": [{ "name": "Stadium Arcadium", "albumId": 1, "artistId": 1 }]
    }
  },
  "7": {
    "endpoint": "Get a specific album's details based on albumId",
    "request": {
      "method": "GET",
      "URL": "/albums/1",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": {
        "name": "Stadium Arcadium",
        "albumId": 1,
        "artistId": 1,
        "artist": { "name": "Red Hot Chili Peppers", "artistId": 1 },
        "songs": [
          {
            "name": "Dani California",
            "lyrics": "Getting born in the state of Mississippi\nPapa was a copper, and her mama was a hippy\nIn Alabama she would swing a ...",
            "trackNumber": 1,
            "songId": 1,
            "albumId": 1
          }
        ]
      }
    }
  },
  "8": {
    "endpoint": "Add an album to a specific artist based on artistId",
    "request": {
      "method": "POST",
      "URL": "/artists/:artistId/albums",
      "headers": "application/json",
      "body": {
        "name": "The Way I Am"
      }
    },
    "response": {
      "headers": "application/json",
      "statusCode": 201,
      "body": {
        "name": "The Way I Am",
        "albumId": 2,
        "artistId": 3
      }
    }
  },
  "9": {
    "endpoint": "Edit a specified album by albumId",
    "request": {
      "method": "PUT",
      "URL": "/albums/:albumId",
      "headers": "application/json",
      "body": {
        "name": "The Marshall Mathers LP"
      }
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": {
        "name": "The Marshall Mathers LP",
        "albumId": 2,
        "artistId": 3
      }
    }
  },
  "10": {
    "endpoint": "Delete a specified album by albumId",
    "request": {
      "method": "DELETE",
      "URL": "/albums/:albumId",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": { "message": "Sucessfully deleted" }
    }
  },
  "11": {
    "endpoint": "Get all songs of a specific artist based on artistId",
    "request": {
      "method": "GET",
      "URL": "/artists/:artistId/songs",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": [
        {
          "name": "Dani California",
          "lyrics": "Getting born in the state of Mississippi\nPapa was a copper, and her mama was a hippy\nIn Alabama she would swing a hammer...",
          "trackNumber": 1,
          "songId": 1,
          "albumId": 1
        }
      ]
    }
  },
  "12": {
    "endpoint": "Get all songs of a specific album based on albumId",
    "request": {
      "method": "GET",
      "URL": "/albums/:albumId/songs",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": [
        {
          "name": "Dani California",
          "lyrics": "Getting born in the state of Mississippi\nPapa was a copper, and her mama was a hippy\nIn Alabama she would swing a hammer...",
          "trackNumber": 1,
          "songId": 1,
          "albumId": 1
        }
      ]
    }
  },
  "13": {
    "endpoint": "Get all songs of a specified trackNumber",
    "request": {
      "method": "GET",
      "URL": "/trackNumbers/:trackNumber/songs",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": [
        {
          "name": "Dani California",
          "lyrics": "Getting born in the state of Mississippi\nPapa was a copper, and her mama was a hippy\nIn Alabama she would swing a hammer...",
          "trackNumber": 1,
          "songId": 1,
          "albumId": 1
        }
      ]
    }
  },
  "14": {
    "endpoint": "Get a specific song's details based on songId",
    "request": {
      "method": "GET",
      "URL": "/songs/:songId",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": {
        "name": "Dani California",
        "lyrics": "Getting born in the state of Mississippi\nPapa was a copper, and her mama was a hippy\nIn Alabama she would swing a hammer...",
        "trackNumber": 1,
        "songId": 1,
        "albumId": 1,
        "album": {
          "name": "Stadium Arcadium",
          "albumId": 1,
          "artistId": 1
        },
        "artist": {
          "name": "Red Hot Chili Peppers",
          "artistId": 1
        }
      }
    }
  },
  "15": {
    "endpoint": "Add a song to a specific album based on albumId",
    "request": {
      "method": "POST",
      "URL": "/albums/:albumId/songs",
      "headers": "application/json",
      "body": {
        "name": "The Way I am",
        "lyrics": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a nunc porttitor, rhoncus odio venenatis, semper est. Mauris magna ...",
        "trackNumber": 1
      }
    },
    "response": {
      "headers": "application/json",
      "statusCode": 201,
      "body": {
        "name": "The Way I am",
        "lyrics": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a nunc porttitor, rhoncus odio venenatis, semper est. Mauris magna enim...",
        "trackNumber": 1,
        "songId": 4,
        "albumId": 3
      }
    }
  },
  "16": {
    "endpoint": "Edit a specified song by songId",
    "request": {
      "method": "PUT",
      "URL": "/songs/:songId",
      "headers": "application/json",
      "body": {
        "name": "Kill You",
        "lyrics": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a nunc porttitor, rhoncus odio venenatis, semper est. Mauris magna ...",
        "trackNumber": 2
      }
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": {
        "name": "Kill You",
        "lyrics": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a nunc porttitor, rhoncus odio venenatis, semper est. Mauris magna ...",
        "trackNumber": 2,
        "songId": 2,
        "albumId": 3
      }
    }
  },
  "17": {
    "endpoint": "Delete a specified song by songId",
    "request": {
      "method": "DELETE",
      "URL": "/songs/:songId",
      "headers": null,
      "body": null
    },
    "response": {
      "headers": "application/json",
      "statusCode": 200,
      "body": {
        "message": "Sucessfully deleted"
      }
    }
  }
}
```
