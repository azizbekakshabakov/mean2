var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const atlasCreds = require('./atlasCreds');

const { ApolloServer, gql } = require('apollo-server-express');
const {cities} = require('./cities/cities');
const axios = require('axios');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

async function startApolloServer() {
var app = express();
const cors = require('cors');

const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://adminUser:${encodeURIComponent(atlasCreds.password)}@atlascluster.zhkoeux.mongodb.net/?retryWrites=true&w=majority`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/', indexRouter);
app.use('/auth/', authRouter);
///////////////////////////////////////////////
// Define your GraphQL schema using the GraphQL schema language
const typeDefs = gql`
  type Weather {
    generationtime_ms: String!,
    timezone: String!,
    daily: DailyWeather
  }

  type DailyWeather {
    time: [String!],
    weathercode: [String!],
    temperature_2m_max: [String!],
    temperature_2m_min: [String!],
    rain_sum: [String!],
    snowfall_sum: [String!],
    windspeed_10m_max: [String!],
  }

  type Query {
    getWeather(name: String!): Weather
  }
`;

// Define resolver functions
const resolvers = {
  Query: {
    getWeather: (_, {name}) => {
      return new Promise((resolve, reject) => {
        let latitude;
        let longitude;
        cities.forEach(element => {
          if (element['name'] == name) {
            latitude = element['latitude'].toFixed(4);
            longitude = element['longitude'].toFixed(4);
          }
        });
      
        axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum,windspeed_10m_max&forecast_days=8&timezone=auto`)
        .then(response => {
          console.log(response.data);
          // res.status(200).send({ data: response.data });
          // return response.data;
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          reject(error);
        });
      });
    }
  }
};

// Create an ApolloServer instance
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app });
///////////////////////////////////////////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen({port: 3000});
}

startApolloServer();

// module.exports = app;
