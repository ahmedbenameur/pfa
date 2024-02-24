import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Leader = () => {
  const [leader, setLeader] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:3000/auth/leader')
      .then(result => {
        if (result.data.Status) {
          setLeader(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

 

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>leader List</h3>
      </div>
      <Link to="/dashboard/add_leader" className='btn btn-success'>Add Leader</Link>
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
              leader && leader.map(e => (
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

export default Leader ;

