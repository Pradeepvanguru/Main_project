import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RegistrationForm.css'; // Import custom CSS

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    year: '',
    sem: '',
    email: '',
    section: '',
    branch: '',
    name: '',
    subj: ''
  });
  
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);

  const subjectsData = {
    1: {
      1: ['Maths', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Electronics'],
      2: ['Biology', 'Statistics', 'History', 'Geography', 'C Programming', 'Data Structures']
    },
    2: {
      3: ['Database Management Systems', 'Data Communication Systems', 'OOP through Java', 'Discrete Mathematical Structures', 'Digital Logic Design', 'Python programming and Applications'],
      4: ['Web Development', 'Mobile Apps', 'Machine Learning', 'AI', 'Ethical Hacking', 'Cloud Computing']
    },
    3: {
      5: ['Design and Analysis of Algorithms', 'Artificial Intelligence', 'Cloud Computing', 'Software Engineering Principles', 'Exploratory Data Analytics(AI & ML)', 'Web Programming Languages(Full stack)','Fundamentals of Security','Term paper'],
      6: ['ACD', 'EEPM', 'WEB', 'ML']
    },
    4: {
      7: ['Natural Lagnuage Proceessing(AI&ML)', 'Web Application Database', 'Software Project Management',  'Main Project'],
      8: ['Research Methodology', 'Software Testing', 'Data Visualization', 'System Modeling', 'DevOps', 'Content Management']
    }
  };

  const branches = ["IT", "CSE", "MECH", "Civil", "EEE", "ECE", "AIDS"];
  const sectionsData = {
    IT: ['A', 'B'],
    CSE: ['A', 'B'],
    MECH: ['A', 'B', 'C'],
    Civil: ['A', 'B'],
    EEE: ['A', 'B'],
    ECE: ['A', 'B'],
    AIDS: ['A', 'B']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'year') {
      setFormData(prevData => ({ ...prevData, sem: '', subj: '' }));
    }

    if (name === 'sem') {
      setSubjects(subjectsData[formData.year][value]);
    }
  };

  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;
    setFormData(prevData => ({ ...prevData, branch: selectedBranch, section: '' }));
    setSections(sectionsData[selectedBranch] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(' http://localhost:5000/registers', formData);
      alert("Registration successful...!!");
      
      console.log(response);
    } catch (error) {
      console.error('There was an error registering!', error);
      alert('Registration failed!');
    }
  };

  const getSemesters = (year) => {
    switch (year) {
      case '1': return [1, 2];
      case '2': return [3, 4];
      case '3': return [5, 6];
      case '4': return [7, 8];
      default: return [];
    }
  };

  return (
    <div className='form-container bg-secondary'>
      <div className='form-wrapper'>
        <div className='form-title'>
          <Link to="/" className="back-btn">&#8592; Back</Link>
          <h3>Registered Here..</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-row'>
            <div className='form-field'>
              <label className='fw-bold'>Branch</label>
              <select className='form-control' name="branch" value={formData.branch} onChange={handleBranchChange} required>
                <option value="">Select Branch</option>
                {branches.map((branch, index) => (
                  <option key={index} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div className='form-field'>
              <label className='fw-bold'>Year</label>
              <select className='form-control' name="year" value={formData.year} onChange={handleChange} required>
                <option value="">Select Year</option>
                <option value="1">1 year</option>
                <option value="2">2 year</option>
                <option value="3">3 year</option>
                <option value="4">4 year</option>
              </select>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label className='fw-bold'>Semester</label>
              <select className='form-control' name="sem" value={formData.sem} onChange={handleChange} required disabled={!formData.year}>
                <option value="">Select Semester</option>
                {getSemesters(formData.year).map(sem => (
                  <option key={sem} value={sem}>{sem} sem</option>
                ))}
              </select>
            </div>
            <div className='form-field'>
              <label className='fw-bold'>Section</label>
              <select className='form-control' name="section" value={formData.section} onChange={handleChange} required disabled={!formData.branch}>
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label className='fw-bold'>Subject</label>
              <select className='form-control' name="subj" value={formData.subj} onChange={handleChange} required disabled={!formData.sem}>
                <option value="">Select Subject</option>
                {subjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            <div className='form-field'>
              <label className='fw-bold'>Name</label>
              <input className='form-control' name="name" value={formData.name} onChange={handleChange} required placeholder='start with Mr./Mrs.' />
            </div>

            <div className='form-field'>
              <label className='fw-bold'>Email</label>
              <input className='form-control' type="email" name="email" value={formData.email} onChange={handleChange} required placeholder='Enter your email' />
            </div>
          </div>

          <button className='btn-submit' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
