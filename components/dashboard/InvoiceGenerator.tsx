"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { formatAsCurrency } from "@/lib/currency";
import { 
  Calendar, 
  Trash2, 
  Plus, 
  Printer, 
  Download, 
  Send, 
  Save, 
  Hash, 
  LayoutGrid, 
  GripVertical
} from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  units: number;
  unitCost: number;
}

interface InvoiceGeneratorProps {
  initialInvoice?: any;
  onSave?: () => void;
}

export default function InvoiceGenerator({ initialInvoice, onSave }: InvoiceGeneratorProps) {
  const [reference, setReference] = useState(initialInvoice?.reference || `FL-${Math.floor(Math.random() * 10000)}`);
  const [issuedDate, setIssuedDate] = useState(initialInvoice?.issuedDate ? format(new Date(initialInvoice.issuedDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
  const [dueDate, setDueDate] = useState(initialInvoice?.dueDate ? format(new Date(initialInvoice.dueDate), "yyyy-MM-dd") : format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
  
  const [clientInitials, setClientInitials] = useState(initialInvoice?.client?.initials || "AC");
  const [clientName, setClientName] = useState(initialInvoice?.client?.name || "AiY Cap");
  const [clientEmail, setClientEmail] = useState(initialInvoice?.client?.email || "finance@aiycap.com");
  const [clientAddress, setClientAddress] = useState(initialInvoice?.client?.address || "AiY Cap\nOne BKC, Bandra Kurla Complex\nMumbai, Maharashtra 400051\nTax ID: GSTIN-27AAICA3102K1Z7");
  
  const [businessAddress, setBusinessAddress] = useState(initialInvoice?.business?.address || "WebLabs Studio\n210 Frost Avenue\nAustin, TX 78701\nTax ID: WS-1029384756");
  const [paymentInfo, setPaymentInfo] = useState(initialInvoice?.business?.paymentInfo || "Payment account:\nMercury Business\nRouting no. 084009519");

  const [items, setItems] = useState<InvoiceItem[]>(initialInvoice?.items?.map((item: any) => ({ ...item, id: item._id || Math.random().toString() })) || [
    { id: "1", description: "Cloud hosting services", units: 1, unitCost: 3500 },
    { id: "2", description: "Data analytics report", units: 2, unitCost: 750 },
    { id: "3", description: "Technical support retainer", units: 1, unitCost: 400 },
  ]);

  const [taxRate, setTaxRate] = useState(initialInvoice?.taxRate || 12);
  const [discount, setDiscount] = useState(initialInvoice?.discount || 40);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + (item.units * item.unitCost), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount - discount;

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), description: "", units: 1, unitCost: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const getInvoicePayload = () => ({
    reference,
    issuedDate,
    dueDate,
    client: { name: clientName, email: clientEmail, initials: clientInitials, address: clientAddress },
    business: { address: businessAddress, paymentInfo: paymentInfo },
    items: items.map(({ description, units, unitCost }) => ({ description, units, unitCost })),
    taxRate,
    discount
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const method = initialInvoice ? "PUT" : "POST";
      const payload = { ...getInvoicePayload(), _id: initialInvoice?._id };
      
      const res = await fetch("/api/admin/invoices", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && onSave) {
        onSave();
      } else {
        alert(data.message || "Failed to save invoice");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving invoice");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      // First save the invoice if it's new
      let invoiceId = initialInvoice?._id;
      
      if (!invoiceId) {
        const res = await fetch("/api/admin/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getInvoicePayload()),
        });
        const data = await res.json();
        if (data.success) {
          invoiceId = data.invoice._id;
        } else {
          throw new Error(data.message || "Failed to create invoice before sending");
        }
      } else {
        // Update existing invoice first
        await fetch("/api/admin/invoices", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...getInvoicePayload(), _id: invoiceId }),
        });
      }

      // Then send the email
      const sendRes = await fetch("/api/admin/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      
      const sendData = await sendRes.json();
      if (sendData.success) {
        alert("Invoice sent successfully!");
        if (onSave) onSave();
      } else {
        alert(sendData.message || "Failed to send invoice");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error sending invoice");
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#121212] rounded-3xl overflow-hidden print:bg-white print:rounded-none">
      {/* Header - Hidden when printing */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-stone-200 dark:border-white/10 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Create New Invoice</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Add invoice details, review the preview, and send it to your client.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave} 
            disabled={isSaving || isSending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save as Draft"}
          </button>
          <button 
            onClick={handleSend}
            disabled={isSaving || isSending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {isSending ? "Sending..." : "Send Invoice"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden print:overflow-visible">
        {/* Form Panel - Hidden when printing */}
        <div className="w-full lg:w-[45%] border-r border-stone-200 dark:border-white/10 overflow-y-auto p-8 print:hidden">
          
          {/* Section Tabs */}
          <div className="flex items-center p-1 bg-stone-100 dark:bg-white/5 rounded-2xl mb-8">
            <button className="flex-1 py-2 px-4 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-bold rounded-xl shadow-sm">Invoice</button>
            <button className="flex-1 py-2 px-4 text-stone-500 dark:text-stone-400 text-sm font-bold hover:text-stone-900 dark:hover:text-white transition-colors">Payment</button>
            <button className="flex-1 py-2 px-4 text-stone-500 dark:text-stone-400 text-sm font-bold hover:text-stone-900 dark:hover:text-white transition-colors">Business</button>
          </div>

          <div className="space-y-6">
            {/* Reference Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">Reference Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 dark:text-white focus:outline-none focus:border-stone-900 dark:focus:border-white/30"
                />
                <Hash className="absolute right-4 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">Issued Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    className="w-full bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 dark:text-white focus:outline-none focus:border-stone-900 dark:focus:border-white/30 appearance-none"
                  />
                  {/* Note: Native date picker arrow overrides icon in some browsers, but keeping structure matching mockup */}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">Due Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 dark:text-white focus:outline-none focus:border-stone-900 dark:focus:border-white/30 appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Client */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">Billed To</label>
                <button className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1 hover:opacity-70 transition-opacity">
                  <Plus className="w-3 h-3" /> Add New Client
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-2">Client</label>
                <div className="flex items-center justify-between border border-stone-200 dark:border-white/10 rounded-xl p-3 bg-white dark:bg-transparent cursor-pointer hover:border-stone-300 dark:hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-stone-900 dark:text-white">
                      {clientInitials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900 dark:text-white">{clientName}</div>
                      <div className="text-xs text-stone-500">{clientEmail}</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-stone-200 dark:border-white/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex items-center justify-between mb-4 mt-6">
                <label className="block text-sm font-bold text-stone-900 dark:text-white">Invoice Items</label>
                <button onClick={handleAddItem} className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1 hover:opacity-70 transition-opacity">
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-[auto_1fr_60px_80px_80px_auto] gap-3 text-xs font-semibold text-stone-500 px-1">
                  <div className="w-4"></div>
                  <div>Description</div>
                  <div>Units</div>
                  <div>Unit cost</div>
                  <div className="text-right">Line Total</div>
                  <div className="w-6"></div>
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-[auto_1fr_60px_80px_80px_auto] gap-3 items-center">
                    <GripVertical className="w-4 h-4 text-stone-300 dark:text-stone-600 cursor-grab" />
                    <input 
                      type="text" 
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-stone-900 dark:text-white focus:outline-none focus:border-stone-900"
                    />
                    <input 
                      type="number" 
                      value={item.units}
                      onChange={(e) => updateItem(item.id, "units", parseFloat(e.target.value) || 0)}
                      className="bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-stone-900 dark:text-white focus:outline-none focus:border-stone-900 text-center"
                    />
                    <input 
                      type="number" 
                      value={item.unitCost}
                      onChange={(e) => updateItem(item.id, "unitCost", parseFloat(e.target.value) || 0)}
                      className="bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-stone-900 dark:text-white focus:outline-none focus:border-stone-900"
                    />
                    <div className="text-sm font-bold text-stone-900 dark:text-white text-right py-2">
                      ${(item.units * item.unitCost).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Adjustments */}
            <div className="mt-8">
              <label className="block text-sm font-bold text-stone-900 dark:text-white mb-4">Adjustments</label>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-2">Tax</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 dark:text-white focus:outline-none appearance-none cursor-pointer"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                    >
                      <option value={0}>No Tax (0%)</option>
                      <option value={5}>VAT (5%)</option>
                      <option value={12}>VAT (12%)</option>
                      <option value={18}>GST (18%)</option>
                    </select>
                    <div className="absolute right-4 top-3 pointer-events-none">
                      <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-2">Discount</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select className="w-full bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 dark:text-white focus:outline-none appearance-none cursor-pointer">
                        <option>Fixed amount</option>
                        <option>Percentage</option>
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <div className="relative w-20">
                      <input 
                        type="number" 
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-transparent border border-stone-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-900 dark:text-white focus:outline-none"
                      />
                      <span className="absolute right-3 top-3 text-stone-400 text-sm font-medium">$</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Preview Panel - Full width when printing */}
        <div className="w-full lg:w-[55%] bg-stone-50 dark:bg-stone-900/30 overflow-y-auto p-4 md:p-8 flex flex-col print:w-full print:bg-white print:p-0 print:overflow-visible h-full">
          
          <div className="flex items-center justify-between mb-6 print:hidden">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Preview</h2>
            <div className="flex items-center gap-2 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-white/10 p-1">
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <div className="w-px h-4 bg-stone-200 dark:bg-white/10"></div>
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors">
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>

          {/* A4 Paper Container */}
          <div className="w-full max-w-[800px] mx-auto bg-white shadow-xl dark:shadow-2xl rounded-sm print:shadow-none print:max-w-none print:w-full">
            <div className="aspect-[1/1.414] p-10 md:p-14 text-stone-900 font-sans text-sm flex flex-col print:h-auto print:aspect-auto">
              
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-16">
                <div>
                  <LayoutGrid className="w-10 h-10 mb-8" />
                  
                  <div className="grid grid-cols-[100px_1fr] gap-y-1 text-xs">
                    <span className="text-stone-500">Reference:</span>
                    <span className="font-medium">{reference}</span>
                    <span className="text-stone-500">Issued:</span>
                    <span className="font-medium">{issuedDate}</span>
                    <span className="text-stone-500">Payment due:</span>
                    <span className="font-medium">{dueDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-bold tracking-widest uppercase mb-8">INVOICE</h1>
                  
                  <div className="text-xs whitespace-pre-line text-left float-right">
                    {paymentInfo}
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-8 mb-16">
                <div>
                  <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-3">FROM</h3>
                  <div className="text-xs leading-relaxed whitespace-pre-line font-medium">
                    {businessAddress}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-3">BILL TO</h3>
                  <div className="text-xs leading-relaxed whitespace-pre-line font-medium">
                    {clientAddress}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-12 flex-1">
                <div className="grid grid-cols-[1fr_60px_80px_100px] gap-4 border-y border-stone-200 py-3 mb-4">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">DESCRIPTION</div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider text-right">UNITS</div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider text-right">UNIT COST</div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider text-right">LINE TOTAL</div>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_60px_80px_100px] gap-4 text-xs font-medium">
                      <div>{item.description || "—"}</div>
                      <div className="text-right">{item.units}</div>
                      <div className="text-right">${item.unitCost.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                      <div className="text-right">${(item.units * item.unitCost).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-16">
                <div className="w-64">
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium mb-1">
                    <span className="text-stone-500">Net amount:</span>
                    <span className="text-right">${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium mb-1">
                    <span className="text-stone-500">Discount:</span>
                    <span className="text-right">${discount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium mb-3">
                    <span className="text-stone-500">VAT {taxRate}%:</span>
                    <span className="text-right">${taxAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-bold border-t border-stone-900 pt-2">
                    <span>BALANCE DUE:</span>
                    <span className="text-right">${total.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end mt-auto pt-8 text-[10px] text-stone-400">
                <div className="whitespace-pre-line">
                  hello@weblabs.studio
                  +1-512-555-0154
                  weblabs.studio
                </div>
                <div className="text-right whitespace-pre-line">
                  Prepared for prompt processing
                  Issued by Arham Khan
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
      
      {/* Global print styles to hide everything else on the page */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          /* We want to make the InvoiceGenerator visible */
          .print\\:bg-white, .print\\:bg-white * {
            visibility: visible;
          }
          /* Absolute positioning ensures it fills the page */
          .print\\:w-full {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Specifically hide elements that shouldn't print */
          .print\\:hidden, .print\\:hidden * {
            visibility: hidden !important;
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
