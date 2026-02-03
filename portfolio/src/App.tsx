import { useState } from "react";
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
import AboutMe from "./components/AboutMe.tsx"

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [serviceData, setServiceData] = useState(null);

  const handleLoadingComplete = (data) => {
    // Update body styles
    document.body.style.backgroundColor = '#333333';
    document.body.style.backgroundImage = "url('../assets/bak/hero-bg.jpg')";
    document.body.style.overflow = '';
    
    // Set data and mark loading as complete
    setServiceData(data);
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <>
            <Header />
            <Home />
            <CardDisplay />
            <About />
            <Service serviceData={serviceData} />
            <ProjectDisplay />
            <Awards />
            <Contact />
          </>
        } />
        
        <Route path="/auth/user/login" element={<Auth />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* other route */}
        <Route path="/about" element={<>
          <Header />
          <About/>
          <footer />
          <Contact />
        </>}
         />
         <Route path="/project" element={<>
          <Header />
          <ProjectDisplay />
          <Contact />
         </>
          }/>
      </Routes>
    </Router>
  );
}

export default App;