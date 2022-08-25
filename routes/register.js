import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import { users } from '../db.js';

// Get register page
router.get('/', (req, res, next) => {
    res.render('register', { title: 'NodeGuru', newUser: false })
})

router.post('/', async (req, res, next) => {
    try {
        // generate hashed password from the given
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        // Debugging
        console.log(users);

        // redirect back to the login page
        res.redirect('/login');
    } catch (e) {
        // Debugging
        console.log(e);
        console.log('name: ' + req.body.name + ' | email: ' + req.body.email + ' | pass: ' + req.body.password);

        res.redirect('reg');
    }
})

export default router;