import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LeaveForm.css'; // Link to custom CSS for additional styling

function LeaveForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm();
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dayName, setDayName] = useState('');
  const [sections, setSections] = useState([]);
  const [name, setFacultyNames] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const semestersData = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };

  const periodTimes = {
    1: { startTime: '09:00 AM', endTime: '10:00 AM' },
    2: { startTime: '10:00 AM', endTime: '11:00 AM' },
    3: { startTime: '11:10 AM', endTime: '12:10 PM' },
    4: { startTime: '12:00 PM', endTime: '01:10 PM' },
    5: { startTime: '02:00 PM', endTime: '03:00 PM' },
    6: { startTime: '03:00 PM', endTime: '04:00 PM' },
    7: { startTime: '04:00 PM', endTime: '05:00 PM' },
  };

  const onYearChange = (year) => {
    setValue('sem', '');
    if (year) {
      setSemesters(semestersData[year]);
      handleSemesterChange(semestersData[year][0]);
    } else {
      setSemesters([]);
    }
  };

  const handleSemesterChange = (sem) => {
    const year = watch('year');
    if (year && semestersData[year].includes(sem)) {
      console.log(`Selected semester ${sem} for year ${year}`);
    } else {
      console.log('Selected semester is not valid for the chosen year');
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    setDayName(dayName);
    setValue('dayName', dayName);
  };

  const handlePeriodChange = (event) => {
    const period = event.target.value;
    if (periodTimes[period]) {
      setValue('startTime', periodTimes[period].startTime);
      setValue('endTime', periodTimes[period].endTime);
    }
  };

  const onSubmit = (data, event) => {
    event.preventDefault();
    setIsSubmitting(true);
    axios.post(' http://localhost:5000/api/leave', data)
      .then((response) => {
        reset();
        navigate('/');
      })
      .catch((error) => {
        setIsSubmitting(false);
      });
  };

  const branches = ["IT", "CSE", "MECH", "Civil", "EEE", "ECE", "AIDS"];

  const fetchFacultyData = async ({ email, branch, sem, year }) => {
    try {
      const response = await axios.post(' http://localhost:5000/api/getFacultyData', { email, branch, sem, year });
      if (response.data) {
        setFacultyNames(response.data.name);
        setSubjects(response.data.subjects || '');
        setSections(response.data.sections || '');
      }
    } catch (error) {
      console.error('Error fetching faculty data', error);
    }
  };

  useEffect(() => {
    const email = watch('email');
    const branch = watch('branch');
    const sem = watch('sem');
    const year = watch('year');

    if (email && branch && sem && year) {
      fetchFacultyData({ email, branch, sem, year });
    }
  }, [watch('email'), watch('branch'), watch('sem'), watch('year')]);


  const back = {
    opacity: '0.9',
    boxShadow: "0 4px 8px #fff, 0 8px 16px #f99999",
  };

  return (
    <div className='form-container bg-secondary'>
    
    
      <div className='form-wrapper '>
      <Link to='/'> 
        <div className="d-flex justify-content-center ">
            <img
              src="https://uploads.sarvgyan.com/2014/05/GMRIT-Rajam.jpg"
              height={80} width={130}
              className="rounded"
              style={back}
              alt="Campus"
             
            />
          </div></Link>
        <Link to="/" className="btn-back">
          <h4>&#8592; Back</h4>
        </Link>
       
        <form onSubmit={handleSubmit(onSubmit)} className='form-group'>
          <center>
            <h3><b className='form-title'>Class Adjustment Request Form 👋</b></h3>
          </center>

          <div className='form-row'>
            <div className='form-field'>
              <label>Branch</label>
              <select {...register('branch')} className='form-control' required>
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className='form-field'>
              <label>Year</label>
              <select {...register('year')} className='form-control' required onChange={(e) => onYearChange(e.target.value)}>
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Semester</label>
              <select {...register('sem')} className='form-control' required onChange={(e) => handleSemesterChange(e.target.value)}>
                <option value="">Select Semester</option>
                {(semesters || []).map((sem) => (
                  <option key={sem} value={sem}>{sem} Semester</option>
                ))}
              </select>
            </div>
            <div className='form-field'>
              <label>Email</label>
              <input {...register('email')} type='email' className='form-control' required placeholder='Registration email' />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Name</label>
              <input {...register('name', { required: true })} type='text' className='form-control' value={name || ''} readOnly />
            </div>
            <div className='form-field'>
              <label>Section</label>
              <select {...register('section')} className='form-control' required>
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Subject Name</label>
              <select {...register('subj')} className='form-control' required>
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div className='form-field'>
              <label>Which Period</label>
              <select {...register('period')} className='form-control' required onChange={handlePeriodChange}>
                <option value="">Select Period</option>
                {[1, 2, 3, 4, 5, 6, 7].map(period => (
                  <option key={period} value={period}>Period {period}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Start Time</label>
              <input {...register('startTime')} type='text' className='form-control' readOnly />
            </div>
            <div className='form-field'>
              <label>End Time</label>
              <input {...register('endTime')} type='text' className='form-control' readOnly />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Leave Date</label>
              <input {...register('leaveDate')} type='date' className='form-control' required onChange={handleDateChange} />
            </div>
            <div className='form-field'>
              <label>Day</label>
              <input {...register('dayName')} type='text' className='form-control' value={dayName || ''} readOnly />
            </div>
          </div>

          <button type="submit" className='btn-submit' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LeaveForm;
