import PouchDBService from "./PouchDBService";
import LocalStorageService from "./LocalStorageService";
import NetworkService from "./NetworkService";
import Promise form "bluebird";
import {convertIdForNetwork, convertIdForStorage} from "./CompetitionService";



const FIELD_FIXTURES_FETCH = "fixtures_fetch/"; //per competition fetch status
const FIELD_FIXTURES_REFRESH = "fixtures_refresh/";
const VALUE_FIXTURES_FETCH = {
    NOT_FETCHED: -1, FETCHED: 1, FETCHING: 0
};

const generateLocalFieldFixturesFetch = function(competitionId) {
    return FIELD_FIXTURES_FETCH + competitionId;
};
const generateLocalFieldFixturesRefresh = function(competitionId) {
    return FIELD_FIXTURES_REFRESH + competitionId;
};
const startFetch = function(competitionStorageId, isRefreshRequest) {
    if (isRefreshRequest) {
        LocalStorageService.set(generateLocalFieldFixturesRefresh(competitionStorageId), VALUE_FIXTURES_FETCH.FETCHING);
    } else {
        LocalStorageService.set(generateLocalFieldFixturesFetch(competitionStorageId), VALUE_FIXTURES_FETCH.FETCHING);
    }
};
const stopFetch = function(competitionStorageId, isRefreshRequest, hasError) {
    if (isRefreshRequest) {
        if (hasError) {
            LocalStorageService.remove(generateLocalFieldFixturesRefresh(competitionStorageId));
        } else {
            LocalStorageService.set(generateLocalFieldFixturesRefresh(competitionStorageId), Date.now());
        }
    } else if (hasError) {
        LocalStorageService.set(generateLocalFieldFixturesFetch(competitionStorageId), VALUE_FIXTURES_FETCH.NOT_FETCHED);
    } else {
        LocalStorageService.set(generateLocalFieldFixturesFetch(competitionStorageId), VALUE_FIXTURES_FETCH.FETCHED);  
    }
};
const canFetch = function(competitionStorageId ,isRefreshRequest) {
    let fetchStatus = null;
    if (isRefreshRequest) {
        fetchStatus = parseInt(LocalStorageService.get(generateLocalFieldFixturesRefresh(competitionStorageId)));
        if (!isNaN(fetchStatus) && fetchStatus != VALUE_FIXTURES_FETCH.FETCHING) {
            return ((Date.now() - fetchStatus) > 3600000);
        }
    } else {
        fetchStatus = parseInt(LocalStorageService.get(generateLocalFieldFixturesFetch(competitionStorageId)));
    }
    return isNaN(fetchStatus) || fetchStatus == VALUE_FIXTURES_FETCH.NOT_FETCHED;
};
const mapFromNetworkToStorage = function(ajaxResponse, competitionStorageId) {
    return ajaxResponse.reduce((accumulator, doc) => {
        if (!accumulator[doc["mday"] - 1]) {
            accumulator [doc["mday"] - 1] = {
                "_id": "fixtures/" + doc["mday"] + "/" + competitionStorageId,
                "fixtures": []
            };
        }
        accumulator[doc["mday"]-1]["fixtures"].push(doc);
        return accumulator;
    }, []);
};
/*var _mapFromStorageToDisplay = function (competitions) {
return competitions.map (function (competition) {
  delete competition.doc._rev;
  return competition.doc;
});
}*/

/*var _getFromStorage = function (competitionStorageId) {
var prefixKey = "teams/"+competitionStorageId;
return PouchDBService.getInstance ().allDocs ({include_docs: true, startkey: prefixKey, endkey: prefixKey+"\uffff"}).then (function (result) {
  console.log ("teams fetched from pouch");
  return result.rows;
}).then (function (teams) {
  return _mapFromStorageToDisplay (teams);
}).catch (function (err) {
  console.log ("error while getting teams from db");
  console.error (err);
  return Promise.reject ();
});
};*/
const getFromNetwork = function(competitionNetworkId) {
    return NetworkService.sendRequest(NetworkService.getFixturesAjaxOptions(competitionNetworkId)).then((result) => {
        console.log("fixtures fetched from network");
        return result.fixtures;
    }).catch((err) => {
        console.log("error while getting fixtures from network", err);
        return Promise.reject();
    });
};
const saveInStorage = function(fixtures, competitionStorageId) {
    console.log ("saving fixtures in db")
    return PouchDBService.getInstance().bulkDocs(fixtures).then(() => {
        console.log("fixtures successfully saved in db");
        return true;
    }).catch((err) => {
        console.log("error while saving fixtures in db", err);
        return Promise.reject();
    });
};
const updateOne = function(fixture) {
    return PouchDBService.getInstance().get(fixture._id).then((doc) => {
        fixture ["_rev"] = doc._rev;
        return PouchDBService.getInstance().put(fixture);
    }).catch (() => {
        return PouchDBService.getInstance().put(fixture);
    }).catch ((err) => {
        console.log ("error while updating fixture in db" + fixture._id, err);
        return Promise.reject();
    });
};
const updateInStorage = function(fixtures, competitionStorageId) {
    console.log("updating fixtures in db");
    return Promise.all(fixtures.map((fixture) => {
        return updateOne(fixture);
    }));
};
const fetchAndStore = function(competitionNetworkId, competitionStorageId, isRefreshRequest) {
    startFetch(competitionStorageId, isRefreshRequest);
    return getFromNetwork(competitionNetworkId).then ((res) => {
        return mapFromNetworkToStorage(res, competitionStorageId);
    }).then((list) => {
        if (isRefreshRequest) {
            return updateInStorage(list, competitionStorageId);
        }
        return saveInStorage(list, competitionStorageId);
    }).then(() => {
        stopFetch(competitionStorageId, isRefreshRequest);
        return true;
    }).catch((err) => {
        stopFetch(competitionStorageId, isRefreshRequest, true);
        return Promise.reject();
    });
};
const getOneMatchdayFixturesFromStorage = function(fixtureId) {
    return PouchDBService.getInstance().get(fixtureId).then((result) => {
        console.log("one matchday fixtures fetched from pouch");
        return result.fixtures;
    }).catch ((err) => {
        console.log("eror while getting one matchday fixtures from db", err);
        return Promise.reject();
    });
};

class FixturesService {

    static fetchAndStoreForCompetition(competitionId, isRefreshRequest) {
        const competitionStorageId = convertIdForStorage(competitionId);
        const competitionNetworkId = convertIdForNetwork(competitionId);
        if (canFetch(competitionStorageId ,isRefreshRequest)) {
            return fetchAndStore(competitionNetworkId, competitionStorageId, isRefreshRequest);
        }
        return Promise.resolve();
    }

    static getByCompetitionAndMatchday(competitionId, matchday) {
        return getOneMatchdayFixturesFromStorage("fixtures/" + matchday +"/" +convertIdForStorage(competitionId));
    }

    static fetchAndGetOneMatchday(competitionId, matchday, isRefreshRequest) {
        return FixturesService.fetchAndStoreForCompetition(competitionId, isRefreshRequest).then (() => {
            return FixturesService.getByCompetitionAndMatchday(competitionId, matchday);
        });
    }

    static isFixtureRemaining(status) {
        return (status == "SCHEDULED" || status == "IN_PLAY" || status == "TIMED");
    }
}



export default FixturesService;
