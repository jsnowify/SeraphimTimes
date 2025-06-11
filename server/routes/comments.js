const router = require("express").Router();
let Comment = require("../models/comment.model");
let User = require("../models/user.model");
const auth = require("../middleware/auth");

// GET: All comments for a specific article
router.get("/article/:articleId", async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId }).sort(
      { createdAt: "desc" }
    );
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new comment to an article (Protected)
router.post("/add", auth, async (req, res) => {
  try {
    const { content, articleId } = req.body;
    if (!content || !articleId) {
      return res
        .status(400)
        .json({ msg: "Comment content and article ID are required." });
    }

    const user = await User.findById(req.user.id);

    // UPDATED: Robust author name logic
    // If firstName and lastName exist, use them. Otherwise, fall back to the username.
    const authorName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username;

    const newComment = new Comment({
      content,
      article: articleId,
      user: req.user.id,
      authorName: authorName, // Use the safe authorName
    });

    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Update a comment (Protected)
router.post("/update/:commentId", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ msg: "Content is required to update." });
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found." });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized." });
    }
    comment.content = content;
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: A comment (Protected)
router.delete("/:commentId", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found." });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized." });
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ msg: "Comment deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
