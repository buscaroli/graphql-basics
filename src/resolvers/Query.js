const Query = {
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
    users(parent, args, { db }, info) {
        if (!args.query)
            return db.users
        return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, { db }, info) {
        if (!args.query)
            return db.posts
        return db.posts.filter(post => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            return isTitleMatch || isBodyMatch
        })
    },
    comments(parent, args, { db }, info) {
        if (!args.query) 
            return db.comments
        return db.comments.filter(comment => comment.text.toLowerCase().includes(args.query.toLowerCase()))
    }
}

export { Query as default}