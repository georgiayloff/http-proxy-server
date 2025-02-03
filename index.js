const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const cors = require("cors");

const createServer = (config) => {
  const appDir = config.dist || path.join(process.cwd(), "dist");
  const port = config.port || 4200;
  const proxies = config.proxies || [];
  const corsEnabled = config.cors || false;

  const app = express();

  app.use("/", express.static(appDir));
  if (corsEnabled) {
    app.use(cors());
  }

  proxies.forEach((proxy) => {
    app.use(
      proxy.path,
      createProxyMiddleware({
        target: proxy.target,
        changeOrigin: proxy.changeOrigin || false,
        pathRewrite: proxy.pathRewrite,
        logger: console,
      })
    );
  });

  app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
  });
};

module.exports = createServer;
