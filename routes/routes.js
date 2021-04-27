// const express = require("express")
// const router = express.Router()

// const userController = require("../controllers/userController")

// const authMiddleware = require("../middlewares/authorize")

// /*************************************************************************
// API CALL START
// *************************************************************************/

// router.get("/api/test", (req, res) => {
//     return res.send({ status: 1 })
// })

// /**
//  * user is coming directly from user module by clicking "click to open this module"
//  * data coming is module id and app key hash  
// */

// router.post("/", userController.login_from_user_module)

// /*
// ***************************************************************
// USER ROUTES START FROM HERE
// ***************************************************************
// */

// router.post("/api/user/register", userController.register)
// router.post("/api/user/login", userController.login)
// router.post("/api/user/check_user_existance", userController.check_user_existance)
// router.post("/api/user/create_user", userController.create_user)
// router.post("/api/user/create_user_with_userdata", userController.create_user_with_userdata)
// router.post("/api/user/login_with_user_module", userController.login_with_user_module)
// router.post("/api/user/login_with_user_module_with_user_data", userController.login_with_user_module_with_user_data)

// router.post("/api/user/login_using_keys", userController.login_using_keys)
// router.get("/api/user/me", authMiddleware.authorize, userController.me)

// module.exports = router
