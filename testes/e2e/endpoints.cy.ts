type TestUser = {
  name: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'DRIVER';
  phone: string;
  vehicleType?: string;
  vehiclePlate?: string;
};

const unique = Date.now();
const password = '123456';
const client: TestUser = {
  name: 'Cliente Cypress',
  email: `cliente.cypress.${unique}@example.com`,
  password,
  role: 'CLIENT',
  phone: '11999999999',
};
const driver: TestUser = {
  name: 'Motorista Cypress',
  email: `motorista.cypress.${unique}@example.com`,
  password,
  role: 'DRIVER',
  phone: '11988888888',
  vehicleType: 'Van',
  vehiclePlate: `CYP${String(unique).slice(-4)}`,
};

describe('Endpoints da API ClickFretes', () => {
  let clientToken = '';
  let driverToken = '';
  let freightId = '';

  it('responde ao health check', () => {
    cy.request('/health').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('ok');
      expect(response.body.timestamp).to.be.a('string');
    });
  });

  it('cadastra cliente e motorista', () => {
    cy.request('POST', '/register', client).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.email).to.equal(client.email);
      expect(response.body.role).to.equal('CLIENT');
      expect(response.body.password).to.be.undefined;
    });

    cy.request('POST', '/register', driver).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.email).to.equal(driver.email);
      expect(response.body.role).to.equal('DRIVER');
      expect(response.body.driver.vehicleType).to.equal(driver.vehicleType);
    });
  });

  it('rejeita cadastro inválido e login com credenciais incorretas', () => {
    cy.request({
      method: 'POST',
      url: '/register',
      failOnStatusCode: false,
      body: { name: 'Inválido', email: 'email-invalido', password, role: 'CLIENT', phone: '123' },
    }).its('status').should('equal', 400);

    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false,
      body: { email: client.email, password: 'senha-incorreta' },
    }).its('status').should('equal', 401);
  });

  it('faz login e consulta o usuário autenticado', () => {
    cy.request('POST', '/login', { email: client.email, password }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.a('string');
      clientToken = response.body.token;
    });

    cy.request('POST', '/login', { email: driver.email, password }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.a('string');
      driverToken = response.body.token;
    });

    cy.then(() => {
      cy.request({ headers: { Authorization: `Bearer ${clientToken}` }, url: '/me' }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(client.email);
      });
    });
  });

  it('executa o fluxo principal de frete pelos endpoints', () => {
    cy.request({
      method: 'POST',
      url: '/freights',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: {
        pickupAddress: 'Rua Cypress Origem, 100',
        dropoffAddress: 'Rua Cypress Destino, 200',
        price: 250,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('REQUESTED');
      freightId = response.body.id;
    });

    cy.then(() => {
      cy.request({ headers: { Authorization: `Bearer ${driverToken}` }, url: '/freights/available' }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.some((freight: { id: string }) => freight.id === freightId)).to.equal(true);
      });

      cy.request({
        method: 'PATCH',
        url: `/freights/${freightId}/accept`,
        headers: { Authorization: `Bearer ${driverToken}` },
      }).its('body.status').should('equal', 'ACCEPTED');

      cy.request({
        method: 'PATCH',
        url: `/freights/${freightId}/start`,
        headers: { Authorization: `Bearer ${driverToken}` },
      }).its('body.status').should('equal', 'IN_PROGRESS');

      cy.request({
        method: 'PATCH',
        url: `/freights/${freightId}/finish`,
        headers: { Authorization: `Bearer ${driverToken}` },
      }).its('body.status').should('equal', 'FINISHED');

      cy.request({
        method: 'POST',
        url: '/reviews',
        headers: { Authorization: `Bearer ${clientToken}` },
        body: { freightId, rating: 5, comment: 'Fluxo testado pelo Cypress' },
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.freightId).to.equal(freightId);
        expect(response.body.rating).to.equal(5);
      });
    });
  });

  it('protege rotas autenticadas e permissões por perfil', () => {
    cy.request({ method: 'GET', url: '/me', failOnStatusCode: false }).its('status').should('equal', 401);

    cy.request({
      method: 'GET',
      url: '/freights/available',
      headers: { Authorization: `Bearer ${clientToken}` },
      failOnStatusCode: false,
    }).its('status').should('equal', 403);
  });
});
