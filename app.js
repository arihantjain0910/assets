const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'your-secret-key', // Change this to a more secure secret in production
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sangam@2024',
    database: 'assets',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


passport.use(new LocalStrategy({
    usernameField: 'employee_code',
    passwordField: 'password'
}, async (employee_code, password, done) => {
    try {
        const [results] = await pool.query('SELECT * FROM users WHERE employee_code = ?', [employee_code]);
        if (results.length === 0) {
            return done(null, false, { message: 'Incorrect employee code.' });
        }
        const user = results[0];
        if (user.kyc_submitted) {
            return done(null, false, { message: 'Your KYC form has already been submitted and you are not allowed to log in.' });
        }
        if (password !== user.password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        console.log('Authenticated user:', user);
        return done(null, user);
    } catch (err) {
        console.error('Error retrieving user:', err);
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [results] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, results[0]);
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err);
    }
});

// Middleware to check if the user is an admin
function releaser1(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.releaser1) {
        return next();
    }
    req.flash('error', 'You are not authorized to access this page.');
    res.redirect('/login');
}


function releaser2(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.releaser2) {
        return next();
    }
    req.flash('error', 'You are not authorized to access this page.');
    res.redirect('/login');
}

function releaser3(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.releaser3) {
        return next();
    }
    req.flash('error', 'You are not authorized to access this page.');
    res.redirect('/login');
}

function releaser4(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.releaser4) {
        return next();
    }
    req.flash('error', 'You are not authorized to access this page.');
    res.redirect('/login');
}
function user(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You are not authorized to access this page.');
    res.redirect('/login');
}

// Routes
app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.releaser1) {
            res.redirect('/releaser1-dashboard');
        } else if(req.user.releaser2){
            res.redirect('/releaser2-dashboard');
        }else if(req.user.releaser3){
            res.redirect('/releaser3-dashboard');
        }else if(req.user.releaser4){
            res.redirect('/releaser4-dashboard');
        }
        else {
            res.redirect('/internal_order');
        }
    } else {
        res.redirect('/login');
    }
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    if (req.user.releaser1) {
        res.redirect('/releaser1-dashboard');
    }else if(req.user.releaser2){
        res.redirect('/releaser2-dashboard');
    } 
    else if(req.user.releaser3){
        res.redirect('/releaser3-dashboard');
    }else if(req.user.releaser4){
        res.redirect('/releaser4-dashboard');
    }
    else {
        res.redirect('/internal_order');
    }
});

app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});


app.get("/internal_order", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("internal_order.ejs");
    } else {
        res.redirect('/login');
    }
});




