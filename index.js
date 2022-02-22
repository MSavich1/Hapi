"use strict";

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Joi = require("@hapi/joi");
const path = require("path");
const Qs = require("qs");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "static"),
      },
    },
    query: {
      parser: (query) => Qs.parse(query),
    },
  });

  await server.register([
    {
      plugin: require("hapi-geo-locate"),
      options: {
        enabledByDefault: true,
      },
    },
    {
      plugin: Inert,
    },
    {
      plugin: Vision,
    },
  ]);

  server.views({
    engines: {
      hbs: require("handlebars"),
    },
    path: path.join(__dirname, "views"),
    layout: "default",
  });

  server.route([
    {
      method: "GET",
      path: "/",
      handler: (request, h) => {
        // return request.query;
        return h.file("welcome.html");
      },
    },
    {
      method: "GET",
      path: "/dynamic",
      handler: (request, h) => {
        const data = {
          name: "MSavich",
        };
        return h.view("index", data);
      },
    },
    {
      method: "POST",
      path: "/login",
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            username: Joi.string().min(1).max(15),
            password: Joi.string().min(7),
          }),
        },
      },
      handler: (request, h) => {
        const payload = request.payload;
        return h.view("index", { username: request.payload.username });
      },
    },
    {
      method: "GET",
      path: "/download",
      handler: (request, h) => {
        return h.file("welcome.html", {
          mode: "inline",
          filename: "welcome-dowload.html",
        });
      },
    },
    {
      method: "GET",
      path: "/location",
      handler: (request, h) => {
        if (request.location) {
          return h.view("location", { location: request.location.ip });
        } else {
          return h.view("location", {
            location: "Your location is not enabled.",
          });
        }
      },
    },
    {
      method: "GET",
      path: "/users",
      handler: (request, h) => {
        return "<h1>USERS PAGE</h1>";
      },
    },
    {
      method: "GET",
      path: "/hello/{user*2}",
      handler: function (request, h) {
        const userParts = request.params.user.split("/");

        return `Hello ${userParts[0]} ${userParts[1]}!`;
      },
    },
    {
      method: "GET",
      path: "/{any*}",
      handler: (request, h) => {
        return `<h1>404</h1>`;
      },
    },
  ]);

  // server.route({
  //     method: 'GET',
  //     path: '/users/{user?}',
  //     handler: function (request, h) {

  //         if(request.params.soccer){
  //             return `Hello ${request.params.user}`
  //         }else{
  //             return 'Hello Stranger!'
  //         }
  //     }
  // });

  //  server.route({
  //     method: 'GET',
  //     path: '/users/{user?}',
  //     handler: function (request, h) {

  //        return `<h1>${request.query.name} ${request.query.age}</h1>`
  //     }
  // });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
