const express = require("express");
const { models } = require("mongoose");
const {
  createCommentCtrl,
  singleCommentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../../controllers/comments/comments");
const commentRoutes = express.Router();
const protected = require("../../middlewares/protected");
//POST/api/v1/comments
commentRoutes.post("/:id", protected, createCommentCtrl);

//GET/api/v1/comments/:id
commentRoutes.get("/:id", singleCommentDetailsCtrl);

//DELETE/api/v1/comments/:id
commentRoutes.delete("/:id", protected, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRoutes.put("/:id", protected, updateCommentCtrl);

module.exports = commentRoutes;
