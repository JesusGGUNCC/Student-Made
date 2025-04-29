Visual Studio Code settings: (Optional)
----------------------------
File -> Preferences -> Click settings.json icon 
Add the following:
"files.exclude": {
    "**/__pycache__": true,
    "**/migrations": true,
    "**/__init__.py": true
}

Note:
----------
The following steps for frontend install & testing in local machine.
The backend instlall & testing insturctions available in readme.txt under backend folder.

STEP 1:
-------------
Install backend install. See the readme.txt in backend folder. If you plan to test front end with mock data, 
then do not need to install backend and make sure you set the VITE_USE_MOCK=true in .env file under the root folder.

STEP 2:
-------------
Open command prompt

STEP3:
-------------
Navigate to root directory.
Run the following command:
npm install

STEP 4:
-------------
npm run dev

STEP 5:
-------------
Test the following URL in the browser: 
http://localhost:5173/
http://localhost:5173/products
