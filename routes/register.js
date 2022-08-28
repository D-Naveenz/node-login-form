import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { users } from '../db-handler.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        // Debugging
        //console.log(file);
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
})
const upload = multer({ storage: storage });

// Get register page
router.get('/', (req, res, next) => {
    res.render('register', { title: 'NodeGuru', newUser: false })
});

router.post('/', upload.single('avatar'), async (req, res, next) => {
    try {
        // generate hashed password from the given
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            avatar: req.file.filename
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
});

export default router;