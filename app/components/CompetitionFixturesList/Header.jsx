import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Label from 'react-bootstrap/lib/Label';

import ErrorAlert from '../commons/ErrorAlert/ErrorAlert';
import GlyphiconButton from '../commons/GlyphiconButton/GlyphiconButton';


const RefreshButtonTooltip = (
  <Tooltip id="tooltip">Update all fixtures for this competition</Tooltip>
);

const LeagueCaption = ({ caption }) => {
  return (<b>{ caption } </b>);
};

const MatchdayDisplay = ({ currentMatchday }) => {
  return (<small className="matchday">Matchday - { currentMatchday }</small>);
};

const CustomRow = ({ children }) => {
  return (
    <Row className="list-group-item-heading">
      <center>{ children }</center>
    </Row>
  );
};

const UpdateStatus = ({ showUpdateStatus, isSuccess }) => {//TODO: handle this
  return (showUpdateStatus)?
    (<div>
      (isSuccess)? (<Label bsStyle="success">Updated successfully</Label>) :
      (<Label bsStyle="danger">Error occured while updating</Label>)
    </div>) : null;
};

const AlertContainer = ({ error, onButtonClick }) => {
  return (error)?
    (<Col xs={10} xsOffset={1} md={8} mdOffset={2}>
      <ErrorAlert 
        showStatus={true}
        alertMessage={ "Data fetch error" }
        onClickAlertButtonCallback={ onButtonClick } />
    </Col>) : null;
};

const LoadingContainer = ({ isProcessing }) => {
  return (isProcessing)?
    (<Col xs={10} xsOffset={1} md={8} mdOffset={2}>
      <ProgressBar active now={100} />
    </Col>) : null;
};

const HeaderTop = ({ competition, refreshFixtures }) => {
  return (
    <h4>
      <LeagueCaption caption={ competition.caption } />
      <OverlayTrigger placement="left" overlay={ RefreshButtonTooltip }>
        <span>
          <GlyphiconButton glyph="refresh" onClick={ refreshFixtures } />
        </span>
      </OverlayTrigger>
    </h4>
  );
};

const HeaderMiddle = ({ competition, getNext, getPrevious }) => {
  return (
    <div>
      <GlyphiconButton glyph="chevron-left" onClick={ getPrevious } />
      <MatchdayDisplay currentMatchday={ competition.currentMatchday } />
      <GlyphiconButton glyph="chevron-right" onClick={ getNext } />
    </div>
  );
};

const HeaderBottom = (props) => {
  return (
    <div>
      <UpdateStatus { ...props }/>
      <AlertContainer { ...props } />
      <LoadingContainer { ...props } />
    </div>
  );
};

export default class Header extends React.Component {
  render() {
    return (
      <ListGroupItem className="header">
        <CustomRow>
          <HeaderTop { ...this.props } />
          <HeaderMiddle { ...this.props } />
          <HeaderBottom { ...this.props.fetchStatus } />
        </CustomRow>
      </ListGroupItem>
    );
  }
}
Header.propTypes = {
  competition: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.object.isRequired,
  getNext: React.PropTypes.func.isRequired,
  getPrevious: React.PropTypes.func.isRequired,
  refreshFixtures: React.PropTypes.func.isRequired
};
