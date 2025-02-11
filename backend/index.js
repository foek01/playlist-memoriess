const express = require("./express");
const stores = require("./stores");
const s3 = require("./s3");

(() => {
    s3.initialize();
    stores.initialize();
    express.initialize();
})();
