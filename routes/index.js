import express from 'express';
import passport from "passport";
const router = express.Router();
import { users } from '../db.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NodeGuru', name: req.user.name });
});

/* GET login page. */
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'NodeGuru'})
})

/* POST login page. */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

export default router;
