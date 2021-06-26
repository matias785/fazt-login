const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/notes-db-app', {
    useCreateIndex: true,
    useNewUrlparser: true,
    useFindAndModify: false,
    useUnifiedtopology: true
}) 
    .then(db => console.log('DB is connected'))
    .catch(db => console.error(err));
