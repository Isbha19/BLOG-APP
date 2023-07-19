const express = require("express");
const multer = require("multer");
const postRoutes = express.Router();
const {
  createPostCtrl,
  fetchPostCtrl,
  fetchSinglePostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const Post = require("../../model/post/Post");
//instance of multer
const upload = multer({ storage });

//post forms
postRoutes.get("/get-post-form", (req, res) => {
  res.render("posts/addPost", {
    error: "",
  });
});

//getform
postRoutes.get("/get-form-update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", { post, error: "" });
  } catch (error) {
    res.render("posts/updatePost", { error, post: "" });
  }
});

postRoutes.post("/", protected, upload.single("file"), createPostCtrl);

//GET/api/v1/posts
postRoutes.get("/", fetchPostCtrl);

//GET/api/v1/posts/:id
postRoutes.get("/:id", fetchSinglePostCtrl);

//DELETE/api/v1/posts/:id
postRoutes.delete("/:id", protected, deletePostCtrl);

//PUT/api/v1/posts/:id
postRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);

module.exports = postRoutes;
