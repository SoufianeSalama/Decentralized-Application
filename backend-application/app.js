/*
* API using JS Express
* Soufiane Salama
*/

'use strict';

/////////////////////////////////////////////
//  Global variables
const express = require('express')
const app = express()
const port = 3000
const path = require('path');
let fabricNetworkConn = require('./fabric/network_connection.js');


/////////////////////////////////////////////
//  API routes

// Welcome page (SWAGGER)
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')));

// Query for a specific asset
app.get('/query/:id', async (req, res) => {
     var id = req.params.id;
    // res.send("Asset ID: " + id);

    let networkConnection = await fabricNetworkConn.connectToNetwork();
    let response = await fabricNetworkConn.invoke(networkConnection, 'queryCar', id);
        
    if (response.error) {
        res.send("Fault: " + response.error);
    } else {
        let parsedResponse = await JSON.parse(response);
        res.send(parsedResponse);
    }

    
});

// Query all assets
app.get('/query', async (req, res) => {
    let networkConnection = await fabricNetworkConn.connectToNetwork();
    let response = await fabricNetworkConn.invoke(networkConnection, 'queryAllCars', '');

    if (response.error) {
        res.send("Fault: " + response.error);
    } else {
        let parsedResponse = await JSON.parse(response);
        res.send(parsedResponse);
    }
});


/* // Update a specific asset
app.get('/update/:id', async (req, res) => {
    var id = req.params.id;
    res.send("Asset ID: " + id);
});

// Change owner of asset
app.get('/changeowner/:id', async (req, res) => {
    var id = req.params.id;
    res.send("Asset ID: " + id);
});
 */

app.listen(port, () => console.log(`Example app listening on port ${port}!`))