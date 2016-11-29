var express = require("express");
var app = express();
var sendmail = require('sendmail')({logger:{debug:console.log, info:console.log, warn:console.log, error:console.log}, silent:false});
var inscrits = [{nom:"david", mail:"david.elbaze.93@gmail.com", with:false, take:false}];

function random (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

app.get('/', function(req, res){
    res.sendFile("public/index.html", {root:__dirname});
});

app.get("/inscription", function(req, res){
    console.log(req.query.nom);
    console.log(req.query.email);
    inscrits.push({nom: req.query.nom, mail:req.query.email, with:false, take:false});
    res.sendFile("public/merci.html", {root:__dirname});
});

app.get("/list", function(req, res){
    out = "<h1>Liste des inscrits</h1>";
    for(inscrit of inscrits){
        out += inscrit.nom + "<br />";
    }

    sendmail({from:'david.el-baze@emse.fr', to:'david.elbaze.93@gmail.com', subject:'Inscription au Noeloscope', 'html':'Hey !'});

    res.send(out);
});

app.get("/debug1", function(req, res){
    res.send(inscrits)
});

app.get("/debug1_resetwith/:p", function(req, res){
    for(i of inscrits){
        if(i.nom==req.params.p) i.with = false;
    }
    res.send("<script>window.location=\"/debug1\";</script>");
});

app.get("/debug1_rm/:p", function(req, res){
    n = [];
    for(i of inscrits){
        if(i.nom!=req.params.p)
            n.push(i);
    }
    inscrits=n;
    res.send("<script>window.location=\"/debug1\";</script>");
});

app.get("/debug1_with/:p1/:p2", function(req, res){
    p1 = false;
    p2 = false;
    for(i of inscrits){
        if(i.nom==req.params.p1) p1 = i;
        else if (i.nom==req.params.p2) p2 = i;
    }
    if(p1!=false && p2 != false){
        p1.with = p2.nom;
        p2.with = p1.nom;
    }
    res.send("<script>window.location=\"/debug1\";</script>");
});

function getFree(p){
    return inscrits.filter(function(i){return (!i.take || i.take == p.nom) && i.nom!=p.nom && (i.nom!=p.with || p.with==false);});
}

app.get("/debug1_resettirage", function(req, res){
    for(i of inscrits){
        i.take=false;
    }
    res.send("<script>window.location=\"/debug1\";</script>");
});

app.get("/debug1_tirage", function(req, res){
    for(i of inscrits){
        if(i.take==false){
            console.log("recherche pour " + i.nom);
            console.log(inscrits);
            var potentiel = getFree(i);
            console.log("potentiel:");
            console.log(potentiel);
            LE = potentiel[random(0, potentiel.length-1)];
            console.log('LE');
            console.log(LE);
            i.take = LE.nom;
        }
    }
    res.send("<script>window.location=\"/debug1\";</script>");
});

app.listen(5555, function(){
    console.log('Noeloscope running on port 1234');
});

