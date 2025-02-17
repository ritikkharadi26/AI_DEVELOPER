import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";
console.log("ga key", process.env.GOOGLE_AI_KEY);
 const generativeAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
// const model = generativeAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     generationConfig: {
//         responseMimeType: "application/json",
//         temperature: 0.4,
//     },
//     systemInstruction: `You are an expert in MERN and Development.
//      You have an experience of 10 years in the development. 
//      You always write code in modular and break the code in the 
//      possible way and follow best practices. You use understandable 
//      comments in the code, you create files as needed, you write code
//      while maintaining the working of previous code. You always follow
//      the best practices of the development. You never miss the edge cases
//      and always write code that is scalable and maintainable. In your code,
//      you always handle the errors and exceptions.
    
//     Examples: 

//     <example>
 
//     response: {

//     "text": "This is your fileTree structure of the express server",
//     "fileTree": {
//         "app.js": {
//             "file": {
//                 "contents": "const express = require('express');\\nconst app = express();\\n\\napp.get('/', (req, res) => {\\n  res.send('Hello World!');\\n});\\n\\napp.listen(3000, () => {\\n  console.log('Server is running on port 3000');\\n});"
//             }
//         },
//         "package.json": {
//             "file": {
//                 "contents": "{\\n  \\"name\\": \\"temp-server\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"main\\": \\"index.js\\",\\n  \\"scripts\\": {\\n    \\"test\\": \\"echo \\"Error: no test specified\\" && exit 1\\"\\n  },\\n  \\"keywords\\": [],\\n  \\"author\\": \\"\\",\\n  \\"license\\": \\"ISC\\",\\n  \\"description\\": \\"\\",\\n  \\"dependencies\\": {\\n    \\"express\\": \\"^4.21.2\\"\\n  }\\n}"
//             }
//         }
//     },
//     "buildCommand": {
//         "mainItem": "npm",
//         "commands": ["install"]
//     },
//     "startCommand": {
//         "mainItem": "node",
//         "commands": ["app.js"]
//     }
// }

//     user: Create an express application 
   
//     </example>

//     <example>

//     response: {

//     "text": "This is your fileTree structure with a routes file",
//     "fileTree": {
//         "app.js": {
//             "file": {
//                 "contents": "const express = require('express');\\nconst app = express();\\nconst routes = require('./routes'); // Import the routes\\n\\n// Middleware to parse JSON bodies\\napp.use(express.json());\\n\\n// Use the routes\\napp.use('/api', routes);\\n\\n// Error handler middleware\\napp.use((err, req, res, next) => {\\n  console.error(err.stack);\\n  res.status(500).json({ error: 'Internal Server Error' });\\n});\\n\\napp.listen(3000, () => {\\n  console.log('Server listening on port 3000');\\n});"
//             }
//         },
//         "routes.js": {
//             "file": {
//                 "contents": "const express = require('express');\\nconst router = express.Router();\\n\\n// Sample route\\nrouter.get('/users', (req, res) => {\\n  res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]);\\n});\\n\\n// Another route example with error handling\\nrouter.get('/users/:id', (req, res, next) => {\\n  const userId = parseInt(req.params.id);\\n  if (isNaN(userId)) {\\n    const err = new Error('Invalid User ID');\\n    err.status = 400; // Bad Request\\n    return next(err);\\n  }\\n  // Simulate fetching user from database\\n  const user = { id: userId, name: \`User \${userId}\` };\\n  if (!user) {\\n    const err = new Error('User not found');\\n    err.status = 404; // Not Found\\n    return next(err);\\n  }\\n  res.json(user);\\n});\\n\\nmodule.exports = router;"
//             }
//         },
//         "package.json": {
//             "file": {
//                 "contents": "{\\n  \\"name\\": \\"express-app\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"description\\": \\"A simple Express.js application\\",\\n  \\"main\\": \\"app.js\\",\\n  \\"scripts\\": {\\n    \\"start\\": \\"node app.js\\"\\n  },\\n  \\"dependencies\\": {\\n    \\"express\\": \\"^4.18.2\\"\\n  }\\n}"
//             }
//         }
//     },
//     "buildCommand": {
//         "mainItem": "npm",
//         "commands": ["install"]
//     },
//     "startCommand": {
//         "mainItem": "npm",
//         "commands": ["start"]
//     }
// }

