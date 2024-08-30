# Thaii

Thaii (Tool to analyze Human-AI-Interaction) is designed to provide users with insights into their AI usage for self-learning purposes. This research project aims to help users reflect on their interaction with conversational agents by tracking their usage and regulating their learning process. By offering these insights, Thaii seeks to reduce users' overdependency on conversational agents during their learning activities.

## Main Features
- **Chatbot**: Utilize OpenAI's LLM to power a chatbot for active communication within the platform, allowing users to create, edit, label, and delete chats.
- **Pages**:  Users can create, edit, and delete pages, assigning chats to organize them according to their needs. Pages enable personalization and structuring of chats, with tagging options for semantic connections.
- **Insights**: Users can analyze their chatbot interactions, filtering insights by pages, labels, and tags for a detailed view of their usage, aiding in monitoring and regulating their learning process.
- **User Management**: Admins can manage users and authorize email addresses eligible for registration in the system.

## Prequesites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- pip
- virtualenv
- [Docker](https://docs.docker.com/get-docker/) (version 20.x or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29.x or later)

## Client Setup (React + Vite)

1. Clone the respository

```bash
https://github.com/ls1intum/Thaii.git
cd thaii
```
2. Navigate to client directory
```bash
cd client
```
3. Install dependencies:
```bash
npm install
```
4. Start the development server:
```bash
npm run dev
```
The client development server should now be running at `http://localhost:5173`.

## Server Setup (Django)

1. Navigate to the server directory:
```bash
cd ../server
```
2. Create a virtual environment:
```bash
virtualenv venv
```
3. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```
4. Install dependencies:
```bash
pip install -r requirements.txt
```
5. Run database migrations:
```bash
python manage.py migrate
```
6. Create a superuser:
```bash
python manage.py createsuperuser
```
- Follow the prompts to set up your superuser account.
- Superusers can log in to the system without being whitlisted first. 
- Superusers can access the admin panel at `http://localhost:8000/api/admin` and manage the stored data.

7. Start the development server:
```bash
python manage.py runserver
```

The server development server should now be running at `http://localhost:8000`.

## Environment Variables
Ensure you have the necessary environment variables set up for both the frontend and backend. You can create a `.env` file in the root of each directory and add the required variables.

### Client `.env` Example
```plaintext
VITE_API_URL=http://localhost:8000/
VITE_ENABLE_TRACKING=true/false 
```
- `VITE_ENABLE_TRACKING`: Enables or disables tracking of user interactions with the webapplication. 

### Server `.env` Example
```plaintext
OPENAI_API_KEY=your_open_ai_key
DEBUG=True
SECRET_KEY=your_secret_key
POSTGRES_DB=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=your_db_host
EMAIL_USE_TLS=True  
EMAIL_HOST=your_email_host  
EMAIL_HOST_USER=your_email_host_user
EMAIL_HOST_PASSWORD=your_email_host_user_password 
DEFAULT_FROM_EMAIL=your_default_email_host
EMAIL_PORT=587    
DJANGO_SUPERUSER_USERNAME=your_django_superuser
DJANGO_SUPERUSER_PASSWORD=your_django_superuser_password
DJANGO_SUPERUSER_EMAIL=your_django_superuser_email
```
- `OPENAI_API_KEY`: Key for an OpenAI project to leverage the OpenAI API
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`: Variables to setup and connect to a PostgreSQL database used to store the data created. The POSTGRES_HOST name is 'localhost' for the local development and 'db' when using docker to run it locally or for deloyment
- `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`: Email configurations to send activation emails for the register flow of users
- `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_PASSWORD`, `DJANGO_SUPERUSER_EMAIL`: Only important for the productive environment. When deployed a superuser with these credentials is created if it does not exist already.

## Running Application with Docker
When you only want to run the application locally without setting up the client and server you can use Docker. 

1. Prerequisites:
- Make sure you installed and run Docker on your local machine
- Make sure you created an .env file with the variables above for the server in the root directory

2. Build and run the containers:
To build the Docker images and start the services defined in the Docker Compose file, run the following command:
```bash
docker-compose -f compose.dev.yml up --build
```

3. Access the web application:
Once the containers are up and running, you can access the web application in your browser at:
```bash
http://localhost:80
```

4. Stopping the containers:
To stop the running containers, press Ctrl + C in the terminal where Docker Compose is running, or run:
```bash
docker-compose -f compose.dev.yml down
```

## Running Application
With both the client and server running, you should be able to access the web application at http://localhost:5173.

## Additional Information
- **Client Build:** To create a production build of the frontend, run:
```bash
npm run build
```
- **Server Management:** You can use standard Django management commands for additional backend tasks.
- **Data Management:** You can access the data using the admin panel at `http://localhost:8000/api/admin` with your superuser account or connect to the local database with pgAdmin.

## License

[MIT](https://choosealicense.com/licenses/mit/)
