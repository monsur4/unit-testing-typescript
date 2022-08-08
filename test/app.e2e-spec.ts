import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ApiService } from '../src/api/api.service';
import { StudentService } from '../src/student/student.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: [ApiService, StudentService],
    }).compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);
    await app.init();
  });

  describe('getGpa', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/student')
        .expect(200)
        .expect('Hello World!');
    });
  });

  it('/greet (GET)', () => {
    return request(app.getHttpServer())
      .get('/student/greet')
      .expect(200)
      .expect('Hello! Greetings from monsuru');
  });

  it('GET student GPA if API finds the student', async () => {
    const result: AxiosResponse = {
      data: {
        name: 'Jane Doe',
        grades: [3.7, 3.8, 3.9, 4.0, 3.6],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
    const expectedGpaString = '3.8';
    const response = await request(app.getHttpServer())
      .get('/student/gpa?firstName=Jane&lastName=Doe')
      .expect(200);
    expect(response.text).toEqual(expectedGpaString);
  });

  it('throws error if get request does not include student name', async () => {
    return await request(app.getHttpServer())
      .get('/student/gpa?firstName=&lastName=')
      .expect(400);
  });

  it('throws error if api cannot find student', async () => {
    const result: AxiosResponse = {
      data: {},
      status: 404,
      statusText: '',
      headers: {},
      config: {},
    };
    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));

    return await request(app.getHttpServer())
      .get('/student/gpa?firstName=Anna&lastName=Julia')
      .expect(404);
  });

  it('throws error if student does not have grades assigned', async () => {
    const result: AxiosResponse = {
      data: { name: 'Davy Jones' },
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    };

    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
    return await request(app.getHttpServer())
      .get('/student/gpa?firstName=Davy&lastName=Jones')
      .expect(404);
  });
});
