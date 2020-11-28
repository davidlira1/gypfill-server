const db = require('./index');

const getProjectDoc = (dealName) => {
    const projectsCollect = db.get().collection('projects');

    return projectsCollect.find(
        {
            "projectInfo.dealName": dealName
        }).toArray();
}

const replaceOneUpsertProjectDoc = (projectData, dealName) => {
    const projectsCollect = db.get().collection('projects');
    
    return projectsCollect.replaceOne(
        {
            // projectInfo: {
            //     dealName: dealName
            // }
            "projectInfo.dealName": dealName
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