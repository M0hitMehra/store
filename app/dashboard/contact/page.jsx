"use client";

import React, { useState } from "react";
import {
  Headphones,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const [subject, setSubject] = useState("");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      variant: "success",
      title: "Message Sent",
      description: "Our support concierge will reply to your registered email shortly.",
    });
    setTimeout(() => {
      setSubject("");
      setOrderId("");
      setMessage("");
      setSubmitted(false);
    }, 3000);
  };

  const faqs = [
    {
      q: "How long does standard vs express shipping take?",
      a: "Standard shipping takes 3-5 business days across India. Express Air shipping delivers within 1-2 business days to major metropolitan areas.",
    },
    {
      q: "What is your return & exchange policy?",
      a: "We offer hassle-free returns within 7 days of delivery. Items must be unworn in their original designer packaging with all brand tags intact.",
    },
    {
      q: "Are all products authentic?",
      a: "Yes, 100% of the products on STUDIO ATELIER are authentic, directly sourced and verified.",
    },
    {
      q: "Can I cancel my order after placement?",
      a: "Orders can be cancelled directly from your Orders page before they are marked as Shipped. Once shipped, you can initiate a return upon delivery.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
            Assistance & Service
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-neutral-900 mt-1">
            Customer Helpline
          </h1>
        </div>
        <p className="text-xs text-neutral-500 font-medium">
          Available Monday to Saturday, 9:00 AM – 7:00 PM IST
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-neutral-200 rounded-3xl space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-900">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-900">
            Email Support
          </h3>
          <p className="text-xs text-neutral-500">
            Direct assistance with order inquiries & styling consultations.
          </p>
          <p className="text-xs font-mono font-bold text-neutral-950 pt-2">
            concierge@studio-atelier.com
          </p>
        </div>

        <div className="p-6 bg-white border border-neutral-200 rounded-3xl space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-900">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-900">
            Direct Helpline
          </h3>
          <p className="text-xs text-neutral-500">
            Immediate phone support for urgent order amendments.
          </p>
          <p className="text-xs font-mono font-bold text-neutral-950 pt-2">
            +91 (0) 800-456-7890
          </p>
        </div>

        <div className="p-6 bg-white border border-neutral-200 rounded-3xl space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-900">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-900">
            Operating Hours
          </h3>
          <p className="text-xs text-neutral-500">
            Mon – Fri: 9:00 AM – 7:00 PM<br />
            Sat: 10:00 AM – 4:00 PM IST
          </p>
          <span className="inline-block mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            Concierge Online
          </span>
        </div>
      </div>

      {/* Contact Form & FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Support Request Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
              Inquiry Desk
            </span>
            <h2 className="text-xl font-black uppercase font-mono tracking-tight text-neutral-900">
              Submit a Support Ticket
            </h2>
            <p className="text-xs text-neutral-500">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Subject / Issue Category *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Order Tracking, Sizing Guidance, Exchange Request"
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Order Reference ID (Optional)
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. #ORD-123456"
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Detailed Message *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry or requirement..."
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3.5 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ticket Submitted</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>
        </div>

        {/* FAQs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
              Quick Answers
            </span>
            <h2 className="text-xl font-black uppercase font-mono tracking-tight text-neutral-900">
              Frequently Asked
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 bg-white border border-neutral-200 rounded-2xl space-y-1.5"
              >
                <h4 className="text-xs font-bold text-neutral-900">
                  {faq.q}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
