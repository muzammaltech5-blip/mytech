const htmlmin = require("html-minifier-terser");
const CleanCSS = require("clean-css");
const { minify } = require("terser");

module.exports = function(eleventyConfig) {

  // Copy folders directly
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/uploads");

  // Date filter
  eleventyConfig.addFilter("date", (dateObj) => {
    return new Date(dateObj).toLocaleDateString();
  });

  // Posts collection
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });

  // HTML Minify
  eleventyConfig.addTransform("htmlmin", async function(content, outputPath) {

    if (outputPath && outputPath.endsWith(".html")) {

      return await htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true
      });

    }

    return content;

  });

  // CSS Minify
  eleventyConfig.addTemplateFormats("css");

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",

    compile: async function(inputContent) {

      let output = new CleanCSS({}).minify(inputContent).styles;

      return async () => output;

    }
  });

  // JS Minify
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function(code, callback) {

    try {

      const minified = await minify(code);

      callback(null, minified.code);

    } catch (err) {

      callback(null, code);

    }

  });

  // Final config
  return {

    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    }

  };

};
