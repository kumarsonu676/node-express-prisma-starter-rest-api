import app from './app';
import container from './config/ioc.config';
import { TYPES } from './config/ioc.types';
import { PrismaService } from './services/prisma.service';

const PORT = process.env.PORT || 3001;

const prismaService = container.get<PrismaService>(TYPES.PrismaService);

process.on('SIGINT', async () => {
  await prismaService.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prismaService.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
