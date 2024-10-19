const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const methodOverride = require("method-override");
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "your-secret-key", // Change this to a more secure secret in production
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sangam@2024",
  database: "assets",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "employee_code",
      passwordField: "password",
    },
    async (employee_code, password, done) => {
      try {
        const [results] = await pool.query(
          "SELECT * FROM users WHERE employee_code = ?",
          [employee_code]
        );
        if (results.length === 0) {
          return done(null, false, { message: "Incorrect employee code." });
        }
        const user = results[0];
        if (user.kyc_submitted) {
          return done(null, false, {
            message:
              "Your KYC form has already been submitted and you are not allowed to log in.",
          });
        }
        if (password !== user.password) {
          return done(null, false, { message: "Incorrect password." });
        }
        console.log("Authenticated user:", user);
        return done(null, user);
      } catch (err) {
        console.error("Error retrieving user:", err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [results] = await pool.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    done(null, results[0]);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err);
  }
});

// Middleware to check if the user is an admin
function releaser1(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser1) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}

function releaser2(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser2) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}

function releaser3(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser3) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}

function releaser4(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser4) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}
function releaser5(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser5) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}
function releaser6(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser6) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}
function releaser7(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser7) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}
function releaser8(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser8) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}
function releaser9(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.releaser9) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}
function user(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You are not authorized to access this page.");
  res.redirect("/login");
}

