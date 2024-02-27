
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const ProjectsList = () => {

    const [projects, setProjectName] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/leader/projectList')
            .then(result => {
                if (result.data.Status) {
                    setProjectName(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Category List</h3>
            </div>
            <Link to="project" className='btn btn-success'>Add Project</Link> 
           
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects && projects.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
  
}

export default ProjectsList