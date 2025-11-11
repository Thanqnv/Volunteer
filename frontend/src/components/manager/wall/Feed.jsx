"use client";

import React, { useMemo, useState } from "react";

function PostCard({ post, onToggleLike, onAddComment }) {
  const [commentText, setCommentText] = useState("");

  return (
    <article className="bg-white p-5 rounded-xl shadow-sm">
      {/* Header */}
      <header className="flex items-center gap-3">
        <img
          src={post.group.avatar}
          alt="grp"
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-800">
            {post.group.name} - <span className="font-normal">{post.author}</span>
          </div>
          <div className="text-xs text-slate-500">{post.time}</div>
        </div>
      </header>

      {/* Content */}
      <div className="mt-3 text-base text-slate-700 leading-relaxed">{post.content}</div>

      {/* Media */}
      {post.media && (
        <div className="mt-3">
          <img
            src={post.media}
            alt="media"
            className="w-full max-h-[420px] object-cover rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-4 border-t pt-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          {/* Like */}
          <button
            onClick={() => onToggleLike(post.id)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-50 transition"
            aria-label="Like"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`h-5 w-5 transition ${post.liked ? "text-red-500" : "text-gray-400"}`}
              fill={post.liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M12 21s-6-4.35-9-8.28C1.2 10.29 1 8.88 1 7.5 1 4.42 3.42 2 6.5 2 8.24 2 9.91 2.81 11 4.09 12.09 2.81 13.76 2 15.5 2 18.58 2 21 4.42 21 7.5c0 1.38-.2 2.79-2 5.22C18 16.65 12 21 12 21z" />
            </svg>
            <span className="text-sm">{post.stats.likes}</span>
          </button>

          {/* Comment count */}
          <div className="flex items-center gap-1 text-gray-500">
            <span className="text-lg">💬</span>
            <span className="text-sm">{post.stats.comments}</span>
          </div>

          {/* Comment input + send button */}
          <div className="flex-1 ml-3">
            <div className="flex items-center border border-slate-200 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-blue-200 transition">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận..."
                className="flex-1 px-4 py-2 text-sm bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (commentText.trim()) {
                    onAddComment(post.id, commentText);
                    setCommentText("");
                  }
                }}
                className="h-full px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition rounded-r-full"
                title="Gửi bình luận"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default function Feed({
  posts: initialPosts = [],
  filterGroupId: externalFilter,
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [sortMode, setSortMode] = useState("activity");
  const activeGroupId = externalFilter || "all";

  const filteredPosts = useMemo(() => {
    if (activeGroupId === "all") return posts;
    return posts.filter((p) => p.group?.id === activeGroupId);
  }, [posts, activeGroupId]);

  const sortedPosts = useMemo(() => {
    const list = [...filteredPosts];
    const getTimestamp = (value) => (value ? new Date(value).getTime() : 0);

    if (sortMode === "activity") {
      return list.sort(
        (a, b) =>
          (getTimestamp(b.lastCommentAt) || getTimestamp(b.createdAt)) -
          (getTimestamp(a.lastCommentAt) || getTimestamp(a.createdAt))
      );
    }

    return list.sort(
      (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
    );
  }, [filteredPosts, sortMode]);


  /** â¤ï¸ Toggle Like */
  function handleToggleLike(postId) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: !p.liked,
              stats: {
                ...p.stats,
                likes: p.liked ? p.stats.likes - 1 : p.stats.likes + 1,
              },
            }
          : p
      )
    );
  }

  /** 💬 Thêm bình luận */
  function handleAddComment(postId, text) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              stats: { ...p.stats, comments: p.stats.comments + 1 },
              lastCommentAt: new Date().toISOString(),
              comments: [...(p.comments || []), text],
            }
          : p
      )
    );
  }

  return (
    <main className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Dòng thời gian</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Lọc:</label>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            <option value="activity">Hoạt động mới đây nhất</option>
            <option value="newest">Bài viết mới</option>
          </select>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {sortedPosts.length === 0 && (
          <div className="text-sm text-slate-500">KhÃ´ng cÃ³ bÃ i Ä‘Äƒng nÃ o.</div>
        )}

        {sortedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
          />
        ))}
      </div>
    </main>
  );
}

