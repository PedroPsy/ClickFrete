# 📖 Guia de Uso da API ClickFretes

## Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env e adicionar suas credenciais do PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/clickfretes"
```

### 3. Executar Migrations
```bash
npm run prisma:migrate
npm run prisma:generate
```

### 4. Iniciar Servidor
```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3333`

---

## 🧪 Testando a API

### Acessar Documentação Swagger
```
http://localhost:3333/api/docs
```

### Health Check
```bash
curl http://localhost:3333/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-16T10:30:00.000Z"
}
```

---

## 👤 Autenticação

### 1. Registrar Cliente
```bash
curl -X POST http://localhost:3333/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "role": "CLIENT",
    "phone": "11987654321"
  }'
```

Response:
```json
{
  "id": "uuid-aqui",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "CLIENT",
  "phone": "11987654321",
  "createdAt": "2026-06-16T10:30:00.000Z",
  "driver": null
}
```

### 2. Registrar Motorista
```bash
curl -X POST http://localhost:3333/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com",
    "password": "senha456",
    "role": "DRIVER",
    "phone": "11999999999",
    "vehicleType": "Van",
    "vehiclePlate": "ABC1234"
  }'
```

### 3. Fazer Login
```bash
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "CLIENT",
    "phone": "11987654321"
  }
}
```

### 4. Obter Perfil do Usuário
```bash
curl -X GET http://localhost:3333/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📦 Gerenciamento de Fretes

### 1. Cliente: Criar Frete
```bash
curl -X POST http://localhost:3333/freights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "pickupAddress": "Rua A, 123, São Paulo",
    "dropoffAddress": "Avenida B, 456, São Paulo",
    "price": 150.00,
    "description": "Mudança de 2 cômodos"
  }'
```

Response:
```json
{
  "id": "frete-uuid",
  "clientId": "client-uuid",
  "driverId": null,
  "pickupAddress": "Rua A, 123, São Paulo",
  "dropoffAddress": "Avenida B, 456, São Paulo",
  "price": 150.00,
  "status": "REQUESTED",
  "createdAt": "2026-06-16T10:30:00.000Z",
  "updatedAt": "2026-06-16T10:30:00.000Z"
}
```

### 2. Motorista: Listar Fretes Disponíveis
```bash
curl -X GET "http://localhost:3333/freights/available?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_MOTORISTA_AQUI"
```

Response:
```json
{
  "data": [
    {
      "id": "frete-uuid",
      "clientId": "client-uuid",
      "pickupAddress": "Rua A, 123, São Paulo",
      "dropoffAddress": "Avenida B, 456, São Paulo",
      "price": 150.00,
      "status": "REQUESTED",
      "client": {
        "id": "client-uuid",
        "name": "João Silva",
        "phone": "11987654321"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 3. Motorista: Aceitar Frete
```bash
curl -X PATCH http://localhost:3333/freights/frete-uuid/accept \
  -H "Authorization: Bearer TOKEN_MOTORISTA_AQUI"
```

Response:
```json
{
  "id": "frete-uuid",
  "clientId": "client-uuid",
  "driverId": "driver-uuid",
  "status": "ACCEPTED",
  "pickupAddress": "Rua A, 123, São Paulo",
  "dropoffAddress": "Avenida B, 456, São Paulo",
  "price": 150.00,
  "createdAt": "2026-06-16T10:30:00.000Z"
}
```

### 4. Motorista: Iniciar Frete
```bash
curl -X PATCH http://localhost:3333/freights/frete-uuid/start \
  -H "Authorization: Bearer TOKEN_MOTORISTA_AQUI"
```

Response:
```json
{
  "id": "frete-uuid",
  "status": "IN_PROGRESS",
  ...
}
```

### 5. Motorista: Finalizar Frete
```bash
curl -X PATCH http://localhost:3333/freights/frete-uuid/finish \
  -H "Authorization: Bearer TOKEN_MOTORISTA_AQUI"
```

Response:
```json
{
  "id": "frete-uuid",
  "status": "FINISHED",
  ...
}
```

### 6. Cancelar Frete
```bash
curl -X PATCH http://localhost:3333/freights/frete-uuid/cancel \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 7. Cliente: Listar Seus Fretes
```bash
curl -X GET "http://localhost:3333/freights/client?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_CLIENTE_AQUI"
```

### 8. Motorista: Listar Seus Fretes
```bash
curl -X GET "http://localhost:3333/freights/driver?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_MOTORISTA_AQUI"
```

---

## ⭐ Avaliações

### 1. Cliente: Avaliar Frete (após finalizar)
```bash
curl -X POST http://localhost:3333/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_CLIENTE_AQUI" \
  -d '{
    "freightId": "frete-uuid",
    "rating": 5,
    "comment": "Motorista muito atencioso e rápido!"
  }'
```

Response:
```json
{
  "id": "review-uuid",
  "rating": 5,
  "comment": "Motorista muito atencioso e rápido!",
  "freightId": "frete-uuid",
  "createdAt": "2026-06-16T10:30:00.000Z"
}
```

---

## ❌ Tratamento de Erros

### Validação Falhou
```json
{
  "error": "Validação falhou",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

### Token Inválido
```json
{
  "error": "Token inválido",
  "code": "INVALID_TOKEN"
}
```

### Não Autenticado
```json
{
  "error": "Token não fornecido",
  "code": "NO_TOKEN"
}
```

### Acesso Proibido
```json
{
  "error": "Seu papel não tem permissão para acessar este recurso",
  "code": "FORBIDDEN"
}
```

### Recurso Não Encontrado
```json
{
  "error": "Frete não encontrado",
  "code": "NOT_FOUND"
}
```

---

## 🔐 Status Codes HTTP

| Code | Significado |
|------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Erro de validação |
| 401 | Não autenticado |
| 403 | Acesso proibido |
| 404 | Não encontrado |
| 409 | Conflito (ex: email duplicado) |
| 500 | Erro interno do servidor |

---

## 🗂️ Estrutura de Status de Frete

```
REQUESTED → Cliente criou frete
    ↓
ACCEPTED → Motorista aceitou o frete
    ↓
IN_PROGRESS → Motorista iniciou o frete
    ↓
FINISHED → Motorista finalizou o frete
    ↓
CANCELED (a qualquer momento)
```

---

## 💡 Dicas

1. **Guarde o Token**: O token JWT é válido por 7 dias
2. **Use o Swagger**: Para testes interativos, use http://localhost:3333/api/docs
3. **Logs**: Verifique `logs/error.log` para debugar problemas
4. **Paginação**: Para grandes volumes de dados, use paginação
5. **Validação**: Todos os campos obrigatórios são validados no backend

---

## 🚀 Deploy

### Build
```bash
npm run build
```

### Start em Produção
```bash
npm start
```

### Variáveis de Produção
```bash
export NODE_ENV=production
export JWT_SECRET=seu-segredo-muito-seguro-aqui
export DATABASE_URL=sua-url-postgresql
export PORT=3333
```

---

## 📞 Suporte

Se encontrar erros, verifique:
1. Se todos os campos obrigatórios foram enviados
2. Se o token é válido e não expirou
3. Se a role do usuário tem permissão
4. Os logs em `logs/error.log`
