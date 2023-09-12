// add middlewares here related to projects
const Projects = require('./projects-model')

async function validateProjectId (req, res, next) {
    const { id } = req.params;
    try {
        const project = await Projects.get(id);
        if(project) {
            req.project = project;
            req.id = id;
            next();
        } else {
            res.status(404).json({ message: "project not found"})
        }
    }
    catch (err) {
        next(err);
    }
}
function validateProjectContents (req, res, next) {
    const { name, description } = req.body;
    if(!name || ! description) {
        res.status(400).json({ message: "projects need a name and description"})
    } else {
        next();
    }
}

async function validateProjectUpdate (req, res, next) {
    const { name, description, completed } = req.body
    const changes = req.body
    if(!name || !description || !completed) {
        res.status(400).json({ message: "projects need a name, description, and completed property"})
    } else {
        const project = await Projects.get(req.params.id)
        if(project) {
            req.changes = changes;
            next();
        }
        else {
            res.status(404).json({ message: "cannot find project"})
        }
    }
    
}
module.exports = {
    validateProjectId,
    validateProjectContents,
    validateProjectUpdate
}