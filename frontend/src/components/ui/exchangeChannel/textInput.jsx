"use client"; // ✅ Add this if you are in a Next.js app directory

import React, { useState } from "react";
import dynamic from "next/dynamic"; // ✅ dynamic import from Next.js
import "react-quill/dist/quill.snow.css";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";

// ✅ Dynamically import ReactQuill so it only loads on the client
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TextInputComment = () => {
    const [value, setValue] = useState("");

    const modules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "code-block"],
            ["clean"],
        ],
    };

    const formats = [
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
        "code-block",
    ];

    const handleSubmit = () => {
        console.log("Nội dung bình luận:", value);
        alert("Nội dung bình luận:\n" + value);
    };

    return (
        <div className="flex gap-3 p-4 border rounded-xl bg-white">
            {/* Avatar */}
            <Avatar>
                <AvatarImage src="/avatar.png" alt="avatar" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>

            {/* Input box */}
            <div className="flex-1">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    modules={modules}
                    formats={formats}
                    placeholder="Nhập bình luận mới của bạn..."
                    className="rounded-lg border"
                />

                {/* Action buttons */}
                <div className="flex justify-end gap-2 mt-3">
                    <button
                        onClick={() => setValue("")}
                        className="px-4 py-1 rounded-md border hover:bg-gray-100 transition"
                    >
                        HỦY
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                        BÌNH LUẬN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextInputComment;
