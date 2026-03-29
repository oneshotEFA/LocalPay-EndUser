"use client";

import { useDepositStore, VerificationMethod } from "@/store/deposit.store";
import { Link2, Image, MessageSquare, ArrowLeft, ArrowRight, Check } from "lucide-react";
import clsx from "clsx";
import { Fragment } from "react";

const BANK_SENDER: Record<string, string> = {
  CBE: "CBE",
  TELEBIRR: "Telebirr",
  EBIRR: "eBirr",
  ABYSSINIA: "Bank of Abyssinia",
  NIB: "NIB Bank",
};

const DEMO_SMS: Record<string, string> = {
  CBE: `Dear Mr, You have transfered ETB 1.00 to Ephrem Mesfin on 24/03/2026 at 14:55:21 from your account 1*********8625. Your account has been debited with a S.charge of ETB 0.00 and VAT(15%) of ETB0.00 and Disaster Fund (5%) of ETB0.00, with a total of ETB 1.00. Thank you for Banking with CBE! https://apps.cbe.com.et:100/?id=FT26083LN1YR80798625 For feedback click the link https://forms.gle/R1s9nkJ6qZVCxRVu9`,
  TELEBIRR: `Dear Ephrem You have transferred ETB 1.00 to CHALTU HIRPHASA (2519****7857) on 24/03/2026 20:59:48. Your transaction number is DCK82EGB8C. https://transactioninfo.ethiotelecom.et/receipt/DCK82EGB8C Thank you for using telebirr  Ethio telecom`,
  EBIRR: `[-EBIRR-KAAFI-] Dear Ephrem, You have successfully transferred ETB1.00 to Chaltu Hirphasa on 24/03/2026 at 15:02:11. Transfer-Id: 2034819274651. Charges: ETB0.00 with VAT: ETB0.00. https://transactioninfo.ebirr.com/kaafimf-Ebirr/receipt/2034819274651`,
  ABYSSINIA: `Dear Customer, ETB 1.00 has been debited from your account and transferred to Ephrem Mesfin on 24/03/2026 at 14:58:00. Transaction Ref FT26083J258M. Thank you for banking with Bank of Abyssinia. https://cs.bankofabyssinia.com/slip/?trx=FT26083J258M`,
  NIB: `Dear Customer, Your account has been debited with ETB 1.00 on 24/03/2026 at 15:01:44. Beneficiary: Ephrem Mesfin. Reference: NIB2026083001234. Thank you for choosing NIB International Bank.`,
};

const DEMO_LINK: Record<string, string> = {
  CBE: "https://apps.cbe.com.et:100/?id=FT26083LN1YR80798625",
  TELEBIRR: "https://transactioninfo.ethiotelecom.et/receipt/DCK82EGB8C",
  EBIRR: "https://transactioninfo.ebirr.com/kaafimf-Ebirr/receipt/2034819274651",
  ABYSSINIA: "https://cs.bankofabyssinia.com/slip/?trx=FT26083J258M",
  NIB: "https://nibbank.et/transaction/NIB2026083001234",
};

const DEMO_PHOTOS: Record<string, string> = {
  CBE: "https://res.cloudinary.com/dv5ngz0tc/image/upload/photo_2026-03-25_14-49-27_ftbp4t.jpg",
  TELEBIRR: "https://res.cloudinary.com/dv5ngz0tc/image/upload/photo_2026-03-25_15-05-45_tmv2z2.jpg",
  EBIRR: "https://res.cloudinary.com/dv5ngz0tc/image/upload/photo_2026-03-25_15-02-15_gqajvm.jpg",
  ABYSSINIA: "https://res.cloudinary.com/dv5ngz0tc/image/upload/photo_2026-03-25_14-56-43_d44b7j.jpg",
  NIB: "https://res.cloudinary.com/dv5ngz0tc/image/upload/photo_2026-03-25_14-56-43_d44b7j.jpg",
};