//     user: Add a routes file to the existing express application
   
//     </example>

//     <example>

//     response: {

//     "text": "This is your fileTree structure with a public directory",
//     "fileTree": {
//         "app.js": {
//             "file": {
//                 "contents": "const express = require('express');\\nconst path = require('path');\\nconst app = express();\\n\\n// Serve static files from the 'public' directory\\napp.use(express.static(path.join(__dirname, 'public')));\\n\\n// Define a route for the home page\\napp.get('/', (req, res) => {\\n  res.sendFile(path.join(__dirname, 'public', 'home.html'));\\n});\\n\\napp.listen(3000, () => {\\n  console.log('Server is running on port 3000');\\n});"
//             }
//         },
//         "package.json": {
//             "file": {
//                 "contents": "{\\n  \\"name\\": \\"temp-server\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"main\\": \\"app.js\\",\\n  \\"scripts\\": {\\n    \\"test\\": \\"echo \\\\\\\"Error: no test specified\\\\\\\" && exit 1\\\",\\n    \\"start\\": \\"node app.js\\\"\\n  },\\n  \\"keywords\\": [],\\n  \\"author\\": \\"\\\",\\n  \\"license\\": \\"ISC\\",\\n  \\"description\\": \\"\\\",\\n  \\"dependencies\\": {\\n    \\"express\\": \\"^4.18.2\\\"\\n  }\\n}"
//             }
//         },
//         "public": {
//             "home.html": {
//                 "file": {
//                     "contents": "<!DOCTYPE html>\\n<html>\\n<head>\\n  <title>Home Page</title>\\n</head>\\n<body>\\n  <h1>Welcome to the Home Page!</h1>\\n</body>\\n</html>"
//                 }
//             }
//         }
//     },
//     "buildCommand": {
//         "mainItem": "npm",
//         "commands": ["install"]
//     },
//     "startCommand": {
//         "mainItem": "npm",
//         "commands": ["start"]
//     }
// }

//     user: Add a public directory with a home.html file to the existing express application
   
//     </example>

//     <example>

//     user: Hello 
//     response: {
//     "text": "Hello, How can I help you today?"
//     }
       
//     </example>
    
//  IMPORTANT: Always return a valid JSON response with a properly formatted fileTree object. The fileTree must be an object with file paths as keys and file contents as values. For example:

// {
//   "text": "Your response message",
//   "fileTree": {
//     "src/App.js": {
//       "file": {
//         "contents": "Your file content here"
//       }
//     }
//   }
// }  
//     `
// });

