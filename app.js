var express = require('express');
var app = express();

const ROLES_FILE = __dirname + "/roles.txt";
const fs = require('fs');

const buffer = fs.readFileSync(ROLES_FILE);
const roles = JSON.parse(buffer.toString());
console.log(roles);

app.use(function(req, res, next) {
    console.log("A new request received at " + Date.now());
    console.log(req.get('x-role'));
    const xRole = req.get('x-role');
    const scope = "tasks.create";
    const scopes = scope.split(".");
    
    console.log(scopes[0]);
    console.log(scopes[1]);
    

    for (var i=0; i<roles.length; i++) {
        // console.log(roles[i].role);
        // console.log(roles[i]['role']);
        if (roles[i]['role'] === xRole) {
            console.log(roles[i]['scopes']);
            if (roles[i]['scopes'][scopes[0]].includes(scopes[1])) {
                console.log("Found");
                next();
                return;
            }
            else {
                res.status(403).send('Found xRole but can not find proper scope!');        
            }
        }
    }

    if (i == roles.length) {
        res.status(403).send('Something broke!');
    }
    else {
        next();
    }
    
});

app.listen(8081);