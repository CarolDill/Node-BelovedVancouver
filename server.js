const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();
const path = require('node:path');
const mailer = require('./modules/mailer');

const PORT = process.env.PORT || 4000;

const initializePassport = require("./passportConfig");

const methodOverride = require('method-override');

initializePassport(passport);

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method')); 


app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/about", (req,res)=>{

  pool.query(
    `SELECT * FROM news ORDER BY id DESC`, (err, rows, fields)=>{
      if(err){
        console.log(err);
        return;
      }
      console.log(rows.rows);
      res.render("about", { news:rows.rows });
    }
  );
});

app.get("/team", (req,res)=>{
  res.render("team");
});

app.get("/volunteer", (req,res)=>{
  res.render("volunteer");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  res.render("login.ejs");
});

app.post("/users/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  let { title, address, description, date } = req.body;
  let user_id = req.user.id;
  console.log({ title, address, description, date });

  let formatedDate = new Date(date);
  let currentDate = new Date();
  console.log(currentDate);
  console.log(formatedDate);
  let errors = [];

  if(formatedDate <= currentDate){
    errors.push({ message: "Event date can not be earlier than current date." });
  }else{
    pool.query(
      `INSERT INTO events (title, address, description, event_date, user_id) VALUES ($1, $2, $3, $4, $5)`, [title, address, description, date, user_id],
      (err, results) => {
        if (err) {
          console.log(err);
        }
      }
    );

    pool.query(
      `INSERT INTO calendarevents (title, start) VALUES ($1, $2)`, [title, date], (err, results)=>{
        if (err) {
          console.log(err);
        }
      }
    );
  }


  res.redirect("dashboard");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  pool.query(
    `SELECT * FROM events`, (err, rows, fields)=>{
      if(err){
        console.log(err);
        return;
      }
      res.render("dashboard", { user: req.user.name, events:rows.rows });
    }
  )
});

app.post("/email", (req, res)=>{
  let { email, name, phone, address, city, shelter, foster, message } = req.body;

  if (!email || !name || !phone || !address || !city || !message ){
    res.redirect("/volunteer");
  }else{
    mailer.sendMail({
      to: email,
      from: 'test@belovedvancouver.com',
      subject: 'Thank you for your interest',
      text: 'Thank you for your interest in being a volunteer! Someone of our team will review your application soon. Att Beloved Vancouver.'
    }, (err)=>{
      if (err){
        console.log("erro");
        res.redirect("/volunteer");
      }
  
      mailer.sendMail({
        to: 'test@belovedvancouver.com',
        from: email,
        subject: 'New volunteer application received',
        text: `Name: ${name},
              Phone: ${phone},
              Address: ${address},
              City: ${city},
              Shelter? ${shelter},
              Foster? ${foster},
              Email: ${email},
              Message: ${message}`
      })
    });
    res.redirect("/volunteer");
  }
});

app.delete("/users/dashboard/:id", (req, res)=>{
  let id = req.params.id;

  pool.query(
    `DELETE FROM events WHERE event_id =$1`, [id], (err, rows, fields) =>{
      if(err){
        console.log(err);
        return;
      }
      res.redirect("/users/dashboard");
    }
  )
});

app.post("/users/dashboard/animals", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  let { pet_name, pet_age, pet_weight, pet_type, pet_breed, pet_additional_info, pet_picture } = req.body;

  console.log({ pet_name, pet_age, pet_weight, pet_type, pet_breed, pet_additional_info, pet_picture });

  pool.query(
    `INSERT INTO animals (pet_name, age, weight, type, breed, additional, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [pet_name, pet_age, pet_weight, pet_type, pet_breed, pet_additional_info, pet_picture],
    (err, results) => {
      if (err) {
        console.log(err);
      }
    }
  );

  res.redirect("animals");
});

app.get("/users/dashboard/animals", checkNotAuthenticated, (req, res) => {

  pool.query(
    `SELECT * FROM animals`, (err, rows, fields)=>{
      if(err){
        console.log(err);
        return;
      }

      res.render("animals", { user: req.user.name, animals:rows.rows });
    }
  )
});

app.delete("/users/dashboard/animals/:id", (req, res)=>{
  let id = req.params.id;

  pool.query(
    `DELETE FROM animals WHERE id =$1`, [id], (err, rows, fields) =>{
      if(err){
        console.log(err);
        return;
      }
      res.redirect("/users/dashboard/animals");
    }
  )
});

app.get("/adopt", (req, res) => {

  pool.query(
    `SELECT * FROM animals`, (err, rows, fields)=>{
      if(err){
        console.log(err);
        return;
      }
      console.log(rows.rows);
      res.render("adopt", { animals:rows.rows });
    }
  )
});

app.post("/users/dashboard/news", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  let { news_title, news_description, news_picture } = req.body;

  console.log({ news_title, news_description, news_picture });

  pool.query(
    `INSERT INTO news (title, description, picture) VALUES ($1, $2, $3)`, [news_title, news_description, news_picture],
    (err, results) => {
      if (err) {
        console.log(err);
      }
    }
  );

  res.redirect("news");
});

app.get("/users/dashboard/news", checkNotAuthenticated, (req, res) => {

  pool.query(
    `SELECT * FROM news ORDER BY id DESC`, (err, rows, fields)=>{
      if(err){
        console.log(err);
        return;
      }

      res.render("news", { user: req.user.name, news:rows.rows });
    }
  )
});

app.delete("/users/dashboard/news/:id", (req, res)=>{
  let id = req.params.id;

  pool.query(
    `DELETE FROM news WHERE id =$1`, [id], (err, rows, fields) =>{
      if(err){
        console.log(err);
        return;
      }
      res.redirect("/users/dashboard/news");
    }
  )
});

app.get('/getcalendar', (req, res) => {
  console.log("getcalendar method");

  pool.query(
    `SELECT * FROM calendarevents`, (err, rows, fields)=>{
      if(err){
        console.log(err);
        return;
      }
      // console.log(rows.rows);
      res.json(rows.rows);
    }
  )

});

app.get("/events", (req, res)=>{
  res.render("events");
});

app.post("/events", (req,res) => {
  let { date}  = req.body;
  if (date){
    pool.query(
      `SELECT * FROM events WHERE event_date = $1`, [date], (err, rows, fields)=>{
        if (err){
          console.log(err);
        }
        // res.send({ events:res.rows });
        console.log(rows.rows);
        res.render("events", { events: rows.rows });
      }
    );
  }else{
    res.redirect("events");
  }
});

app.get("/users/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/index"); 
  });
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2
  });

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "Email already registered"
          });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
