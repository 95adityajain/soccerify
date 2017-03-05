import Promise from 'bluebird';



const competitions = {
  'comp1': {},
  'comp2': {}
};

export const getCompetitions = () => {
  return Promise.resolve(competitions);
};

export default {
  getCompetitions
};
