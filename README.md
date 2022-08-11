# Node-BelovedVancouver

#### Video Demo: <URL HERE>

## Desciption:

This project was submitted to eDx as my final project for the CS50x webcourse from Harvard.
Further information can be found [here] (https://cs50.harvard.edu/x/2022/).

The idea here was to create a website that could be used by any animal shelter.
Not only to advertise their work, but to promote events, show the animals available for adoption, get information from potential adopters, as well as give a chance to anyone interest in volunteer to submit a request.
The focus of the project is on the admin access and the database.
Donate buttons won't have any function as of now.
The form on the "adoption" page is not yet implemented. The idea would be the same as the form on "volunteer" page, so I didn't duplicate the efforts here.
The pictures used in this project were taken from [unsplash] (https://unsplash.com/) website, to avoid copyright issues.
On the database, it's only possible to save a path to an image, given that, after research and consideration, keeping images in a database would increase its size considerably, what could potentially disrupt or compromise the loading of the website.

I used a "fake" email to test the functionality, provided by [mailtrap](https://mailtrap.io/).

The calendar chosen for this project was [this] (https://fullcalendar.io/) one.
FullCalendar, being developed in JavaScript, was the most compatible with the project, and allows connections with the database to pass on information to be added to the calendar.

The admin login page is not linked on any page available for the final user, to help prevent unauthorized attempts to change the website content.

Through the admin access, it's possible to:

- Add and delete events to the calendar, that the final user will be able to check clicking on the calendar in the events page. The events added here will be tagged on the calendar used in "events" section, and the event will show once the user clicks on the event date.
- Add and delete animals available for adoption, with characteristics and additional information, as well as one picture.
- Add and delete news, to broadcast achievements and celebrate the work done by the org.

## Required:

- DBeaver
- Docker
- Visual Studio Code

## Database tables:

- [ ] animals: id (int4), pet_name (abc), age (123), weight (123), type (abc), breed (abc), additional (abc), picture (abc);
- [ ] calendarevents: id (serial4), title (abc), start (date);
- [ ] events: id (serial4), title (abc), description (abc), address (abc), event_date (date), user_id (abc);
- [ ] news: id (serial4), title(abc), description (abc), picture (abc);
- [ ] users: id (int4), name (abc), password (abc), email (abc);

## Technologies:

- PostgreSQL for object-relational database.
- Node js/express on the back end for HTTP requests.
- EJS as template engine for JavaScript.
- Dotenv to load environment variables.
- BCrypt to hash passwords.
- Passport as authentication middleware for Node.js.

## Starting:

Please start running the following code, so all the dependencies are installed:

```
npm install
```

Comand to start server:

```
npm start
```

## Files:

.ejs files are the html the final user will see when they access the website, except for login, dashboard, animals, and news, which are pages accessed by the admin to add or delete information seen by the final user.

- dbConfig.js is used to connect the application to the database.
- server.js to handle the HTTP requests, forms submission and email delivery, as well as environment and session.
- passportConfig.js will verify the credentials entered by the admin against the database to authenticate them.
- package.json refers to the dependencies used in this project, that will be installed once the command `npm start` is used.

## Final Comments

It was a challenge that I recognize can still receive quite improvements, but that already taught me very much. I hope someday I can implement and deploy this version for an org in need.

Thank you,

Caroline
