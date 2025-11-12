import React from "react"
import ContainerResponsive from "@/components/ui/exchangeChannel/groupCard.jsx"
import Action from "@/components/ui/exchangeChannel/Action.jsx"
import CreatePostBox from "@/components/ui/exchangeChannel/CreatePostBox.jsx"
import TextInputComment from "@/components/ui/exchangeChannel/textInput.jsx"
import Post from "@/components/ui/exchangeChannel/postBox.jsx"
export default function Temp() {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <CreatePostBox />
            <TextInputComment />
            <Post />

        </div>
    )
}