function SmsBubble({ senderName, text }: { senderName: string; text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-background shadow-inner">
      <div className="bg-surface border-b border-border px-3 py-2 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-surfaceHover flex items-center justify-center text-[10px] font-bold text-textMain shrink-0">
          {senderName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-[11px] font-bold text-textMain leading-none">
            {senderName}
          </p>
          <p className="text-[9px] text-textMuted mt-0.5 font-medium">
            SMS · Example message
          </p>
        </div>
      </div>
      <div className="p-4 bg-background">
        <div className="flex items-end gap-2">
          <div className="relative max-w-[92%] bg-surfaceHover rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-border/50">
            <p className="text-[11px] text-textMain leading-relaxed break-words whitespace-pre-wrap font-mono font-medium">
              {parts.map((part, i) =>
                part.match(/^https?:\/\//) ? (
                  <span
                    key={i}
                    className="text-blue-500 underline underline-offset-2 break-all"
                  >
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
            </p>
            <span
              className="absolute -bottom-[1px] -left-[5px] w-3 h-3 bg-surfaceHover border-l border-b border-border/50"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
            />
          </div>
        </div>
        <p className="text-[10px] text-textMuted mt-4 ml-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Copy the full message exactly as shown.
        </p>
      </div>
    </div>
  );
}

function LinkPreview({ url }: { url: string }) {
  const splitIdx = url.indexOf("?");
  const base = splitIdx !== -1 ? url.slice(0, splitIdx) : url;
  const query = splitIdx !== -1 ? url.slice(splitIdx) : "";

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-background shadow-inner">
      <div className="bg-surface border-b border-border px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2 bg-background border border-border rounded px-2 py-0.5 flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] text-green-500 shrink-0">🔒</span>
          <span className="text-[10px] text-textMuted font-mono truncate font-medium">
            {base}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-[10px] text-textMuted uppercase tracking-wider font-bold">
          Example transaction link
        </p>
        <div className="bg-surface rounded-lg px-4 py-3 border border-border shadow-sm">
          <span className="font-mono text-[11px] break-all leading-relaxed font-medium">
            <span className="text-textMain">{base}</span>
            <span className="text-blue-500">{query}</span>
          </span>
        </div>
        <p className="text-[10px] text-textMuted mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Open your bank app → Copy the share link.
        </p>
      </div>
    </div>
  );
}

const METHODS: {
  key: VerificationMethod;
  label: string;
  badge: string;
  icon: React.ElementType;
}[] = [
  {
    key: "LINK",
    label: "Link",
    badge: "Fastest",
    icon: Link2,
  },
  {
    key: "SCREENSHOT",
    label: "Screenshot",
    badge: "Easy",
    icon: Image,
  },
  {
    key: "SMS",
    label: "SMS",
    badge: "Reliable",
    icon: MessageSquare,
  },
];

export default function StepVerMethod() {
  const { verificationMethod, paymentMethod, setVerificationMethod, setStep } = useDepositStore();

  const demoSms = paymentMethod ? DEMO_SMS[paymentMethod] : null;
  const demoLink = paymentMethod ? DEMO_LINK[paymentMethod] : null;
  const demoPhoto = paymentMethod ? DEMO_PHOTOS[paymentMethod] : null;
  const senderName = paymentMethod ? BANK_SENDER[paymentMethod] : "Bank";

  const renderVerificationInstructions = () => (
    <>
      <p className="text-[10px] font-black text-textMuted tracking-widest uppercase mb-3 px-1">
        Instructions
      </p>
      <div className="card p-5 bg-background shadow-inner border border-border relative z-20">
        
        <div className="mb-6">
          {verificationMethod === "LINK" && demoLink && <LinkPreview url={demoLink} />}
          
          {verificationMethod === "SCREENSHOT" && demoPhoto && (
            <div className="rounded-xl overflow-hidden border border-border shadow-inner bg-background">
              <img
                src={demoPhoto}
                alt="Screenshot example"
                className="w-full object-contain max-h-48 md:max-h-60 mix-blend-multiply dark:mix-blend-normal"
              />
              <div className="px-5 py-4 bg-surface border-t border-border">
                <p className="text-xs text-textMuted leading-relaxed font-medium">
                  Make sure <span className="text-textMain font-bold">amount, date, recipient</span> and <span className="text-textMain font-bold">transaction ID</span> are fully visible.
                </p>
              </div>
            </div>
          )}
          
          {verificationMethod === "SMS" && demoSms && (
            <SmsBubble senderName={senderName} text={demoSms} />
          )}
        </div>

        <button
          onClick={() => setStep(4)}
          className="btn-primary w-full h-14 text-base font-bold flex items-center justify-center gap-2 group shadow-md"
        >
          Continue to Upload <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col w-full animate-fade-in-up stagger">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setStep(2)} 
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surfaceHover text-textMuted hover:text-textMain transition-colors shrink-0 outline-none focus:ring-2 focus:ring-blue-500/50 ring-offset-2 ring-offset-background"
          aria-label="Go back"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-textMain tracking-tight">
            Proof Strategy
          </h2>
          <p className="text-sm font-medium text-textMuted mt-1">
            How would you like to verify this transfer?
          </p>
        </div>
      </div>

      <div className="card shadow-sm border-border p-3 md:p-6 mb-8 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {METHODS.map(({ key, label, badge, icon: Icon }) => {
            const isSelected = verificationMethod === key;

            return (
              <Fragment key={key}>
                <button
                  onClick={() => setVerificationMethod(key)}
                  className={clsx(
                    "relative group flex items-center md:flex-col md:justify-center p-4 rounded-xl transition-all duration-200 outline-none w-full",
                    "border shadow-sm hover:shadow-md",
                    "md:aspect-square",
                    isSelected
                      ? "border-blue-500 bg-blue-600/5 ring-1 ring-blue-500"
                      : "border-border bg-background hover:border-textMuted",
                  )}
                >
                  {key === "LINK" && !isSelected && (
                    <span className="absolute -top-2 md:left-1/2 md:-translate-x-1/2 right-4 md:right-auto bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm whitespace-nowrap z-10">
                      {badge}
                    </span>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check size={10} strokeWidth={4} className="text-white" />
                    </div>
                  )}

                  <div
                    className={clsx(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 md:mb-3 outline outline-1 outline-border",
                      isSelected
                        ? "bg-blue-600 text-white scale-110 outline-blue-500/50"
                        : "bg-surfaceHover text-textMuted border border-border group-hover:scale-105",
                    )}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <span 
                    className={clsx(
                      "text-sm md:text-xs font-bold md:text-center w-full truncate px-4 md:px-1 flex-1 text-left",
                      isSelected ? "text-textMain" : "text-textMuted group-hover:text-textMain"
                    )}
                  >
                    {label}
                  </span>
                </button>
                {isSelected && (
                  <div className="md:hidden animate-fade-in-up mb-2">
                    {renderVerificationInstructions()}
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {verificationMethod && (
        <div className="hidden md:block animate-fade-in-up">
          {renderVerificationInstructions()}
        </div>
      )}
    </div>
  );
}
