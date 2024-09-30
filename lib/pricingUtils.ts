// utils/pricingUtils.ts
import { client } from '@/sanity/lib/client'; // Adjust the import path as necessary
import { Pricing } from '@/types/pricing'; // Adjust the import path as necessary

export async function getPricing(id: string): Promise<Pricing> {
  const query = `*[_type == "pricing" && _id == '${id}'][0]{
    ...
  }`;
  return client.fetch(query);
}

export async function getPricings(): Promise<Pricing[]> {
  const query = `*[_type == "pricing"] | order(_createdAt asc) {
    ...
  }`;
  return client.fetch(query);
}