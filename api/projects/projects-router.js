// Write your "projects" router here!
const express = require('express');
const Projects = require('./projects-model');
const { validateProjectId, validateProjectContents, validateProjectUpdate } = require('./projects-middleware')

const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({ message: "There was a problem contacting the server"})
        })
})

router.get('/:id', validateProjectId, (req, res, next) => {
    res.status(200).json(req.project)
})
router.post('/', validateProjectContents, (req, res, next) => {
   Projects.insert(req.body)
    .then(project => {
        res.status(201).json(project)
    }) 
    .catch(err => next(err))

})
// router.put('/:id', validateProjectUpdate, (req, res, next) => {
//     const { id } = req.params
//     Projects.update(id, req.changes)
//         .then(project => {
//             console.log(req.body);
//             res.status(200).json(project)
//         })
//         .catch(err => next(err))
// })
router.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const project = await Projects.get(id)
        if(project) {
            const { completed, name, description } = req.body;
            const changes = req.body
            if(name && description && (completed === true || completed === false)) {
                Projects.update(id, changes)
                .then(update => {
                    console.log(update);
                    res.status(200).send(update)
                })
            } else {
                res.status(400).json({ message: "please fill out all fields"})
            }
            
        } else {
            res.status(404).json({ message: "project not found"})
        }
    }
    catch {
        res.status(500).json({ message: "server error"})
    }
})
router.delete('/:id', validateProjectId, (req, res, next) => {
    Projects.remove(req.id)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => next(err))
})
router.get('/:id/actions', validateProjectId, (req, res, next) => {
    Projects.getProjectActions(req.id)
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => next(err))
})

module.exports = router;
