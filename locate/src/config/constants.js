const prodConfig = {
  VERIFY_TOKEN_URI: "https://airqo-250220.uc.r.appspot.com/api/v1/users/reset",
  UPDATE_PWD_URI:
    "https://airqo-250220.uc.r.appspot.com/api/v1/users/updatePasswordViaEmail",
  FORGOT_PWD_URI:
    "https://airqo-250220.uc.r.appspot.com/api/v1/users/forgotPassword",
  LOGIN_USER_URI:
    "https://airqo-250220.uc.r.appspot.com/api/v1/users/loginUser",
  REGISTER_USER_URI:
    "https://airqo-250220.uc.r.appspot.com/api/v1/users/registerUser",
  REGISTER_CANDIDATE_URI:
    "https://airqo-250220.uc.r.appspot.com/api/v1/users/registerCandidate",
  REJECT_USER_URI: "https://airqo-250220.uc.r.appspot.com/api/v1/users/deny",
  ACCEPT_USER_URI: "https://airqo-250220.uc.r.appspot.com/api/v1/users/accept",
  GET_USERS_URI: "https://airqo-250220.uc.r.appspot.com/api/v1/users/",
  RUN_LOCATE_MODEL:
    "https://locate-bknd-service-dot-airqo-250220.uc.r.appspot.com/api/v1/map/parishes",
  SAVE_LOCATE_MAP:
    "https://locate-bknd-service-dot-airqo-250220.uc.r.appspot.com/api/v1/map/savelocatemap",
  GET_LOCATE_MAP:
    "https://locate-bknd-service-dot-airqo-250220.uc.r.appspot.com/api/v1/map/getlocatemap/",
  UPDATE_LOCATE_MAP:
    "https://locate-bknd-service-dot-airqo-250220.uc.r.appspot.com/api/v1/map/updatelocatemap/",
  DELETE_LOCATE_MAP:
    "https://locate-bknd-service-dot-airqo-250220.uc.r.appspot.com/api/v1/map/deletelocatemap/",
};

const devConfig = {
  VERIFY_TOKEN_URI: "http://localhost:3000/api/v1/users/reset",
  UPDATE_PWD_URI: "http://localhost:3000/api/v1/users/updatePasswordViaEmail",
  FORGOT_PWD_URI: "http://localhost:3000/api/v1/users/forgotPassword",
  LOGIN_USER_URI: "http://localhost:3000/api/v1/users/loginUser",
  REGISTER_USER_URI: "http://localhost:3000/api/v1/users/registerUser",
  REGISTER_CANDIDATE_URI:
    "http://localhost:3000/api/v1/users/registerCandidate",
  REJECT_USER_URI: "http://localhost:3000/api/v1/users/deny",
  ACCEPT_USER_URI: "http://localhost:3000/api/v1/users/accept",
  GET_USERS_URI: "http://localhost:3000/api/v1/users/",
  RUN_LOCATE_MODEL: "http://localhost:4000/api/v1/map/parishes",
  SAVE_LOCATE_MAP: "http://localhost:4000/api/v1/map/savelocatemap",
  GET_LOCATE_MAP: "http://localhost:4000/api/v1/map/getlocatemap/",
  UPDATE_LOCATE_MAP: "http://localhost:4000/api/v1/map/updatelocatemap/",
  DELETE_LOCATE_MAP: "http://localhost:4000/api/v1/map/deletelocatemap/",
};

function runConfig(env) {
  switch (env) {
    case "development":
      return devConfig;
    default:
      return prodConfig;
  }
}

export default { ...runConfig(process.env.NODE_ENV) };
