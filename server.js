const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expresgql = require('express-graphql');
const db = require('./db');

const mysql = require('mysql');
const myDB = mysql.createPool({
    host: 'remotemysql.com',
    user: 'vz6dBfVkAS',
    password: 'yuhsAfSmBB',
    database: 'vz6dBfVkAS',
    port: '3306'
});

const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull
} = require('graphql');

const port = process.env.PORT || 9000;
const app = express();

const fs = require('fs');
//const typeDefs = fs.readFileSync('./schema.graphql', { encoding: 'utf-8' });
//const resolvers = require('./resolvers');

//const { makeExecutableSchema } = require('graphql-tools');
//const schema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });

app.use(cors(), bodyParser.json());

const allusers = [
    {
        _id: 1,
        username: 'A',
        email: 'A@gmail.com',
        password: '12345',
        phone_no: '0304',
        profession: '',
        picture_url: '',
        created_at: '1518'
    },
    {
        _id: 2,
        username: 'B',
        email: 'C@gmail.com',
        password: '12345',
        phone_no: '0304',
        profession: '',
        picture_url: '',
        created_at: '1518'
    },
    {
        _id: 3,
        username: 'C',
        email: 'C@gmail.com',
        password: '12345',
        phone_no: '0304',
        profession: '',
        picture_url: '',
        created_at: '1518'
    },

]

// video link
const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        _id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        profession: { type: GraphQLString },
        picture_url: { type: GraphQLString },
        created_at: { type: GraphQLString }
    }
});

const schema2 = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            users: {
                type: GraphQLList(UserType),
                resolve: async (root, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        const sql = `SELECT * FROM users_tbl`; 
                        console.log(sql);
                        myDB.query(sql , function (err, result, fields) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    });
                }
            },
            user: {
                type: UserType,
                args: {
                    _id: { type: GraphQLNonNull(GraphQLID) }
                },
                resolve: async (root, args, context, info) => {
                    console.log(args._id);
                    return new Promise((resolve, reject) => {
                        const sql = `SELECT * FROM users_tbl WHERE _id = ${args._id}`;
                        console.log(sql);
                        myDB.query(sql , function (err, result, fields) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                console.log(result);
                                resolve(result);
                            }
                        });
                    });
                //    return allusers.find(user => user._id == args.id)
                }
            }
        }
    })
})
app.use("/graphql/users", expresgql({
    schema: schema2,
    graphiql: true
}));
/*
const {graphiqlExpress, graphqlExpress} = require('apollo-server-express')
app.use('/graphql', graphqlExpress({schema}))
app.use('/graphql', graphiqlExpress({endpointURL: '/graphql'}))


const { ApolloServer } = require('apollo-server-express');
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers,
})

server.applyMiddleware({ app, path: '/graphql' })
*/

app.listen(
    port,
    () => console.info(
        `Server started on port ${port}`
    )
);