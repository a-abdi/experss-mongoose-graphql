import {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull
 } from 'graphql';
 import Book from '../models/book';
 import Author from '../models/author';
 import User from '../models/User';
 //Schema defines data on the Graph like object types(book type), the relation between
//these object types and describes how they can reach into the graph to interact with
//the data to retrieve or mutate the data  


const BookType = new GraphQLObjectType({
   name: 'Book',
   //We are wrapping fields in the function as we don’t want to execute this until
   //everything is inilized. For example below code will throw an error AuthorType not
   //found if not wrapped in a function
   fields: () => ({
       id: { type: GraphQLID  },
       name: { type: GraphQLString },
       pages: { type: GraphQLInt },
       author: {
       type: AuthorType,
       resolve(parent, args) {
           return Author.findById(parent.authorID);
       }
   }
   })
});

const UserLogin = new GraphQLObjectType({
    name: 'UserLogin',
    fields: () => ({
        token: {
            type: GraphQLString,
        },
    })
 });

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID  },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
    })
 });

const AuthorType = new GraphQLObjectType({
   name: 'Author',
   fields: () => ({
       id: { type: GraphQLID },
       name: { type: GraphQLString },
       age: { type: GraphQLInt },
       book:{
           type: new GraphQLList(BookType),
           resolve(parent,args){
               return Book.find({ authorID: parent.id });
           }
       }
   })
})



//RootQuery describes how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
       book: {
           type: BookType,
           //argument passed by the user while making the query
           args: { id: { type: GraphQLID } },
           resolve(parent, args) {
               //Here we define how to get data from a database source



               //this will return the book with id passed in argument
               //by the user
               return Book.findById(args.id);
           }
       },
       books:{
           type: new GraphQLList(BookType),
           resolve(parent, args) {
               return Book.find({});
           }
       },
       author:{
           type: AuthorType,
           args: { id: { type: GraphQLID } },
           resolve(parent, args) {
               return Author.findById(args.id);
           }
       },
       authors:{
           type: new GraphQLList(AuthorType),
           resolve(parent, args) {
               return Author.find({});
           }
       }
   }
});

//Very similar to RootQuery helps users to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                //GraphQLNonNull make these fields required
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},
                pages: { type: new GraphQLNonNull(GraphQLInt)},
                authorID: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    pages:args.pages,
                    authorID:args.authorID
                })
                return book.save()
            }
        },
        signup:{
            type:UserType,
            args:{
                name: { type: GraphQLString},
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type:GraphQLString},
                repeatPassword: { type: GraphQLString},
            },
            async resolve(parent,args){
                const user = new User({
                    name:args.name,
                    email:args.email,
                    password:args.password,
                })
                const newUser = JSON.parse(JSON.stringify(await user.save()))
                delete newUser.password
                return newUser
            }
        },
        signin:{
            type:UserLogin,
            args:{
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,args){
                const user = new User({email: args.email, password: args.password})
                const token = await user.credentials()
                return { token }
            }
        },
    }
 });

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use it when they are making requestsuntil.
export default new GraphQLSchema({ query: RootQuery,  mutation: Mutation });