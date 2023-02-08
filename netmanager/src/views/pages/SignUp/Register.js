/* eslint-disable */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearErrors, registerCandidate } from 'redux/Join/actions';
import TextField from '@material-ui/core/TextField';
import categories from 'utils/categories';
import { Alert, AlertTitle } from '@material-ui/lab';
import { withStyles } from '@material-ui/core';
import { isEmpty, isEqual } from 'underscore';
import { isFormFullyFilled, containsEmptyValues } from './utils';
import usersStateConnector from 'views/stateConnectors/usersStateConnector';
import AlertMinimal from '../../layouts/AlertsMininal';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const countryObj = countries.getNames('en', { select: 'official' });

const countryArr = Object.entries(countryObj).map(([key, value]) => {
  return {
    label: value,
    value: key
  };
});

const styles = (theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
});

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const tenantMapper = {
  airqo: 'AirQo',
  kcca: 'KCCA'
};

const validateForm = (errors) => {
  try {
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val && val.length > 0 && (valid = false)
    );
    return valid;
  } catch (e) {
    console.log('validate form error', e.message);
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.query = new URLSearchParams(this.props.location.search);
    this.tenant = this.props.match.params.tenant || 'airqo';
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      description: '',
      long_organization: '',
      category: '',
      website: '',
      errors: {},
      isChecked: {},
      country: ''
    };
  }

  componentDidMount() {
    var anchorElem = document.createElement('link');
    anchorElem.setAttribute(
      'href',
      'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'
    );
    anchorElem.setAttribute('rel', 'stylesheet');
    anchorElem.setAttribute('id', 'logincdn');

    //document.body.appendChild(anchorElem);
    document.getElementsByTagName('head')[0].appendChild(anchorElem);
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.registered) {
      this.props.history.push('/login'); // push user to the landing page after successfull signup
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = (e) => {
    // this.setState({ [e.target.id]: e.target.value });

    e.preventDefault();
    const { id, value } = e.target;
    let errors = this.state.errors;
    if (id === 'email') {
      if (value.length === 0) errors[id] = 'This field is required';
      else errors[id] = validEmailRegex.test(value) ? '' : 'This is not a valid email';
    } else {
      errors[id] = value.length === 0 ? 'This field is required' : '';
    }
    this.setState(
      {
        ...this.state,
        errors,
        [id]: value
      },
      () => {
        console.log('errors', errors);
      }
    );
  };

  handleCheck = (event) => {
    this.state.isChecked = event.target.checked;
    this.setState({ isChecked: this.state.isChecked });
  };

  getInitialState = () => {
    return {
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      description: '',
      category: '',
      long_organization: '',
      website: '',
      errors: {},
      isChecked: {},
      country: ''
    };
  };

  clearState = () => {
    this.setState(this.getInitialState());
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (validateForm(this.state.errors)) {
      console.info('Valid Form');
    } else {
      console.error('Invalid Form');
    }

    const emptyFields = isFormFullyFilled(this.state, 'This field is required');

    if (!isEmpty(emptyFields)) {
      this.setState({
        ...this.state,
        errors: {
          ...this.state.errors,
          ...emptyFields
        }
      });
      return;
    }

    const { id, value } = e.target;
    let errors = this.state.errors;
    // const { errors } = this.state;

    // THis has been commented out.  Not sure where the mapped errors come from
    // errors[id] = mappedErrors && mappedErrors.errors[id] || "";

    if (!containsEmptyValues(errors)) {
      this.setState(
        {
          errors,
          [id]: value
        },
        () => {
          console.log(errors);
        }
      );
    } else {
      this.props.registerCandidate(this.tenant, this.state, () => this.clearState());
    }
  };

  tenantLabel = (tenant) => {
    return tenantMapper[tenant.toLowerCase()];
  };

  render() {
    const { errors } = this.state;
    const { classes } = this.props;
    return (
      <AlertMinimal>
        <div
          className="container"
          style={{
            maxWidth: '600px',
            marginTop: '4rem',
            backgroundColor: '#fff'
          }}
        >
          <div className="row">
            <div
              className=" offset-s2"
              style={{
                backgroundColor: '#3067e2',
                height: '15vh',
                padding: '1em'
              }}
            />
            <div className="offset-s2" style={{ backgroundColor: '#fff', padding: '1em' }}>
              <div className="col s12" style={{ paddingLeft: '11.250px' }}>
                <h4>
                  <b>{this.tenantLabel(this.tenant)} Access Request</b>
                </h4>
                <p className="grey-text text-darken-1">
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                <div
                  style={
                    isEmpty((this.props.errors && this.props.errors.data) || {})
                      ? { display: 'none' }
                      : {}
                  }
                >
                  <Alert
                    severity="error"
                    onClose={() => {
                      this.props.clearErrors();
                    }}
                  >
                    {this.props.errors && this.props.errors.data && this.props.errors.data.message}
                  </Alert>
                </div>

                <div className="col s12">
                  <TextField
                    onChange={this.onChange}
                    value={this.state.firstName}
                    error={!!errors.firstName}
                    id="firstName"
                    label="first Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={errors.firstName}
                  />
                  <TextField
                    onChange={this.onChange}
                    value={this.state.lastName}
                    error={!!errors.lastName}
                    id="lastName"
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={errors.lastName}
                  />
                  <TextField
                    onChange={this.onChange}
                    value={this.state.email}
                    error={!!errors.email}
                    id="email"
                    label="Official Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={errors.email}
                  />
                  <TextField
                    onChange={this.onChange}
                    select
                    value={this.state.country}
                    error={!!errors.country}
                    id="country"
                    label="Choose your country"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={errors.country}
                    SelectProps={{
                      native: true,
                      style: { width: '100%', height: '50px' }
                    }}
                  >
                    {countryArr.map(({ label, value }) => (
                      <option key={value} value={label}>
                        {label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    onChange={this.onChange}
                    value={this.state.long_organization}
                    error={!!errors.long_organization}
                    id="long_organization"
                    label="Organization"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={errors.long_organization}
                  />
                  <TextField
                    onChange={this.onChange}
                    value={this.state.jobTitle}
                    error={!!errors.jobTitle}
                    id="jobTitle"
                    label="Job Title"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={errors.jobTitle}
                  />
                  <TextField
                    onChange={this.onChange}
                    value={this.state.website}
                    error={!!errors.website}
                    id="website"
                    label="Website"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={errors.website}
                  />
                  <TextField
                    id="category"
                    select
                    label="What best describes you?"
                    value={this.state.category}
                    error={!!errors.category}
                    onChange={this.onChange}
                    fullWidth
                    SelectProps={{
                      native: true,
                      style: { width: '100%', height: '50px' }
                    }}
                    variant="outlined"
                    helperText={errors.category}
                  >
                    {categories.array.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    id="description"
                    label="Outline in detailed nature your interest in AirQuality"
                    fullWidth
                    multiline
                    rows="5"
                    rowsMax="10"
                    value={this.state.description}
                    onChange={this.onChange}
                    margin="normal"
                    variant="outlined"
                    error={!!errors.description}
                    helperText={errors.description}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>

                <div className="col s12" style={{ paddingLeft: '11.250px' }}>
                  {this.state.isChecked ? (
                    <button
                      style={{
                        width: '150px',
                        borderRadius: '3px',
                        letterSpacing: '1.5px',
                        margin: '1rem'
                      }}
                      type="submit"
                      className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                      disabled={
                        isEqual(this.getInitialState(), {
                          ...this.state,
                          errors: {},
                          isChecked: {}
                        }) || !validateForm(this.state.errors)
                      }
                    >
                      REQUEST
                    </button>
                  ) : null}
                </div>
                {this.props.auth.newUser && (
                  <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    Your request has been successfully received! — <strong>Thank you!</strong>
                  </Alert>
                )}
              </form>
            </div>
          </div>
        </div>
      </AlertMinimal>
    );
  }
}

Register.propTypes = {
  registerCandidate: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

// export default Register;
export default usersStateConnector(
  connect(mapStateToProps, { registerCandidate, clearErrors })(
    withRouter(withStyles(styles, { withTheme: true })(Register))
  )
);
