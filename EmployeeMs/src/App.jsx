import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Employee from './Components/Employee'
import Category from './Components/Category'
import Profile from './Components/Profile'
import AddCategory from './Components/AddCategory'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import Start from './Components/Start'
import EmployeeLogin from './Components/EmployeeLogin'
import EmployeeDetail from './Components/EmployeeDetail'
import PrivateRoute from './Components/PrivateRoute'
import EmployeeDashboard from './Components/EmployeeDashboard'
import EmployeeConge from './Components/EmployeeConge'
import Employeedemandeconge from './Components/Employeedemandeconge'
import EmployeeSortie from './Components/EmployeeSortie'
import EmployeeDemandeSortie from './Components/EmployeeDemandeSortie'
import SurveyQuestion from './Components/SurveyQuestion'
import WorkTimeTracking from './Components/WorkTimeTracking'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start />}></Route>
      <Route path='/adminlogin' element={<Login />}></Route>
      <Route path='/employee_login' element={<EmployeeLogin />} />

    <Route path='/employeedashboard/:id' element={<PrivateRoute><EmployeeDashboard /></PrivateRoute>}>
  <Route path='/employeedashboard/:id/employee_detail/:id' element={<EmployeeDetail />} />
  <Route path='/employeedashboard/:id/employee_conge/:id' element={<EmployeeConge />} />
  <Route path='/employeedashboard/:id/employee_sortie/:id' element={<EmployeeSortie />} />
  <Route path='/employeedashboard/:id/WorkTimeTracking/:id' element={<WorkTimeTracking />} />
  <Route path='/employeedashboard/:id/employee_surveyquestion/:questionId' element={<SurveyQuestion />} />
  <Route path='/employeedashboard/:id/employee_demande_conge' element={<Employeedemandeconge />} /> 
  <Route path='/employeedashboard/:id/employee_demande_sortie' element={<EmployeeDemandeSortie />} /> 


</Route>




      <Route path='/dashboard' element={
        <PrivateRoute >
          <Dashboard />
        </PrivateRoute>
      }>
        <Route path='' element={<Home />}></Route>
        <Route path='/dashboard/employee' element={<Employee />}></Route>
        <Route path='/dashboard/category' element={<Category />}></Route>
        <Route path='/dashboard/profile' element={<Profile />}></Route>
        <Route path='/dashboard/add_category' element={<AddCategory />}></Route>
        <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
        <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />}></Route>
      </Route>

     
    </Routes>
    </BrowserRouter>
  )
}

export default App