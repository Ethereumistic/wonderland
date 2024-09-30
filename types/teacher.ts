// types/teacher.ts
export interface TeacherType {
    _id: string;
    name: string;
    image: { asset: { url: string } }; // Changed to a single image object
    description?: string;
    experience?: string[]; // Changed to an array of strings
  }