import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Mail, Star, Check, Trash } from "lucide-react";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [replyBox, setReplyBox] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const [notificationCount, setNotificationCount] = useState(0);
  const prevContactsRef = useRef([]);

  // ✅ Separate pagination
  const [userPage, setUserPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const [contactPage, setContactPage] = useState(1);
  const contactsPerPage = 5;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // FETCH USERS
  const fetchUsers = async () => {
    const res = await fetch("/.netlify/functions/subscribers");
    const data = await res.json();
    setUsers(data);
  };

  // FETCH CONTACTS
  const fetchContacts = async () => {
    const res = await fetch("/.netlify/functions/contacts");
    const data = await res.json();

    if (prevContactsRef.current.length > 0) {
      const diff = data.length - prevContactsRef.current.length;
      if (diff > 0) setNotificationCount((p) => p + diff);
    }

    prevContactsRef.current = data;
    setContacts(data);
  };

  // FETCH TEMPLATES
  const fetchTemplates = async () => {
    const res = await fetch("/.netlify/functions/templates");
    const data = await res.json();

    if (Array.isArray(data)) setTemplates(data);
    else setTemplates([]);
  };

  useEffect(() => {
    fetchUsers();
    fetchContacts();
    fetchTemplates();

    const interval = setInterval(fetchContacts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setUserPage(1);
    setContactPage(1);
  }, [search, usersPerPage]);

  // DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Delete subscriber?")) return;

    await fetch(`/.netlify/functions/delete?id=${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  // DELETE CONTACT
  const deleteContact = async (id) => {
    if (!window.confirm("Delete message?")) return;

    await fetch(`/.netlify/functions/contact?id=${id}`, {
      method: "DELETE",
    });

    fetchContacts();
  };

  // IMPORTANT / REPLIED
  const toggleImportant = async (id) => {
    await fetch(`/.netlify/functions/important?id=${id}`, {
      method: "PUT",
    });
    fetchContacts();
  };

  const markReplied = async (id) => {
    await fetch(`/.netlify/functions/replied?id=${id}`, {
      method: "PUT",
    });
    fetchContacts();
  };

  // SEND TEMPLATE
  const sendTemplate = async () => {
    if (!selectedTemplate) return alert("Select template first");

    setLoading(true);

    await fetch("/.netlify/functions/send-template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateName: selectedTemplate }),
    });

    alert("Template sent successfully 🚀");
    setLoading(false);
  };

  const handleExport = () => {
    window.open("/.netlify/functions/export");
  };

  const sendReply = async () => {
    if (!replyMessage) return alert("Write message");

    await fetch("/.netlify/functions/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: replyBox.email,
        message: replyMessage,
        id: replyBox._id,
      }),
    });

    alert("Reply sent ✅");
    setReplyBox(null);
    setReplyMessage("");
    fetchContacts();
  };

  // FILTER
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContacts = contacts.filter((c) =>
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION USERS
  const userLast = userPage * usersPerPage;
  const userFirst = userLast - usersPerPage;
  const currentUsers = filteredUsers.slice(userFirst, userLast);
  const userTotalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // PAGINATION CONTACTS
  const contactLast = contactPage * contactsPerPage;
  const contactFirst = contactLast - contactsPerPage;
  const currentContacts = filteredContacts.slice(contactFirst, contactLast);
  const contactTotalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  // CHART DATA
  const userChart = [
    { name: "Subscribers", value: users.length },
    { name: "Filtered", value: filteredUsers.length },
  ];

  const contactChart = [
    { name: "Messages", value: contacts.length },
    { name: "Filtered", value: filteredContacts.length },
  ];

  const COLORS = ["#3b82f6", "#22c55e"];

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <img src="./maldives.jpg" className="w-full h-full object-cover" />
      </div>

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 pt-20">
        {/* HEADER */}
        <div className="flex justify-between max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="bg-red-500 px-4 py-2 rounded text-white cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* CHARTS + CONTROLS */}
        <div className="grid md:grid-cols-3 gap-4 max-w-7xl mx-auto mb-1 px-4 py-4">
          {/* SUBSCRIBERS CHART */}
          <div className="bg-white opacity-80 pr-3 pt-3 rounded-xl shadow">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={userChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* MESSAGES CHART */}
          <div className="bg-white opacity-80 pr-3 pt-3 rounded-xl shadow">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={contactChart} dataKey="value" outerRadius={90}>
                  {contactChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* CONTROLS */}
          <div className="bg-white opacity-80 p-4 rounded-xl shadow flex flex-col gap-2">
            <button onClick={handleExport} className="btn btn-secondary cursor-pointer">
              Export Excel
            </button>

            <select
              className="p-2 border rounded"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Select Template</option>
              {templates.map((t, i) => (
                <option key={i}>{t}</option>
              ))}
            </select>

            <button
              onClick={sendTemplate}
              className="bg-purple-600 text-white py-2 rounded cursor-pointer"
            >
              {loading ? "Sending..." : "Send Template"}
            </button>

            <input
              type="text"
              placeholder="Search email..."
              className="p-2 border rounded"
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="p-2 border rounded"
              value={usersPerPage}
              onChange={(e) => setUsersPerPage(Number(e.target.value))}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>

        {/* LISTS */}
        <div className="grid md:grid-cols-2 gap-2 max-w-7xl mx-auto mb-2 px-5 py-5 bg-black opacity-75 rounded-xl shadow">
          {/* USERS */}
          <div className="space-y-2">
            <h2 className="text-white text-xl font-semibold">Subscribers</h2>
            {currentUsers.map((user, i) => (
              <div key={user._id} className="flex justify-between bg-white p-4 rounded shadow">
                <div>
                  #{userFirst + i + 1} — {user.email}
                </div>
                <button onClick={() => handleDelete(user._id)} className="btn btn-secondary cursor-pointer">
                  Delete
                </button>
              </div>
            ))}

            <div className="flex justify-center mt-4 gap-2 text-white">
              <button onClick={() => setUserPage(p => Math.max(p - 1, 1))} className="px-3 py-1 bg-white text-black rounded">◀</button>
              <span>Page {userPage} / {userTotalPages || 1}</span>
              <button onClick={() => setUserPage(p => Math.min(p + 1, userTotalPages || 1))} className="px-3 py-1 bg-white text-black rounded">▶</button>
            </div>
          </div>

          {/* CONTACTS */}
          <div className="space-y-2">
            <h2 className="text-white text-xl font-semibold">Messages received</h2>

            {currentContacts.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded shadow flex justify-between">
                <div>
                  <b>{c.name}</b> ({c.email})
                  <div>{c.message}</div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setReplyBox(c)} className="btn btn-secondary"><Mail size={16} /></button>
                  <button onClick={() => toggleImportant(c._id)} className="btn btn-secondary"><Star size={16} /></button>
                  <button onClick={() => markReplied(c._id)} className="btn btn-secondary"><Check size={16} /></button>
                  <button onClick={() => deleteContact(c._id)} className="btn btn-secondary"><Trash size={16} /></button>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-4 gap-2 text-white">
              <button onClick={() => setContactPage(p => Math.max(p - 1, 1))} className="px-3 py-1 bg-white text-black rounded">◀</button>
              <span>Page {contactPage} / {contactTotalPages || 1}</span>
              <button onClick={() => setContactPage(p => Math.min(p + 1, contactTotalPages || 1))} className="px-3 py-1 bg-white text-black rounded">▶</button>
            </div>
          </div>
        </div>

        {/* REPLY MODAL */}
        {replyBox && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-lg mb-3">Reply to {replyBox.email}</h2>

              <textarea
                rows="4"
                className="w-full p-2 border rounded mb-4"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button onClick={() => setReplyBox(null)} className="px-4 py-2 bg-gray-400 rounded">
                  Cancel
                </button>

                <button onClick={sendReply} className="px-4 py-2 bg-green-500 text-white rounded">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;