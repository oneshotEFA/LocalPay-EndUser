import "dotenv/config";
import { buildCheckoutToken } from "@/lib/token";

async function main() {
  const token = await buildCheckoutToken({
    userId: "1547236567",
    email: "test@gmail.com",
    checkoutId: "checkout_test_001",
    invoiceId: "invoice_test_001",
    amount: 1,
  });

  console.log(`http://localhost:3001/deposit/${token}`);
}

main();
