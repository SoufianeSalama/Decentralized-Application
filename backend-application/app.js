'use strict';

const express = require('express')
const app = express()
const port = 3000
const path = require('path');

// Welcome page (SWAGGER)
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')));

// Query for a specific asset
app.get('/query/:id', async (req, res) => {
    var id = req.params.id;
    res.send("Asset ID: " + id);
});

// Update a specific asset
app.get('/update/:id', async (req, res) => {
    var id = req.params.id;
    res.send("Asset ID: " + id);
});

// Change owner of asset
app.get('/changeowner/:id', async (req, res) => {
    var id = req.params.id;
    res.send("Asset ID: " + sid);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))