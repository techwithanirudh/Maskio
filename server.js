const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.static('dist'));
app.use('/sprites', express.static('dist/sprites'));
app.use('/sounds', express.static('dist/sounds'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
