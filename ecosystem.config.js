module.exports = {
    apps : [
        {
          name: "file-manager",
          script: "node -r ./tsconfig-path-bootstrap.js dist/index.js",
        }
    ]
  }