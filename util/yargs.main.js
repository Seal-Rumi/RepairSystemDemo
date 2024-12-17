let yargs = require("yargs").options({
  // 'port': {
  //     'default': 8090,
  //     'description': 'Port to listen on.'
  // },
  csrf: {
    type: "boolean",
    // 'default': true,
    default: false,
    description: "csrf protect",
  },
  debug: {
    type: "boolean",
    default: true,
    // 'default': false,
    description: "weather open debug message.",
  },
  editMode: {
    type: "boolean",
    default: false,
    description: "edit mode open or close.",
  },
  public: {
    type: "boolean",
    default: true,
    description: "Run a public server that listens on all interfaces.",
  },
  dbtype: {
    type: "boolean",
    default: true,
    description: "Run a  server that connect to PostgreSQL database.",
  },
  dev: {
    default: true,
    description: "false => 8009   true => 8080",
  },
  details: {
    type: "boolean",
    default: false,
    description: "Run a  server that connect to PostgreSQL database.",
  },
  "upstream-proxy": {
    // 'default': true,
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
