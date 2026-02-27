import { injectable } from 'inversify';
import container from '../../config/ioc.config';
import { TYPES_COMMON } from '../../config/ioc.types';
import { PrismaService } from '../../services/prisma.service';
import { Role, User, UserRoleMapping } from '../../prisma/generated/prisma/client';

@injectable()
export class AuthRepository {
  constructor(private prisma = container.get<PrismaService>(TYPES_COMMON.PrismaService)) {
  }

  async findByUsername(username: string): Promise<(User & { userRoles: (UserRoleMapping & { role: Role })[] }) | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findByIdWithRoles(userId: string): Promise<(User & { userRoles: (UserRoleMapping & { role: Role })[] }) | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}
