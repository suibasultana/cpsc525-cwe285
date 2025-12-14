# CWE-285 : Improper Authorization
----------------------------------

A deliberately vulnerable application demonstrating CWE-285 (Improper Authorization). It includes 
1. Insecure implementation
2. An example of the vulnerability being exploited
3. Description of how the vulnerability is fixed


## Overview
-----------

This project shows Improper Authorization (CWE-285) within a web-based messaging application.
The app enables users to use personal messages and authenticate them. 
But when authentication is applied, authorization checks are not present. 
This allows the attacker to gain access to the resources that are owned by other users.
The vulnerability is exploited by manipulating request parameters and accessing the data without proper checks. 
This is accompanied by an exploit script that shows the practicality of the unauthorized access. 
An explanation of the secure fix conceptually is also presented.



## Technologies used
-----------------


1. Frontend

	- React.js for building a component-based user interface
	- CSS for styling, and basic responsiveness

2. Backend

	- Node.js with the Express framework (express-session)
	- JavaScript for implementing the server side logic
	- RESTful API architecture for client-server communication

3. Others

	- In-memory database (for demonstration purposes)

4. Development Environment
	
	- This project was developed and tested in a Linux environment.
	- Node.js (JavaScript runtime)
	- npm (Node Package Manager)
	- No additional external services are required.



## Running the Vulnerable Application


1. Clone the repository using 
	git clone <REPOSITORY URL>

2. Installing the backend dependencies
	npm install
	
	[npm install cors - optional]

3. Starting the backend server (Port 4000)
	node server.js
   	
	[ Note: It will show a message: http://localhost:4000]

4. Starting the frontend application (Port 3000)
	
	- Open a second terminal window

	- Navigate to frontend directory
		cd frontend

	- Installing the frontend dependencies
		npm install

	- Start the React application
		npm start
   	
	[ Note: The frontend will be available at this URL: http://localhost:3000
		This application contains the deliberate flaw in authorization.
	      	The vulnerability can be exploited using the provided attack code in the file attack/exploit_messages.js]



## Running the Exploit script
 
1. Firstly, ensure that the vulnerable application is running:

	- Terminal 1: Backend server running on http://localhost:4000

	- Terminal 2: Frontend application running on http://localhost:3000


2. Open a third terminal window (do not stop the frontend or backend).

3. Navigate to the exploit directory
	 cd attack

4. Install exploit dependencies (optional)
	npm install axios
	
5. Run the exploit script
	node exploit.js



## Description of how the vulnerability is fixed

Adding SECURE ROUTES: These use proper checks and are used to demonstrate the fixed version. Putting them BEFORE the vulnerable /:id route (in file messages.js) so /secure/... will still work.

	// Secure version: View a single message with Auth + Ownership check.
	router.get("/secure/:id", messages.viewMessageSecure);

	// Secure version: Handle actions (edit/delete/flag/forward/inbox) securely.
	router.post("/secure/action", messages.handleActionSecure);



NOTE: npm install cors and npm install axois were required at the beginning for one of our team members.
      Fewer files in frontend that have built-in code along with documentation (not written by the team).


----------------------------------------------------------------------------------