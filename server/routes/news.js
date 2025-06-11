const router = require("express").Router();
let News = require("../models/news.model");
let User = require("../models/user.model");
const auth = require("../middleware/auth");

// GET: All articles for the currently logged-in user
router.get("/my-articles", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const userCondition = { user: req.user.id };
    const articlesQuery = News.find(userCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalQuery = News.countDocuments(userCondition);
    const [articles, totalArticles] = await Promise.all([
      articlesQuery,
      totalQuery,
    ]);
    const totalPages = Math.ceil(totalArticles / limit);
    res.json({ articles, currentPage: page, totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Search for articles with pagination
router.route("/search").get(async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json("Error: Search query is required");
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const regex = new RegExp(query, "i");
    const searchCondition = { $or: [{ title: regex }, { content: regex }] };
    const articlesQuery = News.find(searchCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalQuery = News.countDocuments(searchCondition);
    const [articles, totalArticles] = await Promise.all([
      articlesQuery,
      totalQuery,
    ]);
    const totalPages = Math.ceil(totalArticles / limit);
    res.json({ articles, currentPage: page, totalPages });
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// GET: All news articles with pagination
router.route("/").get(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const newsQuery = News.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalQuery = News.countDocuments();
    const [articles, totalArticles] = await Promise.all([
      newsQuery,
      totalQuery,
    ]);
    const totalPages = Math.ceil(totalArticles / limit);
    res.json({ articles, currentPage: page, totalPages });
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// GET: All articles by author with pagination
router.route("/author/:authorname").get(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const authorCondition = { author: req.params.authorname };
    const articlesQuery = News.find(authorCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalQuery = News.countDocuments(authorCondition);
    const [articles, totalArticles] = await Promise.all([
      articlesQuery,
      totalQuery,
    ]);
    const totalPages = Math.ceil(totalArticles / limit);
    res.json({ articles, currentPage: page, totalPages });
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// GET: A specific news article by its ID
router.route("/:id").get((req, res) => {
  News.findById(req.params.id)
    .then((news) => res.json(news))
    .catch((err) => res.status(400).json("Error: " + err));
});

// POST: Add a new news article
router.post("/add", auth, async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    const authorName = `${user.firstName} ${user.lastName}`;
    const newNewsArticle = new News({
      title,
      author: authorName,
      content,
      imageUrl,
      user: req.user.id,
    });
    await newNewsArticle.save();
    res.json("News article added!");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// DELETE: A specific news article
router.delete("/:id", auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ msg: "Article not found." });
    }
    if (news.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized." });
    }
    await News.findByIdAndDelete(req.params.id);
    res.json("News article deleted.");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

// POST: Update a specific news article
router.post("/update/:id", auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ msg: "Article not found." });
    }
    if (news.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized." });
    }
    news.title = req.body.title;
    news.content = req.body.content;
    news.imageUrl = req.body.imageUrl;
    await news.save();
    res.json("News article updated!");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

module.exports = router;
