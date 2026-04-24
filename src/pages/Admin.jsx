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

  const prevContactsRef = useRef([]);

  const [userPage, setUserPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const [contactPage, setContactPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(5);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // FETCH DATA
  const fetchUsers = async () => {
    const res = await fetch("/.netlify/functions/subscribers");
    setUsers(await res.json());
  };

  const fetchContacts = async () => {
    const res = await fetch("/.netlify/functions/contacts");
    const data = await res.json();
    prevContactsRef.current = data;
    setContacts(data);
  };

  const fetchTemplates = async () => {
    const res = await fetch("/.netlify/functions/templates");
    const data = await res.json();
    setTemplates(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchUsers();
    fetchContacts();
    fetchTemplates();
  }, []);

  useEffect(() => {
    setUserPage(1);
    setContactPage(1);
  }, [search, usersPerPage, contactsPerPage]);

  // EXPORT
  const exportSubscribers = () => {
    window.open("/.netlify/functions/export-subscribers");
  };

  const exportMessages = () => {
    window.open("/.netlify/functions/export-messages");
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete subscriber?")) return;
    await fetch(`/.netlify/functions/delete?id=${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete message?")) return;
    await fetch(`/.netlify/functions/contact?id=${id}`, { method: "DELETE" });
    fetchContacts();
  };

  const toggleImportant = async (id) => {
    await fetch(`/.netlify/functions/important?id=${id}`, { method: "PUT" });
    fetchContacts();
  };

  const markReplied = async (id) => {
    await fetch(`/.netlify/functions/replied?id=${id}`, { method: "PUT" });
    fetchContacts();
  };

  const sendTemplate = async () => {
    if (!selectedTemplate) return alert("Select template");

    setLoading(true);
    await fetch("/.netlify/functions/send-template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateName: selectedTemplate }),
    });

    alert("Template sent 🚀");
    setLoading(false);
  };

  const sendReply = async () => {
    if (!replyMessage) return alert("Write message");

    await fetch("/.netlify/functions/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: replyBox.email,
        message: replyMessage,
        id: replyBox._id,
      }),
    });

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

  // PAGINATION
  const userLast = userPage * usersPerPage;
  const userFirst = userLast - usersPerPage;
  const currentUsers = filteredUsers.slice(userFirst, userLast);
  const userTotalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

          <div className="flex gap-2">
            <button onClick={exportSubscribers} className="btn btn-secondary">Export Subscribers</button>
            <button onClick={exportMessages} className="btn btn-secondary">Export Messages</button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-red-500 px-4 py-2 rounded text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CHARTS + TEMPLATE */}
        <div className="grid md:grid-cols-3 gap-4 max-w-7xl mx-auto px-4 py-4">
          {/* SUBSCRIBERS CHART */}
          <div className="bg-white opacity-80 p-3 rounded-xl shadow">
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
          <div className="bg-white opacity-80 p-3 rounded-xl shadow">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={contactChart} dataKey="value" outerRadius={90}>
                  {contactChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* TEMPLATE */}
          <div className="bg-white opacity-80 p-4 rounded-xl shadow flex flex-col gap-2">
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
              className="bg-purple-600 text-white py-2 rounded"
            >
              {loading ? "Sending..." : "Send Template"}
            </button>

            <input
              type="text"
              placeholder="Search email..."
              className="p-2 border rounded"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LISTS */}
        <div className="grid md:grid-cols-2 gap-2 max-w-7xl mx-auto px-5 py-5 bg-black opacity-75 rounded-xl shadow">

          {/* SUBSCRIBERS */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white text-xl font-semibold">Subscribers</h2>

              <select
                value={usersPerPage}
                onChange={(e) => setUsersPerPage(Number(e.target.value))}
                className="p-1 border rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {currentUsers.map((u, i) => (
              <div key={u._id} className="flex justify-between bg-white p-3 rounded mb-2">
                <div>#{userFirst + i + 1} — {u.email}</div>
                <button onClick={() => handleDelete(u._id)} className="btn btn-secondary">Delete</button>
              </div>
            ))}

            <div className="flex justify-center gap-2 text-white mt-2">
              <button onClick={() => setUserPage(p => Math.max(p - 1, 1))} className="bg-white text-black px-2">◀</button>
              <span>{userPage}/{userTotalPages || 1}</span>
              <button onClick={() => setUserPage(p => Math.min(p + 1, userTotalPages || 1))} className="bg-white text-black px-2">▶</button>
            </div>
          </div>

          {/* MESSAGES */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white text-xl font-semibold">Messages</h2>

              <select
                value={contactsPerPage}
                onChange={(e) => setContactsPerPage(Number(e.target.value))}
                className="p-1 border rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {currentContacts.map((c) => (
              <div key={c._id} className="bg-white p-3 rounded mb-2 flex justify-between">
                <div>
                  <b>{c.name}</b> ({c.email})
                  <div>{c.message}</div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setReplyBox(c)} className="btn btn-secondary"><Mail size={16} /></button>
                  <button onClick={() => toggleImportant(c._id)} className="btn btn-secondary"><Star size={16} /></button>
                  <button onClick={() => markReplied(c._id)} className="btn btn-secondary"><Check size={16} /></button>
                  <button onClick={() => deleteContact(c._id)} className="btn btn-secondary"><Trash size={16} /></button>
                </div>
              </div>
            ))}

            <div className="flex justify-center gap-2 text-white mt-2">
              <button onClick={() => setContactPage(p => Math.max(p - 1, 1))} className="bg-white text-black px-2">◀</button>
              <span>{contactPage}/{contactTotalPages || 1}</span>
              <button onClick={() => setContactPage(p => Math.min(p + 1, contactTotalPages || 1))} className="bg-white text-black px-2">▶</button>
            </div>
          </div>
        </div>

        {/* REPLY MODAL */}
        {replyBox && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white p-5 rounded w-96">
              <textarea
                className="w-full border p-2 mb-2"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              <button onClick={sendReply} className="bg-green-500 text-white px-3 py-1 rounded">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;