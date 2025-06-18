import "./App.css";
import React, { useEffect, useContext } from "react";
import StagePopup from "./popup/stagepopup.js";
import AddPopup from "./popup/addpopup.js";
import UpdatePopup from "./popup/updatePopup.js";
import PopupContext from "./context/popupContext.js";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import "./home.css"

function Home() {
  const toast = useToast();
  const { showStage, addPopup, showUpdate, handleTotalSearchForPage, showAdd } =
    useContext(PopupContext);
  const history = useHistory();
  const role = sessionStorage.getItem("role"); // Retrieve the role from local storage

  useEffect(() => {
    handleTotalSearchForPage();
  }, []);

  const handleAddClient = () => {
    if (role === "Viewer") {
      toast({
        title: "You do not have authority to add a new client.",
        status: "success",
        position: "top",
        isClosable: true,
      });
    } else if (!showUpdate) { 
      showAdd(); 
    }
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();

    // Clear history state to prevent back navigation
    history.replace("/login");
    window.location.href = "/login"; // Invalidate back button by navigating to login page
  };

  const goToAdminDashboard = () => {
    history.replace("/admin-dashboard"); // Relative path
  };

  // useEffect(() => {
  //   window.history.pushState(null, null, window.location.href);
  //   window.addEventListener("popstate", (event) => {
  //     window.history.pushState(null, null, window.location.href);
  //   });
  // }, []);

  return (
    <div className="webpage bg-gray-100 min-h-screen font-roboto text-gray-800">
      <div className="flex flex-wrap justify-between mr-1 ml-1 px-2 ">
        {/* Conditionally render the Add New Client button */}
        {role !== "Viewer" && (
          <div className="section">
            <button
              className="add-client-btn"
              onClick={handleAddClient} // Use the new handler
            >
              Add New Client
            </button>
          </div>
        )}
        <div className="section flex items-center">
          {/* Conditionally render the Go to Admin Dashboard button */}
          {role !== "Viewer" && role !== "Data Entry Operator" && (
            <button
              className="dashboard-btn"
              onClick={goToAdminDashboard} // Redirect to admin dashboard
            >
              Go to Dashboard
            </button>
          )}
          <button
            className="logout-btn"
            onClick={handleLogout} // Call handleLogout on click
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dynamicContent p-2">
        <div className="stagePopup">{showStage && <StagePopup />}</div>
        <div className="addPopup">{addPopup && <AddPopup />}</div>
        <div className="updatePopup">{showUpdate && <UpdatePopup />}</div>
      </div>
    </div>
  );
}

export default React.memo(Home);
