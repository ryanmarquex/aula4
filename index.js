import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;
app.use(express.static('./paginas/public'))
// Configurações de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: true,
  })
);

// Banco de dados temporário
let produtos = [];

// Página de login
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login</title>
      </head>
      <body>
        <h1>Login no Sistema</h1>
        <form method="POST" action="/login">
          <label>Nome do Usuário:</label><br>
          <input type="text" name="username" required /><br><br>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

// Login do usuário
app.post('/login', (req, res) => {
  const { username } = req.body;

  if (username) {
    req.session.username = username;
    res.cookie('ultimoAcesso', new Date().toLocaleString());
    res.redirect('/cadastro');
  } else {
    res.send(`
      <html>
        <body>
          <h1>Erro</h1>
          <p>O nome de usuário é obrigatório!</p>
          <a href="/">Voltar</a>
        </body>
      </html>
    `);
  }
});

// Página de cadastro de produtos
app.get('/cadastro', (req, res) => {
  if (!req.session.username) {
    res.send(`
      <html>
        <body>
          <h1>Acesso Negado</h1>
          <p>Você precisa fazer login para acessar esta página.</p>
          <a href="/">Login</a>
        </body>
      </html>
    `);
    return;
  }

  const ultimoAcesso = req.cookies.ultimoAcesso || 'Primeiro acesso';
  let tabelaProdutos = '';

  if (produtos.length > 0) {
    tabelaProdutos = `
      <table border="1">
        <tr>
          <th>Código de Barras</th>
          <th>Descrição</th>
          <th>Preço de Custo</th>
          <th>Preço de Venda</th>
          <th>Data de Validade</th>
          <th>Qtd em Estoque</th>
          <th>Fabricante</th>
        </tr>
        ${produtos
          .map(
            (produto) => `
          <tr>
            <td>${produto.codigo}</td>
            <td>${produto.descricao}</td>
            <td>${produto.precoCusto}</td>
            <td>${produto.precoVenda}</td>
            <td>${produto.validade}</td>
            <td>${produto.estoque}</td>
            <td>${produto.fabricante}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    `;
  }

  res.send(`
    <html>
      <head>
        <title>Cadastro de Produtos</title>
      </head>
      <body>
        <h1>Cadastro de Produtos</h1>
        <p>Bem-vindo, ${req.session.username}</p>
        <p>Último acesso: ${ultimoAcesso}</p>
        <form method="POST" action="/cadastro">
          <label>Código de Barras:</label><br>
          <input type="text" name="codigo" required /><br>
          <label>Descrição:</label><br>
          <input type="text" name="descricao" required /><br>
          <label>Preço de Custo:</label><br>
          <input type="number" step="0.01" name="precoCusto" required /><br>
          <label>Preço de Venda:</label><br>
          <input type="number" step="0.01" name="precoVenda" required /><br>
          <label>Data de Validade:</label><br>
          <input type="date" name="validade" required /><br>
          <label>Quantidade em Estoque:</label><br>
          <input type="number" name="estoque" required /><br>
          <label>Fabricante:</label><br>
          <input type="text" name="fabricante" required /><br><br>
          <button type="submit">Cadastrar Produto</button>
        </form>
        <br>
        ${tabelaProdutos}
      </body>
    </html>
  `);
});

// Cadastro de produtos
app.post('/cadastro', (req, res) => {
  const { codigo, descricao, precoCusto, precoVenda, validade, estoque, fabricante } = req.body;

  if (req.session.username) {
    produtos.push({ codigo, descricao, precoCusto, precoVenda, validade, estoque, fabricante });
    res.redirect('/cadastro');
  } else {
    res.send(`
      <html>
        <body>
          <h1>Acesso Negado</h1>
          <p>Você precisa fazer login para cadastrar produtos.</p>
          <a href="/">Login</a>
        </body>
      </html>
    `);
  }
});
function autenticaUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    if(usuario === 'admin' && senha === '123'){

    }else{
        resp.write('<div class="alert alert-danger" role="alert">usuario ou senha invalidos</div>')
    }
}
app.get('.login', (req, resp) =>{
    resp.redirect('/login.html')
});
app.post('/login', autenticaUsuario);
// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
