import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

const PDDashBoardPage = '/messages/project-msg';
const DesignerDashBoardPage = '/messages/contribution-msg';
const OperatorDashBoardPage = '/sample-check/check-list';
const SignupPage = '/signup';

export class DefaultPage extends Component {
  static propTypes = { home: PropTypes.object.isRequired, actions: PropTypes.object.isRequired };

  componentDidMount() {
    // this.props.actions.routeByRolePerm();
    const { user: { role, permittedRole }, history } = this.props;

    if (role === '') {
      // enter signup page
      return history.replace(SignupPage);
    }

    if (role === 'operator') {
      return history.replace(OperatorDashBoardPage);
    }

    if (role === permittedRole) {
      if (permittedRole === 'pd') {
        return history.replace(PDDashBoardPage);
      }
      if (permittedRole === 'designer') {
        return history.replace(DesignerDashBoardPage);
      }
    }

    console.warn('un expected behavior',  role, permittedRole);
  }

  render() {
    return null;
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    user: state.user,
    home: state.home
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage);
