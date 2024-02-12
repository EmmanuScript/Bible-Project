import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import VersePage from "./pages/Verses";
import VerseDetail from "./components/DailyVerse";
import bibleVerses from "./verses";
import Quiz from "./components/Quiz";
import { AuthProvider } from "./Providers/AuthProviders";
import PrivateRoute from "./components/PrivateComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./Providers/AuthRoutes";

// Assuming your VersePage component file name

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AppRoutes />} />
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/*"
            element={
              <PrivateRoute
                element={
                  <div>
                    <Navbar />
                    <Routes>
                      <Route
                        path="/verses"
                        element={<VersePage dataArray={bibleVerses} />}
                      />
                      <Route
                        path="/verse/:id"
                        element={<VerseDetail dataArray={bibleVerses} />}
                      />
                      <Route
                        path="/quiz/:id"
                        element={<Quiz dataArray={bibleVerses} />}
                      />
                      <Route path="/home" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </div>
                }
              />
            }
          />

          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
