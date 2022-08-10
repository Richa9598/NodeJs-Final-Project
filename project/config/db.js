const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');


const initializing = (connectionString) => {
    mongoose.connect(connectionString).then(() => {
        console.log("Mongodb connected");
    }).catch(error => console.log(error.message));
}

const addNewRestaurant = (newRestaurant) => {
    let result = Restaurant.create(newRestaurant).then((restaurant) => {
        return restaurant;
    }).catch((error) => {
        console.log(error);
    })

    return result;
};

const getAllRestaurants = (page, perPage, borough) => {
    let query = {};
    if (borough) {
        query.borough = borough;
    }
    let result = Restaurant.find(query).sort({ restaurant_id: 1 }).collation({ locale: "en_US", numericOrdering: true }).skip(perPage * page).limit(perPage).then((result) => {
        return result;
    })
    return result;
};

const getRestaurantById = (_id) => {
    let result = Restaurant.findById(_id).then((restaurant) => {
        return restaurant;
    }).catch((error) => {
        console.log("error",error);
    })
    return result;
}


const updateRestaurantById = (updatedRestaurantData, _id) => {
    let result = Restaurant.findByIdAndUpdate(_id, updatedRestaurantData).then((restaurant) => {
        return 'Successfully! updated';
    }).catch((error) => {
        console.log(error);
    })

    return result;
}

const deleteRestaurantById = (_id) => {
    let result = Restaurant.deleteOne({
        _id
    }).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err)
    })
    return result;
}

module.exports = { initializing, addNewRestaurant, getAllRestaurants, getRestaurantById, updateRestaurantById, deleteRestaurantById }