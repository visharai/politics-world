import { jsPDF } from 'jspdf';
import type { ClientTaxType, CurrencyCode } from '../data/adSlotsConfig';

/**
 * Normalize Unicode currency glyphs & punctuation for standard Helvetica WinAnsi PDF fonts
 * so PDF downloads always render crisp ASCII/ISO text across every viewer.
 */
function pdfSafe(input: string): string {
  return String(input || '')
    .replace(/₹/g, 'INR ')
    .replace(/€/g, 'EUR ')
    .replace(/£/g, 'GBP ')
    .replace(/→/g, ' -> ')
    .replace(/•/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E\n\r\t]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let cachedOfficialLogoDataUrl: string | null = null;
let logoPreloadStarted = false;

export function preloadOfficialLogo(): void {
  if (logoPreloadStarted || typeof window === 'undefined' || typeof document === 'undefined') return;
  logoPreloadStarted = true;
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || 1223;
        const h = img.naturalHeight || 205;
        const targetW = 480;
        const targetH = Math.max(1, Math.round((targetW * h) / w));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetW, targetH);
          cachedOfficialLogoDataUrl = canvas.toDataURL('image/png');
        }
      } catch {
        // ignore canvas conversion errors
      }
    };
    img.src = '/images/politics_world_logo.png';
  } catch {
    // ignore preload errors
  }
}

if (typeof window !== 'undefined') {
  preloadOfficialLogo();
}

function getPrintLogoUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/images/politics_world_logo.png`;
  }
  return '/images/politics_world_logo.png';
}

/**
 * Iframe-safe isolated A4 Print trigger (avoids window.open & prevents printing modal backdrops).
 */
export function printCleanHtmlDocument(docTitle: string, bodyHtml: string): void {
  if (typeof document === 'undefined') return;

  const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(docTitle)}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 12px;
      line-height: 1.5;
    }
    .pw-sheet { width: 100%; max-width: 780px; margin: 0 auto; }
    .pw-header {
      background: #070e24;
      color: #ffffff;
      padding: 18px 22px;
      border-bottom: 3px solid #d4af37;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    .pw-brand { font-size: 16px; font-weight: 800; letter-spacing: 0.08em; line-height: 1.1; }
    .pw-logo { height: 20px; width: auto; display: block; margin: 3px 0 6px; object-fit: contain; }
    .pw-sub { font-size: 11px; color: #cbd5e1; margin-top: 3px; }
    .pw-doc-type { text-align: right; }
    .pw-doc-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; color: #fbbf24; text-transform: uppercase; }
    .pw-doc-id { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; font-weight: 700; margin-top: 2px; }
    .pw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
    .pw-box {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 6px;
      padding: 12px 14px;
    }
    .pw-box-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 5px; }
    .pw-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; border: 1px solid #cbd5e1; }
    th { background: #f1f5f9; text-align: left; padding: 9px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; border-bottom: 1px solid #cbd5e1; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .pw-right { text-align: right; }
    .pw-totals { margin-top: 12px; margin-left: auto; width: 320px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; background: #f8fafc; }
    .pw-total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
    .pw-grand { border-top: 1.5px solid #0f172a; margin-top: 6px; padding-top: 8px; font-weight: 800; font-size: 14px; }
    .pw-footer { margin-top: 18px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #475569; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
    .pw-kv { width: 100%; border-collapse: collapse; margin-top: 14px; }
    .pw-kv td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    .pw-kv td:first-child { color: #475569; width: 34%; font-weight: 600; }
  </style>
</head>
<body>
  <div class="pw-sheet">${bodyHtml}</div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    setTimeout(() => {
      try {
        iframe.remove();
      } catch {
        // ignore
      }
    }, 500);
  };

  iframe.onload = () => {
    try {
      const win = iframe.contentWindow;
      if (!win) {
        cleanup();
        window.print();
        return;
      }
      win.onafterprint = cleanup;
      win.focus();
      win.print();
      setTimeout(cleanup, 4000);
    } catch {
      cleanup();
      try {
        window.print();
      } catch {
        // ignore
      }
    }
  };

  iframe.srcdoc = fullHtml;
  document.body.appendChild(iframe);
}

export interface CommercialInvoicePdfPayload {
  invoiceNumber: string;
  issueDate: string;
  clientType: ClientTaxType;
  currency: CurrencyCode;
  slotTitle: string;
  slotCategory: string;
  sac: string;
  durationDays: number;
  scheduleText: string;
  clientName: string;
  contactPerson?: string;
  clientAddress?: string;
  taxRegistration: string;
  placeOfSupply?: string;
  reverseCharge?: string;
  subtotalFormatted: string;
  taxLabel: string;
  taxFormatted: string;
  grandTotalFormatted: string;
  paymentMethod?: string;
  paymentReference?: string;
  targetUrl?: string;
}

export function downloadCommercialInvoicePdf(p: CommercialInvoicePdfPayload): string {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const posText = p.placeOfSupply || '07 - Delhi';
  const rcmText = p.reverseCharge || 'No';

  // Header Navy Bar
  doc.setFillColor(7, 14, 36);
  doc.rect(0, 0, pageWidth, 94, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 94, pageWidth, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('POLITICS WORLD INDIA MEDIA DESK', 40, cachedOfficialLogoDataUrl ? 30 : 38);

  if (cachedOfficialLogoDataUrl) {
    try {
      doc.addImage(cachedOfficialLogoDataUrl, 'PNG', 40, 35, 108, 18);
    } catch {
      // fallback to text-only header
    }
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`GSTIN: 07AAACP9921D1Z8 (07-Delhi)  |  SAC: ${pdfSafe(p.sac)}  |  Currency: ${p.currency}`, 40, cachedOfficialLogoDataUrl ? 67 : 56);
  doc.text(`POS: ${pdfSafe(posText)}  |  Reverse Charge: ${pdfSafe(rcmText)}  |  vrai74918@gmail.com`, 40, cachedOfficialLogoDataUrl ? 82 : 71);

  doc.setTextColor(251, 191, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TAX INVOICE (INDIA GST)', pageWidth - 40, 34, { align: 'right' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(pdfSafe(p.invoiceNumber), pageWidth - 40, 52, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Date: ${pdfSafe(p.issueDate)}`, pageWidth - 40, 68, { align: 'right' });

  // Client & Schedule Boxes
  const boxTop = 114;
  const colW = (pageWidth - 96) / 2;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(40, boxTop, colW, 114, 4, 4, 'FD');
  doc.roundedRect(40 + colW + 16, boxTop, colW, 114, 4, 4, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const clientTypeLabel =
    p.clientType === 'b2b' ? 'BILLED TO (INDIA B2B REGISTERED)' : 'BILLED TO (INDIA B2C · RULE 46 URP)';
  doc.text(pdfSafe(clientTypeLabel), 52, boxTop + 18);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(pdfSafe(p.clientName || 'Indian Advertiser').slice(0, 42), 52, boxTop + 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  let leftY = boxTop + 52;
  if (p.contactPerson) {
    doc.text(pdfSafe(p.contactPerson).slice(0, 44), 52, leftY);
    leftY += 13;
  }
  if (p.clientAddress) {
    const addrLines = doc.splitTextToSize(pdfSafe(p.clientAddress), colW - 24).slice(0, 2);
    doc.text(addrLines, 52, leftY);
    leftY += addrLines.length * 11;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(pdfSafe(p.taxRegistration).slice(0, 46), 52, boxTop + 92);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Place of Supply: ${pdfSafe(posText)}`, 52, boxTop + 105);

  // Right Box: Schedule & Payment Ref
  const rx = 40 + colW + 28;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CAMPAIGN SCHEDULE & SETTLEMENT', rx, boxTop + 18);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.text(pdfSafe(p.scheduleText), rx, boxTop + 36);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Placement Duration: ${p.durationDays} Days (All-India)`, rx, boxTop + 52);
  if (p.paymentMethod) {
    doc.text(`Rail: ${pdfSafe(p.paymentMethod).slice(0, 40)}`, rx, boxTop + 67);
  }
  if (p.paymentReference) {
    doc.text(`Verified UTR: ${pdfSafe(p.paymentReference).slice(0, 36)}`, rx, boxTop + 81);
  }
  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Sec 269ST Digital INR Settlement Verified', rx, boxTop + 99);

  // Line Item Table
  const tableTop = 250;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(40, tableTop, pageWidth - 80, 26, 'FD');

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('NATIONAL PLACEMENT DESCRIPTION', 52, tableTop + 16);
  doc.text('SAC', pageWidth - 190, tableTop + 16);
  doc.text(`AMOUNT (${p.currency})`, pageWidth - 52, tableTop + 16, { align: 'right' });

  doc.setFillColor(255, 255, 255);
  doc.rect(40, tableTop + 26, pageWidth - 80, 56, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(pdfSafe(p.slotTitle), 52, tableTop + 46);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(pdfSafe(p.slotCategory), 52, tableTop + 61);
  if (p.targetUrl) {
    doc.text(`Target URL: ${pdfSafe(p.targetUrl).slice(0, 62)}`, 52, tableTop + 74);
  }

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(pdfSafe(p.sac), pageWidth - 190, tableTop + 48);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(pdfSafe(p.subtotalFormatted), pageWidth - 52, tableTop + 48, { align: 'right' });

  // Totals Summary Box
  const totTop = tableTop + 98;
  const totW = 260;
  const totX = pageWidth - 40 - totW;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(totX, totTop, totW, 88, 4, 4, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Taxable Value (${p.currency})`, totX + 14, totTop + 22);
  doc.setTextColor(15, 23, 42);
  doc.text(pdfSafe(p.subtotalFormatted), totX + totW - 14, totTop + 22, { align: 'right' });

  doc.setTextColor(71, 85, 105);
  doc.text(pdfSafe(p.taxLabel), totX + 14, totTop + 42);
  doc.setTextColor(15, 23, 42);
  doc.text(pdfSafe(p.taxFormatted), totX + totW - 14, totTop + 42, { align: 'right' });

  doc.setDrawColor(15, 23, 42);
  doc.line(totX + 14, totTop + 54, totX + totW - 14, totTop + 54);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text('Grand Total (INR)', totX + 14, totTop + 74);
  doc.setTextColor(4, 120, 87);
  doc.text(pdfSafe(p.grandTotalFormatted), totX + totW - 14, totTop + 74, { align: 'right' });

  // Statutory Compliance Terms
  const termsTop = totTop + 114;
  doc.setDrawColor(226, 232, 240);
  doc.line(40, termsTop, pageWidth - 40, termsTop);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('GOVERNMENT OF INDIA STATUTORY COMPLIANCE & NATIONAL PLACEMENT TERMS', 40, termsTop + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('- 100% advance electronic INR settlement (UPI / NEFT / RTGS / NetBanking) per Sec 269ST.', 40, termsTop + 34);
  doc.text(`- CGST Rule 46 Compliant · POS: ${pdfSafe(posText)} · Tax: ${pdfSafe(p.taxLabel)} · Reverse Charge: ${pdfSafe(rcmText)}.`, 40, termsTop + 48);
  doc.text('- All banner creatives must comply with ASCI & IT (Digital Media Ethics Code) Rules 2021.', 40, termsTop + 62);
  doc.text('- Subject to New Delhi jurisdiction. Issued by Politics World India National Ad Desk.', 40, termsTop + 76);

  const safeSlug = p.invoiceNumber.replace(/[^A-Za-z0-9_-]+/g, '-');
  const fileName = `PoliticsWorld_India_Invoice_${safeSlug}.pdf`;
  doc.save(fileName);
  return fileName;
}

export function printCommercialInvoiceDocument(p: CommercialInvoicePdfPayload): void {
  const posText = p.placeOfSupply || '07 - Delhi';
  const rcmText = p.reverseCharge || 'No (Forward Charge)';
  const logoUrl = escapeHtml(getPrintLogoUrl());
  const html = `
    <div class="pw-header">
      <div>
        <div class="pw-brand">POLITICS WORLD INDIA MEDIA DESK</div>
        <img src="${logoUrl}" alt="Politics World Official Emblem" class="pw-logo" />
        <div class="pw-sub">GSTIN: <span class="pw-mono">07AAACP9921D1Z8</span> (07 - Delhi) · SAC: <span class="pw-mono">${escapeHtml(p.sac)}</span> · Reverse Charge: ${escapeHtml(rcmText)}</div>
      </div>
      <div class="pw-doc-type">
        <div class="pw-doc-label">India GST Tax Invoice</div>
        <div class="pw-doc-id">${escapeHtml(p.invoiceNumber)}</div>
        <div class="pw-sub">${escapeHtml(p.issueDate)}</div>
      </div>
    </div>
    <div class="pw-grid">
      <div class="pw-box">
        <div class="pw-box-title">Billed To (${p.clientType === 'b2b' ? 'India B2B Registered' : 'India Rule 46 B2C'})</div>
        <div style="font-weight:700;font-size:13px;">${escapeHtml(p.clientName)}</div>
        ${p.contactPerson ? `<div>${escapeHtml(p.contactPerson)}</div>` : ''}
        ${p.clientAddress ? `<div style="color:#475569;">${escapeHtml(p.clientAddress)}</div>` : ''}
        <div class="pw-mono" style="margin-top:6px;font-size:11px;">${escapeHtml(p.taxRegistration)}</div>
        <div class="pw-mono" style="margin-top:3px;font-size:11px;color:#334155;">Place of Supply: ${escapeHtml(posText)}</div>
      </div>
      <div class="pw-box">
        <div class="pw-box-title">National Placement Schedule & Payment</div>
        <div style="font-weight:700;">${escapeHtml(p.scheduleText)}</div>
        <div>Duration: ${p.durationDays} Days (All-India)</div>
        ${p.paymentMethod ? `<div>Rail: ${escapeHtml(p.paymentMethod)}</div>` : ''}
        ${p.paymentReference ? `<div class="pw-mono" style="font-size:11px;">UTR / Ref: ${escapeHtml(p.paymentReference)}</div>` : ''}
        <div style="color:#047857;font-weight:600;margin-top:6px;">Sec 269ST Digital INR Pre-Payment Verified</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>National Service Description</th>
          <th class="pw-mono">SAC</th>
          <th class="pw-right">Amount (${escapeHtml(p.currency)})</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div style="font-weight:700;">${escapeHtml(p.slotTitle)}</div>
            <div style="color:#64748b;font-size:11px;">${escapeHtml(p.slotCategory)}</div>
            ${p.targetUrl ? `<div class="pw-mono" style="color:#0369a1;font-size:10px;margin-top:4px;">${escapeHtml(p.targetUrl)}</div>` : ''}
          </td>
          <td class="pw-mono">${escapeHtml(p.sac)}</td>
          <td class="pw-right pw-mono" style="font-weight:700;">${escapeHtml(p.subtotalFormatted)}</td>
        </tr>
      </tbody>
    </table>
    <div class="pw-totals">
      <div class="pw-total-row"><span>Taxable Value (${escapeHtml(p.currency)})</span><span class="pw-mono">${escapeHtml(p.subtotalFormatted)}</span></div>
      <div class="pw-total-row"><span>${escapeHtml(p.taxLabel)}</span><span class="pw-mono">${escapeHtml(p.taxFormatted)}</span></div>
      <div class="pw-total-row pw-grand"><span>Grand Total (INR)</span><span class="pw-mono">${escapeHtml(p.grandTotalFormatted)}</span></div>
    </div>
    <div class="pw-footer">
      <div>• 100% advance electronic INR settlement (UPI / NEFT / RTGS) per Sec 269ST.</div>
      <div>• ASCI & IT (Digital Media Ethics Code) Rules 2021 compliant.</div>
      <div>• CGST Rule 46 Compliant · POS: ${escapeHtml(posText)} · Reverse Charge: ${escapeHtml(rcmText)}.</div>
      <div>• ${escapeHtml(p.taxLabel)} · SAC ${escapeHtml(p.sac)} · New Delhi Jurisdiction.</div>
    </div>
  `;
  printCleanHtmlDocument(`India GST Invoice ${p.invoiceNumber}`, html);
}

export interface TransactionSlipPdfPayload {
  id: string;
  invoiceNumber?: string;
  title: string;
  payerOrPayee: string;
  paymentMode: string;
  deviceReference: string;
  dateTime: string;
  category: string;
  status: string;
  signedNetFormatted: string;
  taxFormatted: string;
  notes?: string;
}

export function downloadTransactionSlipPdf(p: TransactionSlipPdfPayload): string {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(7, 14, 36);
  doc.rect(0, 0, pageWidth, 88, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 88, pageWidth, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('POLITICS WORLD · ELECTRONIC PAYMENT ADVICE', 40, cachedOfficialLogoDataUrl ? 30 : 38);

  if (cachedOfficialLogoDataUrl) {
    try {
      doc.addImage(cachedOfficialLogoDataUrl, 'PNG', 40, 35, 108, 18);
    } catch {
      // ignore
    }
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Transaction ID: ${pdfSafe(p.id)}  |  Status: ${p.status.toUpperCase()}`, 40, cachedOfficialLogoDataUrl ? 70 : 58);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(40, 108, pageWidth - 80, 72, 4, 4, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('NET SETTLEMENT AMOUNT', 56, 130);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.text(pdfSafe(p.signedNetFormatted), 56, 158);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Tax / Reserve: ${pdfSafe(p.taxFormatted)}`, pageWidth - 56, 154, { align: 'right' });

  const rows: Array<[string, string]> = [
    ['Description', p.title],
    ['Counterparty / Entity', p.payerOrPayee],
    ['Classification Category', p.category],
    ['Payment Rail', p.paymentMode],
    ['Invoice / Advice No', p.invoiceNumber || p.id],
    ['Electronic Reference', p.deviceReference],
    ['Timestamp', p.dateTime],
  ];

  let y = 208;
  rows.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 44, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const wrapped = doc.splitTextToSize(pdfSafe(val), pageWidth - 220);
    doc.text(wrapped, 190, y);
    y += Math.max(22, wrapped.length * 14 + 8);

    doc.setDrawColor(226, 232, 240);
    doc.line(40, y - 8, pageWidth - 40, y - 8);
  });

  if (p.notes) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    const noteLines = doc.splitTextToSize(pdfSafe(p.notes), pageWidth - 104);
    doc.roundedRect(40, y + 8, pageWidth - 80, noteLines.length * 14 + 24, 4, 4, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(noteLines, 52, y + 26);
  }

  const fileName = `PoliticsWorld_Payment_Advice_${p.id.replace(/[^A-Za-z0-9_-]+/g, '-')}.pdf`;
  doc.save(fileName);
  return fileName;
}

export function printTransactionSlipDocument(p: TransactionSlipPdfPayload): void {
  const logoUrl = escapeHtml(getPrintLogoUrl());
  const html = `
    <div class="pw-header">
      <div>
        <div class="pw-brand">POLITICS WORLD INDIA MEDIA DESK</div>
        <img src="${logoUrl}" alt="Politics World Official Emblem" class="pw-logo" />
        <div class="pw-sub">Electronic INR Treasury Payment Advice · Audit Trail</div>
      </div>
      <div class="pw-doc-type">
        <div class="pw-doc-label">Transaction Advice</div>
        <div class="pw-doc-id">${escapeHtml(p.id)}</div>
        <div class="pw-sub">${escapeHtml(p.status.toUpperCase())}</div>
      </div>
    </div>
    <div class="pw-box" style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div class="pw-box-title">Net Amount</div>
        <div class="pw-mono" style="font-size:22px;font-weight:800;">${escapeHtml(p.signedNetFormatted)}</div>
      </div>
      <div class="pw-right">
        <div class="pw-box-title">Tax / Reserve</div>
        <div class="pw-mono" style="font-weight:700;">${escapeHtml(p.taxFormatted)}</div>
      </div>
    </div>
    <table class="pw-kv">
      <tbody>
        <tr><td>Description</td><td>${escapeHtml(p.title)}</td></tr>
        <tr><td>Counterparty</td><td>${escapeHtml(p.payerOrPayee)}</td></tr>
        <tr><td>Category</td><td>${escapeHtml(p.category)}</td></tr>
        <tr><td>Payment Rail</td><td>${escapeHtml(p.paymentMode)}</td></tr>
        <tr><td>Invoice / Ref</td><td class="pw-mono">${escapeHtml(p.invoiceNumber || p.id)}</td></tr>
        <tr><td>UTR / Wire Reference</td><td class="pw-mono">${escapeHtml(p.deviceReference)}</td></tr>
        <tr><td>Timestamp</td><td class="pw-mono">${escapeHtml(p.dateTime)}</td></tr>
      </tbody>
    </table>
    ${p.notes ? `<div class="pw-box" style="margin-top:14px;">${escapeHtml(p.notes)}</div>` : ''}
  `;
  printCleanHtmlDocument(`Payment Advice ${p.id}`, html);
}

export interface TaxCompliancePdfPayload {
  fxCode: string;
  grossInflow: string;
  gstReserve: string;
  withholdingReserve: string;
  totalTaxPool: string;
  totalWithdrawn: string;
  availableBalance: string;
  bankSummary: string;
}

export function downloadTaxCompliancePdf(p: TaxCompliancePdfPayload): string {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(7, 14, 36);
  doc.rect(0, 0, pageWidth, 88, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 88, pageWidth, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('POLITICS WORLD INDIA · TREASURY & GST COMPLIANCE', 40, cachedOfficialLogoDataUrl ? 30 : 38);

  if (cachedOfficialLogoDataUrl) {
    try {
      doc.addImage(cachedOfficialLogoDataUrl, 'PNG', 40, 35, 108, 18);
    } catch {
      // ignore
    }
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`FY 2026-27  |  GSTIN: 07AAACP9921D1Z8  |  SAC 998363  |  Currency: ${p.fxCode}`, 40, cachedOfficialLogoDataUrl ? 70 : 58);

  const metrics: Array<[string, string]> = [
    ['Total Gross Inflow (INR)', p.grossInflow],
    ['India GST Output Reserve (18%)', p.gstReserve],
    ['TDS Compliance Reserve (Sec 194J)', p.withholdingReserve],
    ['Total Tax Compliance Pool', p.totalTaxPool],
    ['Total Settled to Indian Bank', p.totalWithdrawn],
    ['Net Available Treasury Balance (INR)', p.availableBalance],
  ];

  let y = 122;
  metrics.forEach(([label, val]) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(40, y, pageWidth - 80, 38, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(label, 54, y + 23);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(pdfSafe(val), pageWidth - 54, y + 23, { align: 'right' });
    y += 48;
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Linked Indian Bank: ${pdfSafe(p.bankSummary)}`, 40, y + 18);
  doc.text('Certified 100% Electronic INR Audit Trail (Business UPI / NEFT / RTGS · Sec 269ST Compliant).', 40, y + 34);

  const fileName = `PoliticsWorld_India_Tax_Compliance_${p.fxCode}_2026-27.pdf`;
  doc.save(fileName);
  return fileName;
}

export function printTaxComplianceDocument(p: TaxCompliancePdfPayload): void {
  const logoUrl = escapeHtml(getPrintLogoUrl());
  const html = `
    <div class="pw-header">
      <div>
        <div class="pw-brand">POLITICS WORLD INDIA MEDIA DESK</div>
        <img src="${logoUrl}" alt="Politics World Official Emblem" class="pw-logo" />
        <div class="pw-sub">GSTIN: <span class="pw-mono">07AAACP9921D1Z8</span> · SAC 998363 · FY 2026-27</div>
      </div>
      <div class="pw-doc-type">
        <div class="pw-doc-label">India Treasury & GST Statement</div>
        <div class="pw-doc-id">${escapeHtml(p.fxCode)}</div>
      </div>
    </div>
    <table class="pw-kv">
      <tbody>
        <tr><td>Total Gross Inflow</td><td class="pw-right pw-mono" style="font-weight:700;">${escapeHtml(p.grossInflow)}</td></tr>
        <tr><td>India GST Output Reserve (18%)</td><td class="pw-right pw-mono">${escapeHtml(p.gstReserve)}</td></tr>
        <tr><td>TDS Compliance Reserve</td><td class="pw-right pw-mono">${escapeHtml(p.withholdingReserve)}</td></tr>
        <tr><td>Total Tax Compliance Pool</td><td class="pw-right pw-mono" style="font-weight:700;">${escapeHtml(p.totalTaxPool)}</td></tr>
        <tr><td>Total Settled to Indian Bank</td><td class="pw-right pw-mono">${escapeHtml(p.totalWithdrawn)}</td></tr>
        <tr><td><strong>Net Available Treasury Balance</strong></td><td class="pw-right pw-mono" style="font-weight:800;font-size:14px;">${escapeHtml(p.availableBalance)}</td></tr>
      </tbody>
    </table>
    <div class="pw-box" style="margin-top:16px;">
      <div class="pw-box-title">Linked Indian Settlement Bank</div>
      <div>${escapeHtml(p.bankSummary)}</div>
    </div>
  `;
  printCleanHtmlDocument(`India Treasury Tax Statement (${p.fxCode})`, html);
}

export function downloadMagazineExcerptPdf(): string {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(7, 14, 36);
  doc.rect(0, 0, pageWidth, 108, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 108, pageWidth, 3, 'F');

  doc.setTextColor(251, 191, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('NOTEBOOK MAGAZINE · ISSUE 47 · WINTER 2026 EDITION', 40, 36);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('QUARTERLY DIPLOMATIC REVIEW', 40, 66);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Statecraft, Sovereign Supply Chains & Geopolitical Intelligence', 40, 88);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Featured Dossiers in Issue 47 (Executive Excerpt)', 40, 146);

  const items = [
    ['01. The New Silk Road: Ports, Rare Earths & Strategic Corridors (p. 14)',
      'An empirical mapping of deep-water maritime chokepoints, critical mineral refining bottlenecks, and multi-corridor trade treaties reshaping Eurasian and Indo-Pacific diplomacy in 2026.'],
    ['02. Crisis in Multilateral Diplomacy: Treaties for the 2026 Epoch (p. 28)',
      'Former G7 and Global South ambassadors examine institutional reform at the UN Security Council, sovereign debt restructuring frameworks, and regional defense pacts.'],
    ['03. Sovereign Semiconductor Reserves & AI Computing Alliances (p. 58)',
      'Analysis of cross-border lithography supply agreements, sovereign energy grids for hyperscale compute clusters, and export-control coordination across allied capitals.'],
  ];

  let y = 176;
  items.forEach(([title, body]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title, 40, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const lines = doc.splitTextToSize(body, pageWidth - 80);
    doc.text(lines, 40, y + 18);
    y += 28 + lines.length * 14;
  });

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(40, y + 12, pageWidth - 80, 68, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Full Issue & National Masthead Sponsorship', 56, y + 34);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Published by Politics World India Media | INR 1,999 Archival Print + Digital Edition', 56, y + 52);
  doc.text('Editorial & National Advertising Desk: vrai74918@gmail.com', 56, y + 66);

  const fileName = 'PoliticsWorld_Notebook_Issue47_Excerpt.pdf';
  doc.save(fileName);
  return fileName;
}

export function downloadLegalGazettePdf(
  sections: Array<{ roman: string; title: string }>,
  effectiveDate: string,
  lastUpdated: string
): string {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(7, 14, 36);
  doc.rect(0, 0, pageWidth, 102, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 102, pageWidth, 3, 'F');

  doc.setTextColor(251, 191, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('POLITICS WORLD - LEGAL & STANDARDS GAZETTE (INDIA IST · 2026)', 40, 34);

  if (cachedOfficialLogoDataUrl) {
    try {
      doc.addImage(cachedOfficialLogoDataUrl, 'PNG', pageWidth - 155, 16, 115, 20);
    } catch {
      // ignore if image draw fails
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.text('SOVEREIGN SAFE HARBOR & PRIVACY CHARTER', 40, 58);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Effective: ${pdfSafe(effectiveDate)}  |  Updated: ${pdfSafe(lastUpdated)}  |  SAC 998363 (Strictly Not Refundable)  |  privacy@politicsworld.news`,
    40,
    78
  );

  let y = 134;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Codified Articles & Legal Instruments Overview', 40, y);
  y += 22;

  sections.forEach((sec) => {
    if (y > 760) {
      doc.addPage();
      y = 50;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(180, 120, 10);
    doc.text(pdfSafe(sec.roman), 40, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    const wrapped = doc.splitTextToSize(pdfSafe(sec.title), pageWidth - 150);
    doc.text(wrapped, 115, y);
    y += Math.max(18, wrapped.length * 13 + 5);
  });

  const fileName = 'PoliticsWorld_Legal_SafeHarbor_Gazette.pdf';
  doc.save(fileName);
  return fileName;
}

export interface CampaignDeliveryProofPdfPayload {
  bookingId: string;
  invoiceNumber: string;
  brandName: string;
  campaignTitle?: string;
  slotTitle: string;
  slotKey: string;
  targetUrl: string;
  publicPortalUrl: string;
  activatedAtIst: string;
  expiresAtIst: string;
  durationDays: number;
  status?: 'Active' | 'Completed';
  impressions: number;
  uniqueSessions?: number;
  clicks: number;
  ctrPct: string;
  indiaStatesReachedCount?: number;
  states: Record<string, number>;
  devices: Record<string, number>;
  languages: Record<string, number>;
  audiencePulse: {
    totalResponses: number;
    ageBrackets: Record<string, number>;
    states: Record<string, number>;
  };
  ga4Configured: boolean;
}

export function downloadCampaignDeliveryReportPdf(p: CampaignDeliveryProofPdfPayload): string {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const statusLabel = p.status || 'Active';
  const uniqueSess = Number(p.uniqueSessions ?? p.impressions ?? 0);
  const statesReached =
    typeof p.indiaStatesReachedCount === 'number'
      ? p.indiaStatesReachedCount
      : Object.keys(p.states || {}).filter((k) => k && !k.includes('Unspecified')).length;

  // Header Navy Bar
  doc.setFillColor(7, 14, 36);
  doc.rect(0, 0, pageWidth, 100, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 100, pageWidth, 3, 'F');

  doc.setTextColor(251, 191, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('POLITICS WORLD INDIA MEDIA DESK · CAMPAIGN COMPLETION & REACH CERTIFICATE', 40, 32);

  if (cachedOfficialLogoDataUrl) {
    try {
      doc.addImage(cachedOfficialLogoDataUrl, 'PNG', pageWidth - 150, 16, 110, 19);
    } catch {
      // ignore if image draw fails
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('CAMPAIGN COMPLETION & INDIA REACH REPORT', 40, 56);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Booking: ${pdfSafe(p.bookingId)}  |  Invoice: ${pdfSafe(p.invoiceNumber)}  |  Status: ${statusLabel.toUpperCase()}`,
    40,
    78
  );

  // Verification Summary Box
  let y = 120;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(40, y, pageWidth - 80, 108, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Advertiser / Brand: ${pdfSafe(p.brandName)}`, 54, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Campaign Title: ${pdfSafe(p.campaignTitle || p.slotTitle).slice(0, 74)}`, 54, y + 36);
  doc.text(`Slot Placement: ${pdfSafe(p.slotTitle)} (${p.durationDays} Days)`, 54, y + 51);
  doc.text(`Live Portal URL: ${pdfSafe(p.publicPortalUrl)}  |  Target: ${pdfSafe(p.targetUrl).slice(0, 42)}`, 54, y + 66);
  doc.text(`Run Window (IST): ${pdfSafe(p.activatedAtIst)}  ->  ${pdfSafe(p.expiresAtIst)}`, 54, y + 81);
  doc.text(`Indian States Reached: ${statesReached}  |  Unique Sessions: ${uniqueSess.toLocaleString('en-IN')}`, 54, y + 96);

  // Real-Time Server Telemetry KPIs
  y += 126;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Verified On-Site Delivery & Reach Metrics', 40, y);
  y += 12;

  const colW = (pageWidth - 116) / 4;
  const kpis: Array<[string, string]> = [
    ['IMPRESSIONS', Number(p.impressions || 0).toLocaleString('en-IN')],
    ['UNIQUE SESSIONS', uniqueSess.toLocaleString('en-IN')],
    ['INDIA STATES', String(statesReached)],
    ['CLICKS (CTR)', `${Number(p.clicks || 0).toLocaleString('en-IN')} (${pdfSafe(p.ctrPct)}%)`],
  ];
  kpis.forEach(([label, val], idx) => {
    const x = 40 + idx * (colW + 12);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(x, y, colW, 52, 4, 4, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    doc.text(label, x + 10, y + 18);
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(val, x + 10, y + 39);
  });

  // Device, Language & State Telemetry Breakdown
  y += 72;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. State-Wise View Breakdown Across India, Devices & Languages', 40, y);
  y += 14;

  const stateEntries = Object.entries(p.states || {}).sort((a, b) => b[1] - a[1]);
  const stateSummary =
    stateEntries.length > 0
      ? stateEntries.slice(0, 12).map(([st, cnt]) => `${st}: ${cnt}`).join('  |  ')
      : 'Pan-India / Unspecified Region (awaiting render telemetry)';

  const deviceEntries = Object.entries(p.devices || {}).filter(([, c]) => c > 0);
  const deviceSummary =
    deviceEntries.length > 0
      ? deviceEntries.map(([d, cnt]) => `${d}: ${cnt}`).join('  |  ')
      : 'Mobile: 0  |  Desktop: 0';

  const langEntries = Object.entries(p.languages || {}).sort((a, b) => b[1] - a[1]);
  const langSummary =
    langEntries.length > 0
      ? langEntries.slice(0, 6).map(([l, cnt]) => `${l.toUpperCase()}: ${cnt}`).join('  |  ')
      : 'EN / HI Editions Active';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const stateLines = doc.splitTextToSize(`Regions / States: ${pdfSafe(stateSummary)}`, pageWidth - 80);
  doc.text(stateLines, 40, y);
  y += stateLines.length * 13 + 4;
  doc.text(pdfSafe(`Devices: ${deviceSummary}`), 40, y);
  y += 15;
  doc.text(pdfSafe(`Edition Languages: ${langSummary}`), 40, y);

  // Audience Age & State Verification Section
  y += 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. All-India Audience State Reach & Age Group Reporting Standard', 40, y);
  y += 15;

  const pulseTotal = p.audiencePulse?.totalResponses || 0;
  const ageEntries = Object.entries(p.audiencePulse?.ageBrackets || {}).filter(([, v]) => v > 0);
  const ageSummary =
    pulseTotal > 0 && ageEntries.length > 0
      ? ageEntries
          .map(([bracket, cnt]) => `${bracket} yrs: ${Math.round((cnt / pulseTotal) * 100)}% (${cnt})`)
          .join('  |  ')
      : 'No opt-in reader age responses recorded yet (platform strictly prohibits fabricated age numbers).';

  const pulseStateEntries = Object.entries(p.audiencePulse?.states || {}).sort((a, b) => b[1] - a[1]);
  const pulseStateSummary =
    pulseStateEntries.length > 0
      ? pulseStateEntries.slice(0, 10).map(([st, cnt]) => `${st}: ${cnt}`).join('  |  ')
      : 'Awaiting opt-in reader state check-ins.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(51, 65, 85);
  const ageLines = doc.splitTextToSize(`Opt-In Reader Age Pulse (${pulseTotal} responses): ${pdfSafe(ageSummary)}`, pageWidth - 80);
  doc.text(ageLines, 40, y);
  y += ageLines.length * 12 + 5;

  const pulseStLines = doc.splitTextToSize(`Opt-In Reader State Coverage: ${pdfSafe(pulseStateSummary)}`, pageWidth - 80);
  doc.text(pulseStLines, 40, y);
  y += pulseStLines.length * 12 + 8;

  const methodologyLines = doc.splitTextToSize(
    `Verification Note: Standard web browsers do not expose private visitor age without login. Politics World provides transparent verification via (a) real-time server impression/click logs & geo-headers, (b) voluntary first-party India Reader State & Age Pulse, and (c) ${
      p.ga4Configured ? 'Active Google Analytics 4 (GA4 + Google Signals)' : 'Optional Google Analytics 4 (GA4) Property Export when linked by Publisher'
    }.`,
    pageWidth - 80
  );
  doc.text(methodologyLines, 40, y);
  y += methodologyLines.length * 12 + 16;

  // Legal Safe Harbor Footer Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(40, y, pageWidth - 80, 62, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CONCLUSIVE DELIVERY & NOT REFUNDABLE COVENANT (LEGAL GAZETTE ARTICLE VII)', 52, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(71, 85, 105);
  doc.text('Live URL deployment & server delivery logs constitute 100% legal fulfillment (Client Ad-Blocker Safe Harbor).', 52, y + 34);
  doc.text('SAC 998363 · Strictly Not Refundable · Issued by Politics World India Media Desk (New Delhi Jurisdiction).', 52, y + 48);

  const safeBrand = pdfSafe(p.brandName).replace(/[^A-Za-z0-9_-]+/g, '-').slice(0, 28) || 'Campaign';
  const fileName = `PoliticsWorld_Campaign_Reach_Report_${safeBrand}_${pdfSafe(p.slotKey)}.pdf`;
  doc.save(fileName);
  return fileName;
}

export function printCampaignDeliveryReportDocument(p: CampaignDeliveryProofPdfPayload): void {
  const logoUrl = escapeHtml(getPrintLogoUrl());
  const statusLabel = p.status || 'Active';
  const uniqueSess = Number(p.uniqueSessions ?? p.impressions ?? 0);
  const statesReached =
    typeof p.indiaStatesReachedCount === 'number'
      ? p.indiaStatesReachedCount
      : Object.keys(p.states || {}).filter((k) => k && !k.includes('Unspecified')).length;

  const stateRows = Object.entries(p.states || {}).sort((a, b) => b[1] - a[1]);
  const stateTableHtml =
    stateRows.length > 0
      ? stateRows
          .map(
            ([st, cnt]) =>
              `<tr><td>${escapeHtml(st)}</td><td class="pw-right pw-mono" style="font-weight:700;">${Number(cnt).toLocaleString('en-IN')}</td></tr>`
          )
          .join('')
      : `<tr><td>Pan-India / Unspecified Region</td><td class="pw-right pw-mono">0</td></tr>`;

  const html = `
    <div class="pw-header">
      <div>
        <div class="pw-brand">POLITICS WORLD INDIA MEDIA DESK</div>
        <img src="${logoUrl}" alt="Politics World Official Emblem" class="pw-logo" />
        <div class="pw-sub">Campaign Completion &amp; All-India Reach Report · SAC 998363</div>
      </div>
      <div class="pw-doc-type">
        <div class="pw-doc-label">Status: ${escapeHtml(statusLabel)}</div>
        <div class="pw-doc-id">${escapeHtml(p.bookingId)}</div>
        <div class="pw-sub">Invoice: ${escapeHtml(p.invoiceNumber)}</div>
      </div>
    </div>
    <div class="pw-grid">
      <div class="pw-box">
        <div class="pw-box-title">Advertiser &amp; Campaign</div>
        <div style="font-weight:700;font-size:13px;">${escapeHtml(p.brandName)}</div>
        <div>${escapeHtml(p.campaignTitle || p.slotTitle)}</div>
        <div class="pw-mono" style="margin-top:4px;font-size:11px;color:#0369a1;">${escapeHtml(p.targetUrl)}</div>
      </div>
      <div class="pw-box">
        <div class="pw-box-title">Run Schedule (IST)</div>
        <div><strong>Start:</strong> ${escapeHtml(p.activatedAtIst)}</div>
        <div><strong>End:</strong> ${escapeHtml(p.expiresAtIst)}</div>
        <div><strong>Duration:</strong> ${p.durationDays} Days · ${escapeHtml(p.slotTitle)}</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Total Views / Impressions</th>
          <th>Unique Sessions</th>
          <th>Indian States Reached</th>
          <th class="pw-right">Clicks &amp; CTR</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="pw-mono" style="font-weight:800;font-size:15px;">${Number(p.impressions || 0).toLocaleString('en-IN')}</td>
          <td class="pw-mono" style="font-weight:800;font-size:15px;">${uniqueSess.toLocaleString('en-IN')}</td>
          <td class="pw-mono" style="font-weight:800;font-size:15px;">${statesReached}</td>
          <td class="pw-right pw-mono" style="font-weight:700;">${Number(p.clicks || 0).toLocaleString('en-IN')} (${escapeHtml(p.ctrPct)}%)</td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>State / Region Across India</th>
          <th class="pw-right">Recorded Impressions</th>
        </tr>
      </thead>
      <tbody>
        ${stateTableHtml}
      </tbody>
    </table>
    <div class="pw-footer">
      <div>• Verified first-party render telemetry with rapid re-render &amp; session deduplication.</div>
      <div>• SAC 998363 · Strictly Not Refundable · Issued by Politics World India Media Desk.</div>
    </div>
  `;
  printCleanHtmlDocument(`Campaign Reach Report ${p.bookingId}`, html);
}


