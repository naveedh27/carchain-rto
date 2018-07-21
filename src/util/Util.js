
var user = {
    isAuthenticated: true,
    name: '',
    authenticate(cb) {
        this.isAuthenticated = true
        setTimeout(cb, 100) // fake async
    },
    signout(cb) {
        this.isAuthenticated = false
        setTimeout(cb, 100) // fake async
    }
};

var endpoint = {
    //url: "http://localhost:3010/api/"
    url : "http://ec2-13-232-8-72.ap-south-1.compute.amazonaws.com:3000/api/"
}

module.exports = {
    user,
    endpoint
};