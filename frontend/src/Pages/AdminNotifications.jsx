import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';

function AdminNotifications() {
  const [form, setForm] = useState({ title: "", message: "" });
  const [touched, setTouched] = useState({ title: false, message: false });
  const [successMsg, setSuccessMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch notification history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setTouched({ title: true, message: true });
    if (!canSubmit) return;
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/notifications', {
        title: form.title.trim(),
        message: form.message.trim(),
      });
      setSuccessMsg("Notification broadcasted successfully!");
      setForm({ title: "", message: "" });
      setTouched({ title: false, message: false });
      fetchHistory();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to broadcast notification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification? It will be removed from all user inboxes.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to delete notification.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">Notifications Management</h1>
        <p className="text-gray-500 mt-1 mb-8">Broadcast announcements and manage active system notifications.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📢</span>
                <h3 className="text-xl font-bold text-gray-800">New Broadcast</h3>
              </div>
              
              {successMsg && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {successMsg}
                </div>
              )}
              
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    onBlur={() => setTouched((p) => ({ ...p, title: true }))}
                    placeholder="e.g. Server Maintenance"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  />
                  {touched.title && errors.title ? (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.title}</p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message Body</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    onBlur={() => setTouched((p) => ({ ...p, message: true }))}
                    placeholder="Type your announcement here..."
                    rows={5}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                  />
                  {touched.message && errors.message ? (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.message}</p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={
                    "w-full px-5 py-3 rounded-lg font-semibold shadow-sm transition-all " +
                    (canSubmit && !isSubmitting
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed")
                  }
                >
                  {isSubmitting ? "Sending..." : "Send Notification"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Broadcast History</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  {history.length} Total
                </span>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                    <svg className="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No notifications have been broadcasted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((note) => (
                      <div key={note._id} className="group flex items-start justify-between p-5 rounded-xl border border-gray-100 bg-white hover:bg-blue-50/30 hover:border-blue-100 transition-all shadow-sm hover:shadow">
                        <div className="pr-4">
                          <h4 className="text-lg font-bold text-gray-800 mb-1">{note.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{note.message}</p>
                          <div className="flex items-center text-xs text-gray-400 font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(note.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all focus:opacity-100"
                          title="Delete Notification"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default AdminNotifications;
