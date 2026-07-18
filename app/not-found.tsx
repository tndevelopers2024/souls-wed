"use client";

import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex relative overflow-hidden font-sans selection:bg-[#f97316] selection:text-white items-center justify-center" style={{ color: "#0f172a", padding: "20px", paddingTop: "80px" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .maintenance-container {
            margin: auto;
            position: relative;
            z-index: 10;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 24px 70px rgba(252, 203, 17, 0.12);
            border-radius: 40px;
            padding: 60px 40px;
            max-width: 600px;
            width: 100%;
            text-align: center;
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(40px);
        }
        @keyframes slideUp {
            to { opacity: 1; transform: translateY(0); }
        }
        .logo-wrapper {
            margin-bottom: 30px;
            display: flex;
            justify-content: center;
        }
        .logo-wrapper img {
            max-width: 200px;
            height: auto;
            max-height: 64px;
            object-fit: contain;
            margin-bottom: 8px;
        }
        .heading-title {
            font-size: 42px;
            font-weight: 700;
            line-height: 1.2;
            margin: 0 0 20px 0;
            letter-spacing: -1px;
        }
        .italic-accent {
            font-family: var(--font-heading), 'Playfair Display', serif;
            font-style: italic;
            font-weight: 600;
            color: #f97316;
            font-size: 1.1em;
        }
        .message {
            font-size: 18px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 30px;
            font-weight: 400;
        }
        .contact-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: #fff;
            padding: 12px 24px;
            border-radius: 100px;
            font-size: 15px;
            font-weight: 600;
            color: #0f172a;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            border: 1px solid #f1f5f9;
        }
        .contact-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(249, 115, 22, 0.15);
            border-color: #ffedd5;
        }
        .contact-btn svg {
            color: #f97316;
        }
        .pill-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 1);
            border-radius: 100px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #f97316;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .pulse-dot {
            width: 6px;
            height: 6px;
            background-color: #f97316;
            border-radius: 50%;
            animation: pulse-shadow 1.5s infinite;
        }
        @keyframes pulse-shadow {
            0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(249, 115, 22, 0); }
            100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
        @media (max-width: 640px) {
            .heading-title { font-size: 28px; margin-bottom: 16px; }
            .maintenance-container { 
                padding: 32px 20px; 
                width: 100%;
                border-radius: 32px;
            }
            .message { font-size: 15px; margin-bottom: 24px; }
            .pill-badge { font-size: 10px; padding: 4px 10px; margin-bottom: 16px; }
            .contact-btn { font-size: 14px; padding: 10px 20px; width: 100%; max-width: 250px; }
        }
        @media (max-width: 400px) {
            .heading-title { font-size: 26px; }
            .maintenance-container { padding: 24px 16px; border-radius: 24px; }
            .message { font-size: 14px; }
        }
        `
      }} />

      <div className="maintenance-container">
          <div className="logo-wrapper">
              <Image 
                src="/logo/logo-by-soulswed.png" 
                alt="SoulsWed Logo"
                width={200}
                height={64}
                priority
              />
          </div>
          
          <div className="pill-badge">
              <div className="pulse-dot"></div>
              404 Error
          </div>

          <h1 className="heading-title">Looks like you're <br /><span className="italic-accent">Lost in the Details</span></h1>
          
          <p className="message">
              Oops! The page you are looking for seems to have wandered off. Let's get you back to planning your perfect wedding.
          </p>

          <Link href="/" className="contact-btn">
              <Home className="w-4 h-4" />
              Back to Home
          </Link>
      </div>
    </div>
  );
}
