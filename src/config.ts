export const SITE = {
  website: "https://ktt.dev/",
  author: "Khant Thura Thaung",
  profile: "https://ktt.dev/",
  desc: "Writing on software, AI tooling, and practical automation by Khant Thura Thaung.",
  title: "Khant Thura Thaung",
  navTitle: "KTT",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/FreddieKT/freddie-portfolio-v2/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Asia/Rangoon",
} as const;
