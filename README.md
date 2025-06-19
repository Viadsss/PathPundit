# Path Pundit: Analysis, Design and Application of a Branch and Bound Solution to the Travelling Salesman Problem (TSP)
A website that optimizes courier delivery routes using the Traveling Salesman Problem (TSP) with the Branch and Bound algorithm for efficient returns to the depot. Developed as a group project for the "Design and Analysis of Algorithms" course.

![PathPundit-1](https://github.com/user-attachments/assets/5c8363a2-528b-4219-a2fa-61427612aa05)
![PathPundit-2](https://github.com/user-attachments/assets/133b151d-b2f9-447c-9c75-3ecf8118d693)
![PathPundit-3](https://github.com/user-attachments/assets/10558aa9-7c56-4032-a39a-f95d8240c1ae)

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
