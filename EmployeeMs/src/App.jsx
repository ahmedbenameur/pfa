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
import Project from './Components/Project'
import ProjectsList from './Components/ProjectsList'
import AddTask from './Components/AddTask'
import TaskList from './Components/TaskList'
import ManagerLogin from './Components/ManagerLogin'
import ManagerDashboard from './Components/ManagerDashboard'
import Manager from './Components/Manager'
import AddManager from './Components/AddManager'
import Leader from './Components/Leader'
import AddLeader from './Components/AddLeader'
import LeaderLogin from './Components/LeaderLogin'
import LeaderDashboard from './Components/LeaderDashboard'
import CongesLeader from './Components/CongesLeader'
import EditLeaderConge from './Components/EditLeaderConge'
import SortiesLeader from './Components/SortiesLeader'
import EditLeaderSortie from './Components/EditLeaderSortie'
import TasksVisualization from './Components/TasksVisualization'
import Productivité from './Components/Productivité'
import TaskEmployee from './Components/TaskEmployee'
import LeavesCalendar from './Components/LeavesCalendar'
import EditEntryForm from './Components/EditEntryForm'
import WorkTimeCalendar from './Components/WorkTimeCalendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AbsencePresenceVisualization from './Components/AbsencePresenceVisualization'
import LeaderDeplacement from './Components/LeaderDeplacement'
import EmployeeDeplacement from './Components/EmployeeDeplacement'
import EmployeeDemandeDeplacement from './Components/EmployeeDemandeDeplacement'
import ManualTimeEntry from './Components/ManualTimeEntry'




function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start />}></Route>
      <Route path='/adminlogin' element={<Login />}></Route>
      <Route path='/employee_login' element={<EmployeeLogin />} />
      <Route path='/manager_login' element={<ManagerLogin />} />
      <Route path='/leader_login' element={<LeaderLogin />} />
      

      <Route path='/managerdashboard/*' element={<ManagerDashboard />} >
        <Route path='productivité' element= {< Productivité/>}></Route>
        <Route path='WorkTimeCalendar' element={<WorkTimeCalendar />} />
        <Route path='absence-presence' element={<AbsencePresenceVisualization />} />
        </Route>
        
  <Route path='/leaderdashboard/*' element={<LeaderDashboard />}  >
  <Route path='project' element={<Project />} />
  <Route path='add_task' element={<AddTask />} />
  <Route path='projectList' element={<ProjectsList />} />
  <Route path='taskList' element={<TaskList />} />
  <Route path='task_visualisation' element={< TasksVisualization/>} />
  <Route path="conges/leaves-calendar"    element={< LeavesCalendar />} />
  <Route path='conges' element={<CongesLeader />} />
  <Route path='sorties' element={<SortiesLeader />} />
  <Route path="conges/editleaderconge/:id" element={<EditLeaderConge />} />
  <Route path="sorties/editleadersortie/:id" element={<EditLeaderSortie />} />
  <Route path='WorkTimeCalendar' element={<WorkTimeCalendar />} />
  <Route path="LeaderDeplacement" element={<LeaderDeplacement />} />
</Route>
  <Route path='/employeedashboard/:id' element={<PrivateRoute><EmployeeDashboard /></PrivateRoute>}>
  <Route path='/employeedashboard/:id/employee_detail/:id' element={<EmployeeDetail />} />
  <Route path='/employeedashboard/:id/employee_conge/:id' element={<EmployeeConge />} />
  <Route path='/employeedashboard/:id/employee_sortie/:id' element={<EmployeeSortie />} />
  <Route path='/employeedashboard/:id/WorkTimeTracking' element={<WorkTimeTracking />} />
  <Route path='/employeedashboard/:id/employee_surveyquestion/:questionId' element={<SurveyQuestion />} />
  <Route path='/employeedashboard/:id/employee_demande_conge' element={<Employeedemandeconge />} /> 
  <Route path='/employeedashboard/:id/employee_demande_sortie' element={<EmployeeDemandeSortie />} /> 
  <Route path='/employeedashboard/:id/employee_task/:employeeID' element={<TaskEmployee/>} /> 
  <Route path='/employeedashboard/:id/edit_entry/:entryId' element = {<EditEntryForm/> }/>
  <Route path="/employeedashboard/:id/employee_deplacement/:id" element={<EmployeeDeplacement />}  />
  <Route path="/employeedashboard/:id/employee_demande_deplacement" element={<EmployeeDemandeDeplacement />} />
  <Route path='/employeedashboard/:id/manualtimeentry' element={<ManualTimeEntry />} />
  
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
        <Route path='/dashboard/manager' element={<Manager />}></Route>
        <Route path='/dashboard/add_manager' element={<AddManager />}></Route>
        <Route path='/dashboard/leader' element={<Leader />}></Route>
        <Route path='/dashboard/add_leader' element={<AddLeader />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App