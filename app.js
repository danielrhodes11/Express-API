const express = require('express');
const app = express();
const items = require('./fakeDb');
const ExpressError = require('./expressError');

app.use(express.json());

app.get('/items', (req, res, next) => {
    return res.json(items);
});

app.post('/items', (req, res, next) => {
    let newItem = req.body;
    items.push(newItem);
    return res.json({ ADDED: newItem });
});

app.get('/items/:name', (req, res, next) => {
    let foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404);
    }
    return res.json(foundItem);
});

app.patch('/items/:name', (req, res, next) => {
    let foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404);
    }
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    return res.json({ UPDATED: foundItem });
});

app.delete('/items/:name', (req, res, next) => {
    let foundItem = items.findIndex(item => item.name === req.params.name);
    if (foundItem === -1) {
        throw new ExpressError("Item not found", 404);
    }
    items.splice(foundItem, 1);
    return res.json({ message: "DELETED" });
});






module.exports = app;


