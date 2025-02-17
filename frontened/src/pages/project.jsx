import React, { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../context/user_context';
import { useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { RingLoader } from 'react-spinners';
import { connectSocket, sendMessage, getMessage } from '../config/socket';
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer';

const Project = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  console.log("user", user);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  console.log("project.id", project._id);

  const fetchProjectData = () => {
    axios.get(`/projects/getProjectById/${project._id}`)
      .then((res) => {
        console.log("res.data", res.data);
        setProject(res.data);
        setFileTree(res.data.fileTree || {});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addCollaborators = () => {
    setLoading(true);
    axios.post('/projects/addUserToProject', {
      projectId: project._id,
      users: Array.from(selectedUserId)
    })
      .then((res) => {
        console.log(res);
        // Fetch the updated project data
        fetchProjectData();
        setSelectedUserId(new Set()); // Clear the selected users
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const send = () => {
    sendMessage('project-message', {
      message,
      sender: user
    });

    setMessages(prevMessages => [...prevMessages, { sender: user, message }]);
    setMessage('');
  };

  function SyntaxHighlightedCode(props) {
    const ref = useRef(null);

    React.useEffect(() => {
      if (ref.current && props.className?.includes('lang-') && window.hljs) {
        window.hljs.highlightElement(ref.current);

        // hljs won't reprocess the element unless this attribute is removed
        ref.current.removeAttribute('data-highlighted');
      }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
  }

  function AiMessage({ message }) {
    console.log("message from ai on code", message);
    const messageObject = JSON.parse(message); // Parsing the message
    if (!messageObject) {
      return null;
    }
    console.log("messageObject", messageObject.text);
    return (
      <div>
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    //calling web container->befor because we will need during axios request
    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
      });
    }

    //axios request for getting all users
    axios.get('/users/allUsers')
      .then(res => {
        setUsers(res.data.users);
      })
      .catch(error => {
        console.log(error);
      });

    // Connect to socket
    const socket = connectSocket(project._id);

    // Event listener for receiving messages
    socket.on('project-message', data => {
      console.log("data", data);

      if (data.sender._id === 'ai') {
        try {
          const rawMessage = data.message;
          console.log("rawMessage", rawMessage);
          const message = JSON.parse(rawMessage);
          console.log("message", message);

          // Validate the fileTree structure
          if (message.fileTree && typeof message.fileTree === 'object' && !Array.isArray(message.fileTree)) {
            console.log("Mounting fileTree:", message.fileTree);
            webContainer?.mount(message.fileTree);

            // Update the state with the new fileTree
            setFileTree(prevFileTree => ({
              ...prevFileTree,
              ...message.fileTree
            }));

            // Save the updated fileTree to the backend
            saveFileTree({
              ...fileTree,
              ...message.fileTree
            });
          } else {
            console.error("Invalid fileTree structure:", message.fileTree);
          }

          // Add the message to the messages list
          setMessages(prevMessages => [...prevMessages, data]);
        } catch (error) {
          console.error("Error parsing AI message:", error);
        }
      } else {
        setMessages(prevMessages => [...prevMessages, data]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [project._id, webContainer]); // Dependency array includes project._id and webContainer

  function saveFileTree(fileTree) {
    axios.put('/projects/updateFileTree', {
      projectId: project._id,
      fileTree
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleUserClick = (id) => {
    setSelectedUserId(prevSelectedUserId => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };

  const handleFileDelete = (fileName) => {
    const updatedFileTree = { ...fileTree };
    delete updatedFileTree[fileName];
    setFileTree(updatedFileTree);
    saveFileTree(updatedFileTree);
    if (currentFile === fileName) {
      setCurrentFile(null);
    }
    setOpenFiles(openFiles.filter(file => file !== fileName));
  };

  const renderUsersNotInProject = () => {
    const usersNotInProject = users.filter(user => !project.users.some(projUser => projUser._id === user._id));
    console.log("usersNotInProject", usersNotInProject);
    return (
      <div>
        {usersNotInProject.length === 0 ? (
          <div className="text-center text-gray-500">No other user is present to connect.</div>
        ) : (
          usersNotInProject.map(user => (
            <div key={user._id} className="flex items-center mb-2">
              <i className="ri-user-line mr-2"></i>
              <div><h3 className="text-lg">{user.email}</h3></div>
              <button
                className={`ml-auto px-3 py-1 rounded ${selectedUserId.has(user._id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                onClick={() => handleUserClick(user._id)}
              >
                {selectedUserId.has(user._id) ? 'Remove' : 'Add'}
              </button>
            </div>
          ))
        )}
        {usersNotInProject.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-fuchsia-900 text-white rounded hover:bg-fuchsia-700"
              onClick={addCollaborators}
              disabled={loading}
            >
              {loading ? <RingLoader size={24} color={"#ffffff"} /> : 'Add as Collaborators'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container flex h-screen space-x-0">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All Collaborators</h2>
              <i className="ri-close-line cursor-pointer" onClick={() => setIsModalOpen(false)}></i>
            </div>
            <div>
              {project.users && project.users.map(user => (
                <div key={user._id} className="flex items-center mb-2">
                  <i className="ri-user-line mr-2"></i>
                  <div><h3 className="text-lg">{user.email}</h3></div>
                </div>
              ))}
            </div>
            <h1 className="text-xl font-bold mt-4">Add other Collaborators</h1>
            {renderUsersNotInProject()}
          </div>
        </div>
      )}

      <div className="messageContainer w-1/3 bg-gray-200 p-4  shadow-md flex flex-col">
        <div className="flex justify-between  items-center mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <button className="px-4 py-2 bg-fuchsia-900 text-white rounded hover:bg-fuchsia-700" onClick={() => { setIsModalOpen(true); fetchProjectData(); }}>Add Collaborators +</button>
        </div>
        <div className='border border-gray-400 mb-1'></div>
        <div className="border p-4 h-full overflow-y-scroll flex-grow">
          {messages.map((msg, index) => (
            <div
            key={index}
            className={`mb-2 p-2 border rounded ${msg.sender._id === user._id ? 'ml-auto bg-fuchsia-800 text-white max-w-52' : 'mr-auto bg-gray-300 max-w-64'}`}
          >
            <strong>{msg.sender.email}:</strong>
            <div className={`messages ${msg.sender._id === 'ai' ? 'bg-black text-white p-1' : msg.sender._id === user._id ? 'bg-fuchsia-800 text-white' : 'bg-gray-300'}`}>
              {msg.sender._id === 'ai' ? <AiMessage message={msg.message} /> : msg.message}
            </div>
          </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="rounded-full border border-fuchsia-950  p-2 hover:border-fuchsia-900 flex-grow"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="px-4 py-2 text-white rounded-full bg-fuchsia-900 hover:bg-fuchsia-700 ml-2"
            onClick={send}
          >
            <i class="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>

      <div className="exploreBox w-1/6 bg-fuchsia-900 p-4  shadow-md">
        <h2 className="text-xl text-white font-bold">File Explorer</h2>
        <div className="fileTree  p-4 h-full overflow-y-scroll">
          {Object.keys(fileTree).map((key, index) => (
            <div key={index} className="flex items-center">
              <button 
                className="block text-left text-white w-full px-2 py-1 hover:bg-fuchsia-800 rounded-full"
                onClick={() => {
                  setCurrentFile(key);
                    setOpenFiles([...new Set([...openFiles, key])]);
                  }}
                  >
                  <p>{key}</p>
                  </button>
                  <button
                  className="ml-auto px-2 py-1  text-white  hover:bg-fuchsia-800 rounded-full"
                  onClick={() => handleFileDelete(key)}
                  >
                  <i className="ri-delete-bin-7-line"></i>
                  </button>
                </div>
                ))}
              </div>
              </div>

              <div className={`editorBox ${iframeUrl ? 'w-2/5' : 'w-3/5'} bg-fuchsia-900 p-4  shadow-md`}>
              <div className="flex flex-col h-full">
                <div className='full-header flex-col w-11/12 '>
                <h2 className="text-lg font-bold text-white">Code Editor</h2>
                <div className="editor-header flex my-2 space-x-2 mb-2">
                
                {openFiles.map((file, index) => (
                  <div key={index} className=" items-center space-x-1">
                  <button
                    className={`px-2 py-1 ${currentFile === file ? 'bg-fuchsia-300 text-white' : 'bg-fuchsia-800 text-white'} rounded`}
                    onClick={() => setCurrentFile(file)}
                  >
                    {file}
                    <button
                   className={`px-2 py-1 ${currentFile === file ? 'bg-fuchsia-300 text-white' : 'bg-fuchsia-800 text-white'} rounded hover:bg-fuchsia-700`}
                    onClick={() => {
                    setOpenFiles(openFiles.filter(f => f !== file));
                    if (currentFile === file) {
                      setCurrentFile(null);
                    }
                    }}
                  >
                    x
                  </button>
                  </button>
                 
                  </div>
                ))}
                <div className="ml-auto ">
                  <button
                  onClick={async () => {
                    try {
                    // Ensure the fileTree includes a package.json and index.js file
                    if (!fileTree['package.json']) {
                      throw new Error("The fileTree does not include a package.json file.");
                    }
                    if (!fileTree['index.js']) {
                      throw new Error("The fileTree does not include an index.js file.");
                    }

                    // Re-mount the fileTree to ensure it is updated
                    await webContainer.mount(fileTree);

                    // Start npm install
                    const installProcess = await webContainer.spawn("npm", ["install"]);

                    // Log npm install output
                    installProcess.output.pipeTo(
                      new WritableStream({
                      write(chunk) {
                        console.log("npm install output:", chunk);
                      },
                      })
                    );

                    // Log npm install error output
                    installProcess.stderr.pipeTo(
                      new WritableStream({
                      write(chunk) {
                        console.error("npm install error:", chunk);
                      },
                      })
                    );

                    // Wait for npm install to complete
                    const installExitCode = await installProcess.exit;
                    if (installExitCode !== 0) {
                      throw new Error(`npm install failed with exit code ${installExitCode}`);
                    }

                    console.log("npm install completed successfully.");

                    // Kill any existing run process
                    if (runProcess) {
                      runProcess.kill();
                    }

                    // Start the application
                    const tempRunProcess = await webContainer.spawn("npm", ["start"]);

                    // Log npm start output
                    tempRunProcess.output.pipeTo(
                      new WritableStream({
                      write(chunk) {
                        console.log("npm start output:", chunk);
                      },
                      })
                    );

                    // Log npm start error output
                    tempRunProcess.stderr.pipeTo(
                      new WritableStream({
                      write(chunk) {
                        console.error("npm start error:", chunk);
                      },
                      })
                    );

                    // Save the run process
                    setRunProcess(tempRunProcess);

                    // Handle server-ready event
                    webContainer.on("server-ready", (port, url) => {
                      console.log("Server is ready on port:", port, "URL:", url);
                      setIframeUrl(url);
                    });
                    } catch (error) {
                    console.error("Error during setup:", error);
                    setMessages((prevMessages) => [
                      ...prevMessages,
                      {
                      sender: { _id: "system", email: "system" },
                      message: `Error: ${error.message}`,
                      },
                    ]);
                    }
                  }}
                  className='pb-2 py-48 pt-1 mx-1 px-4 font-semibold  text-red-600 bg-white rounded-md text-xl hover:scale-125'
                  >
                  run
                  </button>
                </div>
                </div>
                </div>
                <div className=' border border-white h-0 w-11/12 rounded-lg'></div>
                
                <div className="code-editor bg-fuchsia-950 rounded-xl my-2 p-4 w-11/12 h-5/6 overflow-y-scroll">
                {currentFile && fileTree[currentFile] && (
                  <div>
                  <pre className="hljs h-full">
                    <code
                    className="hljs bg-fuchsia-950 h-full outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: {
                          file: {
                            contents: updatedContent
                          }
                        }
                      };
                      setFileTree(ft);
                      saveFileTree(ft);
                    }}
                    dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                    style={{
                      whiteSpace: 'pre-wrap',
                      paddingBottom: '25rem',
                      counterSet: 'line-numbering',
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      {iframeUrl && webContainer && (
        <div className="flex min-w-72 flex-col h-full">
          <div className="address-bar">
            <input
              type="text"
              onChange={(e) => setIframeUrl(e.target.value)}
              value={iframeUrl}
              className="w-full p-2 px-4 bg-fuchsia-200"
            />
          </div>
          <iframe src={iframeUrl} className="w-full h-full"></iframe>
        </div>
      )}
    </div>
  );
};

export default Project;