const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db/connection');
const session = require('express-session');
const port = 3000;

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

//View Engine
app.set('view engine','ejs');

// Sessions
app.use(session({
    secret: 'xyztkw',
    cookie: {
      maxAge: 30000
    }
}))

// Static Folder
app.use(express.static('public'));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// db connection
db.authenticate().then(() => {
    console.log('Conectado com sucesso !!!');
}).catch((erro) => {
    console.log(`Falha ao Conectar: ${erro}`);
});

//Routes

app.use('/',categoriesController);
app.use('/',articlesController);
app.use('/',usersController);

app.get('/session',(req,res) => {
    req.session.treinamento = 'formação node.js';
    res.send('sessão gerada');
});


app.get('/leitura',(req,res) => {
    res.json({
        treinamento: req.session.treinamento
    })
});


app.get('/',(req,res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });
    });
   
});

app.get("/:slug",(req, res) => {

    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})

app.get("/category/:slug",(req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
 
        if(category != undefined){               
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles,categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
})


app.listen(port, () => {
    console.log(`API ativa na porta: ${port}`);
});