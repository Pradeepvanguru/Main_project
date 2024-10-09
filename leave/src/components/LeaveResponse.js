import React from 'react';
import { Link } from 'react-router-dom';
import Table from './details';
import './LeaveResponse.css'

function HomePage() {
  const back = {
    opacity: '0.9',
    boxShadow: "0 4px 8px #fff, 0 8px 16px #f99999",
  };

  return (
    <div className="container-fluid bg-secondary">
      {/* Adjusted padding for mobile view */}
      <div className=" p-md-4 p-1">
        <div className="text-center text-dark  p-md-3 rounded bg-white" style={back}>
          {/* Centering the image and making it responsive */}
         <Link to='/'> <div className="d-flex justify-content-center mb-4">
            <img
              src="https://uploads.sarvgyan.com/2014/05/GMRIT-Rajam.jpg"
              height={90} width={120}
              className="rounded"
              style={back}
              alt="Campus"
             
            />
          </div></Link>
          <h3 className="mb-3">Welcome to the Class Adjustment System....👋</h3>
          <p className="mb-4">Use this platform to manage class adjustments efficiently.</p>
          <div className="d-flex justify-content-center flex-wrap">
            {/* Buttons wrapped for mobile */}
            <Link to="/leaveform" className="btn btn-primary m-2 p-2 fs-6" style={back}>
              Apply Here..
            </Link>
            <Link to="/registration" className="btn btn-success m-2 p-2 fs-6" style={back}>
              Register Now
            </Link>
          </div>
        </div>
      </div>

      {/* Table section - added table responsiveness */}
      <div className="d-flex justify-content-center align-items-center  ">
        <div className="container-fluid ">
          <div className="table-responsive">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
