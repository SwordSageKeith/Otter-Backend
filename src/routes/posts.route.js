const express = require('express');
const router = express.Router();
var Post = require('../schemas/posts.schema');


router.get('/', (req, res) => {
    Post.find().then((posts) => {
        res.send(posts);
    }).catch((err) => {
        res.send(err);
    })
});
  
router.post('/', (req, res) => {
    var newPost = new Post({title: req.body.title ,content:req.body.content, userID: req.user._id});
    newPost.save().then(() => {
        res.send("success");
    }).catch((err) => {
        res.send(err);
    })
});


module.exports = router;