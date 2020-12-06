import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4, v4 } from 'uuid'

// Demo data
const users = [{
    id: '1',
    name: 'Matt',
    email: 'matt@me.com',
    age: 42
},  {
    id: '2',
    name: 'Mel',
    email: 'mel@me.com',
    age: 41
},  {
    id: '3',
    name: 'Stewart',
    email: 'stew@me.com',
    age: 65
}]

const posts = [{
    id: '10',
    title: 'About the Lord of the Rings',
    body: 'My favourite part about the Lord of the Rings is...',
    published: true,
    author: '1'
},  {
    id: '11',
    title: 'About the Shannara serie',
    body: 'My favourite part about the Shannara...',
    published: true,
    author: '1'
},  {
    id: '12',
    title: 'About the Dragonlance serie',
    body: 'My favourite part about the World of Dragonlance is...',
    published: false,
    author: '3'
}]

const comments = [{
    id: '101',
    text: 'Great posts!',
    author: '1',
    post: '10'
},  {
    id: '102',
    text: 'Very impressed, keep up with the good work!',
    author: '1',
    post: '10'
},  {
    id: '103',
    text: 'Not impressed at all...',
    author: '2',
    post: '11'
},  {
    id: '104',
    text: 'I never knew that, time for googling!',
    author: '1',
    post: '12'
}]


// Type Definitons (application Schemas)
// ! after String (String!) means we don't want null as a return value
// NB Query and Mutation are in-built types, they need to be spelled like they are
const typeDefs = `
    type Query {
        me: User!
        post: Post!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String!, 
        email: String!, 
        age: Int
    }

    input CreatePostInput {
        title: String!, 
        body: String!, 
        published: Boolean!, 
        author: ID!
    }

    input CreateCommentInput {
        text: String!, 
        author: ID!, 
        post: ID!
    }


    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers (functions that run when operations are performed)
const resolvers = {
    Query: {
        me() {
           return {
               id: 'sas-123-sdd',
               name: 'Matt',
               email: 'myemail@gmail.com',
               age: 23
           }
        },
        post() {
           return {
               id: '123-wer-423',
               title: 'My fitsr Post',
               body: 'The body of my first post.',
               published: true
           }
        },
        users(parent, args, ctx, info) {
            if (!args.query)
                return users
            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, ctx, info) {
            if (!args.query)
                return posts
            return posts.filter(post => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        comments(parent, args, ctx, info) {
            if (!args.query) 
                return comments
            return comments.filter(comment => comment.text.toLowerCase().includes(args.query.toLowerCase()))
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email)

            if (emailTaken) {
                throw new Error ('Email already taken.')
            }
            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)

            return user
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)

            if (!userExists) throw new Error ('User doesnt Exist.')

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            if (!userExists) throw new Error ('Couldnt find author.')

            const postExistsAndPublished = posts.some(post => post.id === args.data.post &&  post.published)
            if (!postExistsAndPublished) throw new Error ('Couldnt find a published post.')

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)

            return comment

        },
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },

        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id)
        },

        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },

        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up on port 4000.')
})