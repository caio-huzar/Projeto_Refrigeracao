const authSwagger = {
  paths: {
    '/auth/login': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Autentica usuario e retorna token Bearer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'senha'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'cliente@email.com' },
                  senha: { type: 'string', format: 'password', example: 'SenhaSegura123' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Token JWT emitido com validade de uma hora',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    access_token: { type: 'string' },
                    token_type: { type: 'string', example: 'Bearer' },
                    expires_in: { type: 'integer', example: 3600 },
                    usuario: { type: 'object' },
                    cliente: { type: 'object', nullable: true }
                  }
                }
              }
            }
          },
          400: { description: 'Email ou senha ausentes' },
          401: { description: 'Credenciais invalidas' },
          403: { description: 'Cliente sem cadastro vinculado' },
          503: { description: 'JWT_SECRET nao configurado' }
        }
      }
    }
  }
};

module.exports = authSwagger;