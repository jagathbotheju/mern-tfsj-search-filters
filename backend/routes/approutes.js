const express = require("express");
const appControllers = require("../controllers/appControllers");
const router = express.Router();

//@route - /api/
router
  .route("/")
  .get(appControllers.getAllPosts)
  .post(appControllers.createPost);
router
  .route("/:id")
  .get(appControllers.getPostById)
  .put(appControllers.updatePostById)
  .delete(appControllers.deletePostById);

module.exports = router;
