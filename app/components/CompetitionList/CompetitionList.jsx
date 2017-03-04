import React from 'react';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Modal from 'react-bootstrap/lib/Modal';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import Competition from './Competition';
import CustomButton from '../commons/CustomButton/CustomButton';

import CompetitionListCss from './CompetitionList.css';




const TeamListModal = ({ closeModal, showModal, children }) => {
  return (
    <Modal show={showModal} onHide={closeModal} keyboard={false} backdrop={'static'}>
      <Modal.Header>
        <CustomButton onClick={ closeModal }>Close</CustomButton>
        <Modal.Title>Edit Preferences</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row><Col mdOffset={2} md={8}><ListGroup>
        { children }
        </ListGroup></Col></Row>
      </Modal.Body>
      <Modal.Footer>
        <span className="pull-left">
            <CustomButton>Select All</CustomButton>
        </span>
        <span className="pull-left">
          &nbsp;&nbsp;<CustomButton>Deselect All</CustomButton>
        </span>
        <CustomButton>Save</CustomButton>
      </Modal.Footer>
    </Modal>
  )
};

const Team = ({ }) => {
  return (
    <ListGroupItem>
      <Row>
        <Col md={2} xs={2}>
          <img className="media-object team-img" 
            src="http://upload.wikimedia.org/wikipedia/de/3/3f/Real_Madrid_Logo.svg" alt="" />
        </Col>
        <Col md={8} xs={8}>
          <center><h4>Real Madrid</h4></center>
        </Col>
        <Col md={2} xs={2}>
          <input type="checkbox" className="team-select-checkbox" />
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default class CompetitionList extends React.Component {
  
  constructor() {
    super();
    this.state = { showModal: false };
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  closeModal() {
    this.setState({ showModal: false });
  }
  openModal() {
    this.setState({ showModal: true });
  }

  render() {
    const competitionList = this.props.competitionList.map((competition ,index) => {
      competition.onSelectTeamBtnClick = this.openModal;
      return (<Competition {...competition} key={index} />);
    });

    return (
      <ListGroup>
        {competitionList}
        <TeamListModal showModal={this.state.showModal} closeModal={this.closeModal}>
          <Team />
        </TeamListModal>
      </ListGroup>
    );
  }
}
