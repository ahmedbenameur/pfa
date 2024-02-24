import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Manager = () => {
  const [manager, setManager] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:3000/auth/manager')
      .then(result => {
        if (result.data.Status) {
          setManager(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

 

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>Manager List</h3>
      </div>
      <Link to="/dashboard/add_manager" className='btn btn-success'>Add Manager</Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              
            </tr>
          </thead>
          <tbody>
            {
              manager && manager.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td> 
                  <td>{e.email}</td>
                 
                  
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manager ;

