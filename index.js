import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./pages/public'));
const porta = 3000;
const host = '0.0.0.0';

function teste(req, resp){
    resp.send('<p>fazendo um teste</p>');

}
app.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});

app.get('/', teste);
app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});
