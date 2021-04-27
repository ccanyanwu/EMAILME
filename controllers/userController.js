const DB = require("../modules/db");
const config = require("../config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

module.exports = {
  /**
   * this request is coming from user module
   * @param {*} req
   * @param {*} res
   */

  async login_from_user_module(req, res) {
    let { module_id, app_key_hash } = req.body;

    //we need to decrypt app key hash to get app keys

    var getAppKey = AES.decrypt(app_key_hash, config.USER_MODULE_SALT);

    getAppKey = getAppKey.toString(CryptoJS.enc.Utf8);

    // Parse App Key
    var app_keys = JSON.parse(getAppKey);

    res.redirect(
      config.WEBSITE_URL +
        "/auth/login/" +
        app_keys.public_key +
        "/" +
        app_keys.private_key +
        "/" +
        module_id
    );
  },

  /**
   * login using app keys
   * @param {*} req
   * @param {*} res
   */

  async login_using_keys(req, res) {
    try {
      let { public_key, private_key, module_id } = req.body;

      //create hash from this data

      let data = {};
      data.public_key = public_key;
      data.private_key = private_key;
      let data_json = JSON.stringify(data);

      var ciphertext = CryptoJS.AES.encrypt(data_json, config.USER_MODULE_SALT);
      let app_key_hash = ciphertext.toString();

      let map = {};
      map["module_id"] = module_id;
      map["app_key"] = app_key_hash;
      map["api"] = config.USER_MODULE_GET_MODULE_ACCESS_API_NAME;
      let jsonmap = JSON.stringify(map);

      let response = await fetch(config.USER_MODULE_API_URL, {
        method: "POST",
        async: false,
        body: jsonmap,
        headers: { "content-type": "application/json" },
      });
      let ret_data = await response.json();
      if (ret_data.status) {
        let permission = ret_data.data.permission;

        if (!permission || permission === "") {
          return res.send({
            status: 0,
            message: "You don't have permission to this module",
          });
        }

        //user has permissions, get required data
        let user_detail = ret_data.data.user_detail;

        let cognitouserid = user_detail.account_id;
        let name = user_detail.name;
        let email = user_detail.email;

        //find the user in users table, if found then ok, otherwise ask user for role

        let user = await DB.users.findOne({
          where: {
            cognitouserid,
          },
        });

        if (user) {
          let userdata = user.dataValues;

          const authtoken = jwt.sign(
            {
              payload: userdata,
            },
            config.JWTSECRET,
            {
              expiresIn: config.JWT_EXPIRY_TIME,
            }
          );

          res.send({
            status: 1,
            userexists: 1,
            token: authtoken,
            user: userdata,
          });
        } else {
            await DB.users.create({
              cognitouserid,
              fullname: name,
              email,
              //userType: role,
            });

            res.send({ status: 1, message: "User created successfully" });
          /* res.send({
            status: 1,
            userexists: 0,
            user: { cognitouserid, name, email },
          }); */
        }
      } else {
        res.send({ status: 0, message: ret_data.message });
      }
    } catch (error) {
      res.send({ status: 0, message: error.message });
    }
  },

  /**
   * register a user
   * @param {*} req
   * @param {*} res
   */

  async register(req, res) {
    await check("fullname")
      .notEmpty()
      .withMessage("Please enter fullname")
      .run(req);
    await check("userType")
      .isIn(["Student", "Teacher", "Admin"])
      .withMessage("Please enter usertype")
      .run(req);
    await check("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .run(req);
    await check("password")
      .isLength({ min: 6 })
      .withMessage("Please enter password")
      .run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ status: 0, message: "Invalid data" });
    }

    try {
      const { fullname, email, userType, password } = req.body;

      //Checking if any user is already registered by this email address
      const user = await DB.users.findOne({ where: { email } });

      if (user) {
        return res
          .status(400)
          .json({ status: 0, message: "User already exists" });
      }

      //Setting defalut pic for profile
      const pic = "defaultAvatar.png";

      //Creating encryption salt for hashing
      const salt = await bcrypt.genSalt(10);

      //Hashing password with created salt
      const hashPass = await bcrypt.hash(password, salt);

      const newUser = {
        fullname,
        email,
        userType,
        password: hashPass,
        pic,
      };

      //Creating new user if all OK
      let result = await DB.users.create(newUser);

      res.send({
        status: 1,
        message: `${userType} successfully registered`,
        user: result,
      });
    } catch (error) {
      res.send({ status: 0, message: error.message });
    }
  },

  /**
   * login with user module with userdata, which has cognitouserid
   * @param {*} req
   * @param {*} res
   */

  async login_with_user_module_with_user_data(req, res) {
    try {
      let { data } = req.body;

      let { cognitouserid } = data;

      let user = await DB.users.findOne({
        where: {
          cognitouserid,
        },
      });

      if (user) {
        let userdata = user.dataValues;

        const authtoken = jwt.sign(
          {
            payload: userdata,
          },
          config.JWTSECRET,
          {
            expiresIn: config.JWT_EXPIRY_TIME,
          }
        );

        res.send({ status: 1, token: authtoken, user: userdata });
      } else {
        res.send({
          status: 0,
          message:
            "Sorry! there was an error in your request, please contact support",
        });
      }
    } catch (error) {
      res.send({ status: 0, message: error.message });
    }
  },

  async login_with_user_module(req, res) {
    try {
      let { token } = req.body;
      var tokendata = jwt.verify(token, config.USER_MODULE_JWT_SECRET);
      let user_info = tokendata.user_info;
      let UserAttributes = user_info.UserAttributes;

      let cognitouserid = "";
      for (let i = 0; i < UserAttributes.length; i++) {
        if (UserAttributes[i].Name == "sub") {
          cognitouserid = UserAttributes[i].Value;
          break;
        }
      }

      let user = await DB.users.findOne({
        where: {
          cognitouserid,
        },
      });

      if (user) {
        let userdata = user.dataValues;

        const authtoken = jwt.sign(
          {
            payload: userdata,
          },
          config.JWTSECRET,
          {
            expiresIn: config.JWT_EXPIRY_TIME,
          }
        );

        res.send({ status: 1, token: authtoken, user: userdata });
      } else {
        res.send({
          status: 0,
          message:
            "Sorry! there was an error in your request, please contact support",
        });
      }
    } catch (error) {
      res.send({ status: 0, message: error.message });
    }
  },

  async create_user_with_userdata(req, res) {
    try {
      let { userdata} = req.body;

      let { cognitouserid, name, email } = userdata;

      const user = await DB.users.findOne({ where: { cognitouserid } });

      if (user) {
        //this case will only reach when there is an error in our implementation
        //because this API is only supposed to be called when we don't have the user
        res.send({ status: 0, message: "User already exists" });
      } else {
        //we need to create user
        await DB.users.create({
          cognitouserid,
          fullname: name,
          email,
          //userType: role,
        });

        res.send({ status: 1, message: "User created successfully" });
      }
    } catch (error) {
      res.send({ status: 0, message: error.message });
    }
  },

  /**
   * create user with role after user has logged in with user module
   * @param {*} req
   * @param {*} res
   */

  async create_user(req, res) {
    try {
      let { token, role } = req.body;

      var tokendata = jwt.verify(token, config.USER_MODULE_JWT_SECRET);
      let user_info = tokendata.user_info;

      let cognitouserid = "";
      let name = "";
      let email = "";

      let UserAttributes = user_info.UserAttributes;

      for (let i = 0; i < UserAttributes.length; i++) {
        if (UserAttributes[i].Name == "sub") {
          cognitouserid = UserAttributes[i].Value;
        }

        if (UserAttributes[i].Name === "name") {
          name = UserAttributes[i].Value;
        }

        if (UserAttributes[i].Name === "email") {
          email = UserAttributes[i].Value;
        }
      }

      const user = await DB.users.findOne({ where: { cognitouserid } });

      if (user) {
        //this case will only reach when there is an error in our implementation
        //because this API is only supposed to be called when we don't have the user
        res.send({ status: 0, message: "User already exists" });
      } else {
        //we need to create user
        await DB.users.create({
          cognitouserid,
          fullname: name,
          email,
          userType: role,
        });

        res.send({ status: 1, message: "User created successfully" });
      }
    } catch (error) {
      res.send({ status: 0, message: error.message });
    }
  },

  /**
   * check whether user from user module exists in our db or not
   * @param {*} req
   * @param {*} res
   */

  async check_user_existance(req, res) {
    try {
      let { token } = req.body;
      var tokendata = jwt.verify(token, config.USER_MODULE_JWT_SECRET);

      let user_info = tokendata.user_info;

      let UserAttributes = user_info.UserAttributes;

      let cognitouserid = "";

      for (let i = 0; i < UserAttributes.length; i++) {
        if (UserAttributes[i].Name == "sub") {
          cognitouserid = UserAttributes[i].Value;
          break;
        }
      }

      //we need to check this user id in our db
      //if not then we need to ask client for role and save this user
      const user = await DB.users.findOne({ where: { cognitouserid } });
      if (user) {
        res.send({
          status: 1,
          tokendata,
          userexists: 1,
          role_level: tokendata.role_level,
        });
      } else {
        res.send({ status: 1, tokendata, userexists: 0 });
      }
    } catch (error) {
      res.send({ status: 0, message: error.message });
    }
  },

  /**
   * login a user
   * @param {*} req
   * @param {*} res
   */
  async login(req, res) {
    await check("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("Please enter password")
      .run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ status: 0, message: "Invalid data" });
    }

    try {
      const { email, password } = req.body;

      //Checking if user with this email exists then proceed to next step
      const user = await DB.users.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ status: 0, message: "Invalid Credentials" });
      }

      //Verify password with hashed string
      const verifyPass = await bcrypt.compare(password, user.password);

      if (!verifyPass) {
        return res
          .status(400)
          .json({ status: 0, message: "Invalid Credentials" });
      }

      //Removing password from returning user object
      user.password = undefined;

      //Signing token for client side authentication and its period
      const token = jwt.sign(
        {
          payload: user,
        },
        config.JWTSECRET,
        {
          expiresIn: config.JWT_EXPIRY_TIME,
        }
      );

      res.send({ status: 1, message: "Logged in successfully", token });
    } catch (error) {
      res.send({ status: 0, message: error.message });
    }
  },
  /**
   * get current a user
   * @param {*} req
   * @param {*} res
   */
  async me(req, res) {
    let { authtokendata } = req.body;

    //Return user data from auth token
    if (authtokendata) {
      return res.send({
        status: 1,
        message: "User loaded",
        userData: authtokendata,
      });
    }
    return res.send({ status: 0, message: "No user loaded" });
  },
};
