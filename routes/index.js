var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();




var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');


var dateFormat = require('dateformat');
var util = require( "util" );
//router.get('/', function (req, res) {
//    res.render('index', { user : req.user });
//});



    var modules = {
        news: {
            info: {
                id: 'news',
                name: 'Notícies',
                ico: 'glyphicon glyphicon-list-alt',
                color: "red"
            },
            fields:{
                title: {
                    name:'Títol',
                    description:'',
                    mandatory: true,
                    validate: '',
                    type: 'text'
                },
                description: {
                    name:'Descripció',
                    description:'',
                    mandatory: false,
                    validate: '',
                    type: 'longtext'
                },
                date:{
                    name:'Data',
                    description:'',
                    mandatory: true,
                    validate: '',
                    type: 'date'
                },
                author:{
                    name:'Autor',
                    description:'',
                    mandatory: false,
                    validate: '',
                    type: 'text'
                },

            },
            list:{
                    title: {name:'Títol'},
                    date:  {name:'Data', transform: 'dateFormat("2011-04-11T11:51:00", "dd-mm-yyyy h:MM");'},
                    author: {name:'Autor'}
            }   
        },
        audio: {
            info: {
                id: 'audio',
                name: 'Àudio',
                ico: 'glyphicon glyphicon-volume-up',
                color: "blue"
            },
            fields:{
                title: {
                    name:'Títol',
                    description:'',
                    mandatory: true,
                    validate: '',
                    type: 'text'
                },
                description: {
                    name:'Descripció',
                    description:'',
                    mandatory: false,
                    validate: '',
                    type: 'longtext'
                },
                date:{
                    name:'Data',
                    description:'',
                    mandatory: true,
                    validate: '',
                    type: 'date'
                },
                author:{
                    name:'Autor',
                    description:'',
                    mandatory: false,
                    validate: '',
                    type: 'text'
                },

            },
            list:{
                    title: {name:'Títol'},
                    date:  {name:'Data'}
            }   
        },
        video: {
            info: {
                id: 'video',
                name: 'Vídeo',
                ico: 'fa fa-video-camera',
                color: "green"
            },
            fields:{
                title: {
                    name:'Títol',
                    description:'',
                    mandatory: true,
                    validate: '',
                    type: 'text'
                },
                description: {
                    name:'Descripció',
                    description:'',
                    mandatory: false,
                    validate: '',
                    type: 'longtext'
                },
                date:{
                    name:'Data',
                    description:'',
                    mandatory: true,
                    validate: '',
                    type: 'date'
                },
                author:{
                    name:'Autor',
                    description:'',
                    mandatory: false,
                    validate: '',
                    type: 'text'
                },

            },
            list:{
                    title: {name:'Títol'},
                    date:  {name:'Data'}
            }   
        },
        sindicada: {
            info: {
                id: 'sindicada',
                name: 'Sindicada',
                ico: 'fa fa-rocket',
                color:"yellow"
            },
            fields:{
                title: {
                    name:'Títol',
                    description:'',
                    mandatory: true,
                    validate: '',
                    type: 'text'
                },
                description: {
                    name:'Descripció',
                    description:'',
                    mandatory: false,
                    validate: '',
                    type: 'longtext'
                },
                date:{
                    name:'Data',
                    description:'',
                    mandatory: true,
                    validate: '',
                    type: 'date'
                },
                author:{
                    name:'Autor',
                    description:'',
                    mandatory: false,
                    validate: '',
                    type: 'text'
                },

            },
            list:{
                    title: {name:'Títol'},
                    date:  {name:'Data'}
            }   
        }
    };





var News = mongoose.Schema({
  title: String,
  description: String,
  author: String,
  date: { type: Date, default: Date.now } 
});
News.plugin(mongoosastic);
var modelNews = mongoose.model('News', News);

modelNews.createMapping(function(err, mapping) {
  if (err) {
    console.log(err);
  } else {
    console.log('Mapeo creado!');
    console.log(mapping);
  }
});



var isAuthenticated = function (req, res, next) {
    if (req.user)
        return next();
    req.flash('message', '403 - Forbidden');
    res.redirect('/');
}

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});



