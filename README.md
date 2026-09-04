# MedFind LK

MedFind LK is a medicine availability finder for Sri Lanka. Patients can search for medicines, check stock availability, compare nearby pharmacies, and place orders without visiting multiple pharmacies first.

## Selected Problem

Patients often spend time travelling from pharmacy to pharmacy to find essential medicines. Pharmacy stock information is not always easy to discover, and pharmacists need a simple way to manage medicine inventory and patient orders.

## Proposed Solution

MedFind LK connects patients, pharmacists, and administrators through one web application. Registered pharmacies publish their medicine stock, patients search the listings and place orders, and pharmacists manage stock and update order status.

## Main Features

- Landing page with medicine finder call-to-action and responsive design
- Search medicines by name, category, location, and availability
- Available, low-stock, and out-of-stock status indicators
- Medicine prices, descriptions, images, and pharmacy details
- Patient registration, login, cart, and order history
- Pharmacist registration with admin approval workflow
- Pharmacist dashboard for adding, editing, and deleting medicine stock
- Pharmacist order management and status updates
- Admin user management, pharmacist approvals, and order monitoring
- JWT authentication with role-based access control
- Responsive navigation, pages, cards, and footer for desktop and mobile

## Technologies Used

### Frontend

- React 19, Vite, React Router, Axios
- Lucide React icons
- CSS with responsive layouts and glassmorphism styling

### Backend

- Node.js and Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- Cloudinary and Multer for medicine image uploads
- CORS and dotenv

## AI Tools Used

- ChatGPT/Codex: debugging middleware and routing issues, improving responsive UI, and assisting with documentation
- AI-assisted suggestions were reviewed and adapted to the project's existing React, Express, and MongoDB implementation

## Team Members and Contributions

| Member | Name | Role | Contribution |
| --- | --- | --- | --- |
| Member 1 | `[Jathurshy S]` | Frontend and Navigation | React pages, routing, landing page, medicine browsing, and dashboard navigation |
| Member 2 | `[Deneshkar P]` | Backend and Database | Express server, MongoDB models, authentication, medicine CRUD, and order APIs |
| Member 3 | `[Denesh N]` | UI, Forms, and Validation | Responsive styling, login/register forms, cart UI, validation, and user feedback |
| Member 4 | `[Thanushikan M]` | Integration, Testing, and Deployment | API integration, search and filtering, testing, bug fixes, deployment, and demo preparation |

## Project Structure

```text
MedFind LK/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database or MongoDB Atlas connection
- Cloudinary account for image uploads

## Installation

```bash
git clone `[GitHub repository URL]`
cd "MedFind LK"

cd backend
npm install

cd ../frontend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit real database, JWT, or Cloudinary credentials to GitHub.

## Running the Application

Open two terminals.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:5000`.

To create a production frontend build:

```bash
cd frontend
npm run build
```

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a patient or pharmacist |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/auth/me` | Get the logged-in user |
| GET | `/api/medicines` | Search and filter public medicine listings |
| GET | `/api/medicines/:id` | View one medicine |
| POST | `/api/medicines` | Add medicine as an approved pharmacist |
| PUT | `/api/medicines/:id` | Update medicine stock |
| DELETE | `/api/medicines/:id` | Delete a medicine listing |
| POST | `/api/orders` | Place a patient order |
| GET | `/api/orders` | View role-specific orders |
| PUT | `/api/orders/:id/status` | Update order status |
| GET | `/api/users` | Manage users as an admin |
| GET | `/api/users/pharmacists` | Review pharmacist accounts |

## Deployed Application

[Open MedFind LK](https://mini-hackathon-silk.vercel.app/)

## Demonstration Video

[Add demonstration video link here]

The project also includes the local video asset used on the landing page: `frontend/public/hero-background.mp4`.

## GitHub Contribution Guidelines

- Create a GitHub repository and push the complete source code.
- Use meaningful commits that describe each feature or fix.
- Every team member should make visible contributions through feature work and Git commits.
- Keep secrets in environment variables and out of the repository.

## License

This project was created as a MERN stack mini-hackathon project.
