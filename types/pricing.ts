// types/pricing.ts
export interface Pricing {
    _id: string;
    _type: 'pricing';
    level: string; // Title of the pricing card
    fullPrice: string; // Full price of the product (include currency)
    earlyBirdPrice: string; // Price for early bird
    earlyBirdDeadline: string; // Last date for early bird purchase
    threePayments: string; // Price for three payments
    fourPayments: string; // Price for four payments
    horarium: string; // Indicating hours of study
    description: string; // Description of the pricing level
  }