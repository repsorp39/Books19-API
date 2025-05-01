const express           = require("express");
const helmet            = require("helmet");
const path              = require("path")
const cors              = require("cors");
const cookieParser      = require("cookie-parser");
const swaggerUi         = require('swagger-ui-express');
const swaggerJSDoc      = require('swagger-jsdoc');
const { createServer }  = require("http");
const morgan            = require("morgan");

const { errorHandler } = require("./middlewares/error-handler");
const rateLimiter = require("./config/rate-limiter");

const app = express();



app.use(morgan("dev"));

app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended:true}));

app.use(cors());
app.use(helmet());
app.use(cookieParser());


//swagger definitions
const docPaths = path.join(__dirname, "routes", "**" ,"*.js");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Books19 API',
            version: '1.0.0',
            description: 'Books19 API documentation using Swagger',
        },
        servers: [
            {
                url: "/api/v1"
            },
        ],
    components: {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT', 
        },
    },
},
    },
    apis: [docPaths], // Path to the API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//serving statics files
app.use("/", express.static(path.join(__dirname,"public")));

//custom middlewares

//routes
app.use("/api/v1/auth",require("./routes/auth.route"));
app.use("/api/v1/books",require("./routes/books.route"));
//error handling
app.use(errorHandler);


module.exports = createServer(app);