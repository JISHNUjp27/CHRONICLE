import React, { useState, useEffect } from "react";
import Container from "../components/container/Container";
import PostCard from '../components/PostCard';
import appwriteService from '../appwrite/config';
import { Link } from "react-router-dom";

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        appwriteService.getPosts([])
            .then((posts) => {
                if (posts) {
                    setPosts(posts.documents);
                }
            })
            .catch((err) => {
                console.error("Error fetching all posts:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="w-full py-16 text-center">
                <Container>
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
                {posts.length === 0 ? (
                    <div className="text-center py-16 bg-white/70 rounded-2xl shadow-sm max-w-lg mx-auto p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No posts found</h2>
                        <p className="text-gray-600 mb-4">Start creating your own blog posts today!</p>
                        <Link
                            to="/add-post"
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Create Post
                        </Link>
                    </div>
                ) : (
                    <div className='flex flex-wrap'>
                        {posts.map((post) => (
                            <div key={post.$id} className='p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}

export default AllPosts;