// Routes
app.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.releaser1) {
      res.redirect("/releaser1-dashboard");
    } else if (req.user.releaser2) {
      res.redirect("/releaser2-dashboard");
    } else if (req.user.releaser3) {
      res.redirect("/releaser3-dashboard");
    } else if (req.user.releaser4) {
      res.redirect("/releaser4-dashboard");
    } else if (req.user.releaser5) {
      res.redirect("/releaser5-dashboard");
    } else if (req.user.releaser6) {
      res.redirect("/releaser6-dashboard");
    } else if (req.user.releaser7) {
      res.redirect("/releaser7-dashboard");
    } else if (req.user.releaser8) {
      res.redirect("/releaser8-dashboard");
    } else if (req.user.releaser9) {
      res.redirect("/releaser9-dashboard");
    } else {
      res.redirect("/internal_order");
    }
  } else {
    res.redirect("/login");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    if (req.user.releaser1) {
      res.redirect("/releaser1-dashboard");
    } else if (req.user.releaser2) {
      res.redirect("/releaser2-dashboard");
    } else if (req.user.releaser3) {
      res.redirect("/releaser3-dashboard");
    } else if (req.user.releaser4) {
      res.redirect("/releaser4-dashboard");
    } else if (req.user.releaser5) {
      res.redirect("/releaser5-dashboard");
    } else if (req.user.releaser6) {
      res.redirect("/releaser6-dashboard");
    } else if (req.user.releaser7) {
      res.redirect("/releaser7-dashboard");
    } else if (req.user.releaser8) {
      res.redirect("/releaser8-dashboard");
    } else if (req.user.releaser9) {
      res.redirect("/releaser9-dashboard");
    } else {
      res.redirect("/internal_order");
    }
  }
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/internal_order", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("internal_order.ejs");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit-form", async (req, res) => {
  if (req.isAuthenticated()) {
    const {
      plant,
      profitCenter,
      dateOfRequisition,
      type,
      materialCode,
      description,
      qty,
      purchaseType,
      cost_center,
      totalCost,
      paybackPeriod,
      remarks,
      assetProcuredAgainst,
      assetsAgainstReplacement,
    } = req.body;

    const sql = `
            INSERT INTO fixed_assets_requisition 
            (user_id,employee_code, plant, profitCenter, dateOfRequisition, type, materialCode, description, qty, purchaseType,cost_center, totalCost, paybackPeriod,remarks,
      assetProcuredAgainst,
      assetsAgainstReplacement)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;

    if (Array.isArray(materialCode)) {
      for (let index = 0; index < materialCode.length; index++) {
        const values = [
          req.user.id, // Add the user ID here
          req.user.employee_code, // Add the user ID here
          plant,
          profitCenter,
          dateOfRequisition,
          type,
          materialCode[index],
          description[index],
          qty[index],
          purchaseType[index],
          cost_center[index],
          totalCost[index],
          paybackPeriod[index],
          remarks, // Add these missing fields
          assetProcuredAgainst, // Add these missing fields
          assetsAgainstReplacement,
        ];

        try {
          await pool.query(sql, values);
        } catch (err) {
          console.error("Error inserting data:", err);
          return res.status(500).send("Error inserting data");
        }
      }
    } else {
      const values = [
        req.user.id, // Add the user ID here
        req.user.employee_code, // Add the user ID here
        plant,
        profitCenter,
        dateOfRequisition,
        type,
        materialCode,
        description,
        qty,
        purchaseType,
        cost_center,
        totalCost,
        paybackPeriod,
        remarks,
        assetProcuredAgainst,
        assetsAgainstReplacement,
      ];

      try {
        await pool.query(sql, values);
      } catch (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send("Error inserting data");
      }
    }

    res.send("Form data submitted successfully!");
  } else {
    res.redirect("/login");
  }
});

app.get("/releaser1", async (req, res) => {
  const sql = `
       SELECT * 
FROM fixed_assets_requisition 
WHERE (plant = 1100 OR plant = 1120);
 
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser1.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/releaser2", async (req, res) => {
  const sql = `
             SELECT * 
FROM fixed_assets_requisition 
WHERE plant = 1110;
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser2.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/releaser3", async (req, res) => {
  const sql = `
        SELECT * 
FROM fixed_assets_requisition 
WHERE plant = 1200;
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser3.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/releaser4", async (req, res) => {
  const sql = `
        SELECT * 
FROM fixed_assets_requisition 
WHERE plant = 1300;
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser4.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser5", async (req, res) => {
  const sql = `
        SELECT * 
FROM fixed_assets_requisition 
WHERE plant = 1400;
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser5.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser6", async (req, res) => {
  const sql = `
        SELECT * 
FROM fixed_assets_requisition 
WHERE (plant = 1500 OR plant = 3500);
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser6.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser7", async (req, res) => {
  const sql = `
        SELECT * 
FROM fixed_assets_requisition 
WHERE (plant = 1100 OR plant = 1110 OR plant = 1120 OR plant = 1200)
AND (totalCost > 2000000);
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser7.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser8", async (req, res) => {
  const sql = `
        SELECT * 
FROM fixed_assets_requisition 
WHERE (plant = 1300 OR plant = 1400 OR plant = 1500 OR plant = 3500)
AND (totalCost > 2000000);
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser8.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser9", async (req, res) => {
  const sql = `
        SELECT * 
FROM fixed_assets_requisition 
WHERE (plant = 1100 OR plant = 1110 OR plant = 1120 OR plant = 1200 OR plant = 1300 OR plant = 1400 OR plant = 1500 OR plant = 3500)
AND (totalCost > 5000000);
    `;

  try {
    const [results] = await pool.query(sql);
    // Render the view-rate-list.ejs template with rateList data
    res.render("releaser9.ejs", { users: results });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Internal Server Error");
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

app.get("/releaser1-dashboard", releaser1, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser1_approval_status = "Pending" AND (plant = 1100 OR plant = 1120);'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser1-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/releaser2-dashboard", releaser2, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser2_approval_status = "Pending" AND plant = 1110;'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser2-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/releaser3-dashboard", releaser3, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser3_approval_status = "Pending" AND plant = 1200;'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser3-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/releaser4-dashboard", releaser4, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser4_approval_status = "Pending" AND plant = 1300;'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser4-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser5-dashboard", releaser5, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser5_approval_status = "Pending" AND plant = 1400;'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser5-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser6-dashboard", releaser6, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser6_approval_status = "Pending" AND (plant = 1500 OR plant = 3500);'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser6-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser7-dashboard", releaser7, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser7_approval_status = "Pending" AND (plant = 1100 OR plant = 1110 OR plant = 1120 OR plant = 1200) AND totalCost > 2000000;'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser7-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser8-dashboard", releaser8, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser8_approval_status = "Pending" AND (plant = 1300 OR plant = 1400 OR plant = 1500 OR plant = 3500) AND totalCost > 2000000;'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser8-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/releaser9-dashboard", releaser9, async (req, res) => {
  try {
    // Query to fetch requisitions with "Pending" approval status for Releaser 1
    const [results] = await pool.query(
      'SELECT * FROM fixed_assets_requisition WHERE releaser9_approval_status = "Pending" AND (plant = 1100 OR plant = 1110 OR plant = 1120 OR plant = 1200 OR plant = 1300 OR plant = 1400 OR plant = 1500 OR plant = 3500) AND totalCost > 5000000;'
    );

    // Render the 'releaser1-dashboard' view and pass the fetched requisitions data
    res.render("releaser9-dashboard", { requisitions: results });
  } catch (err) {
    // Log the error and send a 500 response if something goes wrong
    console.error("Error retrieving requisitions:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/approve/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser1_approval_status = "Approved", releaser1_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser1-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/approve2/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser2_approval_status = "Approved", releaser2_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser2-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/approve3/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser3_approval_status = "Approved", releaser3_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser3-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/approve4/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser4_approval_status = "Approved", releaser4_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser4-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/approve5/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser5_approval_status = "Approved", releaser5_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser5-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/approve6/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser6_approval_status = "Approved", releaser6_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser6-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/approve7/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser7_approval_status = "Approved", releaser7_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser7-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/approve8/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser8_approval_status = "Approved", releaser8_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser8-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/approve9/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser9_approval_status = "Approved", releaser9_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser9-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/reject/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser1_approval_status = "Rejected", releaser1_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser1-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/reject2/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser2_approval_status = "Rejected", releaser2_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser2-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/reject3/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser3_approval_status = "Rejected", releaser3_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser3-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/reject4/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser4_approval_status = "Rejected", releaser4_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser4-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/reject5/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser5_approval_status = "Rejected", releaser5_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser5-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/reject6/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser6_approval_status = "Rejected", releaser6_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser6-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/reject7/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser7_approval_status = "Rejected", releaser7_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser7-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/reject8/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser8_approval_status = "Rejected", releaser8_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser8-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/reject9/:id", async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  try {
    await pool.query(
      'UPDATE fixed_assets_requisition SET releaser9_approval_status = "Rejected", releaser9_comments = ? WHERE id = ?',
      [comments, id]
    );
    res.redirect("/releaser9-dashboard");
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/view/:id", async (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM fixed_assets_requisition WHERE id='${id}'`;
  try {
    const [result] = await pool.query(q); // Use promise-based syntax
    let options = result[0];
    res.render("view_form.ejs", { options });
  } catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});

app.get("/user-dashboard", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      // Query to fetch requisitions submitted by the logged-in user
      const [results] = await pool.query(
        "SELECT * FROM fixed_assets_requisition WHERE user_id = ?",
        [req.user.id]
      );

      // Render the 'user-dashboard' view and pass the requisitions data
      res.render("user-dashboard", { requisitions: results });
    } catch (err) {
      // Log the error and send a 500 response if something goes wrong
      console.error("Error retrieving requisitions:", err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
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
