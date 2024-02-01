// This file overwrites the stock UV config.js

self.__uv$config = {
    prefix: "/hello/service/",
    bare: "/bare/",
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: "/hello/website.handler.js",
    client: "/hello/website.client.js",
    bundle: "/hello/website.bundle.js",
    config: "/hello/bootstrap.config.js",
    sw: "/hello/website.sw.js",
};