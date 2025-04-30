Note:
----------
The following steps for backend install & testing in local machine.
The frontend instlall & testing insturctions available in readme.txt under root folder.

STEP 1:
-------------
Open command prompt

STEP 2:
-------------
Navigate to backend directory

STEP3:
-------------
Run the following command:
pip install flask flask_sqlalchemy flask_cors python-dotenv bcrypt

STEP 4:
-------------
Run the following command:
pip install psycopg2-binary

STEP 5:
-------------
Run the following command:
python run.py
~~~~~~~~~~~
Result should be something like this:
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 136-763-458
~~~~~~~~~~~

STEP 6:
----------
a) Install Postman
b) Open Postman
c) Import Postman collection from postman folder
e) Test end points from Postman 
Ex: http://localhost:5000/api/product/list
or
http://ec2-54-235-32-197.compute-1.amazonaws.com/api/product/list
if no products exist, then, try invoke first http://localhost:5000/api/product/add-products
and then invoke http://localhost:5000/api/product/list