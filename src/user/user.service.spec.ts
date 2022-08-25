import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import * as dayjs from 'dayjs';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const user = {
    id: 'testID',
    email: 'user@mail.com',
    username: 'testUsername',
    password: 'testPass',
    role: Role.USER,
  };
  const emailUsage = {
    id: 'usageId',
    user: user,
    userId: user.id,
    dailyUsage: 5,
    lastEmailDate: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should increase daily usage', async () => {
    prisma.emailUsage.findUnique = jest.fn().mockReturnValueOnce(emailUsage);
    prisma.emailUsage.update = jest.fn().mockReturnValueOnce(emailUsage);

    await service.addEmailUsage(user);
    expect(prisma.emailUsage.update).toBeCalledWith({
      where: { userId: user.id },
      data: {
        dailyUsage: emailUsage.dailyUsage + 1, // Daily usage should be increased by one
        lastEmailDate: expect.any(Date),
      },
    });
  });

  it('should not increase daily usage', async () => {
    prisma.emailUsage.findUnique = jest.fn().mockReturnValueOnce({
      ...emailUsage,
      dailyUsage: +process.env.MAX_EMAIL_USAGE, // max daily usage
    });

    await expect(service.addEmailUsage(user)).rejects.toEqual(
      new BadRequestException('Max daily usage reached'),
    );
  });

  it('should reset daily usage', async () => {
    prisma.emailUsage.findUnique = jest.fn().mockReturnValueOnce({
      ...emailUsage,
      lastEmailDate: dayjs().subtract(24, 'hour').toDate(), // Last email date will always be some time in the previous day so count should be reset
    });
    prisma.emailUsage.update = jest.fn().mockReturnValueOnce(emailUsage);

    await service.addEmailUsage(user);
    expect(prisma.emailUsage.update).toBeCalledWith({
      where: { userId: user.id },
      data: {
        dailyUsage: 1, // Daily usage reset
        lastEmailDate: expect.any(Date),
      },
    });
  });

  it('should not create repeated usernames', async () => {
    prisma.user.findFirst = jest.fn().mockReturnValueOnce(user);
    await expect(
      service.createUser({ ...user, email: 'user2@mail.com' }), // only username is repeated
    ).rejects.toEqual(new BadRequestException('Email/Username already exists'));
  });

  it('should not create repeated usernames', async () => {
    prisma.user.findFirst = jest.fn().mockReturnValueOnce(user);
    await expect(
      service.createUser({ ...user, username: 'testUsername2' }), // only email is repeated
    ).rejects.toEqual(new BadRequestException('Email/Username already exists'));
  });
});
