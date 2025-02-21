import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/user_context';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

const Home = () => {
  const [projects, setProject] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  const createProject = (e) => {
    e.preventDefault();
    console.log(projectName);

    axios.post('/projects/createProject', {
      name: projectName,
    })
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
        setProjectName('');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios.get('/projects/getAllProjects')
      .then((res) => {
        console.log(res.data);
        setProject(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLogin = () => {
    if (user) {
      alert('Already logged in');
    } else {
      navigate('/login');
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    if (user) {
      const token = localStorage.getItem('token');
      axios.get('/users/logout', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          setUser(null);
          localStorage.removeItem('token');
          alert('Logged out');
        })
        .catch((error) => {
          console.log(error);
          alert('Error logging out');
        });
    } else {
      alert('Not logged in');
    }
  };

  const handleMyProjects = () => {
    if (user) {
      setIsProjectsModalOpen(true);
    } else {
      alert('Please log in first');
      navigate('/login');
    }
  };

  console.log("project", projects);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#41295a] to-[#2F0743]">
      <div className="absolute top-4 right-4">
        {user && (
          <button
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
            onClick={handleLogout}
            title="Logout from your account"
          >
            Logout
          </button>
        )}
      </div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Build, Code, and Collaborate with Your AI Developer</h1>
        <p className="text-xl text-gray-200 mt-4">Welcome to the future of coding! Create, edit, and run projects effortlessly with your personal AI developer powered by Gemini AI.</p>
        <p className="text-lg text-gray-300 mt-2">Whether you're brainstorming ideas, collaborating with peers, or building your next big project, our platform makes it seamless and fun.</p>
        <h2 className="text-3xl font-bold text-white mt-8">Debug with ease using AI</h2>
      </div>
      <div className="w-full max-w-2xl p-6  rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-around mb-6 space-y-4 md:space-y-0 md:space-x-4">
          {!user && (
            <>
              <div className="flex flex-col items-center space-y-2 p-4 bg-cyan-100 rounded-lg shadow-md">
                <p className="text-lg text-gray-700">Already a member? Login and dive back into your projects and creativity!</p>
                <button
                  className="px-4 py-2 text-white bg-cyan-500 rounded-lg hover:bg-cyan-700"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-teal-100 rounded-lg shadow-md">
                <p className="text-lg text-gray-700">New here? Sign Up and start building with AI today!</p>
                <button
                  className="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-700"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
          <div className="flex flex-col items-center space-y-2 p-4 bg-purple-100 rounded-lg shadow-md">
            <p className="text-lg text-gray-700">Explore your creations! View and manage your My Projects.</p>
            <button
              className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-700"
              onClick={handleMyProjects}
            >
              My Projects
            </button>
            
          </div>
          
          {user &&(
   <div className="flex flex-col items-center space-y-2 p-4 bg-purple-100 rounded-lg shadow-md">
   <p className="text-lg text-gray-700">Bring your imagination in life ,get started with new project</p>
   <button
     className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-700"
     onClick={()=>setIsModalOpen(true)}
   >
    create new project
   </button>
   
 </div>
)}
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white mt-8">Let's Code !</h2>
     

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  id="projectName"
                  name="projectName"
                  type="text"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        
      )}

      {isProjectsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">My Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="p-4 bg-gray-100 rounded shadow cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    navigate('/project/', {
                      state: { project }
                    });
                  }}
                >
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-600">Collaborators</h3>
                    <div className="text-sm text-gray-800">{project.users.length}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setIsProjectsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
