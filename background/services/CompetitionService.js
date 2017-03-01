import PouchDBService from "./PouchDBService";
import LocalStorageService from "./LocalStorageService";
import NetworkService from "./NetworkService";
import Promise form "bluebird";



const FIELD_COMPETITON_FETCH = "competitions_fetch";
const VALUE_COMPETITION_FETCH = {
    NOT_FETCHED: -1, FETCHED: 1, FETCHING: 0
};

const mapFromNetworkToStorage = function(ajaxResponse) {
    return ajaxResponse.map((doc) => {
        doc["_id"] = "competitions/" + doc["league"] + "-" +doc["id"];
        delete doc["id"];
        return doc;
    });
};
const mapFromStorageToDisplay = function(competitions) {
    return competitions.map((competition) => {
        delete competition.doc._rev;
        competition.doc._id = competition.doc._id.split("/")[1];
        return competition.doc;
    });
};
const getFromNetwork = function(season) {
    return NetworkService.sendRequest(NetworkService.getCompetitionAjaxOptions()).then((result) => {
        console.log("competitions fetched from network", result);
        return result;
    }).catch((err) => {
        console.log("error while getting competitions from network", err);
        return Promise.reject();
    });
};
const saveInStorage = function(competitions) {
    console.log ("saving competitions in db")
    return PouchDBService.getInstance().bulkDocs(competitions).then(() => {
        console.log("competitions successfully saved in db");
        return true;
    }).catch((err) => {
        console.lo("error while saving competitions in db", err);
        return Promise.reject();
    });
};
const fetchAndStore = function() {
    LocalStorageService.set(FIELD_COMPETITON_FETCH, VALUE_COMPETITION_FETCH.FETCHING);
    return getFromNetwork().then(mapFromNetworkToStorage).then(saveInStorage).then(() => {
        LocalStorageService.set(FIELD_COMPETITON_FETCH, VALUE_COMPETITION_FETCH.FETCHED);
        return true;
    }).catch((err) => {
        LocalStorageService.set(FIELD_COMPETITON_FETCH, VALUE_COMPETITION_FETCH.NOT_FETCHED);
        return Promise.reject();
    });
};
const getFromStorage = function() {
    return PouchDBService.getInstance().allDocs({
        include_docs: true, startkey: "competitions", endkey: "competitions\uffff"
    }).then ((result) => {
        console.log ("competitions fetched from pouch", result);
        return result.rows;
    }).then(mapFromStorageToDisplay).catch((err) => {
        console.log("error while getting competitions from db", err);
        return Promise.reject();
    });
};

class CompetitionService {

    static initialize() {
        LocalStorageService.set(FIELD_COMPETITON_FETCH, VALUE_COMPETITION_FETCH.NOT_FETCHED);
        fetchAndStore();
    }

    static getCompetitionFetchStatus() {
        return LocalStorageService.get(FIELD_COMPETITON_FETCH);
    }

    static get() {
        if (LocalStorageService.get(FIELD_COMPETITON_FETCH) == VALUE_COMPETITION_FETCH.NOT_FETCHED) {
            return fetchAndStore().then(getFromStorage);
        }
        return getFromStorage();
    }

    static getMultipleById(idArray) {
        return PouchDBService.getInstance().allDocs({
            "include_docs": true, "keys": idArray
        }).then((res) => {
            return res.rows;
        }).then(mapFromStorageToDisplay);
    }

    static getCurrentMatchday(competitionId) {
        return PouchDBService.getInstance ().get(competitionId).then((competition) => {
            return competition.currentMatchday;
        });
    }
}



export default CompetitionService;
