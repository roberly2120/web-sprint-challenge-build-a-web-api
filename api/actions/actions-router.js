// Write your "actions" router here!
const express = require('express');
const Actions = require('./actions-model');
const { validateActionId, validateNewAction } = require('./actions-middlware');

const router = express.Router();

router.get('/', (req, res) =>{
    Actions.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            res.status(500).json({ message: "something went wrong!"})
        })
})
router.get('/:id', validateActionId, (req, res, next) => {
    Actions.get(req.id)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => next(err))
})
router.post('/', validateNewAction, (req, res, next) => {
    Actions.insert(req.action)
     .then(action => {
        res.status(201).json(action)
     })
     .catch(err => next(err))
})
router.put('/:id', validateActionId, validateNewAction, (req, res, next) => {
    Actions.update(req.id, req.body)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => next(err))
})
router.delete('/:id', validateActionId, (req, res, next) => {
    Actions.remove(req.id)
        .then(resp => {
            res.status(200).json({ message: "deleted"})
        })
        .catch(err => next(err))
})
module.exports = router;