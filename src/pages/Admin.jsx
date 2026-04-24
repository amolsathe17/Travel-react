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

  // ✅ SEPARATE PAGINATION
  const [userPage, setUserPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const [contactPage, setContactPage] = useState(1);
  const [contactsPerPage] = useState(5);

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

  // USERS PAGINATION
  const userLast = userPage * usersPerPage;
  const userFirst = userLast - usersPerPage;
  const currentUsers = filteredUsers.slice(userFirst, userLast);
  const userTotalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // CONTACT PAGINATION
  const contactLast = contactPage * contactsPerPage;
  const contactFirst = contactLast - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    contactFirst,
    contactLast
  );
  const contactTotalPages = Math.ceil(
    filteredContacts.length / contactsPerPage
  );

  const barData = [
    { name: "Total", value: users.length },
    { name: "Filtered", value: filteredUsers.length },
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
          <h1 className="text-3xl font-bold text-white">
            Admin Dashboard
          </h1>

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

        {/* CONTROLS */}
        <div className="grid md:grid-cols-3 gap-4 max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white opacity-80 p-4 rounded-xl shadow">
            <button onClick={handleExport} className="mb-2">
              Export Excel
            </button>

            <select
              className="p-2 border w-full mb-2"
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
              className="bg-purple-600 text-white w-full py-2"
            >
              {loading ? "Sending..." : "Send Template"}
            </button>

            <input
              className="mt-2 p-2 border w-full"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LISTS */}
        <div className="grid md:grid-cols-2 gap-4 max-w-7xl mx-auto px-4 py-4">
          {/* USERS */}
          <div>
            <h2 className="text-white text-xl mb-2">
              Subscribers
            </h2>

            {currentUsers.map((user, i) => (
              <div
                key={user._id}
                className="bg-white p-3 mb-2 flex justify-between"
              >
                #{userFirst + i + 1} {user.email}
                <button onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </div>
            ))}

            {/* USER PAGINATION */}
            <div className="text-white">
              <button
                onClick={() =>
                  setUserPage((p) => Math.max(p - 1, 1))
                }
              >
                ◀
              </button>
              Page {userPage} / {userTotalPages || 1}
              <button
                onClick={() =>
                  setUserPage((p) =>
                    Math.min(p + 1, userTotalPages)
                  )
                }
              >
                ▶
              </button>
            </div>
          </div>

          {/* CONTACTS */}
          <div>
            <h2 className="text-white text-xl mb-2">
              Messages
            </h2>

            {currentContacts.map((c) => (
              <div
                key={c._id}
                className="bg-white p-3 mb-2 flex justify-between"
              >
                <div>
                  {c.name} ({c.email})
                  <div>{c.message}</div>
                </div>
                <button onClick={() => deleteContact(c._id)}>
                  Delete
                </button>
              </div>
            ))}

            {/* CONTACT PAGINATION */}
            <div className="text-white">
              <button
                onClick={() =>
                  setContactPage((p) => Math.max(p - 1, 1))
                }
              >
                ◀
              </button>
              Page {contactPage} / {contactTotalPages || 1}
              <button
                onClick={() =>
                  setContactPage((p) =>
                    Math.min(p + 1, contactTotalPages)
                  )
                }
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;