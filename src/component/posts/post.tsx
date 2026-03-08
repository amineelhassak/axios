import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Post() {
  // 1. State to store your posts
  const [posts, setPosts] = useState([]);

  // 2. Define the function properly inside the component
  const fetchPosts = async () => {
    try {
      const  { data }  = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.slice(0, 5).map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}