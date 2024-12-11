import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from "path";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), './pages/public')));
app.use(session( {
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 30 //minutos para excluir os dados de login
    }
}));
app.use(cookieParser());
   
const porta = 3000;
const host = '0.0.0.0';

var listaUsuarios = [];

function menu(req, resp) {
    let ultimoLogin = req.cookies['ultimoLogin'];

    if(!ultimoLogin)
        ultimoLogin = '';

    resp.send(` <html lang="pt-br">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Menu</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">                           
                    </head>
                    <body>
                        <nav class="navbar navbar-expand-lg bg-body-tertiary">
                            <div class="container-fluid">
                                <a class="navbar-brand" href="#">MENU</a>
                                <div class="collapse navbar-collapse" id="navbarNav">
                                    <ul class="navbar-nav">
                                        <li class="nav-item">
                                            <a class="nav-link active" aria-current="page" href="/cadastroUsuario">Cadastro de Usuários</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link active" aria-current="page" href="/batePapo">Bate-papo</a>
                                        </li>
                                        <li>
                                            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${ultimoLogin}</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link active" aria-current="page" href="/login">Sair</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>                                                   
                    </body>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script> 
    `);
}

function mostraFormulario(req, resp) {
    resp.send(` <html>
                    <head>
                        <meta charset="UTF-8"/>
                        <title>Cadastro de contato</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
                        <style>
                            body{
                                width: 700px;
                                margin: auto;
                            }
                            .botao{
                                display: flex;
                                justify-content: space-between;
                            }
                            button{
                                margin-top: 0;
                                margin-bottom: 1rem;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Cadastro</h2></br>
                        <hr>
                        <form class="row g-3" method="POST" action="/cadastroUsuario" >

                            <div class="col-md-4">
                                <label for="nome" class="form-label">Nome completo</label>
                                <input type="text" class="form-control" id="nome" name="nome">
                            </div>

                            <div class="col-md-4">
                                <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                                <div class="input-group">
                                    <input type="date" class="form-control" id="data" name="dataNascimento" aria-describedby="inputGroupPrepend"/>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label for="nickname" class="form-label">Nickname</label>
                                <input type="text" class="form-control" id="nickname" name="nickname">
                            </div>

                            <div class="botao">
                                <button class="btn btn-success" type="submit">Enviar</button>
                                <p><a class="btn btn-primary" href="/">Menu</a></p>
                            </div>
                        </form>
                    </body>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
                </html>
    `);
}

