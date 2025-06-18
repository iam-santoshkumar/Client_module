import React, { useState, useEffect } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./home";
import PopupContextProvider from "./context/popContextProvider";
import Preview from "./popup/preview";
import ProtectedComponent from "./ProtectedComponent"; // Ensure this path is correct

const App = () => {
  // const [authenticated, setAuthenticated] = useState(false);
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const checkAuth = async () => {
      
  //   };

  //   checkAuth();
  // }, []);

  // const handleLogout = async () => {
   
  // };

  return (
    <PopupContextProvider>
      <div className="flex flex-col min-h-screen">
        <header className="header">
          <div className="container mx-auto p-4 flex justify-center items-center">
            <h1 className="text-2xl font-bold text-white">
              R. K. Dewan Client Management System
            </h1>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4">
          <div>
            {/* {authenticated && <button onClick={handleLogout}>Logout</button>} */}
            <Router>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/preview" component={Preview} />
                <Route path="/protected">
                  {/* {authenticated ? <ProtectedComponent /> : <Redirect to="/" />} */}
                </Route>
              </Switch>
            </Router>
          </div>
        </main>
        <footer className="footer">
          <div className="container mx-auto p-2 flex justify-center items-center">
            <p className="text-sm text-white">
              © 2024 R. K. Dewan Client Management System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </PopupContextProvider>
  );
};

export default App;
