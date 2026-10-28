# Autenticacao e escopo de clientes

## Configuracao

Copie `.env.example` para `.env`, preencha as variaveis do PostgreSQL e defina `JWT_SECRET` com um segredo aleatorio de pelo menos 32 caracteres. Nao envie o arquivo `.env` ao repositorio.

## Login

Envie `POST /auth/login` com `email` e `senha`. A resposta inclui um token JWT valido por uma hora. Para usar uma rota protegida, envie:

```http
Authorization: Bearer <access_token>
```

O login confere a senha com o hash scrypt salvo no cadastro e rejeita usuarios inativos. Clientes sem registro vinculado em `clientes.id_usuario` nao recebem token.

## Escopo

As rotas de clientes, ordens de servico, agendamentos e orcamentos exigem token. Para `cargo: cliente`, o servidor busca `id_cliente` pelo `id` do usuario autenticado e aplica esse ID nas consultas. Um `id_cliente` enviado na query ou no corpo nao substitui essa identidade. Leituras de outra pessoa respondem como nao encontradas; alteracoes administrativas sao restritas a `cargo: funcionario`.

Rotas publicas incluem o cadastro `POST /clientes/cadastro`, o login e catalogos como servicos. A documentacao interativa fica em `/docs`.

## Testes

Execute `npm test` dentro de `Back` para rodar os testes de hash de senha e isolamento de cliente.
