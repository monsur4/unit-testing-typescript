import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from '../api/api.service';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let spyService: ApiService;

  class ApiServiceMock {
    getStudent(_firstName: string, _lastName: string) {
      return {
        name: 'Jane Doe',
        grades: [3.7, 3.8, 3.9, 4.0, 3.6],
      };
    }
  }

  const ApiServiceProvider = {
    provide: ApiService,
    useClass: ApiServiceMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, ApiServiceProvider],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGpa', () => {
    it('should get student gpa', async () => {
      const firstName = 'Jane';
      const lastName = 'Doe';

      const expectedGpa = 3.8;
      expect(await service.getGpa(firstName, lastName)).toEqual(expectedGpa);
    });
  });
});
