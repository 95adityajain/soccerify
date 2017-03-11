import Promise from 'bluebird';



const sendMessageToChrome = function(message) {
  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage(message, function(response){
      console.log(response);
      resolve(response);
    });
  });
};

export const getCompetitions = () => {
  return sendMessageToChrome({action: "get/competitions"});
};

export const getTeams = (competitionId) => {
  return sendMessageToChrome({
    action: "get/competitions/teams/",
    competitionId
  });
};

export const getFixtures = (competitionId, matchday) => {
  return sendMessageToChrome({
    action: "get/competitions/fixtures/by_matchday",
    competitionId,
    matchday
  });
};

export const refreshAndGetFixtures = (competitionId, matchday) => {
  return sendMessageToChrome({
    action: "refresh_get/competitions/fixtures/by_matchday",
    competitionId,
    matchday
  });
};

export const getAllPreferences = () => {
  return sendMessageToChrome({
    action: "get/teams/preferences/all"
  });
};

export const saveTeamsPreferencesByCompetition = (competitionId, preferences) => {
  return sendMessageToChrome({
    action: "save/teams/preferences",
    competitionId,
    preferences
  });
};
