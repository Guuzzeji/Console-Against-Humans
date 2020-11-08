const {networkInterfaces} = require('os');
const net = networkInterfaces();

module.exports.getLocalIP = function(){
    let local_ip = '';
    for (const name of Object.keys(net)) {
        for (const nets of net[name]) {
            if (nets.family === 'IPv4' && !nets.internal) {
                let finder = nets.address.search('192.');
                if(finder != -1){
                    local_ip = nets.address;
                };
            };
        };
    };
    return local_ip
};