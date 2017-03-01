import CompetitionService from "./CompetitionService";
import TeamService from "./TeamService";
import FixturesService from "./FixturesService";
import PreferenceService from "./PreferenceService";



class UserService {

    static initialize() {
        PreferenceService.initialize();
        CompetitionService.initialize();
    }

    static getCompetitionFetchStatus() {
        return CompetitionService.getCompetitionFetchStatus();
    }

    static getCompetitions() {
        return CompetitionService.get();
    }

    static getTeamFetchStatus(){
        return TeamService.getTeamFetchStatus(competitionId);
    }

    static getTeams(competitionId) {
        return TeamService.get(competitionId);
    }

    static fetchAndStoreFixturesForCompetition(competitionId) {
        return FixturesService.fetchAndStoreForCompetition(competitionId);
    }

    static fetchCompetitionsFixturesAndGetByOneMatchday(competitionId, matchday, isRefreshRequest) {
        return FixturesService.fetchAndGetOneMatchday(competitionId, matchday, isRefreshRequest);
    }

    static getTeamsPreferences(competitionId) {
        return Promise.resolve(PreferenceService.getForTeams(competitionId));
    }

    static saveTeamsPreferences(competitionId, preferences) {
        return PreferenceService.saveForTeams(competitionId, preferences);
    }

    static getPreferredCompetitionsWithTeams() {
        let allPreferences = PreferenceService.getAllForTeams();
        let allPreferencesKeys = Object.keys(allPreferences);

        let competitionIds = allPreferencesKeys.map((competitionId) => {
            return "competitions/" + competitionId;
        });

        let promiseArray = [CompetitionService.getMultipleById(competitionIds),
            TeamService.getMultipleByCompetitionIds(allPreferencesKeys)];

        return Promise.all(promiseArray).then((result) => {
            return {preferences: allPreferences, competitions: result[0], teams: result[1]};
        });
    }
    
    static hasFixturesToday() {
        const canWatchToday = function(dt) {
            return now.getDate() == dt.getDate() || (now.getDate() + 1 == dt.getDate() && dt.getHours() < 8);
        };
        const handlePerCompetition = function(competitionId) {
            return CompetitionService.getCurrentMatchday("competitions/" + competitionId).then((currentMatchday) => {
                return UserService.fetchCompetitionsFixturesAndGetByOneMatchday(competitionId, currentMatchday);
            }).then((fixtures) => {
                let found = false;
                fixtures.forEach((fixture) => {
                    if (allPreferences[competitionId][fixture.htId] || allPreferences[competitionId][fixture.atId]){
                        let dt = new Date(fixture.date);
                        if (canWatchToday(dt) && FixturesService.isFixtureRemaining(fixture.stat)) {
                            console.log("fixture found");
                            found = true;
                        }
                    }
                });
                return found;
            }).catch(() => {
                return false;
            });
        };
        const generatePromiseFactories = function(competitionIds) {
            return competitionIds.map((competitionId) => {
                return function(fixtureFound) {
                    if (fixtureFound) {
                        return true;
                    }
                    console.log("getting matchday for " + competitionId);
                    return handlePerCompetition(competitionId);
                };
            });
        };
        let allPreferences = PreferenceService.getAllForTeams();
        const now = new Date();
        promiseFactories = generatePromiseFactories(Object.keys(allPreferences));

        let result = Promise.resolve(false);
        promiseFactories.forEach((promiseFactory) => {
            result = result.then(promiseFactory);
        });
        return result;
    }
}



export default UserService;
