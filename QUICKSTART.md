# ⚡ Quick Start - ClickFretes

## TL;DR (Resumo Rápido)

```bash
# 1. Instalar
npm install

# 2. Configurar
cp .env.example .env
# Editar .env com PostgreSQL credentials

# 3. Setup BD
npm run prisma:migrate
npm run prisma:generate

# 4. Rodar
npm run dev

# 5. Acessar
# API: http://localhost:3333
# Docs: http://localhost:3333/api/docs
```

---

## ✨ Principais Recursos Novos

### 1. 📚 Documentação Interativa
- Acesse **http://localhost:3333/api/docs**
- Teste todos os endpoints direto do navegador
- Ver schemas de request/response

### 2. ✅ Validação Robusta
- Validação automática com Zod
- Mensagens de erro claras
- Exemplos: email, phone, rating 1-5

### 3. 📝 Logging Estruturado
- Logs em `logs/error.log`
- `logs/combined.log`
- Useful para debugging

### 4. 🔐 Segurança
- JWT com expiração
- Hash bcrypt para senhas
- Role-based access control

### 5. 📊 Paginação
- Todos os list endpoints suportam
- `?page=1&limit=10`
- Máximo 100 items por página

---

## 📱 Testar Endpoints

### Método 1: Swagger UI (Recomendado)
1. Abra http://localhost:3333/api/docs
2. Registre um usuário
3. Faça login
4. Clique "Authorize" e cole o token
5. Teste os endpoints

### Método 2: cURL
```bash
# Registrar
curl -X POST http://localhost:3333/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@test.com","password":"123456","role":"CLIENT","phone":"11987654321"}'

# Login
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","password":"123456"}'
```

### Método 3: Postman
1. Importe de `http://localhost:3333/swagger.json`
2. Configure Bearer Token na aba Auth
3. Teste

---

## 🔑 Variáveis de Ambiente Essenciais

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/clickfretes"
JWT_SECRET="sua-chave-super-secreta-aqui"
PORT=3333
NODE_ENV="development"
```

---

## 📋 Fluxo de Teste Completo

### 1. Registrar Cliente
```bash
POST /register
{
  "name": "Cliente",
  "email": "cliente@test.com",
  "password": "123456",
  "role": "CLIENT",
  "phone": "11987654321"
}
```

### 2. Registrar Motorista
```bash
POST /register
{
  "name": "Motorista",
  "email": "motorista@test.com",
  "password": "123456",
  "role": "DRIVER",
  "phone": "11999999999",
  "vehicleType": "Van",
  "vehiclePlate": "ABC1234"
}
```

### 3. Login do Cliente
```bash
POST /login
{
  "email": "cliente@test.com",
  "password": "123456"
}
```
⬇️ Copie o token!

### 4. Cliente: Criar Frete
```bash
POST /freights (com token do cliente)
{
  "pickupAddress": "Rua A, 123",
  "dropoffAddress": "Rua B, 456",
  "price": 150.00
}
```

### 5. Login do Motorista
```bash
POST /login
{
  "email": "motorista@test.com",
  "password": "123456"
}
```
⬇️ Copie o token do motorista!

### 6. Motorista: Listar Fretes
```bash
GET /freights/available (com token do motorista)
```

### 7. Motorista: Aceitar Frete
```bash
PATCH /freights/{id}/accept (com token do motorista)
```

### 8. Motorista: Iniciar Frete
```bash
PATCH /freights/{id}/start (com token do motorista)
```

### 9. Motorista: Finalizar Frete
```bash
PATCH /freights/{id}/finish (com token do motorista)
```

### 10. Cliente: Avaliar
```bash
POST /reviews (com token do cliente)
{
  "freightId": "{id}",
  "rating": 5,
  "comment": "Ótimo serviço!"
}
```

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| `DATABASE_URL não configurado` | Edite `.env` com PostgreSQL |
| `Port 3333 em uso` | Mude PORT em `.env` ou mate o processo |
| `Token inválido` | Verifique o formato `Bearer TOKEN` |
| `ValidationError` | Verifique tipos de dados no swagger |

---

## 📚 Documentação Completa

- [README.md](README.md) - Visão geral
- [GUIA_USO.md](GUIA_USO.md) - Exemplos detalhados
- [MELHORIAS.md](MELHORIAS.md) - O que foi melhorado
- [ROADMAP.md](ROADMAP.md) - Futuras features

---

## 🚀 Build & Deploy

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Produção
```bash
npm start
```

---

## ✨ O que é Novo?

✅ Validação com Zod  
✅ Logging com Winston  
✅ Documentação Swagger  
✅ Arquitetura em camadas  
✅ Tratamento de erros  
✅ Segurança melhorada  
✅ Paginação  
✅ Type safety total  

---

## 💡 Tips

- Use Swagger para entender a API
- Verifique logs em `logs/error.log`
- Tokens expiram em 7 dias
- Máximo 100 items por página
- Email deve ser único

---

**Pronto?** Abra http://localhost:3333/api/docs e comece! 🎉
