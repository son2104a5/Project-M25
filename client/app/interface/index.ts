interface User {
    id: number,
    role: string,
    name: string,
    email: string,
    password: string,
    status: boolean,
    avatar: string,
    banner: string,
    follows: string[],
    friends: string[],
    groups: string[]
    createAt: string
    bio: string
}

interface Post {
    postId: number,
    userId: number,
    content: {
        text: string,
        media: [{
            type: string,
            url: string
        }],
    },
    createdAt: string,
    status: string
    engagement: {
        shares: number,
        reactions: {
            like: number,
        }
    }
}

interface Comment {
    id: number,
    postId: number,
    userId: number,
    content: string,
    reactions: string[],
    image: string,
    createdAt: string
}