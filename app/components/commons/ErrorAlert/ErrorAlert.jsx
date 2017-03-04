import React from 'react';

import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';



const DEFAULT_ALERT_MESSAGE = "Not Available";
const DEFAULT_BUTTON_MESSAGE = "Fetch";
const DEFAULT_ON_CLICK_ALERT_BUTTON_CALLBACK = function(){ };
const DEFAULT_SHOW_STATUS = false;

const CustomAlert = ({alertMessage, buttonMessage, onClickAlertButtonCallback}) => {
  return (
    <Alert bsStyle="danger">
      <Button bsStyle="danger" className="pull-right" 
        onClick={ onClickAlertButtonCallback }>
        { buttonMessage }
      </Button>
      <h4><b>{ alertMessage }</b></h4>
    </Alert>
  );
};

export default class ErrorAlert extends React.Component{
  render() {
    const customAlert = (this.props.showStatus) ? 
      <CustomAlert {...this.props} /> : null;

    return customAlert;
  }
}

ErrorAlert.propTypes = {
  alertMessage: React.PropTypes.string.isRequired,
  buttonMessage: React.PropTypes.string.isRequired,
  onClickAlertButtonCallback: React.PropTypes.func.isRequired,
  showStatus: React.PropTypes.bool.isRequired
};

ErrorAlert.defaultProps = {
  alertMessage: DEFAULT_ALERT_MESSAGE,
  buttonMessage: DEFAULT_BUTTON_MESSAGE,
  onClickAlertButtonCallback: DEFAULT_ON_CLICK_ALERT_BUTTON_CALLBACK,
  showStatus: DEFAULT_SHOW_STATUS
};
