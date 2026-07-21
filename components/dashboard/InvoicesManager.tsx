"use client";

import React, { useState, useEffect } from "react";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";
import { PlusIcon } from "@/components/ui/plus";
import { SearchIcon } from "@/components/ui/search";
import { FileTextIcon } from "@/components/ui/file-text";
import { SendIcon } from "@/components/ui/send";
import { DownloadIcon } from "@/components/ui/download";
import InvoiceGenerator from "./InvoiceGenerator";

export default function InvoicesManager() {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<any>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invoices");
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") {
      fetchInvoices();
    }
  }, [view]);

  const handleCreateNew = () => {
    setEditingInvoice(null);
    setView("create");
  };

  const handleEdit = (invoice: any) => {
    setEditingInvoice(invoice);
    setView("edit");
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Paid": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "Sent": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "Overdue": return "bg-red-500/10 text-red-600 dark:text-red-400";
      default: return "bg-stone-500/10 text-stone-600 dark:text-stone-400"; // Draft
    }
  };

  if (view === "create" || view === "edit") {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <button 
            onClick={() => setView("list")}
            className="text-sm font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
          >
            ← Back to Invoices
          </button>
        </div>
        <div className="flex-1 h-full min-h-[800px]">
          <InvoiceGenerator 
            initialInvoice={editingInvoice} 
            onSave={() => setView("list")} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#121212] rounded-3xl p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Invoices</h1>
          <p className="text-sm text-stone-500 mt-1">Manage, send, and track your invoices.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search by reference or client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 text-stone-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-stone-300 dark:text-stone-700" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
            <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
              <FileTextIcon className="w-6 h-6 text-stone-400" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-1">No invoices found</h3>
            <p className="text-xs text-stone-500 mb-4">Create your first invoice to get started.</p>
            <button 
              onClick={handleCreateNew}
              className="text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white px-4 py-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              Create Invoice
            </button>
          </div>
        ) : (
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900/50 text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200 dark:border-stone-800">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date Issued</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
                {filteredInvoices.map((invoice) => {
                  const subtotal = invoice.items.reduce((acc: number, item: any) => acc + (item.units * item.unitCost), 0);
                  const total = subtotal + ((subtotal * invoice.taxRate) / 100) - invoice.discount;

                  return (
                    <tr key={invoice._id} className="hover:bg-stone-50 dark:hover:bg-stone-900/20 transition-colors group">
                      <td className="p-4 font-bold text-stone-900 dark:text-white">{invoice.reference}</td>
                      <td className="p-4">
                        <div className="font-medium text-stone-900 dark:text-white">{invoice.client.name}</div>
                        <div className="text-xs text-stone-500">{invoice.client.email}</div>
                      </td>
                      <td className="p-4 font-bold text-stone-900 dark:text-white">
                        ${total.toLocaleString('en-US', {minimumFractionDigits: 2})}
                      </td>
                      <td className="p-4 text-stone-500">
                        {new Date(invoice.issuedDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleEdit(invoice)}
                          className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
