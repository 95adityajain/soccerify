import React from 'react';

import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import CustomButton from '../commons/CustomButton/CustomButton';



const SelectTeamButton = ({ onSelectTeamBtnClick }) =>{
  return (
    <CustomButton className="select-team-btn" onClick={ onSelectTeamBtnClick }>
      <Glyphicon glyph="star" /> Select Teams
    </CustomButton>
  );
};

export default class Competition extends React.Component {
  render() {
    const competition = {caption: 'Champions League 2016/17',numberOfGames: 20, numberOfTeams: 10};
    return (
      <ListGroupItem header={ competition.caption }>
        Total of<b> {competition.numberOfGames} </b>games will be played by
        <b> { competition.numberOfTeams } </b> teams.
        <SelectTeamButton { ...this.props } />
      </ListGroupItem>
    );
  }
}
