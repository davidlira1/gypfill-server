const db = require('./index');

const getProjectDoc = (street, companyName, phaseOrBuilding) => {
    const projectsCollect = db.get().collection('projects');

    if (phaseOrBuilding === "empty") {
        console.log("comes through here if phaseOr Building empty");
        return projectsCollect.find(
            {
                "projectInfo.street": street,
                "companyInfo.companyName": companyName
            }).toArray();
    } else{
        return projectsCollect.find(
            {
                "projectInfo.street": street,
                "companyInfo.companyName": companyName,
                "projectInfo.phaseOrBuilding": phaseOrBuilding
            }).toArray(); 
    }
}

const replaceOneUpsertProjectDoc = (projectData, street, companyName, phaseOrBuilding) => {
    const projectsCollect = db.get().collection('projects');
    
    if (phaseOrBuilding === "") {
        console.log('should come through here');
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
    } else {
        return projectsCollect.replaceOne(
            {
                "projectInfo.street": street,
                "companyInfo.companyName": companyName,
                "projectInfo.phaseOrBuilding": phaseOrBuilding
            }, 
            projectData,
            {
                upsert: true
            }
        );
    }
}

module.exports = {
    getProjectDoc,
    replaceOneUpsertProjectDoc
}