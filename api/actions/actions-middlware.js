// add middlewares here related to actions
const Actions = require('./actions-model');
const Projects = require('../projects/projects-model');

async function validateActionId (req, res, next) {
    const { id } = req.params;
    try {
        const action = await Actions.get(id)
        if(action) {
            req.action = action;
            req.id = id;
            next();
        } else {
            res.status(404).json({ message: `action with id ${id} not found`})
        }
    }
    catch (err) {
        next(err)
    }
}

async function validateNewAction (req, res, next) {
    const { project_id, description, notes } = req.body;
    const newAction = {project_id, description, notes}
    if(!project_id || !description || !notes) {
        res.status(400).json({ message: "actions must have a description, notes, and a valid project id"})
    } else {
        const project = await Projects.get(project_id)
        if(project) {
            req.action = newAction;
            next();
        }
        else {
            res.status(404).json({ message: "actions can only be created for an existing project"})
        }
        
    }
}

module.exports = {
    validateActionId,
    validateNewAction,
}