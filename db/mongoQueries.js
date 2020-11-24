const db = require('./index');

const insertProjectDoc = (projectObj) => {
    const projectsCollect = db.get().collection('projects');

    return projectsCollect.insertOne(projectObj);
}

module.exports = {
    insertProjectDoc
}