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

  // ✅ Separate Pagination
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
    try {
      const res = await fetch("/.netlify/functions/subscribers");
      const data = await res.json();
      setUsers(data);
    } catch {
      alert("Backend error");
    }
  };

  // FETCH CONTACTS
  const fetchContacts = async () => {
    try {
      const res = await fetch("/.netlify/functions/contacts");
      const data = await res.json();

      if (prevContactsRef.current.length > 0) {
        const diff = data.length - prevContactsRef.current.length;
        if (diff > 0) setNotificationCount((prev) => prev + diff);
      }

      prevContactsRef.current = data;
      setContacts(data);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH TEMPLATES
  const fetchTemplates = async () => {
    try {
      const res = await fetch("/.netlify/functions/templates");
      const data = await res.json();

      if (Array.isArray(data)) setTemplates(data);
      else setTemplates([]);
    } catch (err) {
      setTemplates([]);
    }
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
          {/* SUBSCRIBER CHART */}
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

          {/* MESSAGE CHART */}
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

          {/* CONTROLS (UNCHANGED STYLE) */}
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

        {/* KEEP REST SAME (lists + pagination + reply modal) */}
      </div>
    </div>
  );
};

export default Admin;