const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname + '/client/dist'));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/dist', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));