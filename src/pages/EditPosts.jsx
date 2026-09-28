import React, { useEffect, useState } from "react";
import Container from "../components/container/Container";
import { PostForm } from "../components";
import appwriteService from '../appwrite/config';
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function EditPosts() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            setLoading(true);
            appwriteService.getPost(slug)
                .then((post) => {
                    if (post) {
                        setPost(post);
                    } else {
                        toast.error("Post not found");
                        navigate('/');
                    }
                })
                .catch((err) => {
                    console.error("Error fetching post for edit:", err);
                    toast.error("Failed to load post");
                    navigate('/');
                })
                .finally(() => setLoading(false));
        } else {
            navigate('/');
        }
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="py-16">
                <Container>
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
                    </div>
                </Container>
            </div>
        );
    }

    return post ? (
        <div className="py-8">
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPosts;