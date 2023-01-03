import {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull
 } from 'graphql';
import Book from '../models/book';
import Author from '../models/author';
import User from '../models/User';
import Goods from '../models/Goods';
import Order from '../models/Order';
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

const GoodsType = new GraphQLObjectType({
    name: 'Goods',
    fields: () => ({
        _id: { type: GraphQLID  },
        name: { type: GraphQLString },
        price: { type: GraphQLInt },
        count: { type: GraphQLInt }
    })
 });

 const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: { type: GraphQLID },
        user: { type: UserType },
        goods: { type: GoodsType },
        count: { type: GraphQLInt }
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
        role: { type: GraphQLInt  },
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
        goods: {
            type: GoodsType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from a database source



                //this will return the book with id passed in argument
                //by the user
                return Goods.findById(args.id);
            }
        },
        listGoods:{
            type: new GraphQLList(GoodsType),
            resolve(parent, args) {
                return Goods.find({});
            }
        },
        order: {
            type: OrderType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from a database source



                //this will return the book with id passed in argument
                //by the user
                return Order.findById(args.id).populate('user').populate('goods').exec();
            }
        },
        orders:{
            type: new GraphQLList(OrderType),
            resolve(parent, args) {
                return Order.find({}).populate('user').populate('goods').exec();
            }
        },
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
        addGoods:{
            type:GoodsType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},
                price: { type: new GraphQLNonNull(GraphQLInt)},
                count: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                const goods = new Goods({
                    name:args.name,
                    price:args.price,
                    count:args.count
                })
                return goods.save()
            }
        },
        addOrder:{
            type:OrderType,
            args:{
                userId: { type: new GraphQLNonNull(GraphQLID)},
                goodsId: { type: new GraphQLNonNull(GraphQLID)},
                count: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                const order = new Order({
                    user:args.userId,
                    goods:args.goodsId,
                    count:args.count
                })
                return order.save()
            }
        },
        signup:{
            type:UserType,
            args:{
                name: { type: GraphQLString},
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type:GraphQLString},
                role: { type:GraphQLInt},
                repeatPassword: { type: GraphQLString},
            },
            async resolve(parent,args){
                const user = new User({
                    name:args.name,
                    email:args.email,
                    role:args.role,
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