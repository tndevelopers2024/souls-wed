"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Loader2 } from "lucide-react";
import { XIcon } from "@/components/ui/x";

interface Review {
  id: number;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
}

interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  /** e.g. /api/venues/venue-paris-1/reviews or /api/vendors/<id>/reviews */
  endpoint: string;
  onSubmitted: (review: Review) => void;
}

export default function ReviewFormModal({ open, onClose, endpoint, onSubmitted }: ReviewFormModalProps) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCheckingAuth(true);
    setError(null);
    setSuccess(false);
    setRating(0);
    setText("");
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingAuth(false));
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit review.");
        return;
      }
      setSuccess(true);
      onSubmitted(data.review);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[28px] p-7 max-w-md w-full shadow-2xl border border-slate-100 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            aria-label="Close"
          >
            <XIcon className="w-4 h-4" />
          </button>

          {checkingAuth ? (
            <div className="py-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : !authenticated ? (
            <div className="py-4 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Log in to write a review</h3>
              <p className="text-sm text-slate-500 mb-5">You need an account to share your experience.</p>
              <Link
                href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                Log In
              </Link>
            </div>
          ) : success ? (
            <div className="py-4 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Thank you!</h3>
              <p className="text-sm text-slate-500">Your review has been posted.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Write a Review</h3>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                    aria-label={`${s} star`}
                  >
                    <Star
                      className="w-7 h-7"
                      style={{ color: "var(--sw-secondary)" }}
                      fill={s <= (hoverRating || rating) ? "var(--sw-secondary)" : "none"}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                required
                placeholder="Share details of your experience..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-primary-400 transition-all resize-none mb-3"
              />
              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Review
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
