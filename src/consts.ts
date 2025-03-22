// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Website Configuration
export const SITE_TITLE = "home of ogirginc";
export const SITE_DESCRIPTION = "Welcome (. ❛ ᴗ ❛.)";
export const COPYRIGHT = `© ${new Date().getFullYear()} all rights reserved?`;
export const ICP_NUMBER = "";

// Social Media Links, leave empty or comment out = not displayed
export const SOCIAL_LINKS = {
  Github: "https://github.com/ogirginc",
  Twitter: "https://twitter.com/ogirginc",
  Bsky: "https://ogirginc.bsky.social",
  Instagram: "https://www.instagram.com/ogirginc",
  LinkedIn: "https://www.linkedin.com/in/ogirginc",
  // Mastodon: "https://ruby.social/@ogirginc",
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
];

// Blog Configuration
export const BLOG_CONFIG = {
  locale: "en-us", // Date formatting language
  profile: "https://github.com/ogirginc",
  authorName: "Oğulcan Girginç", // Author name
  // email: "mailto:email@example.com",
  tags: {
    title: "Tags", // Tags page title
    description: "All the tags used in posts.", // Tags page description
  },
};
