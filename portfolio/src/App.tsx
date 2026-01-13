import {useState, useEffect} from "react";
import Loading from "./components/Loading";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import ProjectDisplay from "./components/Projects";
import Service from "./components/service";
import CardDisplay from "./components/carddisplay";
import About from "./components/About";
import Awards from "./components/awards";
import Contact from "./components/contact";
import Dashboard from "./components/Dashboard";
import Auth from "./components/page/auth";
import ProtectedRoute from "./service/ProtectedRoute";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {isLoading ? (
        <div style={{ backgroundColor: "#333"}}>
          <Loading />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Home />
              <CardDisplay />
              <About />
              <Service/>
              <ProjectDisplay />
              <Awards />
              <Contact />
            </>
          } />
          <Route path="/auth/user/login" element={<Auth />} />
          
          {/* Protected Dashboard Route */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      )}
    </Router>
  );
}

export default App;