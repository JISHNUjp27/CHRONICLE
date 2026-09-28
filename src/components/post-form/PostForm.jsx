import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useTilt from "../../hooks/useTilt";

function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, getValues, control, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [isLoading, setIsLoading] = useState(false);
    const [localPreview, setLocalPreview] = useState(null);
    const previewTiltRef = useTilt({ max: 12, lift: -10 });

    const watchTitle = watch("title");
    const watchStatus = watch("status");
    const watchImage = watch("image");

    useEffect(() => {
        if (watchImage && watchImage[0]) {
            const url = URL.createObjectURL(watchImage[0]);
            setLocalPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        return undefined;
    }, [watchImage]);

    const submit = async (data) => {
        setIsLoading(true);
        try {
            if (post) {
                const file = data.image && data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file && post.featuredImage) {
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    toast.success("Chronicle story updated successfully!");
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    toast.error("Failed to update post. Please try again.");
                }
            } else {
                if (!data.image || !data.image[0]) {
                    toast.error("A featured cover image is required for publishing.");
                    setIsLoading(false);
                    return;
                }

                const file = await appwriteService.uploadFile(data.image[0]);

                if (file) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;
                    const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                    if (dbPost) {
                        toast.success("Story published to the feed!");
                        navigate(`/post/${dbPost.$id}`);
                    } else {
                        toast.error("Failed to create post. Please try again.");
                    }
                } else {
                    toast.error("Failed to upload image. Please try again.");
                }
            }
        } catch (error) {
            console.error("PostForm submit error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s+/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const currentImageSrc = localPreview || (post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : null);

    return (
        <form onSubmit={handleSubmit(submit)} className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
            {/* Main Editor Column */}
            <div className="card-3d glass rounded-[30px] p-6 sm:p-10 noise border border-white/10 space-y-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-white">
                        {post ? "Edit Article" : "Draft New Story"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Fill in the metadata and craft your story below. All changes appear in the live preview.
                    </p>
                </div>

                <Input
                    label="Article Title"
                    placeholder="E.g., The Architecture of Tomorrow's Web"
                    {...register("title", { required: true })}
                    error={errors.title ? "Title is required" : undefined}
                />

                <Input
                    label="Slug / URL Path"
                    placeholder="the-architecture-of-tomorrows-web"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                    error={errors.slug ? "Slug is required" : undefined}
                />

                <div className="space-y-2">
                    <RTE label="Article Content" name="content" control={control} defaultValue={getValues("content")} />
                    {errors.content && <p className="text-rose-400 text-xs mt-1">Article content is required</p>}
                </div>
            </div>

            {/* Sidebar Column: Settings & Live 3D Card Preview */}
            <div className="space-y-8">
                {/* Publishing Options Card */}
                <div className="card-3d glass rounded-[30px] p-6 sm:p-8 noise border border-white/10 space-y-6">
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                        <span>✦</span> Publishing Controls
                    </h3>

                    <div>
                        <Input
                            label="Cover Image"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                            {...register("image", { required: !post })}
                            error={errors.image ? "Featured image is required" : undefined}
                        />
                        <p className="mt-1.5 text-[11px] text-slate-400">Recommended aspect ratio: 16:9 or 16:10</p>
                    </div>

                    <Select
                        options={["active", "inactive"]}
                        label="Feed Visibility"
                        {...register("status", { required: true })}
                        error={errors.status ? "Status is required" : undefined}
                    />

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="btn-3d btn-primary w-full py-3.5 text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    {post ? "Updating story..." : "Publishing to feed..."}
                                </span>
                            ) : (
                                <span>{post ? "Update Chronicle ✦" : "Publish Story ✦"}</span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Live 3D Card Preview */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        <span>Live 3D Feed Preview</span>
                        <span className="text-[10px] text-slate-400">Interactive Tilt</span>
                    </div>

                    <div className="scene">
                        <article ref={previewTiltRef} className="tilt card-3d relative flex h-full flex-col overflow-hidden">
                            <span className="spotlight" />

                            <div className="relative overflow-hidden rounded-t-[21px]">
                                <div className="aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-violet-500/70 via-fuchsia-500/45 to-cyan-400/60">
                                    {currentImageSrc ? (
                                        <img
                                            src={currentImageSrc}
                                            alt="Preview cover"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <span className="font-display text-4xl font-extrabold text-white/20">
                                                Cover Image
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060c] via-[#05060c]/25 to-transparent opacity-90" />

                                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md">
                                    {watchStatus === "inactive" ? "Draft" : "Published"}
                                </span>
                            </div>

                            <div className="relative flex flex-1 flex-col p-5">
                                <h4 className="font-display text-base font-bold text-white line-clamp-2">
                                    {watchTitle || "Your Story Title Here..."}
                                </h4>

                                <div className="mt-4 flex items-center justify-between pt-2 text-xs text-slate-400">
                                    <span className="tracking-wide">Today</span>
                                    <span className="inline-flex items-center gap-1 font-semibold text-violet-300">
                                        Read story →
                                    </span>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PostForm;