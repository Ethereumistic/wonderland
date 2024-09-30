// utils/teachersUtils.ts
import { client } from '@/sanity/lib/client'; // Adjust the import path as necessary
import { TeacherType } from '@/types/teacher'; // Adjust the import path as necessary

export async function getTeacher(id: string): Promise<TeacherType> {
  const query = `*[_type == "teacher" && _id == '${id}'][0]{
    ...,
    image {
      asset -> {
        url
      }
    }
  }`;
  return client.fetch(query);
}

export async function getTeachers(): Promise<TeacherType[]> {
  const query = `*[_type == "teacher"]{
    ...,
    image {
      asset -> {
        url
      }
    }
  }`;
  return client.fetch(query);
}