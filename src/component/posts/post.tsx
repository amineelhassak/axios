import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Post() {
  // 1. State to store your posts
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  // 2. Define the function properly inside the component
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
      );
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {error == null ? (
          posts.map((post) => <li key={post.id}>{post.title}</li>)
        ) : (
          <p>Error fetching posts: {error.message}</p>
        )}
      </ul>
    </div>
  );
}
