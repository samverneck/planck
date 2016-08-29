export default function(app){
    app.dbProviderPool.databases = {};
    return new Promise(function(resolve, reject) {
        app.httpServer.close(() => resolve());
    });
}
