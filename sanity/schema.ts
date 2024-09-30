import { type SchemaTypeDefinition } from 'sanity'
import teacher from './teacher'
import pricing from './pricing'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [teacher, pricing],
}