function cadastrarUsuario(req, resp) {
    const nome = req.body.nome;
    const dataNascimento = req.body.dataNascimento;
    const nickname = req.body.nickname;

    const ultimoLogin = req.cookies ['ultimoLogin'];
    
    if(!ultimoLogin)
        ultimoLogin = '';

    if(nome && dataNascimento && nickname) {
        const usuario = {   
                            nome, 
                            dataNascimento, 
                            nickname 
        };

        listaUsuarios.push(usuario);

        resp.write(` <html>
                        <head>
                            <meta charset="UTF-8"/>
                            <title>Lista de usuários</title>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                             <style>
                                body{
                                    width: 700px;
                                    margin: auto;
                                }
                                .botao{
                                    display: flex;
                                    justify-content: space-between;
                                }
                            </style>
                        </head>
                        <body>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Data de Nascimento</th>
                                        <th>Nickname</th>
                                    </tr>
                                </thead>
                                <tbody> 
        `);
                    for(var i = 0; i < listaUsuarios.length; i++){
                        resp.write(` <tr>
                                        <td>${listaUsuarios[i].nome}</td>
                                        <td>${listaUsuarios[i].dataNascimento}</td>
                                        <td>${listaUsuarios[i].nickname}</td>
                                    </tr> 
                        `);
                    }
        resp.write(`           </tbody>            
                            </table>
                            <div class="botao">
                                <p><a class="btn btn-success" href="/cadastroUsuario">Cadastrar outro usuário</a></p>
                                <p><a class="btn btn-primary" href="/">Menu</a></p>
                            </div>
                            </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
                    </html> 
        `);                       
    }
    else {
        resp.write(` <html lang="pt-br">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Cadastro</title>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                            <style>
                                body {    
                                    width: 700px; 
                                    margin: auto; 
                                } 
                                .input-group-custom { 
                                    display: flex; 
                                    flex-direction: column;
                                }
                                .alert { 
                                    color: red; 
                                    margin: 0; 
                                    padding: 0 6px;
                                }                          
                                .botao{
                                    display: flex;
                                    justify-content: space-between;
                                }
                                button{
                                    margin-top: 0;
                                    margin-bottom: 1rem;
                                }
                            </style>
                        </head>
                        <body>
                            <h2>Cadastro</h2>
                            <br>
                            <hr>
                            <form class="row g-3" method="POST" action="/cadastroUsuario">
                                <div class="col-md-4 input-group-custom">
                                    <label class="form-label" for="nome">Nome Completo</label>
                                    <input type="text" class="form-control" id="nome" name="nome" value="${nome}"/>
                                
        `);
        if(!nome) {
            resp.write  (`          <div class="alert">
                                        <p>Nome obrigatório</p>
                                    </div>
            `);
        }                      
        resp.write (`           </div>     
                                <div class="col-md-4 input-group-custom">
                                    <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                                    <div class="input-group">
                                        <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" aria-describedby="inputGroupPrepend" value="${dataNascimento}"/>
                                    </div>
        `);
        if(!dataNascimento){
            resp.write  (`          <div class="alert">
                                        <p>Data de nascimento obrigatória</p>
                                    </div> 
            `);
        }  
    resp.write (`               </div>
                                <div class="col-md-4 input-group-custom">
                                    <label class="form-label" for="nickname">Nickname</label>
                                    <input type="text" class="form-control" id="senha" name="nickname" value="${nickname}"/>
                                    
        `);
        if(!nickname){
            resp.write  (`          <div class="alert">
                                        <p>Nickname obrigatória</p>
                                    </div>  
                                </div>
            `);
        }
        resp.write  (`          </div> 
                                <div class="botao">
                                    <button class="btn btn-success" type="submit">Enviar</button>
                                    <p><a class="btn btn-primary" href="/">Menu</a></p>
                                </div>
                            </form>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
                    </html> 
        `);
        resp.end();
    }
}

function autenticarUsuario(req, resp){
    const email = req.body.email;
    const senha = req.body.senha;

    if(email === 'admin@email.com' && senha === '123'){
        req.session.usuarioLogado = true;

        resp.cookie('ultimoLogin', new Date().toLocaleDateString(),{ 
            maxAge: 1000 * 60 * 60 * 24 * 30, 
            httpOnly: true
        }
        );
        resp.redirect('/');
    }
    else{
        resp.write(`<html>
                        <head>
                            <meta charset="utf-8">
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
                            <style>
                                body{
                                    width: 700px;
                                    margin: auto;
                                }
                                .botao{
                                    display: flex;
                                    justify-content: space-between;
                                }
                                button{
                                    margin-top: 0;
                                    margin-bottom: 1rem;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="alert alert-danger role="alert">
                                Usuário ou senha inválidos!
                            </div>
                            <div>
                                <a href="/login.html" class="btn btn-primary">Tentar novamente</a> 
                            </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
                    </html>
        `);
    }
}

//midleware de segurança
function verificarAutenticacao(req, resp, next){
    if(req.session.usuarioLogado)
        next();//permita acessar os recursos solicitados
    else
        resp.redirect("/login.html");
}

function escreverMensagem(req, resp){
    resp.write(`<html lang="pt-br">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Mensagens</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">  
                        <style>
                            body{
                                width: 700px;
                                margin: auto;
                            }
                            .botao{
                                display: flex;
                                justify-content: space-between;
                            }
                                .chat-container { 
                                width: 100%;
                                max-width: 600px;
                                background-color: #fff; 
                                border: 1px solid #ccc; 
                                border-radius: 5px; 
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
                                overflow: hidden; 
                            } 
                            .messages { 
                                height: 100dvh; 
                                overflow-y: auto; 
                                border-bottom: 1px solid #ccc;

                            }
                            .messages > p{
                                padding-left: 10px 0 0 0;
                                margin: 0;
                            }
                            .bottom-div { 
                                display: flex;
                                justify-content: space-evenly;
                                position: fixed;
                                bottom: 0; 
                                width: 100%; 
                                background-color: #00ff4059; 
                                color: black; 
                                text-align: center; 
                                padding: 10px; 
                            }
                        </style>                         
                    </head>
                    <body>
                        <div class="chat-container">
                            <div class="messages">
                                
                            <div>
                        <div>
                        <div class="bottom-div chat-container">
                            <form  method="POST" action="/batePapo">
                            Usuário: 
                            <select id="usuarios" name="usuarios"> 
    `);
                for(var i = 0; i < listaUsuarios.length; i++){
                    resp.write (`<option value=" ${listaUsuarios[i].nome}">${listaUsuarios[i].nome}</option>`);
                }
    resp.write(`            </select>
                                <label for="msg">Mensagem:</label>
                                <input id="msg" name="mensagem" placeholder="Escreva uma mensagem..."/>
                                <button class="btn btn-primary">Enviar</button>
                            </form>
                            <p><a class="btn btn-primary" href="/">Menu</a></p>
                        </div>
                    </body>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
                </html>
    `);
    resp.end(); 
}