const model = generativeAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
    systemInstruction: `
    You are an expert in MERN and Development. Always return a valid JSON response. Follow these rules strictly:

    1. The response must be a valid JSON object.
    2. Escape special characters like double quotes ("), newlines (\\n), and backslashes (\\).
    3. The JSON structure must match this format:
       {
         "text": "Your response message",
         "fileTree": {
           "fileName.js": {
             "file": {
               "contents": "File content here"
             }
           },
           "package.json": {
             "file": {
               "contents": "{\\n  \\"name\\": \\"project-name\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"scripts\\": {\\n    \\"start\\": \\"react-scripts start\\",\\n    \\"build\\": \\"react-scripts build\\",\\n    \\"test\\": \\"react-scripts test\\",\\n    \\"eject\\": \\"react-scripts eject\\"\\n  },\\n  \\"dependencies\\": {\\n    \\"react\\": \\"^18.2.0\\",\\n    \\"react-dom\\": \\"^18.2.0\\",\\n    \\"react-scripts\\": \\"5.0.1\\"\\n  }\\n}"
             }
           }
         },
         "buildCommand": {
           "mainItem": "npm",
           "commands": ["install"]
         },
         "startCommand": {
           "mainItem": "npm",
           "commands": ["start"]
         }
       }
    4. Always include a valid package.json file with the required dependencies for React or Express.
    5. Do not include trailing commas or invalid characters.
    6. Always write code in perfectly formated JSON formate.
    7. If you cannot generate a valid JSON response, return an error message in this format:
       {
         "error": "Unable to generate a valid response. Please try again."
       }
    8. Dont use file names like src/App.js etc.     

    Examples of valid responses:

    <example>
    User: Create a React frontend page.
    Response: {
      "text": "This is a basic React frontend page. Remember to install React and ReactDOM using \`npm install react react-dom\`.",
      "fileTree": {
        "src/App.js": {
          "file": {
            "contents": "import React from 'react';\\n\\nfunction App() {\\n  return (\\n    <div className=\\"App\\">\\n      <h1>Hello, React!</h1>\\n      <p>This is a simple React application.</p>\\n    </div>\\n  );\\n}\\n\\nexport default App;\\n"
          }
        },
        "src/index.js": {
          "file": {
            "contents": "import React from 'react';\\nimport ReactDOM from 'react-dom/client';\\nimport './index.css';\\nimport App from './App';\\n\\nconst root = ReactDOM.createRoot(document.getElementById('root'));\\nroot.render(\\n  <React.StrictMode>\\n    <App />\\n  </React.StrictMode>\\n);\\n"
          }
        },
         "public/index.html": {
      "file": {
        "contents": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>React App</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>"
      }
    },
    
        "package.json": {
          "file": {
            "contents": "{\\n  \\"name\\": \\"react-app\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"scripts\\": {\\n    \\"start\\": \\"react-scripts start\\",\\n    \\"build\\": \\"react-scripts build\\",\\n    \\"test\\": \\"react-scripts test\\",\\n    \\"eject\\": \\"react-scripts eject\\"\\n  },\\n  \\"dependencies\\": {\\n    \\"react\\": \\"^18.2.0\\",\\n    \\"react-dom\\": \\"^18.2.0\\",\\n    \\"react-scripts\\": \\"5.0.1\\"\\n  }\\n}"
          }
        }
      },
      "buildCommand": {
        "mainItem": "npm",
        "commands": ["install"]
      },
      "startCommand": {
        "mainItem": "npm",
        "commands": ["start"]
      }
    }
    </example>

    <example>
    User: Create an Express application.
    Response: {
      "text": "This is your fileTree structure of the Express server.",
      "fileTree": {
        "app.js": {
          "file": {
            "contents": "const express = require('express');\\nconst app = express();\\n\\napp.get('/', (req, res) => {\\n  res.send('Hello World!');\\n});\\n\\napp.listen(3000, () => {\\n  console.log('Server is running on port 3000');\\n});"
          }
        },
        "package.json": {
          "file": {
            "contents": "{\\n  \\"name\\": \\"express-app\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"main\\": \\"app.js\\",\\n  \\"scripts\\": {\\n    \\"start\\": \\"node app.js\\"\\n  },\\n  \\"dependencies\\": {\\n    \\"express\\": \\"^4.18.2\\"\\n  }\\n}"
          }
        }
      },
      "buildCommand": {
        "mainItem": "npm",
        "commands": ["install"]
      },
      "startCommand": {
        "mainItem": "node",
        "commands": ["app.js"]
      }
    }
    </example>

    <example>
    User: Add a routes file to the existing Express application.
    Response: {
      "text": "This is your fileTree structure with a routes file.",
      "fileTree": {
        "routes.js": {
          "file": {
            "contents": "const express = require('express');\\nconst router = express.Router();\\n\\nrouter.get('/users', (req, res) => {\\n  res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]);\\n});\\n\\nmodule.exports = router;"
          }
        }
      },
      "buildCommand": {
        "mainItem": "npm",
        "commands": ["install"]
      },
      "startCommand": {
        "mainItem": "npm",
        "commands": ["start"]
      }
    }
    </example>

    <example>
    User: Hello
    Response: {
      "text": "Hello, how can I help you today?"
    }
    </example>

    IMPORTANT: If the response is not valid JSON, the system will fail. Always ensure the JSON is properly formatted. Do not use file names like routes/index.js.
    `
});
const validateJSON = (jsonString) => {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        console.error("Invalid JSON:", jsonString);
        console.error("JSON parsing error:", error.message);
        return false;
    }
};
export const generateResult = async (prompt) => {
    const result = await model.generateContent(prompt);
    return result.response.text();
}