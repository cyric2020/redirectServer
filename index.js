const fs = require('fs');
const express = require('express');
const app = express();

const port = getConfig('config.json').Port;

function getConfig(file){
    return JSON.parse(fs.readFileSync('./config/' + file));
}

function saveConfig(file, config){
    fs.writeFileSync('./config/' + file, JSON.stringify(config));
}

app.use(express.static('public'));

app.get('/dash/login', (req, res) => {
    res.sendFile(__dirname + '/dash/login.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});