import React, { Component } from 'react';
import { logout, checkAdminPrivileges, loadEmployeeData, loadAdminData, putReviewFeedback, postNewReviewFeedback, postNewPerformanceReview, deleteUser, deleteReviewFeedback, deletePerformanceReview, putUser, postNewUser } from '../../actions';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppModal from './modal';
import AdminView from './admin';
import EmployeeView from './employee';

class Home extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getSubmitHandler = this.getSubmitHandler.bind(this);
    this.state = {
      model: null,
      data: null,
      newInstance: null,
    };
  }

  logout() {
    this.props.logout();
    this.props.history.push('/login');
  }

  componentWillMount() {
    if (!this.props.authenticated) {
      this.props.history.push('/login');
    } else {
      // authenticated, let's see if we have admin privileges
      this.props.checkAdminPrivileges().then(
        () => {
          // we have admin priveleges, load data for admin
          this.props.loadAdminData();
        },
        (response) => {
          // we do not have admin priveleges, load data for employee
          if (response.response.status === 403) {
            this.props.loadEmployeeData();
          }
        }
      );
    }
  }

  closeModal() {
    this.setState({ model: null, data: null, newInstance: null });
  }

  getSubmitHandler() {
    if (this.state.model === 'ReviewFeedback') {
      if (this.state.newInstance) {
        return ({ formData }) => {
          this.props.postNewReviewFeedback({
            performanceReviewId: formData.performanceReviewId,
            reviewer: formData.reviewer,
          }).then(() => {
            // trigger refresh so that all data is reloaded
            window.location.reload();
          })
        }
      } else {
        return ({ formData }) => {
          this.props.putReviewFeedback(formData.url, formData.feedback).then(() => {
            // trigger refresh so that all data is reloaded
            window.location.reload();
          })
        }
      }
    } else if (this.state.model === 'PerformanceReview') { // will always be new instance
      return ({ formData }) => {
        this.props.postNewPerformanceReview(formData.reviewee).then(() => {
          // trigger refresh so that all data is reloaded
          window.location.reload();
        })
      }
    } else if (this.state.model === 'User') {
      if (this.state.newInstance) {
        return ({ formData }) => {
          this.props.postNewUser({
            username: formData.username,
            password: formData.password,
            email: formData.email,
          }).then(() => {
            // trigger refresh so that all data is reloaded
            window.location.reload();
          })
        }
      } else {
        return ({ formData }) => {
          this.props.putUser(formData.url, {
            password: formData.password,
            email: formData.email,
          }).then(() => {
            // trigger refresh so that all data is reloaded
            window.location.reload();
          })
        }
      }
    }
  }

  render() {
    return (
      <div className="container">
        <AppModal
          model={this.state.model}
          newInstance={this.state.newInstance}
          closeModal={this.closeModal}
          data={this.state.data}
          submitHandler={this.getSubmitHandler()}
        />
        <div className="row" style={{ height: 40 }}>
          <div style={{ float: 'right' }}>
            <button className="btn btn-primary" onClick={this.logout}>Logout</button>
          </div>
        </div>
        <div className="row">
          {(this.props.adminDataUsers) ? (
            <AdminView
              adminDataUsers={this.props.adminDataUsers}
              adminDataPerformanceReviews={this.props.adminDataPerformanceReviews}
              deleteUserCb={this.props.deleteUser}
              deletePerformanceReviewCb={this.props.deletePerformanceReview}
              deleteReviewFeedbackCb={this.props.deleteReviewFeedback}
              modalCb={(modalState) => {
                this.setState(modalState);
              }}
            />
          ) : ( this.props.employeeData && (
            <EmployeeView
              employeeData={this.props.employeeData}
              modalCb={(modalState) => {
                this.setState(modalState);
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: !!state.auth.token,
  employeeData: state.employee.reviewFeedbacks,
  adminDataUsers: state.admin.users,
  adminDataPerformanceReviews: state.admin.performanceReviews,
});

export default connect(mapStateToProps, {
  logout,
  checkAdminPrivileges,
  loadEmployeeData,
  loadAdminData,
  putReviewFeedback,
  deleteUser,
  deleteReviewFeedback,
  deletePerformanceReview,
  putUser,
  postNewUser,
  postNewPerformanceReview,
  postNewReviewFeedback,
})(Home);
