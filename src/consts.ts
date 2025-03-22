// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Website Configuration
export const SITE_TITLE = "PlainPage";
export const SITE_DESCRIPTION = "Welcome (. ❛ ᴗ ❛.)";
export const COPYRIGHT = "© 2024 PlainPage All Rights Reserved";
export const ICP_NUMBER = "";

// Social Media Links, leave empty or comment out = not displayed
export const SOCIAL_LINKS = {
  Github: "https://github.com/churchTao",
  Twitter: "https://twitter.com/yourusername",
  //   LinkedIn: "https://www.linkedin.com/in/yourusername",
  //   Instagram: "https://www.instagram.com/yourusername",
  //   Facebook: "https://www.facebook.com/yourusername",
  //   YouTube: "https://www.youtube.com/yourusername",
};

// SEO Related
export const SEO_CONFIG = {
  ogImage: "/hero-img.png", // Default social media sharing image
  keywords: "blog, tech, programming", // Default keywords
};

// Navigation Configuration
export const NAV_ITEMS = [
  { text: "Home", link: "/" },
  { text: "Blog", link: "/blog" },
  { text: "Tags", link: "/tags" },
  { text: "About", link: "/about" },
];

// Blog Configuration
export const BLOG_CONFIG = {
  locale: "en-us", // Date formatting language
  profile: "https://github.com/churchTao",
  authorName: "Author Name", // Author name
  email: "mailto:your-email@example.com",
  tags: {
    title: "Tags", // Tags page title
    description: "All the tags used in posts.", // Tags page description
  },
};
