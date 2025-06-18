import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "./index.css";
import Home from "./home";
import PopupContextProvider from "./context/popContextProvider";
import RegistrationForm from "./Form/RegistrationForm";
import LoginForm from "./Form/LoginForm";
import Preview from "./popup/preview";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminDashboard from "./Form/AdminDashboard";
import PasswordResetRequest from "./Form/PasswordResetRequest";
import PasswordReset from "./Form/PasswordReset";
import UpdatedInfoTable from "./Form/UpdatedInfoTable";

const HomeOrLogin = () => {
  const { authenticated } = useAuth();
  return authenticated ? <Home /> : <Redirect to="/login" />;
};

const AdminDashboardWrapper = () => {
  const { role } = useAuth();
  return role === "Admin" ? <AdminDashboard /> : <Redirect to="/" />;
};

// PrivateRoute for authenticated users
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const NotFound = () => (
  <div className="text-center">
    <h2>404 Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

const App = () => {
  return (
    <PopupContextProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <header className="header">
              <div className="container mx-auto p-4 flex justify-center items-center">
                <h1 className="text-2xl font-bold text-white">
                  R. K. Dewan Client Management System
                </h1>
              </div>
            </header>

            <main className="flex-grow container mx-auto p-2">
              <Switch>
                <PrivateRoute exact path="/" component={HomeOrLogin} />
                <PrivateRoute path="/preview" component={Preview} />

                <Route path="/login" component={LoginForm} />
                <PrivateRoute path="/register" component={RegistrationForm} />
                <PrivateRoute path="/updatedInfo" component={UpdatedInfoTable} />

                <PrivateRoute
                  path="/admin-dashboard"
                  component={AdminDashboardWrapper}
                />
                <Route
                  path="/password-request"
                  component={PasswordResetRequest}
                />
                <Route
                  path="/password-reset/:email/:token"
                  component={PasswordReset}
                />
                <Route component={NotFound} />
                <Redirect to="/" />
              </Switch>
            </main>

            <footer className="footer">
              <div className="container mx-auto p-2 flex justify-center items-center">
                <p className="text-sm text-white">
                  © 2024 R. K. Dewan Client Management System. All rights
                  reserved.
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </PopupContextProvider>
  );
};

export default App;
