const db = require('./index');

const getMaxJobNumber = () => {
    const projectsCollect = db.get().collection('projects');

    return projectsCollect.find({"projectInfo.jobNumber":{"$exists":true}}).sort({"projectInfo.jobNumber": -1}).limit(1).toArray()
    .then(data => {
        console.log(data);
        if(data.length === 0) return 0;
        return data[0].projectInfo.jobNumber;
    });
}


const getAllProjects = () => {
    const projectsCollect = db.get().collection('projects');

    return projectsCollect.find({}).toArray();
}


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
    getMaxJobNumber,
    getAllProjects,
    getProjectDoc,
    replaceOneUpsertProjectDoc,
}