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
    id: number,
    userId: number,
    content: {
        text: string,
        media: Media[],
    },
    createdAt: number,
    status: string
    engagement: {
        shares: number,
        comments: number,
        reactions: {
            like: number,
        }
    }
}

type Media = {
    url: string;
    type: "image" | "video";
};

interface Comment {
    id: number,
    postId: number,
    userId: number,
    content: string,
    reactions: string[],
    image: string,
    createdAt: string
}

interface Stories {
    id: number,
    userId: number,
    media: [{
        type: string,
        url: string
    }],
    createdAt: string
}