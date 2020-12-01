const db = require('./index');

const getProjectDoc = (street, companyName) => {
    const projectsCollect = db.get().collection('projects');

    return projectsCollect.find(
        {
            "projectInfo.street": street,
            "companyInfo.companyName": companyName
        }).toArray();
}

const replaceOneUpsertProjectDoc = (projectData, street, companyName) => {
    const projectsCollect = db.get().collection('projects');
    
    return projectsCollect.replaceOne(
        {
            "projectInfo.street": street,
            "companyInfo.companyName": companyName
        }, 
        projectData,
        {
            upsert: true
        }
    );
}

module.exports = {
    getProjectDoc,
    replaceOneUpsertProjectDoc
}