import React from 'react';
import LeaveForm from './components/LeaveForm';
import{BrowserRouter,Routes,Route} from "react-router-dom"
import RegistrationFrom from './components/registrationForm'
import LeaveResponse from './components/LeaveResponse';


function App() {
  return (
    <div  className="App">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LeaveResponse />}></Route>
        <Route path='/registration' element={<RegistrationFrom />}></Route>
        <Route path='/leaveform' element={<LeaveForm/>}></Route>
        <Route path='*' element={"page not found 404 ERROR"}></Route>
      </Routes>
    </BrowserRouter>
     
    </div>
  );
}

export default App;