// Validate LOGIN  TODO ACTIVAR **********************************************
router.use(function (req, res, next) {   
    //if(req.url!="/" && !req.user)
       //res.redirect('/');

  next();
});


// NEW
router.get('/new/:category', function(req, res) {
    if(req.params.category && modules[req.params.category]) {
        params = {obj: modules[req.params.category]}
    }

    res.render('form', {params: params, modules: modules});
});  


// SAVE
router.post('/new/:category', function(req, res) {

    console.log("entro en NEW");
    var news = new modelNews({  
        title: req.body.title,
        author: req.body.author,
        description: req.body.description
        //  date: Date.now //content: req.body.content
    });

    console.log("Seteo datos:" + news);


    news.save(function(err, dat){
    
    if (err) {
        console.log(err);
    } else {
        console.log("saved!!!");
        console.log(dat);
    }

    
    news.on('es-indexed', function(){
      console.log('document indexed');
      res.redirect('/category/news');
    });
  });

}); 


// DELETE
router.delete('/category/:category/:id', function(req, res) {

    console.log("entro en delete");



    modelNews.remove({_id:req.params.id}, function(err,dat){
              console.log(dat);

    modelNews.remove('es-indexed', function(){
      console.log('document indexed');
      res.redirect('/category/news');
    });

       res.json({success: ((err)? false : true)});
    });


}); 







// LIST
router.get('/category/:category', function(req, res) {

    var searchText = req.query.q || '*';
    var maxItemsXPage  = req.query.itemspage || 10;
    var page       = req.query.page || 1;
    var offset     = maxItemsXPage * (page - 1);

    console.log(req.url);
    var pagePath = req.url + "&page=";
    var itemsPage = 0;
    var totalPages = 0;
    var totalItems = 0;

    modelNews.search({query_string: {query: searchText}}, {from: offset, size: maxItemsXPage}, function(err,results) {
        
        console.log(err);
        console.log(results);
        console.log(results.hits.hits);

        itemsPage = results.hits.hits.length;
        totalItems = results.hits.total;
        totalPages = Math.ceil(totalItems/maxItemsXPage);

        var pager = {itemsPage: itemsPage, totalItems:totalItems,totalPages: totalPages, maxItemsXPage:maxItemsXPage, page: page,path: pagePath }

        var params = {};
        if(req.params.category && modules[req.params.category]) {
            params = {obj: modules[req.params.category]}
        }

        console.log(eval(util.format("dateFormat('%s', 'dd/mm/yyyy H:MM')",'2011-04-11T11:51:00')));
        res.render('list', {req:req, params: params, results:results,dateFormat: dateFormat,  modules: modules, pager:pager});
    });

});






// HOME
router.get('/home', function(req, res) {

    var graph = {data:[], ykeys:[], labels:[]};
    var graph_year = {};

    for(var key in modules){
        graph.labels.push(modules[key].info.name);
        graph.ykeys.push(key);

        [2009, 2010, 2011, 2012, 2013, 2014, 2015].forEach(function(year) {
            if(!graph_year[year])
                graph_year[year]={}
            graph_year[year][key] = Math.ceil(Math.random() * (300 - 20) + 20);
        });
    }

    for(var key in graph_year){
      //  graph.data.push($.extend({any: key}, graph_year[key]));
      var merged_object = JSON.parse((JSON.stringify({any: key}) + JSON.stringify(graph_year[key])).replace(/}{/g,","))
      graph.data.push(merged_object);
    }

    graph.data = JSON.stringify(graph.data);
    graph.labels = JSON.stringify(graph.labels);
    graph.ykeys = JSON.stringify(graph.ykeys);

    res.render('home', {user : req.user, modules: modules, graph: graph});
});




// LOGIN
router.get('/', function(req, res) {
    if(req.user)
        res.redirect('/home');
    else
        res.render('login', { user : req.user, message : req.flash('error')});
});

// LOGIN POST
router.post('/', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/home');
    });
});

// LOGOUT
router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


router.get('/ping', isAuthenticated, function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
