const express = require('express');
const app = express();
const port = 3000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users=[]
//for users
const UserRoutes= require('./routes/users.route')

app.use('/users', UserRoutes)

//news
const NewsRoutes= require('./routes/news.route')

app.use('/news', NewsRoutes)

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;