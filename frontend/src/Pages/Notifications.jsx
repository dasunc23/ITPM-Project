import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Notifications = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications");
        setItems(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();
  }, []);



  const unread = items.filter((n) => n.status === "Unread");
  const read = items.filter((n) => n.status === "Read");

  const markAsRead = (id) => {
    setItems((prev) => prev.map((n) => ((n._id || n.id) === id ? { ...n, status: "Read" } : n)));
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => (n.status === "Unread" ? { ...n, status: "Read" } : n)));
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      setItems((prev) => prev.filter((n) => (n._id || n.id) !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearRead = () => {
    setItems((prev) => prev.filter((n) => n.status !== "Read"));
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

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
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
                  items.map((n) => {
                    const id = n._id || n.id;
                    const date = n.createdAt ? new Date(n.createdAt).toLocaleString() : n.time;
                    return (
                    <div
                      key={id}
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
                          <p className="text-xs text-gray-400 mt-3">{date}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          {n.status === "Unread" ? (
                            <button
                              type="button"
                              onClick={() => markAsRead(id)}
                              className="text-xs px-4 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition"
                            >
                              Mark as read
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => deleteNotification(id)}
                            className="text-xs px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-200 hover:bg-red-500/15 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )})
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

