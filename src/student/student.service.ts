import { HttpException, Injectable } from '@nestjs/common';
import { ApiService } from '../api/api.service';

export interface Student {
  name: string;
  grades: number[];
}

@Injectable()
export class StudentService {
  constructor(private readonly apiService: ApiService) {}
  public async getGpa(firstName: string, lastName: string): Promise<number> {
    const student: Student = await this.apiService.getStudent(
      firstName,
      lastName,
    );

    if (!student || !student.grades) {
      throw new HttpException('Cannot find student or student grades', 404);
    }
    let score = 0;

    for (const grade of student.grades) {
      score += grade;
    }

    return score / student.grades.length;
  }
}
