import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (slug) {
            setLoading(true);
            appwriteService.getPost(slug)
                .then((post) => {
                    if (post) setPost(post);
                    else {
                        toast.error("Post not found");
                        navigate("/");
                    }
                })
                .catch((err) => {
                    console.error("Error fetching post:", err);
                    toast.error("Failed to load post");
                    navigate("/");
                })
                .finally(() => setLoading(false));
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    const deletePost = async () => {
        if (!post) return;
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                if (post.featuredImage) {
                    await appwriteService.deleteFile(post.featuredImage);
                }
                toast.success("Post deleted successfully");
                navigate("/");
            } else {
                toast.error("Failed to delete post");
            }
        } catch (error) {
            console.error("Delete post error:", error);
            toast.error("An error occurred while deleting the post");
        }
    };

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
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2 bg-white/50 overflow-hidden">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="rounded-xl max-h-[500px] w-full object-cover"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3 hover:bg-green-600 transition">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" className="hover:bg-red-600 transition" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                </div>
                <div className="browser-css bg-white/80 p-6 rounded-xl text-gray-800 leading-relaxed shadow-sm">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}