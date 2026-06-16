# 🚚 ClickFretes - API de Gerenciamento de Fretes

![Node.js](https://img.shields.io/badge/Node.js-v20+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.4-blue)
![Express](https://img.shields.io/badge/Express-v4.19-orange)
![Prisma](https://img.shields.io/badge/Prisma-v5.22-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-336791)

Sistema de API para gerenciar fretes (transporte) conectando clientes e motoristas. Baseado no conceito do Uber para mudanças.

---

## ✨ O que é ClickFretes?

ClickFretes é uma plataforma que permite:

- **Clientes** solicitarem fretes (mudanças, transportes)
- **Motoristas** aceitarem e realizarem os fretes
- **Avaliações** do serviço prestado
- **Rastreamento** do status do frete em tempo real

---

## 🎯 Funcionalidades Principais

### Para Clientes
- ✅ Registrar e fazer login
- ✅ Solicitar novo frete
- ✅ Listar fretes solicitados
- ✅ Cancelar frete
- ✅ Avaliar motorista e serviço
- ✅ Ver histórico de fretes

### Para Motoristas
- ✅ Registrar e fazer login com dados do veículo
- ✅ Ver fretes disponíveis
- ✅ Aceitar fretes
- ✅ Iniciar frete
- ✅ Finalizar frete
- ✅ Ver histórico de fretes realizados
- ✅ Ver avaliações recebidas

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js v20+ instalado
- PostgreSQL v12+ rodando
- npm ou yarn

### 1. Clonar Repositório
```bash
git clone https://github.com/PedroPsy/ClickFrete.git
cd ClickFrete
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL
```

### 4. Setup do Banco de Dados
```bash
npm run prisma:migrate
npm run prisma:generate
```

### 5. Iniciar Servidor
```bash
npm run dev
```

### 6. Acessar a API
- **API**: http://localhost:3333
- **Documentação**: http://localhost:3333/api/docs
- **Health Check**: http://localhost:3333/health

---

## 📚 Documentação

### Guias Disponíveis
- [📖 **GUIA_USO.md**](./GUIA_USO.md) - Exemplos práticos de como usar cada endpoint
- [✨ **MELHORIAS.md**](./MELHORIAS.md) - Detalhes sobre todas as melhorias implementadas
- [🔄 **ROADMAP.md**](./ROADMAP.md) - Funcionalidades futuras planejadas

### Swagger/OpenAPI
Acesse http://localhost:3333/api/docs para documentação interativa completa.

---

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── config/              # Configurações (Swagger)
├── controllers/         # Request handlers
├── middlewares/         # Autenticação, validação, erros
├── services/            # Lógica de negócio
├── types/               # Interfaces TypeScript
├── utils/               # Utilitários (logger, errors)
├── validators/          # Schemas Zod
├── prisma/              # Prisma client
├── routes/              # Definição de rotas
└── server.ts            # Entry point
```

### Padrão de Requisição

```
HTTP Request
    ↓
Router & Middleware (autenticação, validação)
    ↓
Controller (extrai dados)
    ↓
Service (lógica de negócio)
    ↓
Prisma (banco de dados)
    ↓
HTTP Response
```

---

## 🔐 Segurança

### Implementações
- ✅ JWT com expiração (7 dias)
- ✅ Senha com hash bcrypt
- ✅ Validação de entrada com Zod
- ✅ Role-based access control (RBAC)
- ✅ Error handling seguro
- ✅ Logging de eventos sensíveis

### Variáveis Críticas
- `JWT_SECRET` - Chave secreta para assinar tokens
- `DATABASE_URL` - URL de conexão ao PostgreSQL
- `NODE_ENV` - Ambiente (development/production)

---

## 📋 Status de Frete

```
REQUESTED
    ↓
ACCEPTED
    ↓
IN_PROGRESS
    ↓
FINISHED
    ↓
(Cliente avalia)

OU

CANCELED (a qualquer momento antes de IN_PROGRESS)
```

---

## 🧪 Testando a API

### Usando cURL
```bash
# Registrar cliente
curl -X POST http://localhost:3333/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "role": "CLIENT",
    "phone": "11987654321"
  }'

# Login
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Usando Swagger
1. Abra http://localhost:3333/api/docs
2. Registre um usuário
3. Faça login
4. Copie o token
5. Clique no botão "Authorize"
6. Cole `Bearer SEU_TOKEN_AQUI`
7. Teste os endpoints

### Usando Postman
1. Importe a coleção do Swagger: http://localhost:3333/swagger.json
2. Configure a autenticação Bearer Token
3. Teste os endpoints

---

## 📊 Database Schema

### Usuários (Users)
```sql
- id (UUID)
- name (String)
- email (String, unique)
- password (String, hashed)
- role (Enum: CLIENT, DRIVER)
- phone (String)
- createdAt (DateTime)
```

### Motoristas (Drivers)
```sql
- id (UUID)
- userId (UUID, FK)
- vehicleType (String)
- vehiclePlate (String)
- isOnline (Boolean)
```

### Fretes (Freights)
```sql
- id (UUID)
- clientId (UUID, FK)
- driverId (UUID, FK, nullable)
- pickupAddress (String)
- dropoffAddress (String)
- price (Float)
- status (Enum)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Avaliações (Reviews)
```sql
- id (UUID)
- rating (Int 1-5)
- comment (String, nullable)
- freightId (UUID, FK)
- clientId (UUID, FK)
- driverId (UUID, FK)
- createdAt (DateTime)
```

---

## 🛠️ Scripts npm

```bash
# Desenvolvimento
npm run dev              # Inicia servidor com hot-reload

# Build
npm run build            # Compila TypeScript para JavaScript

# Produção
npm start                # Inicia servidor compilado

# Prisma
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:studio    # Abre interface visual do Prisma
```

---

## 📦 Dependências Principais

| Pacote | Versão | Propósito |
|--------|--------|----------|
| express | ^4.19 | Framework web |
| @prisma/client | ^5.22 | ORM banco de dados |
| jsonwebtoken | ^9.0 | Autenticação JWT |
| bcrypt | ^5.1 | Hash de senhas |
| zod | ^3.23 | Validação de tipos |
| winston | ^3.14 | Logging estruturado |
| swagger-ui-express | ^4.6 | Documentação interativa |

---

## 🔮 Próximas Melhorias

### Fase 2 - Próximas Versões
- [ ] WebSockets para notificações real-time
- [ ] Rate limiting para proteção contra abuso
- [ ] Sistema de email (confirmação, recuperação de senha)
- [ ] Soft delete (marcação lógica de exclusão)
- [ ] Histórico/Auditoria de mudanças
- [ ] Testes automatizados
- [ ] Refresh tokens
- [ ] Dashboard admin

Ver [ROADMAP.md](./ROADMAP.md) para mais detalhes.

---

## 📝 Logs

Logs são salvos em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs

Exemplo de log:
```
2026-06-16 10:30:00 [info]: Freight created { freightId: "uuid", clientId: "uuid", price: 150 }
2026-06-16 10:31:00 [error]: Error creating freight { error: "Database connection failed" }
```

---

## 🐛 Troubleshooting

### Erro: "DATABASE_URL não configurado"
- Verifique se `.env` existe e contém `DATABASE_URL`
- Certifique-se de que PostgreSQL está rodando

### Erro: "JWT_SECRET não configurado"
- Adicione `JWT_SECRET` no arquivo `.env`

### Erro: "Validação falhou"
- Verifique se todos os campos obrigatórios foram enviados
- Confira os formatos esperados na documentação Swagger

### Erro: "Token inválido"
- Verifique se o token está no formato correto
- Copie `Authorization: Bearer SEU_TOKEN`

---

## 📞 Suporte

- 📖 Consulte a documentação Swagger: http://localhost:3333/api/docs
- 📚 Veja exemplos em [GUIA_USO.md](./GUIA_USO.md)
- 🐛 Verifique logs em `logs/error.log`

---

## 📄 Licença

MIT - Livre para usar e modificar

---

## 👨‍💻 Autor

**Pedro Miguel Andrade de Souza**

---

## 🙌 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## ⭐ Se foi útil, não esqueça da estrela!

```
        ⭐
       /|\
      / | \
     /  |  \
   ClickFretes
```

---

**Última atualização**: Junho 2026
**Versão**: 1.0.0
