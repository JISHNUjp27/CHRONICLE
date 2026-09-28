import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import useTilt from "../hooks/useTilt";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function readingTime(content = "") {
  const words = stripHtml(content).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostCard({ $id, title, content, featuredImage, $createdAt }) {
  const tiltRef = useTilt({ max: 12, lift: -12 });
  const preview = featuredImage ? appwriteService.getFilePreview(featuredImage) : null;

  return (
    <Link to={`/post/${$id}`} className="scene group block h-full">
      <article ref={tiltRef} className="tilt card-3d relative flex h-full flex-col">
        <span className="spotlight" />

        <div className="relative overflow-hidden rounded-t-[21px]">
          <div className="aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-violet-500/70 via-fuchsia-500/45 to-cyan-400/60">
            {preview ? (
              <img
                src={preview}
                alt={title || "Story cover"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-5xl font-extrabold text-white/15">
                  C
                </span>
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060c] via-[#05060c]/25 to-transparent opacity-90" />

          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md transition-colors duration-300 group-hover:border-cyan-300/60">
            {readingTime(content)} min read
          </span>
        </div>

        <div className="relative flex flex-1 flex-col p-5">
          <h2 className="font-display text-lg font-bold leading-snug text-white transition-colors duration-300 group-hover:text-cyan-200">
            {title}
          </h2>

          <div className="mt-auto flex items-center justify-between pt-5 text-xs text-slate-400">
            <span className="tracking-wide">{formatDate($createdAt)}</span>
            <span className="inline-flex items-center gap-2 font-semibold text-violet-300 transition-all duration-300 group-hover:gap-3 group-hover:text-cyan-300">
              Read article
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;
