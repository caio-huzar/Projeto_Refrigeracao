# Portal do cliente

## Executar localmente

Instale as dependências (`npm install`) e inicie a API Node na pasta `Back`. A API usa `http://localhost:3000` por padrão; para outra URL, defina `VITE_API_URL` no ambiente do Vite antes de iniciar o front.

Na pasta `Front`, execute `npm run dev`. Crie uma conta em `/cadastro` ou entre com o e-mail e a senha de uma conta de cliente. O token de autenticação fica armazenado somente na sessão atual do navegador.

As solicitações de atendimento usam o cliente vinculado ao token e carregam serviços, técnicos ativos e horários disponíveis da API.
