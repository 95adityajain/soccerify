import Promise from 'bluebird';



const competitions = [
  {'_id': 'comp1'},
  {'_id': 'comp2'}
];

const teams = {
  'comp1': [{
    '_id': 'team1'
  }]
};

export const getCompetitions = () => {
  return Promise.resolve(competitions);
};

export const getTeams = (competitionId) => {
  return Promise.resolve(teams[competitionId]);
};

export default {
  getCompetitions,
  getTeams
};
