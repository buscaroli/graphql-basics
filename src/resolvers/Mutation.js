import { v4 as uuidv4 } from 'uuid'

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some(user => user.email === args.data.email)

        if (emailTaken) {
            throw new Error ('Email already taken.')
        }
        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user)

        return user
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id)

        if (userIndex === -1) throw new Error ('User not found.')
        // deleting the user, please note that deletedUsers is
        // an array of one object (array of length 1)
        const deletedUsers = db.users.splice(userIndex, 1)
        
        // We also need to delete #1 its posts and comments and #2 the 
        // comments that appear in its posts

        
        db.posts = db.posts.filter(post => {
            const match = post.author === args.id

            if (match) {
                // #1 delete all of the comments in this post as it was 
                // created by the deleted user and we dont want to have
                // comments that hang around and cant be accessed anymore
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }

            // If we found a match (match is true) means we found a post
            // made by the deleted user and we want to filter it out so 
            // we have to return false (opposite of match) and viceversa:
            // basically if the post was made by the user it will be
            // skipped and not added to the 'posts' array.
            return !match
        })
        // #2 deleting the comments made by the deleted user that are in 
        // somebody else's posts: deleting replies made to other users'
        // posts by the deleted user 
        db.comments = db.comments.filter(comment => comment.author !== args.id)

        // deletedUsers is an array of length 1
        return deletedUsers[0]
    },
    updateUser(parent, { id, data }, { db }, info) {
        const user = db.users.find(user => user.id === id)

        if (!user) throw new Error ('User not Found.')

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email)
            if (emailTaken) throw new Error ('Email already taken.')
            user.email = data.email
        }

        if (typeof data.name === 'string') {
            const nameTaken = db.users.some(user => user.name === data.name)
            if (nameTaken) throw new Error ('Username already taken.')
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user
    },
    // Alternative, shorter version of updateUser using Object.assign
    //
    // updateUser(parent, args, { db }, info) {
    //     const user = db.users.find((user) => user.id === args.id);
    //     if (!user) {
    //       throw new Error('User not found!!!');
    //     }
    //     if (db.users.some((user) => user.email === args.data.email)) {
    //       throw new Error('Email taken!!');
    //     }
    //     return Object.assign(user, args.data);
    //   },
    createPost(parent, args, { db }, info) {
        const userExists = db.users.some(user => user.id === args.data.author)

        if (!userExists) throw new Error ('User doesnt Exist.')

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)

        return post
    },
    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id)
        
        if (postIndex === -1) throw new Error ('Post not found.')

        // deletedPost is a single object
        const deletedPost = posts[postIndex]
        db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter(comment => comment.post !== args.id)

        // deletedPost is an object
        return deletedPost
    },
    updatePost(parent, { id, data }, { db: { posts } }, info) {
        const post = posts.find(post => post.id === id)

        if (!post) throw new Error ('Post not Found.')

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published
        }

        return post

    },
    createComment(parent, args, { db }, info) {
        const userExists = db.users.some(user => user.id === args.data.author)
        if (!userExists) throw new Error ('Couldnt find author.')

        const postExistsAndPublished = db.posts.some(post => post.id === args.data.post &&  post.published)
        if (!postExistsAndPublished) throw new Error ('Couldnt find a published post.')

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)

        return comment

    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id)
    
        if (!commentIndex) throw new Error ('Comment not Found.')

        const deletedComment = db.comments[commentIndex] 
        db.comments.splice(commentIndex, 1)
        
        return deletedComment
    },
    updateComment(parent, { id, data }, {db : {comments}}, info) {
        const comment = comments.find(comment => comment.id === id)

        if (!comment) throw new Error ('Comment not Found.')

        if (typeof data.text === 'string') {
            comment.text = data.text
        }

        return comment
    },
}

export { Mutation as default }