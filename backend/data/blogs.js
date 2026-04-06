const blogs = [
  {
    title: "Understanding Mental Health in 2024",
    excerpt: "Exploring the latest trends in psychiatric care and mental well-being.",
    content: "Psychological well-being is more important than ever. In this article, we delve into common practices for mindfulness and therapy in the modern age.",
    featuredImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
    status: "published",
    author: null, // Will be linked during seeding
    categories: ["Psychology", "Wellness"],
    readTime: 5
  },
  {
    title: "The Importance of Early Diagnosis",
    excerpt: "How regular health check-ups can save lives.",
    content: "Preventive medicine starts with regular visits to clinical experts. Early detection of symptoms can lead to significantly better treatment outcomes.",
    featuredImage: "https://images.unsplash.com/photo-1519494140681-891f9302e482?q=80&w=800",
    status: "published",
    author: null, // Will be linked during seeding
    categories: ["Healthcare", "Medicine"],
    readTime: 4
  }
];
module.exports = blogs;
