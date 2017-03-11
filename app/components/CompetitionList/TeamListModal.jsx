import React from 'react';

import Modal from 'react-bootstrap/lib/Modal';
import CustomButton from '../commons/CustomButton/CustomButton';



export default class TeamListModal extends React.Component {
  render() {
    const {
      closeModal,
      showModal,
      children,
      savePreferences,
      selectAllCheckboxes,
      deselectAllCheckboxes
    } = this.props;
    return (
      <Modal
        show={ showModal }
        onHide={ closeModal } 
        keyboard={ false }
        backdrop={ 'static' }>

        <Modal.Header>
          <CustomButton onClick={ closeModal }>Close</CustomButton>
          <Modal.Title>Edit Preferences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { children }
        </Modal.Body>
        <Modal.Footer>
          <span className="pull-left">
            <CustomButton onClick={ selectAllCheckboxes }>
              Select All
            </CustomButton>
          </span>
          <span className="pull-left">
            &nbsp;&nbsp;
            <CustomButton onClick = { deselectAllCheckboxes }>
              Deselect All
            </CustomButton>
          </span>
          <CustomButton onClick={ savePreferences } >Save</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  }
};
TeamListModal.propTypes = {
  showModal: React.PropTypes.bool.isRequired,
  closeModal: React.PropTypes.func.isRequired,
  savePreferences: React.PropTypes.func.isRequired,
  selectAllCheckboxes: React.PropTypes.func.isRequired,
  deselectAllCheckboxes: React.PropTypes.func.isRequired
};
