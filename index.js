'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    },
    {
        method: 'GET',
        path: '/users',
        handler: (request, h) => {
            return h.redirect('/');
        }
    },
    {
        method: 'GET',
        path: '/{any*}',
        handler: (request, h) => {
            return `<h1>404</h1>`
        }
    } 
], 
);

 


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
    console.log('Server running on %s', server.info.uri);
};



process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

