const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const projectRoutes = require("./modules/projects/project.routes");


const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors());

// Request body parser
app.use(express.json());

// URL encoded parser
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan("dev"));

// for log the request
app.use(requestLogger);

// Health check route

app.use("/api/v1", require("./routes/apiRoutes"));

app.use("/api/v1/projects", projectRoutes);




app.use(notFound);

app.use(errorHandler);

module.exports = app;