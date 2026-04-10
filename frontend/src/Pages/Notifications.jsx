import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [items, setItems] = useState([
    {
      id: "n1",
      title: "Match Invitation",
      message: "You were invited to join room ABC123.",
      time: "2 min ago",
      status: "Unread",
    },
    {
      id: "n2",
      title: "Achievement Unlocked",
      message: "You unlocked 'Fast Thinker' after winning 3 games.",
      time: "30 min ago",
      status: "Unread",
    },
    {
      id: "n3",
      title: "Weekly Summary",
      message: "You climbed 5 ranks this week. Keep going!",
      time: "Today",
      status: "Read",
    },
  ]);

  // Create form (to demonstrate validations + CRUD)
  const [form, setForm] = useState({ title: "", message: "" });
  const [touched, setTouched] = useState({ title: false, message: false });

  const errors = useMemo(() => {
    const next = { title: "", message: "" };
    const title = form.title.trim();
    const message = form.message.trim();

    if (!title) next.title = "Title is required.";
    else if (title.length < 3) next.title = "Title must be at least 3 characters.";
    else if (title.length > 60) next.title = "Title must be 60 characters or less.";

    if (!message) next.message = "Message is required.";
    else if (message.length < 5) next.message = "Message must be at least 5 characters.";
    else if (message.length > 200) next.message = "Message must be 200 characters or less.";

    return next;
  }, [form.message, form.title]);

  const canSubmit = !errors.title && !errors.message;

  const unread = items.filter((n) => n.status === "Unread");
  const read = items.filter((n) => n.status === "Read");

  const markAsRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, status: "Read" } : n)));
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => (n.status === "Unread" ? { ...n, status: "Read" } : n)));
  };

  const deleteNotification = (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const clearRead = () => {
    setItems((prev) => prev.filter((n) => n.status !== "Read"));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setTouched({ title: true, message: true });
    if (!canSubmit) return;

    const now = new Date();
    setItems((prev) => [
      {
        id: `n_${now.getTime()}`,
        title: form.title.trim(),
        message: form.message.trim(),
        time: "Just now",
        status: "Unread",
      },
      ...prev,
    ]);
    setForm({ title: "", message: "" });
    setTouched({ title: false, message: false });
  };

  return (
    <div className="min-h-screen bg-[#040b1d] text-white">
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#a855f7]">GameHub</h1>
          <Link
            to="/home"
            className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white px-5 py-2 rounded-full font-semibold hover:opacity-95 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Notifications</h2>
          <p className="text-center text-gray-300 mb-8">
            Mark as read, delete, and create notifications (demo CRUD + validations).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Create notification</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    onBlur={() => setTouched((p) => ({ ...p, title: true }))}
                    placeholder="e.g. Room started"
                    className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  />
                  {touched.title && errors.title ? (
                    <p className="text-xs text-red-300 mt-2">{errors.title}</p>
                  ) : null}
                </div>
                <div>
                  <label className="text-sm text-gray-300">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    onBlur={() => setTouched((p) => ({ ...p, message: true }))}
                    placeholder="Short message..."
                    rows={4}
                    className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  />
                  {touched.message && errors.message ? (
                    <p className="text-xs text-red-300 mt-2">{errors.message}</p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={
                    "w-full px-5 py-3 rounded-xl font-semibold transition " +
                    (canSubmit
                      ? "bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:opacity-95"
                      : "bg-white/10 text-gray-400 cursor-not-allowed")
                  }
                >
                  Create
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h3 className="text-lg font-bold">Inbox</h3>
                <div className="flex items-center gap-3">
                  {unread.length > 0 ? (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs px-4 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition"
                    >
                      Mark all as read
                    </button>
                  ) : null}
                  {read.length > 0 ? (
                    <button
                      type="button"
                      onClick={clearRead}
                      className="text-xs px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-200 hover:bg-red-500/15 transition"
                    >
                      Clear read
                    </button>
                  ) : null}
                  <span className="text-xs px-3 py-1 rounded-full bg-black/30 border border-white/10 text-gray-200">
                    {items.length} total · {unread.length} unread
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-gray-300 text-sm">No notifications.</div>
                ) : (
                  items.map((n) => (
                    <div
                      key={n.id}
                      className={
                        "p-5 rounded-2xl border transition " +
                        (n.status === "Unread"
                          ? "bg-[#a855f7]/10 border-[#a855f7]/20"
                          : "bg-black/20 border-white/10")
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{n.title}</p>
                            <span
                              className={
                                "text-[11px] px-2 py-0.5 rounded-full border " +
                                (n.status === "Unread"
                                  ? "bg-[#a855f7]/15 border-[#a855f7]/25 text-[#e9d5ff]"
                                  : "bg-white/10 border-white/10 text-gray-200")
                              }
                            >
                              {n.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-2">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-3">{n.time}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          {n.status === "Unread" ? (
                            <button
                              type="button"
                              onClick={() => markAsRead(n.id)}
                              className="text-xs px-4 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition"
                            >
                              Mark as read
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => deleteNotification(n.id)}
                            className="text-xs px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-200 hover:bg-red-500/15 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notifications;

