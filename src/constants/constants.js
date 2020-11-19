export default {
    baseUrl: process.env.BASEURL,
    backendUrl: process.env.BACKENDURL,
    login: process.env.LOGIN,
    forgot: process.env.FORGOT,
    backendApiUrl: process.env.BACKENDAPIURL,
    fileuploadUrl: process.env.FILEUPLOADURL,
    companySignUp: process.env.COMPANYSIGNUP,
    secretKey: process.env.SECRETKEY,
    logOut: process.env.LOGOUT,
    getUrl: function (route) {
        console.log('route',route);
        return this.baseUrl + this[route];
    },
    importBackendUrl() {
        return this.backendUrl + "/download/sample-file"
    }
};