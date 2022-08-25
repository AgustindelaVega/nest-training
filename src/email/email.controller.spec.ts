import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { Role } from '@prisma/client';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EmailController', () => {
  let controller: EmailController;
  let service: EmailService;
  let userService: UserService;
  const email = {
    to: 'to@email.com',
    subject: 'test subject',
    text: 'test content',
  };
  const user = {
    id: 'testID',
    email: 'user@mail.com',
    username: 'testUsername',
    password: 'testPass',
    role: Role.USER,
  };
  const req = {
    user: user,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [EmailService, UserService, PrismaService],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    service = module.get<EmailService>(EmailService);
    userService = module.get<UserService>(UserService);
  });

  it('Should send email', () => {
    jest.spyOn(service, 'sendEmail').mockImplementation();

    // expect(await catsController.findAll()).toBe(result);
    controller.sendEmail(req, email);
    expect(service.sendEmail).toBeCalledWith(user, email);
  });

  it('should call increase email usage count', () => {
    jest.spyOn(userService, 'addEmailUsage').mockImplementation();

    // expect(await catsController.findAll()).toBe(result);
    controller.sendEmail(req, email);
    expect(userService.addEmailUsage).toBeCalledWith(user);
  });
});
