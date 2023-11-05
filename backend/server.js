import express from "express";
import process from "node:process";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Stocks from "./models/Stocks.js";
import User from "./models/Users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("port", PORT);

const mongoDB_connect = process.env.MONGODB_CONNECTION;

await connect(mongoDB_connect);

//middleware
app.use(bodyParser.json());
app.use(cors());

//middleware function
const authenticateToken = async (req, res, next) => {
  let token;

  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // retrieve token
      token = authorization.split(" ")[1];

      // verify token
      const verifyToken = jwt.verify(token, secretKey);

      // Get user from the token
      req.user = await User.findById(verifyToken.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        message: "Not Authorized",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      message: "No Token",
    });
  }
};

//admin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // allow access to the route
  } else {
    return res
      .status(403)
      .json({ message: "Access forbidden for non-admin users" });
    //deny access
  }
};

// ----------------STOCKS_ENDPOINT--------------------

//@desc create stocks
//@route POST /api/stocks
app.post("/api/stocks", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, price, category, quantity } = req.body;
    const stocks = await Stocks.create({
      name,
      price,
      category,
      quantity,
    });

    res.status(200).json({
      message: "Stocks created successfully",
      data: stocks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

//@desc update stocks
//@route PUT /api/stocks/:id
app.put("/api/stocks/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    //validate stocks (find stocks by id)
    const stocks = await Stocks.findById(req.params.id);

    if (!stocks) {
      return res.status(400).json({
        message: "Stocks not found",
      });
    }

    //validate user (find user by id)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //validate user role
    if (req.user.role !== "admin") {
      return res.status(401).json({
        message: "User Not Authorized",
      });
    }

    const updatedStock = await Stocks.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Stocks updated successfully",
      data: updatedStock,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

//@desc GET stocks
//@route GET /api/stocks/
app.get("/api/stocks", authenticateToken, async (req, res) => {
  try {
    const stocks = await Stocks.find();

    res.status(200).json({
      data: stocks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

//@desc DELETE stocks
//@route DELETE /api/stocks/:id
app.delete("/api/stocks/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const stocks = await Stocks.findById(req.params.id);

    if (!stocks) {
      return res.status(400).json({
        message: "Item not found",
      });
    }

    const user = await User.findById(req.user.id);

    //check user
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    //validate user role
    if (req.user.role !== "admin") {
      return res.status(401).json({
        message: "User Not Authorized",
      });
    }

    await stocks.deleteOne({
      _id: req.params.id,
    });

    return res.status(200).json({
      message: "Stocks deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

// --------------USER ENDPOINT-----------------

//Generate JWT
const secretKey = "sample123";

const generateToken = (id) => {
  return jwt.sign({ id }, secretKey, {
    expiresIn: "30d",
  });
};

// @desc    Create New User
// @route   POST /api/users
app.post("/api/users", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      res.status(400).json({
        message: "Please add all fields",
      });
    }

    //user validation (if user exists)
    const isUserExist = await User.findOne({ username });

    //throw error if user exist
    if (isUserExist) {
      res.status(400).json({
        message: "Username already exist",
      });
    }

    //hash password
    const hashPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, hashPassword);

    //create user
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    //validate user
    if (user) {
      res.status(201).json({
        message: "User successfully created",
        _id: user.id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

// @desc    Authenticate User / Login User
// @route   POST /api/users/login
app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //check user's username
    const user = await User.findOne({ username });

    //validate if user exist
    if (!user) {
      return res.status(400).json({
        message: "Username do not exist",
      });
    }

    //validate user and compare if hashed password and text password matched
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    res.json({
      message: `Hello ${user.username}`,
      _id: user.id,
      name: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

app.get("/api/users/me", authenticateToken, async (req, res) => {
  try {
    const { _id, name } = await User.findById(req.user.id);

    res.status(200).json({
      id: _id,
      name,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
