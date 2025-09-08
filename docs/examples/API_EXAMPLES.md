# Testando a API

Aqui estão alguns exemplos de como testar a API usando curl ou um cliente HTTP como Postman/Insomnia.

## 🔐 Autenticação

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Resposta esperada:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "dev-token",
      "refreshToken": "dev-refresh-token",
      "expiresIn": 3600
    }
  },
  "message": "Login realizado com sucesso",
  "timestamp": "2024-12-19T..."
}
```

## 👤 Usuários

### Obter dados do usuário atual

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer dev-token"
```

### Atualizar usuário

```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Nome"
  }'
```

## 📋 Campanhas

### Listar campanhas

```bash
curl -X GET "http://localhost:3000/api/campaigns?page=1&limit=10" \
  -H "Authorization: Bearer dev-token"
```

### Criar campanha

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Minha Nova Campanha",
    "description": "Descrição da campanha",
    "type": "giveaway",
    "startDate": "2024-12-20T00:00:00.000Z",
    "endDate": "2024-12-30T23:59:59.000Z",
    "settings": {
      "maxParticipants": 1000,
      "requiresApproval": false,
      "allowMultipleEntries": true
    }
  }'
```

## 🧪 Testes de Rate Limiting

### Testar limite de auth (10 req/min)

```bash
# Execute múltiplas vezes rapidamente
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test","password":"test"}' \
    -w "Tentativa $i: %{http_code}\n"
done
```

### Testar limite padrão (100 req/min)

```bash
# Execute múltiplas vezes rapidamente
for i in {1..105}; do
  curl -X GET http://localhost:3000/api/users/me \
    -H "Authorization: Bearer dev-token" \
    -w "Tentativa $i: %{http_code}\n" \
    -s -o /dev/null
done
```

## ❌ Testes de Erro

### Login com dados inválidos

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email-inválido",
    "password": "123"
  }'
```

### Acesso sem token

```bash
curl -X GET http://localhost:3000/api/users/me
```

### Token inválido

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer token-inválido"
```

### Método não permitido

```bash
curl -X DELETE http://localhost:3000/api/users/me \
  -H "Authorization: Bearer dev-token"
```

### Campanha com dados inválidos

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A",
    "type": "tipo-inválido",
    "startDate": "data-inválida",
    "endDate": "2024-12-19T00:00:00.000Z"
  }'
```

## 📊 Respostas Esperadas

### Sucesso (200/201)

```json
{
  "success": true,
  "data": {
    /* dados */
  },
  "message": "Operação realizada com sucesso",
  "timestamp": "2024-12-19T..."
}
```

### Erro de Validação (400)

```json
{
  "success": false,
  "error": "Dados de login inválidos",
  "timestamp": "2024-12-19T..."
}
```

### Não Autorizado (401)

```json
{
  "success": false,
  "error": "Token de acesso necessário",
  "timestamp": "2024-12-19T..."
}
```

### Rate Limit Excedido (429)

```json
{
  "success": false,
  "error": "Muitas tentativas de login. Tente novamente em 1 minuto.",
  "timestamp": "2024-12-19T..."
}
```

## 🔧 Dicas

1. **Use ferramentas de desenvolvimento**:
   - Postman/Insomnia para testes visuais
   - Thunder Client (VS Code extension)
   - REST Client (VS Code extension)

2. **Headers importantes**:
   - `Content-Type: application/json` para POST/PUT
   - `Authorization: Bearer <token>` para autenticação
   - Verifique headers `X-RateLimit-*` nas respostas

3. **Parâmetros de query para paginação**:
   - `page`: número da página
   - `limit`: itens por página (máx: 100)
   - `sortBy`: campo de ordenação
   - `sortOrder`: asc ou desc

4. **Token de desenvolvimento**:
   - Use `dev-token` para bypass da validação JWT
   - Em produção, use tokens JWT reais
