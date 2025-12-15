# 🚀 LoanLink

A modern, responsive **Micro-Loan Management System** built with **React**, designed to serve **Admins, Managers, and Borrowers** with role-based dashboards, analytics, and smooth UI interactions.

---

## 🖥️ Tech Stack

- **React 18**
- **Vite**
- **React Router DOM**
- **@tanstack/react-query**
- **Tailwind CSS + DaisyUI**
- **Framer Motion**
- **Recharts**
- **SweetAlert2**
- **React Hook Form**
- **Firebase Authentication**

---

## 🎯 Key Features

### 🔐 Authentication & Roles

- Firebase Email/Password authentication
- Role-based access:
  - **Admin**
  - **Manager**
  - **Borrower**
- Protected routes with redirect handling

### 📊 Dashboards

- Dynamic statistics per role
- Animated stat cards
- Data visualization using **Recharts**
- Real-time data fetching via React Query

### 💼 Loan Management

- Apply for loans
- View loan application status
- Approve / Reject loans (Admin & Manager)
- View approved & pending loans
- Detailed loan view modal

### 🎨 UI & UX

- Dark / Light theme toggle (global hook)
- Responsive layout
- Smooth animations (Framer Motion)
- SweetAlert confirmations & notifications
- Loading states across pages

---

## 📁 Project Structure

```bash
src/
├── Assets/
│   └── All Images
├── Components/
│   ├── Shared/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   ├── PageHeader.jsx
│   │   └── NotFound.jsx
│   ├── Dashboard/
│   │   ├── DashboardHeader.jsx
│   │   ├── DashFooter.jsx
│   │   ├── DashSidebar.jsx
│   │   ├── DashDrawer.jsx
│   │   ├── DashboardChart.jsx
│   │   └── UserStats.jsx
│   └── HomePage/
│       ├── AvailableLoans.jsx
│       ├── CTABanner.jsx
│       ├── CustomerFeedback.jsx
│       ├── HeroBanner.jsx
│       ├── HowItWorks.jsx
│       └── WhyChoose.jsx
├── firebase/
│   └── firebase.config.js
├── Hooks/
│   ├── useTheme.js
│   └── useAuth.js
├── Layouts/
│   ├── DashboardLayout.js
│   └── RootLayout.js
├── Pages/
│   ├── Admin/
│   │   ├── AllAdminLoans.jsx
│   │   ├── LoanApplications.jsx
│   │   └── ManageUsers.jsx
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── DashboardPages/
│   │   ├── User/
│   │   │   ├── MyLoans.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Settings.jsx
│   │   └── DashboardHome.jsx
│   ├── Admin/
│   │   ├── AddLoan.jsx
│   │   ├── ApprovedLoan.jsx
│   │   ├── ManageLoan.jsx
│   │   └── PendingLoan.jsx
│   ├── Shared/
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── AccessDenied.jsx
│   ├── AllLoans.jsx
│   ├── ApplyLoan.jsx
│   ├── ErrorPage.jsx
│   ├── HomePage.jsx
│   └── LoanDetails.jsx
├── Provider/
│   └── AuthProvider.jsx
├── Routes/
│   ├── RoleRoute.jsx
│   └── router.jsx
├── utils/
│   ├── api.js
│   └── DocumentTitle.jsx
├── index.css
└── main.jsx
```

---

## ⚙️ Environment Variables

```bash
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## ▶️ Getting Started

# Install dependencies

```bash
npm install
```

# Run development server

```bash
npm run dev
```

# Build for production

```bash
npm run build
```

---

## 🔒 Route Protection Example

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

---

## 📈 Charts & Analytics

- Loan distribution
- Pending vs Approved loans
- Borrower activity
- Financial summaries

---

## 🧪 Demo Roles

| Role     | Permissions              |
| -------- | ------------------------ |
| Admin    | Full system access       |
| Manager  | Loan approval & reports  |
| Borrower | Apply & manage own loans |

---
