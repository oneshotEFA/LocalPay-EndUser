export interface SingleDepositDto {
  amount: number;
  paymentMethod: string;
  verificationMethod: string;
  rawProof?: string | null;
}

export interface BulkReceiptDto {
  rawProof?: string | null;
  telegramFileId?: string | null;
  amount: number;
}

export interface BulkDepositDto {
  declaredTotal: number;
  paymentMethod: string;
  verificationMethod: string;
  receipts: BulkReceiptDto[];
}

export function buildSingleDepositDto(input: {
  amount: number;
  paymentMethod: string;
  verificationMethod: string;
  rawProof?: string | null;
}): SingleDepositDto {
  return {
    amount: input.amount,
    paymentMethod: input.paymentMethod,
    verificationMethod: input.verificationMethod,
    rawProof: input.rawProof ?? null,
  };
}
