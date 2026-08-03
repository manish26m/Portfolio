"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Calendar, Reply, Send, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

export function AdminMessagesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const selectedMessage = messages.find((m) => m.id === selectedId);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedId === id) {
          setSelectedId(null);
          setShowReply(false);
        }
        toast.success("Message deleted");
      }
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedId(msg.id);
    setShowReply(false);
    setReplyText("");
    if (!msg.read) {
      handleToggleRead(msg.id, false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${selectedMessage.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Reply sent to ${selectedMessage.name}!`);
        setShowReply(false);
        setReplyText("");
      } else {
        toast.error(data.error || "Failed to send reply");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center border border-white/5">
        <MailOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40">Your inbox is empty.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[75vh]">
      {/* Message List */}
      <div className="w-1/3 glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/5 bg-white/5">
          <h2 className="text-sm font-medium text-white/80">All Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              className={cn(
                "w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/5",
                selectedId === msg.id ? "bg-sky-400/10 border-l-2 border-l-sky-400" : "",
                !msg.read ? "bg-white/5" : ""
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn("text-sm font-medium", !msg.read ? "text-white" : "text-white/70")}>
                  {msg.name}
                </span>
                {!msg.read && <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />}
              </div>
              <div className="text-xs text-white/50 truncate mb-1">
                {msg.subject || "No Subject"}
              </div>
              <div className="text-[10px] text-white/30 flex items-center gap-1">
                <Calendar size={10} />
                {format(new Date(msg.createdAt), "MMM d, yyyy")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Detail + Reply */}
      <div className="flex-1 glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
        {selectedMessage ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {selectedMessage.subject || "No Subject"}
                </h2>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-white/80">
                    From: <span className="text-sky-400">{selectedMessage.name}</span>{" "}
                    <span className="text-white/40">&lt;{selectedMessage.email}&gt;</span>
                  </span>
                  <span className="text-white/40">{format(new Date(selectedMessage.createdAt), "PPpp")}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowReply((v) => !v); setReplyText(""); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    showReply
                      ? "bg-sky-400/20 text-sky-400 border border-sky-400/30"
                      : "bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 border border-transparent"
                  )}
                  title="Reply"
                >
                  <Reply size={14} />
                  Reply
                </button>
                <button
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                  className="p-2 rounded-lg glass border border-white/5 text-white/40 hover:text-white transition-colors"
                  title={selectedMessage.read ? "Mark as unread" : "Mark as read"}
                >
                  {selectedMessage.read ? <Mail size={16} /> : <MailOpen size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 rounded-lg glass border border-white/5 text-white/40 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Inline Reply Panel */}
            {showReply && (
              <div className="border-t border-white/5 p-6 flex-shrink-0 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Replying to {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                  </p>
                  <button
                    onClick={() => { setShowReply(false); setReplyText(""); }}
                    className="text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-400/40 outline-none text-sm text-white/80 resize-none transition-all duration-300 placeholder:text-white/20"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSendReply}
                    disabled={sending || !replyText.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                    {sending ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30">
            <Mail className="w-12 h-12 mb-4 opacity-50" />
            <p>Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
