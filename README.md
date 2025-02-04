# Path Pundit: Analysis, Design and Application of a Branch and Bound Solution to the Travelling Salesman Problem (TSP)

## Group Members
- Alano, Ruzel Luigi
- Dellava, Joanna
- Panela, Alexandra Princess
- Viado, John Paul

## Installation steps:
### 1. Pre-requiste install programs
Make sure to you have or already installed **Git**, **NodeJS**, and **MYSQL** in your device

### 2. Installation Steps
- `git clone https://github.com/Viadsss/PathPundit.git`
- `cd PathPundit`

### 3. Configuring Database
Create a database schema in database using the `schema.sql` inside the `/database` directory'

### 4. Add your .env file
Create a `.env` file inside the `/frontend` directory and put your API key inside it following this format:
- `VITE_GRASSHOPPER_API_KEY={YOUR API KEY}`
> Create an account and get your Grasshopper API Key here: https://www.graphhopper.com/

### 5. Running the program
Inside the `/PathPundit` directory, do these two following steps:
- `cd backend && npm run server`
- `cd frontend && npm run dev`
> Make sure you are on the `/PathPundit` directory first before doing the 2nd step
