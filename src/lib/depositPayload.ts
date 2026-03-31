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
