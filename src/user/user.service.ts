import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    select?: Prisma.UserSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const existsByUsernameOrEmail = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });
    if (existsByUsernameOrEmail)
      throw new BadRequestException('Email/Username already exists');

    data.password = await bcrypt.hashSync(data.password, 10);
    data.emailUsage = {
      create: {
        dailyUsage: 0,
        lastEmailDate: new Date(),
      },
    };
    return this.prisma.user.create({
      data,
    });
  }

  async addEmailUsage(user: User) {
    const usage = await this.prisma.emailUsage.findUnique({
      where: { userId: user.id },
    });
    if (!usage) throw new BadRequestException('User not found');
    if (usage.dailyUsage >= +process.env.MAX_EMAIL_USAGE)
      throw new BadRequestException('Max daily usage reached');

    const shouldResetUsage =
      usage.lastEmailDate.getDay() !== new Date().getDay();

    return this.prisma.emailUsage.update({
      where: { userId: user.id },
      data: {
        dailyUsage: shouldResetUsage ? 1 : usage.dailyUsage + 1,
        lastEmailDate: new Date(),
      },
    });
  }

  async usersWithDailyEmailUsage() {
    return this.users({
      select: {
        id: true,
        username: true,
        email: true,
        emailUsage: {
          select: {
            dailyUsage: true,
            lastEmailDate: true,
          },
        },
      },
      where: {
        AND: [
          {
            emailUsage: {
              is: {
                dailyUsage: {
                  gt: 0,
                },
              },
            },
          },
          {
            emailUsage: {
              is: {
                lastEmailDate: {
                  gt: dayjs().startOf('day').toDate(),
                },
              },
            },
          },
        ],
      },
    });
  }
}
