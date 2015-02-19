requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
        "app": "../app",
        "jquery": "//code.jquery.com/jquery-2.1.3.min",
        "jQueryDebounce": "jquery.debounce-1.0.5"
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);