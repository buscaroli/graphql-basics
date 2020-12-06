import { GraphQLServer } from 'graphql-yoga'

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
const typeDefs = `
    type Query {
        me: User!
        post: Post!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        
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