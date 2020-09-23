/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";

//new imports
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { verifyToken, updatePassword } from "../../../redux/Join/actions";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import constants from "../../../config/constants";
const loading = {
  margin: "1em",
  fontSize: "24px",
};

const title = {
  pageTitle: "Password Reset Screen",
};

class ResetPassword extends Component {
  constructor() {
    super();

    this.initialstate = {
      userName: "",
      password: "",
      confirmPassword: "",
      update: false,
      isLoading: true,
      error: false,
      errors: {
        password: "",
        password2: "",
      },
    };
  }
  //fires as soon as the page is reached
  //extract token and DATE from URL params and
  //passes it back to server's reset route for verification
  async componentDidMount() {
    var anchorElem = document.createElement("link");
    anchorElem.setAttribute(
      "href",
      "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
    );
    anchorElem.setAttribute("rel", "stylesheet");
    anchorElem.setAttribute("id", "logincdn");

    //document.body.appendChild(anchorElem);
    document.getElementsByTagName("head")[0].appendChild(anchorElem);

    const {
      match: {
        params: { token },
      },
    } = this.props;

    await axios
      .get(constants.VERIFY_TOKEN_URI, {
        params: {
          resetPasswordToken: token,
        },
      })
      .then((response) => {
        console.log("this is my response: ");
        console.log(response);
        if (response.data.message === "password reset link a-ok") {
          this.setState({
            userName: response.data.userName,
            updated: false,
            isLoading: false,
            error: false,
          });
        } else {
          this.setState({
            updated: false,
            isLoading: false,
            error: true,
          });
        }
      })
      .catch((error) => {
        console.log(error.data);
      });
  }

  onChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    let errors = this.initialstate.errors;

    switch (id) {
      case "password":
        errors.password = validPasswordRegex.test(value)
          ? ""
          : "Minimum six characters, at least one uppercase letter, one lowercase letter and one number!";
        break;

      case "password2":
        errors.password2 = validPasswordRegex.test(value)
          ? ""
          : "Minimum six characters, at least one uppercase letter, one lowercase letter and one number!";
        break;
    }

    this.setState({ errors, [id]: value }, () => {
      console.log(errors);
    });
    // this.setState({
    //   [id]: value,
    // });
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  clearState = () => {
    this.setState({ ...initialState });
  };

  //if the user is authenticated and allowed to reset their password.
  //update password while logged into the app, as well
  onSubmit = (e) => {
    e.preventDefault();
    const { userName, password } = this.initialstate;
    const {
      match: {
        params: { token },
      },
    } = this.props;

    if (validateForm(this.initialstate.errors)) {
      console.log(userData);
      if (userData.password !== userData.password2) {
        alert("Passwords don't match");
      } else {
        return axios
          .put(constants.UPDATE_PWD_URI, {
            userName,
            password,
            resetPasswordToken: token,
          })
          .then((response) => {
            if (response.data.message === "password updated") {
              this.setState({
                updated: true,
                error: false,
              });
            } else {
              this.setState({
                updated: false,
                error: true,
              });
            }
          })
          .catch((e) => {
            console.log(e.data);
          });
      }
      clearState();
    } else {
      console.error("Invalid Form");
      alert("Invalid Form Fields");
    }
  };

  render() {
    const { errors } = this.initialstate;
    const {
      userName,
      password,
      password2,
      error,
      isLoading,
      updated,
      errors,
    } = this.initialstate;

    if (error) {
      return (
        <div>
          <div>
            <h4>Problem resetting password. Please send another reset link.</h4>
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Reset Password Error</b>
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <div className="col s12" style={{ paddingTop: "20px" }}>
              <Link to="/forgot"> Forgotten Password?</Link>
            </div>
          </div>
        </div>
      );
    }
    // {}
    else if (isLoading) {
      return <div>Loading User Data...</div>;
    } else if (!isLoading && !error) {
      return (
        <div className="container">
          <div className="row">
            <div className="col s8 offset-s2">
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                  <b>Reset Password</b>
                </h4>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={password}
                    error={errors.password}
                    id="password"
                    type="password"
                    className={classnames("", {
                      invalid: errors.password,
                    })}
                  />
                  <label htmlFor="password">Password</label>
                  <span className="red-text">{errors.password}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={password2}
                    error={errors.password2}
                    id="password2"
                    type="password"
                    className={classnames("", {
                      invalid: errors.password2,
                    })}
                  />
                  <label htmlFor="password2">Confirm Password</label>
                  <span className="red-text">{errors.password2}</span>
                </div>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                  <button
                    style={{
                      width: "150px",
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "1rem",
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                  >
                    Reset
                  </button>
                </div>
              </form>
              {updated && (
                <div>
                  <Link to="/" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i>{" "}
                    Back to home
                  </Link>
                  <p>
                    Your password has been successfully reset, please try
                    logging in again.
                  </p>
                  <p className="grey-text text-darken-1">
                    Already have an account? <Link to="/login">Log in</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

ResetPassword.propTypes = {
  errors: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }),
  }),
};

const mapSateToProps = (initialstate) => ({
  errors: initialstate.errors,
});

export default ResetPassword;
