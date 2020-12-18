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

const db = {
    users,
    posts,
    comments
}

export { db as default }