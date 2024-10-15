const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const createServer = (config) => {
  const appDir = config.dist || path.join(process.cwd(), "dist");
  const port = config.port || 4200;
  const proxies = config.proxies || [];

  const app = express();

  app.use("/", express.static(appDir));

  proxies.forEach((proxy) => {
    app.use(
      proxy.path,
      createProxyMiddleware({
        target: proxy.target,
        changeOrigin: proxy.changeOrigin || false,
        pathRewrite: proxy.pathRewrite,
      })
    );
  });

  app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
  });
};

module.exports = createServer;
