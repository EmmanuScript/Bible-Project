import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
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

// Assuming your VersePage component file name

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
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
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
