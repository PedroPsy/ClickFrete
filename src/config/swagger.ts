export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'ClickFretes API',
    description: 'API para gerenciamento de fretes - Conectando clientes e motoristas',
    version: '1.0.0',
    contact: {
      name: 'Pedro Miguel Andrade de Souza',
    },
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Desenvolvimento',
    },
    {
      url: process.env.API_URL || 'https://api.clickfretes.com',
      description: 'Produção',
    },
  ],
  paths: {
    '/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registrar novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'role', 'phone'],
                properties: {
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', example: 'joao@example.com' },
                  password: { type: 'string', example: 'senha123' },
                  role: { type: 'string', enum: ['CLIENT', 'DRIVER'] },
                  phone: { type: 'string', example: '11987654321' },
                  vehicleType: { type: 'string', example: 'Van' },
                  vehiclePlate: { type: 'string', example: 'ABC1234' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuário criado com sucesso' },
          400: { description: 'Erro de validação' },
          409: { description: 'Email já cadastrado' },
        },
      },
    },
    '/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Fazer login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login realizado com sucesso' },
          401: { description: 'Credenciais inválidas' },
        },
      },
    },
    '/me': {
      get: {
        tags: ['Usuário'],
        summary: 'Obter perfil do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dados do usuário' },
          401: { description: 'Não autenticado' },
        },
      },
    },
    '/freights': {
      post: {
        tags: ['Fretes'],
        summary: 'Criar novo frete (somente clientes)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['pickupAddress', 'dropoffAddress', 'price'],
                properties: {
                  pickupAddress: { type: 'string', example: 'Rua A, 123' },
                  dropoffAddress: { type: 'string', example: 'Rua B, 456' },
                  price: { type: 'number', example: 150.00 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Frete criado com sucesso' },
          400: { description: 'Erro de validação' },
          401: { description: 'Não autenticado' },
          403: { description: 'Acesso proibido' },
        },
      },
    },
    '/freights/available': {
      get: {
        tags: ['Fretes'],
        summary: 'Listar fretes disponíveis (somente motoristas)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Lista de fretes disponíveis' },
          401: { description: 'Não autenticado' },
        },
      },
    },
    '/freights/{id}/accept': {
      patch: {
        tags: ['Fretes'],
        summary: 'Aceitar um frete (somente motoristas)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Frete aceito com sucesso' },
          401: { description: 'Não autenticado' },
          404: { description: 'Frete não encontrado' },
        },
      },
    },
    '/freights/{id}/start': {
      patch: {
        tags: ['Fretes'],
        summary: 'Iniciar um frete (somente motoristas)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Frete iniciado com sucesso' },
          401: { description: 'Não autenticado' },
          403: { description: 'Acesso proibido' },
          404: { description: 'Frete não encontrado' },
        },
      },
    },
    '/freights/{id}/finish': {
      patch: {
        tags: ['Fretes'],
        summary: 'Finalizar um frete (somente motoristas)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Frete finalizado com sucesso' },
          401: { description: 'Não autenticado' },
          403: { description: 'Acesso proibido' },
          404: { description: 'Frete não encontrado' },
        },
      },
    },
    '/freights/{id}/cancel': {
      patch: {
        tags: ['Fretes'],
        summary: 'Cancelar um frete',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Frete cancelado com sucesso' },
          401: { description: 'Não autenticado' },
          403: { description: 'Acesso proibido' },
          404: { description: 'Frete não encontrado' },
        },
      },
    },
    '/freights/client': {
      get: {
        tags: ['Fretes'],
        summary: 'Listar fretes do cliente (somente clientes)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Lista de fretes do cliente' },
          401: { description: 'Não autenticado' },
        },
      },
    },
    '/freights/driver': {
      get: {
        tags: ['Fretes'],
        summary: 'Listar fretes do motorista (somente motoristas)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Lista de fretes do motorista' },
          401: { description: 'Não autenticado' },
        },
      },
    },
    '/reviews': {
      post: {
        tags: ['Avaliações'],
        summary: 'Criar avaliação de um frete (somente clientes)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating', 'freightId'],
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  comment: { type: 'string' },
                  freightId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Avaliação criada com sucesso' },
          400: { description: 'Erro de validação' },
          401: { description: 'Não autenticado' },
          403: { description: 'Acesso proibido' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
