import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./pages/public'));
const porta = 3000;
const host = '0.0.0.0';

var listaUsuarios = [];

function mostraFormulario(requisicao, resposta){
    resposta.send(` <html>
                        <head>
                            <meta charset="UTF-8"/>
                            <title>Cadastro de contato</title>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                            <style>
                                body{
                                    width: 700px;
                                    margin: auto;
                                }
                            </style>
                        </head>
                        <body>
                            <h2>Cadastro</h2></br>
                            <hr>
                            <form method="POST" action="/cadastroUsuario" class="row g-3" novalidate>

                                <div class="col-md-4">
                                    <label for="nome" class="form-label">Nome completo</label>
                                    <input type="text" class="form-control" id="nome" name="nome" required>
                                </div>

                                <div class="col-md-4">
                                    <label for="email" class="form-label">Email</label>
                                    <div class="input-group has-validation">
                                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                                        <input type="text" class="form-control" id="email" name="email" aria-describedby="inputGroupPrepend" required>
                                        <div class="invalid-feedback">
                                            Please choose a username.
                                        </div>
                                    </div>
                                </div>
                                 <div class="col-md-4">
                                    <label for="senha" class="form-label">Senha</label>
                                    <input type="password" class="form-control" id="senha" name="senha">
                                </div>

                                <div class="col-12">
                                    <button class="btn btn-primary" type="submit">Enviar</button>
                                </div>
                            </form>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
                    </html> `);
}

function cadastrarUsuario(req, resp){
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    const usuario = {nome, email, senha};
    
    listaUsuarios.push(usuario);

    resp.write(` <html>
                    <head>
                        <meta charset="UTF-8"/>
                        <title>Lista de usuários</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>
                    <body>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Senha</th>
                                </tr>
                            </thead>
                            <tbody> `);
                            for(var i = 0; i < listaUsuarios.length; i++){
                                resp.write(` <tr>
                                                <td>${listaUsuarios[i].nome}</td>
                                                <td>${listaUsuarios[i].email}</td>
                                                <td>${listaUsuarios[i].senha}</td>
                                            </tr> `);
                            }
    resp.write(            `</tbody>            
                        </table>
                        <p><a class="btn btn-primary" href="/cadastroUsuario">Cadastrar outro usuário</a></p>
                        </body>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
                </html> `);                       
    resp.end();
}

app.get('/cadastroUsuario', mostraFormulario);
app.post('/cadastroUsuario', cadastrarUsuario);
app.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});

//app.get('/', teste);
app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});
