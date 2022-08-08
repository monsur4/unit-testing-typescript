import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Student } from 'src/student/student.service';

@Injectable()
export class ApiService {
  constructor(private readonly http: HttpService) {}
  async getStudent(firstName: string, lastName: string): Promise<Student> {
    const url = `../get-student?firstName=${firstName}&lastName=${lastName}`;
    const response = await this.http.get(url).toPromise();
    return response.data;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
