import jsPDF from "jspdf";

export const generateInvoicePDF = (invoice: any, sender: any) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("INVOICE", 80, 20);

  doc.setFontSize(12);
  doc.text(`From: ${sender.full_name || sender.name}`, 10, 40);
  doc.text(`Phone: ${sender.phone || ""}`, 10, 50);

  doc.text(`To: ${invoice.receiver_name}`, 10, 70);
  doc.text(`Phone: ${invoice.receiver_phone}`, 10, 80);

  doc.text(`Service: ${invoice.service}`, 10, 100);
  doc.text(`Price: ${invoice.price}`, 10, 110);
  doc.text(`Payment: ${invoice.payment_method}`, 10, 120);

  return doc; // إرجاع كائن jsPDF نفسه
};