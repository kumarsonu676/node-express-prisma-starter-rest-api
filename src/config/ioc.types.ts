export const TYPES = {
  HealthController: Symbol.for('HealthController'),

  UnitOfService: Symbol.for('UnitOfService'),
  PrismaService: Symbol.for('PrismaService'),
  CountryService: Symbol.for('CountryService'),

  CountryRepository: Symbol.for('CountryRepository'),
};

export const TYPES_AUTH = {
  AuthRepository: Symbol.for('AuthRepository'),
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),
};
