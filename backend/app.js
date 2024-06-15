import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import {
  createUser,
  getUser,
  getUserData,
  updateRouteData,
} from "./database.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    const { username, name, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 13);

    await createUser(username, name, hashPassword);
    const user = await getUser(username);
    res.send(user);
  } catch (err) {
    console.error("Username is already taken.", err);
    res.status(500).send("Username is already taken.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await getUser(username);
    if (!user) return res.status(401).send("Wrong credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Wrong credentials");

    res.send(user);
  } catch (err) {
    console.error("Error logging in as user", err);
    res.status(500).send("Failed to login as user");
  }
});

app.put("/routes/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const newData = req.body;

    let existingUserData = await getUserData(username);

    if (!existingUserData || !existingUserData.data) {
      existingUserData = { data: [] };
    } else {
      existingUserData.data = JSON.parse(existingUserData.data);
    }

    existingUserData.data.push(newData);

    await updateRouteData(username, existingUserData.data);

    const newUserData = await getUser(username);
    res.send(newUserData);
  } catch (err) {
    console.error("Failed to save the route", err);
    res.status(500).send("Failed to save the route");
  }
});

app.delete("/routes/:username/:index", async (req, res) => {
  try {
    const username = req.params.username;
    const index = parseInt(req.params.index);

    let existingUserData = await getUserData(username);

    if (!existingUserData || !existingUserData.data) {
      existingUserData = { data: [] };
    } else {
      existingUserData.data = JSON.parse(existingUserData.data);
    }

    existingUserData.data.splice(index, 1);

    await updateRouteData(username, existingUserData.data);

    const newUserData = await getUser(username);
    res.send(newUserData);
  } catch (err) {
    console.error("Failed to delete route the route", err);
    res.status(500).send("Failed to delete the route");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
