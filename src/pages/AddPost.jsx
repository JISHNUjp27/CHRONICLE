import React from "react";
import { PostForm, Container } from "../components/index";
import Reveal from "../components/Reveal";

function AddPosts() {
    return (
        <div className="relative min-h-[85vh] py-12">
            <div className="orb orb-violet" style={{ width: "32rem", height: "32rem", top: "-6rem", left: "-8rem", opacity: 0.25 }} />
            <div className="orb orb-cyan" style={{ width: "24rem", height: "24rem", bottom: "10%", right: "-6rem", opacity: 0.2 }} />

            <Container className="relative z-10">
                <div className="mb-10 text-center">
                    <Reveal>
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-cyan-400" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
                            </span>
                            Chronicle Creator Studio
                        </div>
                    </Reveal>

                    <Reveal delay={80}>
                        <h1 className="font-display mt-5 text-4xl font-extrabold sm:text-5xl text-white">
                            Compose a <span className="text-gradient">Masterpiece</span>
                        </h1>
                        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
                            Give your thoughts a cinematic stage with immersive depth, high typography standards, and interactive reader engagement.
                        </p>
                    </Reveal>
                </div>

                <PostForm />
            </Container>
        </div>
    );
}

export default AddPosts;