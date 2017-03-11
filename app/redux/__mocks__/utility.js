import Promise from 'bluebird';



const competitions = [
  {'_id': 'comp1'},
  {'_id': 'comp2'}
];

const teams = {
  'comp1': [{
    '_id': 'teams/comp1/team1'
  }]
};

const fixtures = {
  'comp1': {
    23: [{
      '_id': 1234
    }]
  }
};

const refreshedFixtures = {
  'comp1': {
    23: [{
      '_id': 4321
    }]
  }
};

const preferences = {
  'comp1': {
    'team1': true
  }
};

export const getCompetitions = () => {
  return Promise.resolve(competitions);
};

export const getTeams = (competitionId) => {
  return Promise.resolve(teams[competitionId]);
};

export const getFixtures = (competitionId, matchDay) => {
  return Promise.resolve(fixtures[competitionId][matchDay]);
};

export const refreshAndGetFixtures = (competitionId, matchDay) => {
  return Promise.resolve(refreshedFixtures[competitionId][matchDay]);
};

export const getAllPreferences = () => {
  return Promise.resolve(preferences);
};

export const saveTeamsPreferencesByCompetition = (competitionId, preferences) => {
  return Promise.resolve();
};

export default {
  getCompetitions,
  getTeams,
  getFixtures,
  refreshAndGetFixtures,
  getAllPreferences,
  saveTeamsPreferencesByCompetition
};
