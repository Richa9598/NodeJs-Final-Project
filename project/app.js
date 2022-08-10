let express = require('express');
let app = express();
let cors = require('cors');
let db = require('./config/db');
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
const dotenv=require('dotenv').config();
const mongoose = require('mongoose');

let path = require('path');

let port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static(path.join(__dirname, 'public')));

const HBS = exphbs.create({
    helpers: {
        arraySize: (arrayObject) => {
            return Object.keys(arrayObject).length+1;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    extname: ".hbs"
});

app.set('view engine', '.hbs');
app.engine('.hbs', HBS.engine);

//const dbConString = "mongodb+srv://admin:abhipatel2@ite5315.9k65m.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
const dbConString =process.env.DB_CONN_STRING;

console.log(dbConString);

db.initializing(dbConString);

app.get('/api/restaurants', async function (req, res) {
    let query = req.query;
    let result = await db.getAllRestaurants(query.page, query.perPage, query.borough);
    res.send(result)

});


app.get('/api/restaurants/:_id', async function (req, res) {
    let id = req.params._id;

    let result = await db.getRestaurantById(id);
    // console.log(result)
    res.send(result)

});



app.post('/api/restaurants', async function (req, res) {

    let newRestaurantObject = {
        address: req.body.address,
        borough: req.body.borough,
        cuisine: req.body.cuisine,
        grades: req.body.grades,
        name: req.body.name,
        restaurant_id: req.body.restaurant_id
    }
    let result = await db.addNewRestaurant(newRestaurantObject);


    if (result) {
        console.log(result)
        res.send("Restaurant Added!")
    } else {
        res.status(401).send("Ooops Error!!")
    }

});

app.put('/api/restaurants/:_id', async function (req, res) {
    let id = req.params._id;
    let restaurantUpdatedData = {
        address: req.body.address,
        borough: req.body.borough,
        cuisine: req.body.cuisine,
        grades: req.body.grades,
        name: req.body.name,
        restaurant_id: req.body.restaurant_id
    }

    let result = await db.updateRestaurantById(restaurantUpdatedData, id);
    res.status(200).send(result);

});

app.delete('/api/restaurants/:_id', async function (req, res) {

    let id = req.params._id;

    let result = await db.deleteRestaurantById(id);

    if (result.deletedCount) {
        res.send("Restaurant Deleted!")
    } else {
        res.status(401).send("Restaurant Not Found!!")
    }
});

app.get('/restaurants', async (req, res) => {
    let query = req.query;

    let result;
    
    let restaurantData;

    if (query.perPage > 0 && query.page > 0) {
        result = db.getAllRestaurants(query.page, query.perPage, query.borough);

        await result.then((result) => {
            restaurantData = result;
        }).catch((err) => {
            console.log(err);
            res.render('viewRestaurantsForm', { layout: false });
        });
    }
    res.render('viewRestaurantsForm', { restaurantData: restaurantData, layout: false });
})

app.listen(port);
console.log("App listening on port : " + port);
