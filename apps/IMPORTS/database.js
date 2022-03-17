
module.exports.dbConfig  = function () 
{
    return config = {
        server: 'localhost\\SAGESQL',
        authentication: { type: 'default', options: { userName: 'Developpement', password: 'Autoequip94' } },
        connectionTimeout: 30000000,
        requestTimeout:30000000,
        options: {encrypt:false,
            enableArithAbort:false

        }
    }
}

