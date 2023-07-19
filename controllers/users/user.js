const User = require("../../model/user/User");
const bcrypt = require("bcryptjs");
const appErr = require("../../utils/appErr");

//register
const registerCtrl = async (req, res) => {
  const { fullname, email, password } = req.body;

  //check if field is empty
  if (!fullname || !email || !password) {
    return res.render("users/register", {
      error: "All fields are required",
    });
  }
  try {
    //1.check if user exists(email)
    const userFound = await User.findOne({ email });
    //throw an error
    if (userFound) {
      return res.render("users/register", {
        error: "Email is taken",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //register user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    //redirect
    res.redirect("/api/v1/users/login");
  } catch (error) {
    return res.render("users/register", {
      error: "user not found",
    });
  }
};

//login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("users/login", {
      error: "All fields are required",
    });
  }
  try {
    //check if email exists
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    //verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      return res.render("users/login", {
        error: "invalid credentials",
      });
    }
    //save user into session
    req.session.userAuth = userFound._id;
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};

//user details ctrl
const userDetailCtrl = async (req, res) => {
  try {
    //get user id from params
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render("users/updateUser", {
      user,
      error: "",
    });
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
    });
  }
};

//profile
const profileCtrl = async (req, res) => {
  try {
    //get the login user
    const userId = req.session.userAuth;
    //find the user
    const user = await User.findById(userId)
      .populate("posts")
      .populate("comments");
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};

//upload profile photo
const uploadprofilePhotoctrl = async (req, res, next) => {
  try {
    //check if file exists
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "please upload image",
      });
    }
    //1.find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "user not found",
      });
    }
    //update profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

//upload cover image
const uploadCoverImageCtrl = async (req, res) => {
  try {
    //check if file exists
    if (!req.file) {
      return res.render("users/uploadCoverPhoto", {
        error: "please upload image",
      });
    }
    //1.find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.render("users/uploadCoverPhoto", {
        error: "user not found",
      });
    }
    //update profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};

//update password
const updatePasswordCtrl = async (req, res) => {
  const { password } = req.body;
  try {
    //check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      //update user
      await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: hashedPassword,
        },
        {
          new: true,
        }
      );
    }

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};

//update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "please provide details",
        user: "",
      });
    }
    //check if email is taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.render("users/updateUser", {
          error: "email is taken",
          user: "",
        });
      }
      //update the user
      await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          fullname,
          email,
        },
        {
          new: true,
        }
      );
      res.redirect("/api/v1/users/profile-page");
    }
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
      user: "",
    });
  }
};

//logout
const logoutCtrl = async (req, res) => {
  //destroy session
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};
module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailCtrl,
  profileCtrl,
  uploadprofilePhotoctrl,
  uploadCoverImageCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
