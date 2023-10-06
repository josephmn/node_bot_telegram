class Router {
    constructor(apiUrl) {
        this._apiUrl = apiUrl;
    }

    getRouteUrl(route) {
        return `${this._apiUrl}${route}`;
    }
}

// Exporta la clase Router para que pueda ser utilizada en otros archivos
module.exports = {
    Router
};

// class Router {
//     constructor() {
//         this.routes = {};
//     }

//     addRoute(routeName, url) {
//         this.routes[routeName] = url;
//     }

//     getRouteUrl(routeName) {
//         return this.routes[routeName] || null;
//     }

//     listRoutes() {
//         return Object.keys(this.routes);
//     }
// }

// // Exporta la clase Router para que pueda ser utilizada en otros archivos
// module.exports = {
//     Router
// };
