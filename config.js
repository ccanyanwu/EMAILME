var config = {};

// config.ENV = "local";
// config.DBNAME = "emailme";
// config.DBUSERNAME = "manifestUser";
// config.DBPASSWORD = "manifestPassword";
// config.DBDIALECT = "postgres";
// config.DBPORT = 5432;
// config.DBREGION = "us-east-1";
// config.DBHOST = "manifestdbinstance.cgq0reqixqsd.us-east-1.rds.amazonaws.com";
config.PORT = process.env.PORT || 5000;

/* config.WEBSITE_URL = "https:localhost:5678";
config.USER_MODULE_API_URL =
  "https://rhck9sk8bh.execute-api.us-east-1.amazonaws.com/userModuleDevAPI3";
config.USER_MODULE_JWT_SECRET = "MTMVP JWT SECRET";
config.USER_MODULE_SALT = "7sd!O(!@$*!#*#!a989!!@*#!@#&!^#*!&3hASD987*(#*%$&";
config.USER_MODULE_GET_MODULE_ACCESS_API_NAME = "module_access";

config.EMAIL_HOST = "smtp.gmail.com";
config.EMAIL_SECURE = "ssl";
config.EMAIL_PORT = "587";
config.EMAIL_USER = "babatope.olajide@gmail.com";
config.EMAIL_PASSWORD = "wtdyucsmshylaahb";
config.EMAIL_FROM = "info@singlelogin.io";

config.DEBUG = true;

config.JWTSECRET = "P)$TB!)G(*#$&*";
config.JWT_EXPIRY_TIME = "1h";

// Common data variables

config.LEVEL = ["Easy", "Moderate", "Hard"]; */

module.exports = config;
