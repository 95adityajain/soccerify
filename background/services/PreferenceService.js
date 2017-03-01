import LocalStorageService from "./LocalStorageService";
import { convertIdForStorage } from "./CompetitionService";



const FIELD_TEAMS_PREFERENCES = "teams/preferences";

const getPreferencesFromStorage = function() {
    return LocalStorageService.get(FIELD_TEAMS_PREFERENCES);
};

const savePreferencesToStorage = function(competitionStorageId ,preferences) {
    let preferencesObject = getPreferencesFromStorage();
    if (!preferencesObject) {
        preferencesObject = {};
    }
    if (!preferences || Object.keys(preferences).length == 0) {
        delete preferencesObject[competitionStorageId];
    } else {
        preferencesObject[competitionStorageId] = preferences;
    }
    LocalStorageService.set(FIELD_TEAMS_PREFERENCES, preferencesObject);
};

class PreferenceService {
    
    static initialize() {
        LocalStorageService.set(FIELD_TEAMS_PREFERENCES, {});
    }

    static saveForTeams(competitionId ,preferences) {
        savePreferencesToStorage(convertIdForStorage(competitionId), preferences);
        return true;
    }

    static getForTeams(competitionId) {
        const preferences = getPreferencesFromStorage();
        return (preferences) ? preferences[convertIdForStorage(competitionId)] : null;
    }

    static getAllForTeams() {
        return getPreferencesFromStorage();
    }
    
    static getForCompetitions() {
        const preferences = getPreferencesFromStorage();
        return (preferences) ? Object.keys(preferences) : []; 
    }
}



export default PreferenceService;
