const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Data base connection
await mongoose.connect(process.env.DATABASE_URL);
