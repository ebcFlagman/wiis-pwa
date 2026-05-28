declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare const APP_VERSION: string;
declare const AUTHOR: string;
declare const HOMEPAGE: string;
declare const GITHUB_URL: string;
declare const GITHUB_BUGS_URL: string;
