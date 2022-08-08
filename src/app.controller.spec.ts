import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentService } from './student/student.service';

describe('AppController', () => {
  let appController: AppController;
  let spyService: StudentService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: StudentService,
      useFactory: () => ({
        getGpa: jest.fn(() => 4.5),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ApiServiceProvider],
    }).compile();

    appController = app.get<AppController>(AppController);
    spyService = app.get<StudentService>(StudentService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('greet', () => {
    it("should return 'Hello! Greetings from monsuru'", () => {
      expect(appController.greet()).toBe('Hello! Greetings from monsuru');
    });
  });

  describe('getGpa', () => {
    it('should call getGpa for a student', () => {
      const firstName = 'Joe';
      const secondName = 'Foo';
      appController.getStudentGpa(firstName, secondName);
      expect(spyService.getGpa).toHaveBeenCalled();
    });
  });

  describe('getGpa', () => {
    it('should retrieve getGpa for a student', async () => {
      const firstName = 'Joe';
      const secondName = 'Foo';
      expect(spyService.getGpa(firstName, secondName)).toBe(4.5);
    });
  });
});