function postarMensagem(req, resp){
    const mensagem = req.body.mensagem;
    const usuarios = req.body.usuarios;
    var horaPostagem;

    if(!mensagem && usuarios){
        resp.write  (`<html>
                        <head>
                            <meta charset="utf-8">
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
                            <style>
                                body{
                                    width: 700px;
                                    margin: auto;
                                }
                                .botao{
                                    display: flex;
                                    justify-content: space-between;
                                }
                                button{
                                    margin-top: 0;
                                    margin-bottom: 1rem;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="alert alert-danger role="alert">
                                Preencha todos os campos
                            </div>
                            <div>
                                <a href="/batePapo" class="btn btn-primary">Tentar novamente</a> 
                            </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
                    </html>
        `);  
        resp.end();
    }else {

        let dataPostagem = req.cookies['dataPostagem'];

        if(!dataPostagem)
            dataPostagem = '';

        resp.cookie('dataPostagem', new Date().toLocaleDateString('pt-BR', {    
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit',
            minute: '2-digit' 
        }));

        horaPostagem = new Date().toLocaleDateString('pt-BR', {    
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit',
            minute: '2-digit' 
        });

        resp.write(`<html lang="pt-br">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Mensagens</title>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">  
                            <style>
                                body {
                                    width: 700px;
                                    margin: auto;
                                }
                                .botao {
                                    display: flex;
                                    justify-content: space-between;
                                }
                                .chat-container { 
                                    width: 100%;
                                    max-width: 600px;
                                    background-color: #fff; 
                                    border: 1px solid #ccc; 
                                    border-radius: 5px; 
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
                                    overflow: hidden; 
                                } 
                                .messages { 
                                    height: 100dvh; 
                                    overflow-y: auto; 
                                    border-bottom: 1px solid #ccc;

                                }
                                .messages > p{
                                    padding-left: 10px 0 0 0;
                                    margin: 0;
                                }
                                .bottom-div { 
                                    display: flex;
                                    justify-content: space-evenly;
                                    position: fixed;
                                    bottom: 0; 
                                    width: 100%; 
                                    background-color: #00ff4059; 
                                    color: black; 
                                    text-align: center; 
                                    padding: 10px; 
                                }
                            </style>                         
                        </head>
                        <body>
                            <div class="chat-container">
                                <div class="messages">
                                    <p>${usuarios}: <spam style="font-size: 1.2rem">${mensagem}</spam></p>
                                    <p style="color: red;">postado em: ${horaPostagem}</p>
                                <div>
                            <div>
                            <div class="bottom-div chat-container">
                                <form  method="POST" action="/batePapo">
                                    <div>
                                        Usuário: 
                                        <select id="usuarios" name="usuarios"> 
        `);
                            for(var i = 0; i < listaUsuarios.length; i++){
                                resp.write (`<option value=" ${listaUsuarios[i].nome}">${listaUsuarios[i].nome}</option>`);
                            }
        resp.write(`                    </select>
                                        <label for="msg">Mensagem:</label>
                                        <input id="msg" name="mensagem" placeholder="Escreva uma mensagem..."/>
                                        <button class="btn btn-primary">Enviar</button>
                                    </div>
                                </form>
                                <p><a class="btn btn-primary" href="/">Menu</a></p>
                            </div>
                    
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
                        </body>
                    </html> 
        `);
        resp.end();
    }
}

app.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});
app.post('/login', autenticarUsuario);
app.get('/cadastroUsuario', mostraFormulario);
app.post('/cadastroUsuario', cadastrarUsuario);
app.get('/batePapo', escreverMensagem);
app.post('/batePapo', postarMensagem);
app.get('/', menu);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});
