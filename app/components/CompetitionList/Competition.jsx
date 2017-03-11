import React from 'react';

import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import CustomButton from '../commons/CustomButton/CustomButton';



const SelectTeamButton = ({ onSelectTeamBtnClick, competition }) =>{
  const onClick = function() {
    onSelectTeamBtnClick(competition._id);
  }
  return (
    <CustomButton className="select-team-btn" onClick={ onClick }>
      <Glyphicon glyph="star" /> Select Teams
    </CustomButton>
  );
};

export default class Competition extends React.Component {
  render() {
    const { competition } = this.props;
    return (
      <ListGroupItem header={ competition.caption }>
        <small>Total of<b> {competition.numberOfGames} </b>games will be played by
        <b> { competition.numberOfTeams } </b> teams.</small>
        <SelectTeamButton { ...this.props } />
      </ListGroupItem>
    );
  }
}
