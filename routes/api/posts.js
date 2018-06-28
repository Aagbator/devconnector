/**
 * Created by Anthony on 23/06/2018.
 */
var express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// validation
const validatePostInput = require('../../validation/post');

// @route GET api/post
// @desc get posts
//access public
router.get('/', (req, res) => {
    Post.find()
        .sort({date:-1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound:'no posts found'}));
});

// @route GET api/post
// @desc get posts
//access public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostfound:'no post found with that id'}));
});



// @route POST api/post.js
// @desc Create post
//access public
router.post('/', passport.authenticate('jwt', {session: false}),
    (req, res) => {

    const {errors, isValid} = validatePostInput(req.body);

    // Check validation
        if(!isValid){
            // if errors
            return res.status(400).json(errors);
        }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

        newPost.save().then(post => res.json(post));
    });


// @route DELETE api/post.js
// @desc Delete post
//access private
router.delete('/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {
       Profile.findOne({ user: req.user.id})
           .then(profile => {
               Post.findById(req.params.id)
                   .then(post => {
                       // check for post owner
                       if(post.user.toString() !== req.user.id){
                           return res.status(401).json({notauthorized: 'User not authorized'});
                       }
                       // Delete
                       post.remove().then(()=> res.json({success:true}));
                   })
                   .catch(err => res.status(404).json({postnotfound:'Post not found'}));
           })
    });


// @route POST api/post/like/:id
// @desc Delete post
//access private
router.post('/like/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({ user: req.user.id})
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        // check for post owner
                        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                            return res.status(400).json({alreadyliked: 'user already liked'})
                        }
                        // Add the user id to the likes array
                        post.likes.unshift({user: req.user.id});
                        post.save().then(post => res.json(post));
                    })
                    .catch(err => res.status(404).json({postnotfound:'Post not found'}));
            })
    });


// @route POST api/post/unlike/:id
// @desc Delete post
//access private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({ user: req.user.id})
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        // check for post owner
                        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                            return res.status(400).json({notliked: 'you have not yet liked this post'})
                        }
                        // Get remove index
                        const removeIndex = post.likes
                            .map(item => item.user.toString)
                            .indexOf(req.user.id);

                        // splice out of the array
                        post.likes.splice(removeIndex, 1);

                        //save
                        post.save().then(post => res.json(post));
                    })
                    .catch(err => res.status(404).json({postnotfound:'Post not found'}));
            })
    });


// @route POST api/posts/comment/:id
// @desc Delete post
//access private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {

        const {errors, isValid} = validatePostInput(req.body);

        // Check validation
        if(!isValid){
            // if errors
            return res.status(400).json(errors);
        }

        Post.findById(req.params.id)
            .then(post => {
               const newComment = {
                   text: req.body.text,
                   name: req.body.name,
                   avatar: req.body.avatar,
                   user: req.user.id
               }

               //Add to comments array
                post.comments.unshift(newComment);

               //save
                post.save().then(post => res.json(post));

            }).catch(err => res.status(404).json({postnotfound:'no post found'}));
    });


// @route DELETE api/posts/comment/:id
// @desc Delete comment from post
//access private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}),
    (req, res) => {


        Post.findById(req.params.id)
            .then(post => {
               // check to see if comment exists
                if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
                   return res.status(404).json({commentnotexists: 'Comment does not exists'});
                }

                // Get remove index
                const removeIndex = post.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id);

                //splicecomment out of array
                post.comments.splice(removeIndex, 1);

                //save
                post.save().then(post => res.json(post));

            }).catch(err => res.status(404).json({postnotfound:'no post found'}));
    });



module.exports = router;