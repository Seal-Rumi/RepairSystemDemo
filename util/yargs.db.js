let yargs = require("yargs").options({
  port: {
    default: 7001,
    description: "Port to listen on.",
  },
  dev: {
    default: true,
    type: "boolean",
    description: "Develop mode start check",
  },
  test: {
    default: false,
    type: "boolean",
    description: "Port to listen on.",
  },
  public: {
    type: "boolean",
    description: "Run a public server that listens on all interfaces.",
  },
  "upstream-proxy": {
    description:
      'A standard proxy server that will be used to retrieve data.  Specify a URL including port, e.g. "http://proxy:8000".',
  },
  "bypass-upstream-proxy-hosts": {
    description:
      'A comma separated list of hosts that will bypass the specified upstream_proxy, e.g. "lanhost1,lanhost2"',
  },
  help: {
    alias: "h",
    type: "boolean",
    description: "Show this help.",
  },
});

module.exports = {
  yargs: function () {
    return yargs;
  },
};
