// EmployeeDashboard.jsx

import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import PrivateRoute from "./PrivateRoute";
import { useParams } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { id: employeeId } = useParams();

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        } else {
          alert("Logout failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while logging out. Please try again later.");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                {/* Autres liens spécifiques à l'employé */}
                <Link
                  to={`employee_detail/${employeeId}`}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Employee Detail
                  </span>
                </Link>
                <Link
                  to={`employee_conge/${employeeId}`}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-calendar-check ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">leave</span>
                </Link>
                <Link
                  to={`employee_sortie/${employeeId}`}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-box-arrow-right ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Exit Request</span>
                </Link>
                <Link
  to={`/employeedashboard/${employeeId}/WorkTimeTracking`}
  className="nav-link px-0 align-middle text-white"
>
  <i className="fs-4 bi-clock ms-2"></i>
  <span className="ms-2 d-none d-sm-inline">Work Time Tracking</span>
</Link>
                <Link
                  to={`/employeedashboard/${employeeId}/employee_surveyquestion/${employeeId}`}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-bar-chart-line ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Survey Questions
                  </span>
                </Link>
                <Link
                  to={`/employeedashboard/${employeeId}/employee_task/${employeeId}`}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-bar-chart-line ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Project Tasks
                  </span>
                </Link>
                <Link
                  to={`/employeedashboard/${employeeId}/employee_deplacement/${employeeId}`}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-arrow-right-circle ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">deplacement</span>
                </Link>
              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Employee Management System</h4>
          </div>

          {/* Render the content of child routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
