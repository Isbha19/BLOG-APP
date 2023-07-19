const express = require("express");
const multer = require("multer");
const {
  registerCtrl,
  loginCtrl,
  userDetailCtrl,
  profileCtrl,
  uploadprofilePhotoctrl,
  uploadCoverImageCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controllers/users/user");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const userRoutes = express.Router();

//instance of multer
const upload = multer({ storage });

//rendering forms
//---------------
//login form
userRoutes.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});

//register form
userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

//Upload profile pic
userRoutes.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto", {
    error: "",
  });
});
//Upload Cover pic
userRoutes.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto", {
    error: "",
  });
});

//Update user form
userRoutes.get("/update-user-password", (req, res) => {
  res.render("users/updatePassword", {
    error: "",
  });
});

//POST/api/v1/users/register
userRoutes.post("/register", registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);

//GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

//GET/api/v1/users/profile
userRoutes.get("/profile-page", protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload
userRoutes.put(
  "/profile-photo-upload",
  protected,
  upload.single("profile"),
  uploadprofilePhotoctrl
);

//PUT/api/v1/users/profile-coverphoto-upload
userRoutes.put(
  "/profile-coverphoto-upload",
  protected,
  upload.single("profile"),
  uploadCoverImageCtrl
);

//GET/api/v1/users/:id
userRoutes.get("/:id", userDetailCtrl);

//PUT/api/v1/users/update-user-password
userRoutes.put("/update-user-password", updatePasswordCtrl);

//PUT/api/v1/users/update/:id
userRoutes.put("/update", updateUserCtrl);

module.exports = userRoutes;
