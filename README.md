## Vulnerability Demonstrated

- CWE ID: CWE-285 – Improper Authorization
- Description: The application allows authenticated users to access resources
  (messages) that they do not own by directly modifying resource identifiers
  in the URL.

## Tech Stack

Frontend:
- React
- CSS

Backend:
- Node.js
- Express
- express-session

Other:
- In-memory database (for demonstration purposes)

## How to Run the Project

### Backend
```bash
cd cpsc525-cwe285
npm install
node server.js
