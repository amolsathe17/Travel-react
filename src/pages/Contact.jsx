import { Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export const Contact = () => {
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true); // fixes hydration/render delay issue
  }, []);

  if (!mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Enter valid mobile number");
      return;
    }

    setLoading(true);

    // fetch("http://localhost:5000/contact", { //local development
    fetch("/.netlify/functions/contact", {  //netlify development
      //netlify deployment
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        if (res.ok) {
          toast.success("Message sent successfully 🚀");
          setForm({ name: "", email: "", phone: "", message: "" });
        } else {
          const data = await res.json();
          toast.error(data.message || "Something went wrong");
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Server error");
        setLoading(false);
      });
  };

  return (
    <section className="relative py-28 overflow-hidden">
      <Toaster position="top-right" />

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      >
        <source src="/contact.mp4" type="video/mp4" />
      </video>

      {/* Mobile fallback */}
      <div className="absolute inset-0 md:hidden bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')] bg-cover bg-center"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Glow */}
      <div className="absolute top-0 left-1/2 w-150 h-150 bg-purple-500/20 blur-[120px] -translate-x-1/2"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-4xl font-bold mb-2 text-white">Let’s Talk ✨</h2>

          <p className="text-gray-300 mb-8 text-sm">
            We usually respond within a few hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 font-semibold hover:scale-105 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>

        {/* MAP + INFO */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* MAP FIXED */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <iframe
              key={mounted ? "map-loaded" : "map"}
              title="map"
              src="https://www.google.com/maps?q=Khopoli,Maharashtra&output=embed"
              className="w-full h-87.5 border-0"
              loading="lazy"
            ></iframe>
          </div>

          {/* INFO */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-400" size={18} />
              <p className="text-white">
                #3, Lara Chambers, Happy Colony, Kothrud, Maharashtra, India
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-green-400" size={18} />
              <p className="text-white">+91 98765 43210</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-purple-400" size={18} />
              <p className="text-white">info@comsoftinfotech.com</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
