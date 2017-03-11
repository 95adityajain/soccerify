import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import CustomLoading from '../commons/CustomLoading/CustomLoading';
import ErrorAlert from '../commons/ErrorAlert/ErrorAlert';


export default class FetchStatus extends React.Component {
  render() {
    const { isProcessing, error, onButtonClick, errorText, btnText } = this.props;
    return (
      <Row>
        <Col xs={12} md={10} mdOffset={1}>
          { (isProcessing)? <CustomLoading /> : null }
          <ErrorAlert showStatus={ (error)?true:false } 
            alertMessage={ errorText } 
            buttonMessage={ btnText }
            onClickAlertButtonCallback={ onButtonClick } />
        </Col>
      </Row>
    );
  }
};
FetchStatus.propTypes = {
  isProcessing: React.PropTypes.bool.isRequired,
  error: React.PropTypes.bool.isRequired,
  onButtonClick: React.PropTypes.func.isRequired,
  errorText: React.PropTypes.string.isRequired,
  btnText: React.PropTypes.string.isRequired
};
