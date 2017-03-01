import PouchDBService from "./PouchDBService";
import LocalStorageService from "./LocalStorageService";
import NetworkService from "./NetworkService";
import Promise from "bluebird";
import { convertIdForNetwork, convertIdForStorage } from "./CompetitionService";



const FIELD_TEAMS_FETCH = "teams_fetch/"; //per competition fetch status
const VALUE_TEAMS_FETCH = {
	NOT_FETCHED: -1, FETCHED: 1, FETCHING: 0
};

const generateLocalFieldTeamFetch = function(competitionId) {
    return FIELD_TEAMS_FETCH + competitionId;
};
const mapFromNetworkToStorage = function(ajaxResponse, competitionStorageId) {
    //var result = {"teams": [], "images": []};
    return ajaxResponse.map((doc) => {
        doc["_id"] = "teams/" + competitionStorageId + "/" + doc.id;
        delete doc.id;
        return doc;
    });
};
const mapFromStorageToDisplay = function(teams) {
    return teams.map((team) => {
        delete team.doc._rev;
        return team.doc;
    });
};
const mapFromStorageToDisplay_MAP = function(teams) {
    return teams.reduce((accumulator, team) => {
        delete team.doc._rev;
        accumulator[team.doc._id] = team.doc;
        return accumulator;
    }, {});
};
const getFromNetwork = function(competitionNetworkId) {
    return NetworkService.sendRequest(NetworkService.getTeamsAjaxOptions(competitionNetworkId))
    .then((result) => {
        console.log("teams fetched from network");
        return result.teams;
    }).catch((err) => {
        console.log("error while getting teams from network", err);
        return Promise.reject();
    });
};
const saveInStorage = function(teams, competitionStorageId) {
    console.log("saving teams in db")
    return PouchDBService.getInstance().bulkDocs(teams).then(() => {
        console.log("teams successfully saved in db");
        return true;
    }).catch((err) => {
        console.log("error while saving teams in db", err);
        return Promise.reject();
    });
};
const fetchAndStore = function(competitionNetworkId, competitionStorageId) {
    LocalStorageService.set(generateLocalFieldTeamFetch(competitionStorageId), VALUE_TEAMS_FETCH.FETCHING);
    return getFromNetwork(competitionNetworkId).then((res) => {
        return mapFromNetworkToStorage(res, competitionStorageId);
    }).then((list) => {
        return saveInStorage(list, competitionStorageId);
    }).then(() => {
        LocalStorageService.set(generateLocalFieldTeamFetch(competitionStorageId), VALUE_TEAMS_FETCH.FETCHED);
        return true;
    }).catch((err) => {
        LocalStorageService.set(generateLocalFieldTeamFetch(competitionStorageId), VALUE_TEAMS_FETCH.NOT_FETCHED);
        return Promise.reject();
    });
};
const getFromStorage0 = function(competitionStorageId) {
    const prefixKey = "teams/" + competitionStorageId;
    return PouchDBService.getInstance().allDocs({
        include_docs: true, startkey: prefixKey, endkey: prefixKey+"\uffff"
    }).then((result) => {
        console.log("teams fetched from pouch");
        return result.rows;
    });
};
const getFromStorage = function(competitionStorageId) {
    return getFromStorage0(competitionStorageId).then(mapFromStorageToDisplay).catch((err) => {
        console.log("error while getting teams from db", err);
        return Promise.reject();
    });
};

class TeamService {
    
    static getTeamFetchStatus(competitionId) {
        return LocalStorageService.get(generateLocalFieldTeamFetch(convertIdForStorage(competitionId)));
    }

    static get(competitionId) {
        const competitionStorageId = convertIdForStorage(competitionId);
        const competitionNetworkId = convertIdForNetwork(competitionId);

        const fetchStatus = parseInt(LocalStorageService.get(generateLocalFieldTeamFetch(competitionStorageId)));
        if (isNaN(fetchStatus) || fetchStatus == VALUE_TEAMS_FETCH.NOT_FETCHED) {
            return fetchAndStore(competitionNetworkId, competitionStorageId).then(() => {
                return getFromStorage(competitionStorageId);
            });
        }
        return getFromStorage(competitionStorageId);
    }

    static getMultipleByCompetitionIds(competitionIds) {
        const promiseArray = [];
        competitionIds.forEach((competitionId) => {
            promiseArray.push(getFromStorage0(convertIdForStorage(competitionId)));
        });

        return Promise.all(promiseArray).then((res) => {
            const allTeams = {};
            res.forEach((teams) => {
                teams.forEach((team) => {
                    delete team.doc._rev;
                    allTeams[team.doc._id] = team.doc;
                });
            });
            return allTeams;
        });
    }

    static getMultipleById(teamIds) {
        return PouchDBService.getInstance().allDocs({
            "include_docs": true, "keys": teamIds
        }).then((res) => {
            return res.rows;
        }).then(mapFromStorageToDisplay_MAP);
    }
}



export default TeamService;
