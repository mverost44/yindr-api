// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for dishes
const Dish = require('../models/dish')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { dish: { title: '', text: 'foo' } } -> { dish: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /dishes
router.get('/dishes', requireToken, (req, res, next) => {
  Dish.find()
    .then(dishes => {
      // `dishes` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return dishes.map(dish => dish.toObject())
    })
    // respond with status 200 and JSON of the dishes
    .then(dishes => res.status(200).json({ dishes: dishes }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /dishes/5a7db6c74d55bc51bdf39793
router.get('/dishes/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Dish.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "dish" JSON
    .then(dish => res.status(200).json({ dish: dish.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /dishes
router.post('/dishes', requireToken, (req, res, next) => {
  // set owner of new dish to be current user
  req.body.dish.owner = req.user.id

  Dish.create(req.body.dish)
    // respond to succesful `create` with status 201 and JSON of new "dish"
    .then(dish => {
      res.status(201).json({ dish: dish.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /dishes/5a7db6c74d55bc51bdf39793
router.patch('/dish/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.dish.owner

  Dish.findById(req.params.id)
    .then(handle404)
    .then(dish => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, dish)

      // pass the result of Mongoose's `.update` to the next `.then`
      return dish.update(req.body.dish)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /dishes/5a7db6c74d55bc51bdf39793
router.delete('/dish/:id', requireToken, (req, res, next) => {
  Dish.findById(req.params.id)
    .then(handle404)
    .then(dish => {
      // throw an error if current user doesn't own `dish`
      requireOwnership(req, dish)
      // delete the dish ONLY IF the above didn't throw
      dish.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
