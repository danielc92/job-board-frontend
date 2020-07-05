export const SITE_NAME = "Applymer"
export const TOKEN_NAME = "JOB_TOKEN"
export const SERVER_500_ERROR_MESAGE =
  "We apologise for the inconvenience. The server was unable to process your request."
export const SESSION_EXPIRED_MESSAGE =
  "We apologise, your session has expired, this is a security measure to keep your information safe. Please login again."
export const ALLOWED_CHARS_JOB = "abcdefghijklmnopqrstuvwxyz1234567890- .,"
export const ALLOWED_CHARS_HUMAN_NAME = "abcdefghijklmnopqrstuvwxyz "
export const ROUTES = {
  ACCOUNT_ACTIVATE: "/activate-account",
  ACCOUNT_REGISTER: "/register",
  ACCOUNT_RESET_PASSWORD: "/reset-password",
  ACCOUNT_SIGNIN: "/sign-in",
  DOCUMENTATION_FAQ: "/documentation/frequently-asked-questions-faq",
  DOCUMENTATION_PRIVACY: "/documentation/privacy-policy",
  DOCUMENTATION_TERMS: "/documentation/terms-and-conditions",
  FEEDBACK: "/provide-feedback",
  HOME: "/",
  JOB_APPLICATIONS: "/my-applications",
  JOB_ARTICLE: "/job/:slug",
  JOB_CREATE: "/create-posting",
  JOB_LIST: "/job-list",
  JOB_POSTING_ARTICLE: "/my-postings/:job_id",
  JOB_POSTINGS: "/my-postings",
  NEWS_ARTICLE: "/news/:slug",
  NEWS_LIST: "/news-list",
  PROFILE_SAVED_JOBS: "/saved-jobs",
  PROFILE_SAVED_SEARCH: "/saved-search",
  PROFILE: "/profile",
}

export const QUILL_SETTINGS = {
  MODULES: {
    toolbar: [
      [{ header: [3, false] }],
      ["bold", "italic", "underline", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  },
  FORMATS: [
    "header",
    "bold",
    "italic",
    "underline",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ],
}
