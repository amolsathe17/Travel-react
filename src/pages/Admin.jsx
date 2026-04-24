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

  // PAGINATION
  const [userPage, setUserPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const [contactPage, setContactPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(5);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // FETCH
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
  const exportSubscribers = () =>
    window.open("/.netlify/functions/export-subscribers");

  const exportMessages = () =>
    window.open("/.netlify/functions/export-messages");

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete subscriber?")) return;
    await fetch(`/.netlify/functions/delete?id=${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete message?")) return;
    await fetch(`/.netlify/functions/contact?id=${id}`, {
      method: "DELETE",
    });
    fetchContacts();
  };

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

  // PAGINATION USERS
  const userLast = userPage * usersPerPage;
  const userFirst = userLast - usersPerPage;
  const currentUsers = filteredUsers.slice(userFirst, userLast);
  const userTotalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // PAGINATION CONTACTS
  const contactLast = contactPage * contactsPerPage;
  const contactFirst = contactLast - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    contactFirst,
    contactLast
  );
  const contactTotalPages = Math.ceil(
    filteredContacts.length / contactsPerPage
  );

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
          <h1 className="text-3xl font-bold text-white">
            Admin Dashboard
          </h1>

          <div className="flex gap-2">
            <button
              onClick={exportSubscribers}
              className="btn btn-secondary cursor-pointer"
            >
              Export Subscribers
            </button>

            <button
              onClick={exportMessages}
              className="btn btn-secondary cursor-pointer"
            >
              Export Messages
            </button>

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

        {/* CONTROLS */}
        <div className="bg-white opacity-80 p-4 rounded-xl shadow flex gap-2 max-w-7xl mx-auto px-4">
          <select
            value={usersPerPage}
            onChange={(e) => setUsersPerPage(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={5}>Subscribers: 5</option>
            <option value={10}>Subscribers: 10</option>
            <option value={20}>Subscribers: 20</option>
          </select>

          <select
            value={contactsPerPage}
            onChange={(e) =>
              setContactsPerPage(Number(e.target.value))
            }
            className="p-2 border rounded"
          >
            <option value={5}>Messages: 5</option>
            <option value={10}>Messages: 10</option>
            <option value={20}>Messages: 20</option>
          </select>
        </div>

        {/* LISTS */}
        <div className="grid md:grid-cols-2 gap-2 max-w-7xl mx-auto mb-2 px-5 py-5 bg-black opacity-75 rounded-xl shadow">
          {/* USERS */}
          <div className="space-y-2">
            <h2 className="text-white text-xl font-semibold">
              Subscribers
            </h2>

            {currentUsers.map((user, i) => (
              <div
                key={user._id}
                className="flex justify-between bg-white p-4 rounded shadow"
              >
                <div>
                  #{userFirst + i + 1} — {user.email}
                </div>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn btn-secondary"
                >
                  Delete
                </button>
              </div>
            ))}

            <div className="flex justify-center gap-2 text-white mt-4">
              <button
                onClick={() =>
                  setUserPage((p) => Math.max(p - 1, 1))
                }
                className="px-3 py-1 bg-white text-black rounded"
              >
                ◀
              </button>

              <span>
                Page {userPage} / {userTotalPages || 1}
              </span>

              <button
                onClick={() =>
                  setUserPage((p) =>
                    Math.min(p + 1, userTotalPages || 1)
                  )
                }
                className="px-3 py-1 bg-white text-black rounded"
              >
                ▶
              </button>
            </div>
          </div>

          {/* CONTACTS */}
          <div className="space-y-2">
            <h2 className="text-white text-xl font-semibold">
              Messages
            </h2>

            {currentContacts.map((c) => (
              <div
                key={c._id}
                className="bg-white p-4 rounded shadow flex justify-between"
              >
                <div>
                  <b>{c.name}</b> ({c.email})
                  <div>{c.message}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setReplyBox(c)}
                    className="btn btn-secondary"
                  >
                    <Mail size={16} />
                  </button>

                  <button
                    onClick={() => toggleImportant(c._id)}
                    className="btn btn-secondary"
                  >
                    <Star size={16} />
                  </button>

                  <button
                    onClick={() => markReplied(c._id)}
                    className="btn btn-secondary"
                  >
                    <Check size={16} />
                  </button>

                  <button
                    onClick={() => deleteContact(c._id)}
                    className="btn btn-secondary"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-center gap-2 text-white mt-4">
              <button
                onClick={() =>
                  setContactPage((p) => Math.max(p - 1, 1))
                }
                className="px-3 py-1 bg-white text-black rounded"
              >
                ◀
              </button>

              <span>
                Page {contactPage} / {contactTotalPages || 1}
              </span>

              <button
                onClick={() =>
                  setContactPage((p) =>
                    Math.min(p + 1, contactTotalPages || 1)
                  )
                }
                className="px-3 py-1 bg-white text-black rounded"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* REPLY MODAL */}
        {replyBox && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-lg mb-3">
                Reply to {replyBox.email}
              </h2>

              <textarea
                rows="4"
                className="w-full p-2 border rounded mb-4"
                value={replyMessage}
                onChange={(e) =>
                  setReplyMessage(e.target.value)
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReplyBox(null)}
                  className="px-4 py-2 bg-gray-400 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={sendReply}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
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