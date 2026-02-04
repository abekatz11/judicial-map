export default {
  title: "US Federal Courts Map",
  root: "src",
  output: "dist",
  pages: [
    {name: "Districts", path: "/districts/"},
    {name: "Circuits", path: "/circuits/"}
  ],
  theme: "default",
  head: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@600;800&display=swap" rel="stylesheet">`
};
