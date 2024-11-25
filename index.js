import express from 'express';


const app = express();
const porta = 3000;
const host = '0.0.0.0';


function cadastroFilmeView(req, resp){
    resp.send(`
<html>
<head>
        <title>Cadastrar Filme</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
        
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html>
`)
}

app.get('/cadastrar-filme', cadastroFilmeView)

app.listen(porta, host, () => {console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`)});