app.post('/submit-form', async (req, res) => {
    if (req.isAuthenticated()) {
        const { plant, profitCenter, dateOfRequisition, type, materialCode, description, qty, purchaseType, totalCost, paybackPeriod } = req.body;

        const sql = `
            INSERT INTO fixed_assets_requisition 
            (user_id, plant, profitCenter, dateOfRequisition, type, materialCode, description, qty, purchaseType, totalCost, paybackPeriod)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        if (Array.isArray(materialCode)) {
            for (let index = 0; index < materialCode.length; index++) {
                const values = [
                    req.user.id,            // Add the user ID here
                    plant,
                    profitCenter,
                    dateOfRequisition,
                    type,
                    materialCode[index],
                    description[index],
                    qty[index],
                    purchaseType[index],
                    totalCost[index],
                    paybackPeriod[index]
                ];

                try {
                    await pool.query(sql, values);
                } catch (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).send('Error inserting data');
                }
            }
        } else {
            const values = [
                req.user.id,            // Add the user ID here
                plant,
                profitCenter,
                dateOfRequisition,
                type,
                materialCode,
                description,
                qty,
                purchaseType,
                totalCost,
                paybackPeriod
            ];

            try {
                await pool.query(sql, values);
            } catch (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error inserting data');
            }
        }

        res.send('Form data submitted successfully!');
    } else {
        res.redirect('/login');
    }
});

app.get('/releaser1', async (req, res) => {
    const sql = `
        SELECT 
            id,
            plant, 
            profitCenter, 
            dateOfRequisition, 
            type, 
            materialCode, 
            description, 
            qty, 
            purchaseType, 
            totalCost, 
            paybackPeriod,
            releaser1_approval_status,
            releaser1_comments
        FROM 
            fixed_assets_requisition 
        WHERE 
            totalCost > 0 
            AND totalCost <= 2000000;
    `;

    try {
        const [results] = await pool.query(sql);
        // Render the view-rate-list.ejs template with rateList data
        res.render('releaser1.ejs', { users: results });
    } catch (err) {
        console.error('Error retrieving data from database:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/releaser2', async (req, res) => {
    const sql = `
        SELECT 
            id,
            plant, 
            profitCenter, 
            dateOfRequisition, 
            type, 
            materialCode, 
            description, 
            qty, 
            purchaseType, 
            totalCost, 
            paybackPeriod,
            releaser1_approval_status,
            releaser1_comments,
            releaser2_approval_status,
            releaser2_comments
        FROM 
            fixed_assets_requisition 
        WHERE 
            totalCost > 0 
            AND totalCost <= 2000000;
    `;

    try {
        const [results] = await pool.query(sql);
        // Render the view-rate-list.ejs template with rateList data
        res.render('releaser2.ejs', { users: results });
    } catch (err) {
        console.error('Error retrieving data from database:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/releaser3', async (req, res) => {
    const sql = `
        SELECT 
            id,
            plant, 
            profitCenter, 
            dateOfRequisition, 
            type, 
            materialCode, 
            description, 
            qty, 
            purchaseType, 
            totalCost, 
            paybackPeriod,
            releaser1_approval_status,
            releaser1_comments,
            releaser2_approval_status,
            releaser2_comments,
            releaser3_approval_status,
            releaser3_comments
        FROM 
            fixed_assets_requisition 
        WHERE 
            totalCost > 0 
            AND totalCost <= 2000000;
    `;

    try {
        const [results] = await pool.query(sql);
        // Render the view-rate-list.ejs template with rateList data
        res.render('releaser3.ejs', { users: results });
    } catch (err) {
        console.error('Error retrieving data from database:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/releaser4', async (req, res) => {
    const sql = `
        SELECT 
            id,
            plant, 
            profitCenter, 
            dateOfRequisition, 
            type, 
            materialCode, 
            description, 
            qty, 
            purchaseType, 
            totalCost, 
            paybackPeriod,
            releaser1_approval_status,
            releaser1_comments,
            releaser2_approval_status,
            releaser2_comments,
            releaser3_approval_status,
            releaser3_comments,
            releaser4_approval_status,
            releaser4_comments
        FROM 
            fixed_assets_requisition 
        WHERE 
            totalCost > 0 
            AND totalCost <= 2000000;
    `;

    try {
        const [results] = await pool.query(sql);
        // Render the view-rate-list.ejs template with rateList data
        res.render('releaser4.ejs', { users: results });
    } catch (err) {
        console.error('Error retrieving data from database:', err);
        res.status(500).send('Internal Server Error');
    }
});
// app.get('/releaser1', (req, res) => {
//     const sql = 'SELECT plant, profitCenter, dateOfRequisition, type, materialCode, description, qty, purchaseType, totalCost, paybackPeriod, releaser1_approval_status, releaser1_comments FROM fixed_assets_requisition';

//     pool.query(sql, (err, results) => {
//         if (err) {
//             console.error('Error retrieving data from database:', err);
//             return res.status(500).send('Internal Server Error');
//         }
//         // Render the view-rate-list.ejs template with rateList data
//         console.log(users); // Log the result to verify dat
//         res.render('releaser1', { users: results });
        
//     });
// });


app.get('/releaser1-dashboard',releaser1, async (req, res) => {
    try {
        // Query to fetch requisitions with "Pending" approval status for Releaser 1
        const [results] = await pool.query('SELECT * FROM fixed_assets_requisition WHERE releaser1_approval_status = "Pending"');
       
        // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
        res.render('releaser1-dashboard', { requisitions: results });
    } catch (err) {
        // Log the error and send a 500 response if something goes wrong
        console.error('Error retrieving requisitions:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/releaser2-dashboard',releaser2, async (req, res) => {
    try {
        // Query to fetch requisitions with "Pending" approval status for Releaser 1
        const [results] = await pool.query('SELECT * FROM fixed_assets_requisition WHERE releaser2_approval_status = "Pending"');
       
        // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
        res.render('releaser2-dashboard', { requisitions: results });
    } catch (err) {
        // Log the error and send a 500 response if something goes wrong
        console.error('Error retrieving requisitions:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/releaser3-dashboard',releaser3, async (req, res) => {
    try {
        // Query to fetch requisitions with "Pending" approval status for Releaser 1
        const [results] = await pool.query('SELECT * FROM fixed_assets_requisition WHERE releaser3_approval_status = "Pending"');
       
        // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
        res.render('releaser3-dashboard', { requisitions: results });
    } catch (err) {
        // Log the error and send a 500 response if something goes wrong
        console.error('Error retrieving requisitions:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/releaser4-dashboard',releaser4, async (req, res) => {
    try {
        // Query to fetch requisitions with "Pending" approval status for Releaser 1
        const [results] = await pool.query('SELECT * FROM fixed_assets_requisition WHERE releaser4_approval_status = "Pending"');
       
        // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
        res.render('releaser4-dashboard', { requisitions: results });
    } catch (err) {
        // Log the error and send a 500 response if something goes wrong
        console.error('Error retrieving requisitions:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/approve/:id', async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    try {
        await pool.query('UPDATE fixed_assets_requisition SET releaser1_approval_status = "Approved", releaser1_comments = ? WHERE id = ?', [comments, id]);
        res.redirect('/releaser1-dashboard');
    } catch (err) {
        console.error('Error updating approval status:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/approve2/:id', async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    try {
        await pool.query('UPDATE fixed_assets_requisition SET releaser2_approval_status = "Approved", releaser2_comments = ? WHERE id = ?', [comments, id]);
        res.redirect('/releaser2-dashboard');
    } catch (err) {
        console.error('Error updating approval status:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/approve3/:id', async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    try {
        await pool.query('UPDATE fixed_assets_requisition SET releaser3_approval_status = "Approved", releaser3_comments = ? WHERE id = ?', [comments, id]);
        res.redirect('/releaser3-dashboard');
    } catch (err) {
        console.error('Error updating approval status:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/approve4/:id', async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    try {
        await pool.query('UPDATE fixed_assets_requisition SET releaser4_approval_status = "Approved", releaser4_comments = ? WHERE id = ?', [comments, id]);
        res.redirect('/releaser4-dashboard');
    } catch (err) {
        console.error('Error updating approval status:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/reject/:id', async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    try {
        await pool.query('UPDATE fixed_assets_requisition SET releaser1_approval_status = "Rejected", releaser1_comments = ? WHERE id = ?', [comments, id]);
        res.redirect('/releaser1-dashboard');
    } catch (err) {
        console.error('Error updating approval status:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/reject2/:id', async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    try {
        await pool.query('UPDATE fixed_assets_requisition SET releaser2_approval_status = "Rejected", releaser2_comments = ? WHERE id = ?', [comments, id]);
        res.redirect('/releaser2-dashboard');
    } catch (err) {
        console.error('Error updating approval status:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/reject3/:id', async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    try {
        await pool.query('UPDATE fixed_assets_requisition SET releaser3_approval_status = "Rejected", releaser3_comments = ? WHERE id = ?', [comments, id]);
        res.redirect('/releaser3-dashboard');
    } catch (err) {
        console.error('Error updating approval status:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/reject4/:id', async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    try {
        await pool.query('UPDATE fixed_assets_requisition SET releaser4_approval_status = "Rejected", releaser4_comments = ? WHERE id = ?', [comments, id]);
        res.redirect('/releaser4-dashboard');
    } catch (err) {
        console.error('Error updating approval status:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user-dashboard', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // Query to fetch requisitions submitted by the logged-in user
            const [results] = await pool.query('SELECT * FROM fixed_assets_requisition WHERE user_id = ?', [req.user.id]);

            // Render the 'user-dashboard' view and pass the requisitions data
            res.render('user-dashboard', { requisitions: results });
        } catch (err) {
            // Log the error and send a 500 response if something goes wrong
            console.error('Error retrieving requisitions:', err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/login');
    }
});


// app.get('/admin-dashboard', isAdmin, async (req, res) => {
//     try {
//         const [results] = await pool.query('SELECT * FROM fixed_assets_requisition');
//         res.render('admin-dashboard', { users: results });
//     } catch (err) {
//         console.error('Error retrieving data from database:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
