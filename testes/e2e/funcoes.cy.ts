import {
  CreateFreightSchema,
  CreateReviewSchema,
  LoginSchema,
  PaginationSchema,
  RegisterSchema,
} from '../../src/validators';
import { AppError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../src/utils/AppError';

describe('Funções e schemas de validação', () => {
  it('valida cadastro de cliente e motorista', () => {
    expect(RegisterSchema.safeParse({
      name: 'Cliente Teste',
      email: 'cliente@example.com',
      password: '123456',
      role: 'CLIENT',
      phone: '11999999999',
    }).success).to.equal(true);

    expect(RegisterSchema.safeParse({
      name: 'Motorista Teste',
      email: 'motorista@example.com',
      password: '123456',
      role: 'DRIVER',
      phone: '11988888888',
      vehicleType: 'Van',
      vehiclePlate: 'ABC1D23',
    }).success).to.equal(true);

    expect(RegisterSchema.safeParse({
      name: 'Motorista Sem Veiculo',
      email: 'motorista-sem-veiculo@example.com',
      password: '123456',
      role: 'DRIVER',
      phone: '11988888888',
    }).success).to.equal(false);
  });

  it('valida login, criação de frete, avaliação e paginação', () => {
    expect(LoginSchema.safeParse({ email: 'user@example.com', password: '123456' }).success).to.equal(true);
    expect(LoginSchema.safeParse({ email: 'email-invalido', password: '' }).success).to.equal(false);

    expect(CreateFreightSchema.safeParse({
      pickupAddress: 'Rua Origem, 100',
      dropoffAddress: 'Rua Destino, 200',
      price: 150,
    }).success).to.equal(true);
    expect(CreateFreightSchema.safeParse({
      pickupAddress: 'Rua Igual, 100',
      dropoffAddress: 'Rua Igual, 100',
      price: 150,
    }).success).to.equal(false);

    expect(CreateReviewSchema.safeParse({
      freightId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 5,
      comment: 'Excelente serviço',
    }).success).to.equal(true);
    expect(CreateReviewSchema.safeParse({
      freightId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 6,
    }).success).to.equal(false);

    const pagination = PaginationSchema.parse({ page: '2', limit: '5' });
    expect(pagination).to.deep.equal({ page: 2, limit: 5 });
  });

  it('mantém status code e mensagens nos erros da aplicação', () => {
    const appError = new AppError('Erro genérico', 500);
    const unauthorized = new UnauthorizedError('Não autorizado');
    const forbidden = new ForbiddenError('Proibido');
    const notFound = new NotFoundError('Frete');
    const conflict = new ConflictError('Conflito');

    expect(appError.statusCode).to.equal(500);
    expect(unauthorized.statusCode).to.equal(401);
    expect(forbidden.statusCode).to.equal(403);
    expect(notFound.statusCode).to.equal(404);
    expect(notFound.message).to.equal('Frete não encontrado');
    expect(conflict.statusCode).to.equal(409);
  });
});
