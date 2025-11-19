📘 Wanderlust – README

Wanderlust is a full-stack travel stay platform inspired by Airbnb.
Users can create property listings, leave star-based reviews, and manage accounts securely with authentication & authorization.

🛠️ Tech Stack
Category	Technologies Used
📝 Languages: JavaScript (Node.js), HTML5, CSS3

🧰 Backend Framework:	Express.js

🖼️ Templating Engine:	EJS, EJS-Mate Layouts

🗄️ Database:	MongoDB, Mongoose ORM

🔐 Authentication:	Passport.js (Local Strategy), express-session, passport-local-mongoose

🛡️ Validation:	Joi (server-side), Bootstrap 5 validation (client-side)

🔒 Security	:dotenv

🎨 UI & Styling:	Bootstrap 5, Font Awesome Icons

⚙️ Utilities:	method-override, connect-flash, ExpressError, wrapAsync helper

🌍 Environment Management: dotenv

🧱 Architecture Style	MVC (Model–View–Controller)

## 🏗️ Architecture Diagram

![Architecture Diagram](assets/architecture_image.png)


✨ Core Features
🔐 Secure Authentication

User signup, login, logout

Password hashing via passport-local-mongoose

Sessions with cookies

Flash messages for feedback

🏡 Listing Management

Create listings

View listings

Edit listings (owner only)

Delete listings (owner only)

⭐ Reviews & Ratings

Leave star ratings (1–5)

Comment on listings

Delete own reviews

Cascading delete (listing removal also removes its reviews)

🛡️ Authorization

isLoggedIn — protects routes

Isowner — only owners can edit/delete listings

IsAuthor — only review authors can delete

🧹 Server & Client Validation

Joi validation schemas (backend)

Bootstrap validation messages (UI)

🎨 Clean UI

EJS layouts

Bootstrap 5 responsive components

Styled review cards & listing cards





⚙️ Setup & Run Instructions
✅ 1. Prerequisites

Node.js (v16+)

MongoDB installed locally OR MongoDB Atlas

Git

✅ 2. Clone the Repository
git clone https://github.com/your-username/wanderlust.git
cd wanderlust

✅ 3. Install Dependencies
npm install

✅ 4. Create .env File
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
SESSION_SECRET=your_session_secret_here

✅ 5. (Optional) Seed the Database
node init/index.js

✅ 6. Start the Server
node app.js


Now open:

http://localhost:8080

📄 .env.example
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
SESSION_SECRET=your_session_secret_here

🗂️ Key Models
User
email: String
username: String
password: Hashed (auto by passport-local-mongoose)

Listing
title: String
description: String
image: String
price: Number
location: String
country: String
owner: ObjectId -> User
reviews: [ObjectId] -> Review

Review
rating: Number (1-5)
comment: String
Author: ObjectId -> User

🔑 Important Endpoints
Listings
Method	Endpoint	Description
GET	/listings	Get all listings
POST	/listings	Create listing
GET	/listings/:id	Show listing
PUT	/listings/:id	Edit listing
DELETE	/listings/:id	Delete listing
Reviews
Method	Endpoint	Description
POST	/listings/:id/reviews	Add review
DELETE	/listings/:id/reviews/:reviewId	Delete review
Authentication
Method	Endpoint	Description
GET	/signup	Signup page
POST	/signup	Create account
GET	/login	Login page
POST	/login	Authenticate
GET	/logout	Logout
📊 Impact & Observations

Responsive UI across mobile and desktop

MVC architecture simplifies scaling

Clean separation of concerns

Mongoose hooks prevent data inconsistency

Fast performance: 10–40ms avg local response time

Easily extendable for cloud deployment



🔮 Future Improvements

Add deployment to Render

Add Cloudinary for image uploads

Add Mapbox for maps & geolocation

Add advanced search & filtering

Add user profile pages

Add pagination & sorting

Implement Redis-backed session store for production