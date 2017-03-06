import Promise from 'bluebird';



const competitions = [
  {'_id': 'comp1'},
  {'_id': 'comp2'},
];

export const getCompetitions = () => {
  return Promise.resolve(competitions);
};

export default {
  getCompetitions
};
