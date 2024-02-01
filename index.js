"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    const url = search(address.value, searchEngine.value);
    location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
});

window.onload = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let url = urlParams.get('url');
    if (url != null) {
        try {
            await registerSW();
        } catch (err) {
            error.textContent = "Failed to register service worker.";
            errorCode.textContent = err.toString();
            throw err;
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var localS = JSON.parse(xhttp.responseText);

                for (var key of Object.keys(localS)) {
                    localStorage.setItem(key, localS[key]);
                }
                location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
            }
        };
        xhttp.open("POST", "https://" + window.location.hostname + "/hello/get", true);
        xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        //xhttp.send(JSON.stringify(localStorage));
        xhttp.send();
    }
};

/**
 *
 * @param {string} input
 * @param {string} template Template for a search query.
 * @returns {string} Fully qualified URL
 */
function search(input, template) {
    try {
        // input is a valid URL:
        // eg: https://example.com, https://example.com/test?q=param
        return new URL(input).toString();
    } catch (err) {
        // input was not a valid URL
    }

    try {
        // input is a valid URL when http:// is added to the start:
        // eg: example.com, https://example.com/test?q=param
        const url = new URL(`http://${input}`);
        // only if the hostname has a TLD/subdomain
        if (url.hostname.includes(".")) return url.toString();
    } catch (err) {
        // input was not valid URL
    }

    // input may have been a valid URL, however the hostname was invalid

    // Attempts to convert the input to a fully qualified URL have failed
    // Treat the input as a search query
    return template.replace("%s", encodeURIComponent(input));
}

/**
 * Distributed with Ultraviolet and compatible with most configurations.
 */
const stockSW = "bootstrap.js";

/**
 * List of hostnames that are allowed to run serviceworkers on http:
 */
const swAllowedHostnames = ["localhost", "127.0.0.1"];

/**
 * Global util
 * Used in 404.html and index.html
 */
async function registerSW() {
    if (
        location.protocol !== "https:" &&
        !swAllowedHostnames.includes(location.hostname)
    )
        throw new Error("Service workers cannot be registered without https.");

    if (!navigator.serviceWorker)
        throw new Error("Your browser doesn't support service workers.");

    // Ultraviolet has a stock `sw.js` script.
    await navigator.serviceWorker.register(stockSW, {
        scope: __uv$config.prefix,
    });
}