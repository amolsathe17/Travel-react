import { useState } from "react";
import { Users, Globe, Plane } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Headphones,
  BadgeCheck,
  Wallet,
  Clock,
} from "lucide-react";

export const About = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const partners = [
    {
      name: "TravelBuddy Co.",
      logo: "https://images.unsplash.com/photo-1601597111965-8c9de3ba2c71?auto=format&fit=crop&w=200",
    },
    {
      name: "GlobeTrekker Ltd.",
      logo: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200",
    },
    {
      name: "Adventure Co.",
      logo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200",
    },
    {
      name: "Wanderlust Inc.",
      logo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200",
    },
  ];

  const team = [
    {
      name: "Amol Sathe",
      role: "CEO & Founder",
      img: "./amol.jpg",
      bio: "Visionary leader",
      detail: "Alice started this company to make travel accessible to all.",
    },
    {
      name: "Shilpa Nadkarni",
      role: "Operations Head",
      img: "./shilpa.jpg",
      bio: "Creative strategist",
      detail:
        "shilpa ensures every journey goes smoothly, from booking to return.",
    },
    {
      name: "Sophie Lee",
      role: "Marketing Head",
      img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=300",
      bio: "Creative strategist",
      detail: "Sophie builds campaigns that inspire adventure worldwide.",
    },
        {
      name: "Rahul Sharma",
      role: "Operations Manager",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300",
      bio: "Expert in logistics",
      detail:
        "Rahul ensures every journey goes smoothly, from booking to return.",
    },
  ];

  const features = [
    {
      icon: <ShieldCheck size={28} />,
      title: "Trusted & Secure",
      desc: "Your bookings are protected with industry-level security and trusted partners worldwide.",
    },
    {
      icon: <Wallet size={28} />,
      title: "Best Price Guarantee",
      desc: "We offer the most competitive prices with no hidden charges.",
    },
    {
      icon: <Headphones size={28} />,
      title: "24/7 Support",
      desc: "Our travel experts are available anytime to assist you before, during, and after your trip.",
    },
    // {
    //   icon: <BadgeCheck size={28} />,
    //   title: "Verified Packages",
    //   desc: "All tours and hotels are verified to ensure quality and comfort.",
    // },
    {
      icon: <Globe size={28} />,
      title: "Worldwide Destinations",
      desc: "Explore hundreds of destinations across the globe with curated experiences.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO VIDEO */}
      <section className="relative h-110 w-full overflow-hidden">
        <video
          className="absolute w-full h-full object-cover"
          src="./beach_walk.mp4"
          autoPlay
          loop
          muted
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl font-bold text-white mb-4">
            Explore the World With Us
          </h1>
          <p className="text-xl text-white max-w-2xl">
            We craft unforgettable journeys for every traveler with passion and
            care.
          </p>
        </div>
      </section>

{/* OUR STORY */}
<div className="container py-4 mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
  
  {/* LEFT CONTENT */}
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="text-4xl font-bold mb-4 text-gradient bg-linear-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text hidden md:block">
      Our Story
    </h2>

        <h2 className="text-4xl font-bold mb-4 text-gradient bg-linear-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text block  md:hidden text-center">
      Our Story
    </h2>

    <p className="text-center md:text-left lg:text-left text-lg mb-4">
      Since 2010, we’ve connected millions of travelers with dream
      destinations. We believe travel should be joyful, safe, and
      meaningful.
    </p>

    <p className="text-center md:text-left lg:text-left text-lg">
      From solo journeys to adventure tours, from family vacations to
      romantic escapes — we tailor every experience with care.
    </p>

    {/* <motion.button
      whileHover={{ scale: 1.05 }}
      className="mt-6 bg-linear-to-r from-teal-400 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl"
    >
      Learn More
    </motion.button> */}
  </motion.div>

  {/* RIGHT STATS */}
  <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 text-center">
    <Stat
      title="Tours Completed"
      value="500+"
      icon={<Globe size={32} />}
    />
    <Stat
      title="Happy Travelers"
      value="10K+"
      icon={<Users size={32} />}
    />
    {/* <Stat title="Destinations" value="80+" icon={<Plane size={32} />} /> */}
  </div>

</div>
      
      <div className="relative bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')] bg-cover bg-center text-white">
  
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content */}
  <div className="relative z-10 container mx-auto px-4 py-6 text-center">
    
    {/* Heading */}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
      Why Choose Us
    </h2>

    <p className="max-w-2xl mx-auto mb-10 text-sm sm:text-base">
      We provide the best travel experiences with trusted services,
      curated packages, and unbeatable prices. Your journey starts with us.
    </p>

    {/* Features Grid */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 ">
      {features.map((item, index) => (
        <div
          key={index}
          className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 group bg-linear-to-l from-teal-400 to-green-50 border-solid border-white border"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3 mx-auto group-hover:bg-blue-600 group-hover:text-white transition">
            {item.icon}
          </div>

          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {item.title}
          </h3>

          <p className="text-gray-600 text-xs sm:text-sm">
            {item.desc}
          </p>
        </div>
      ))}
    </div>

  </div>
</div>
{/* TEAM SECTION */}
<section className="max-w-7xl mx-auto px-4 py-4 mb-6 relative">

  {/* Heading */}
  <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">
    Meet Our Experts
  </h2>

  {/* Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

    {team.map((member, i) => (
      <motion.div
        key={i}
        onClick={() => setSelectedTeam(member)}
        whileHover={{ y: -10 }}
        className="group relative cursor-pointer rounded-2xl p-[1.5px] bg-linear-to-r from-teal-200 to-blue-200"
      >

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl bg-linear-to-r from-teal-300 to-blue-300 transition duration-500"></div>

        {/* Card */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 text-center shadow-lg border border-white/40 transition-all duration-300 group-hover:shadow-2xl">

          {/* Image */}
          <div className="relative w-28 h-28 mx-auto mb-5">
            <img
              src={member.img}
              alt={member.name}
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition duration-500"
            />

            {/* Ring Glow */}
            <div className="absolute inset-0 rounded-full border-2 border-teal-300 opacity-0 group-hover:opacity-100 scale-110 transition duration-500"></div>
          </div>

          {/* Content */}
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            {member.name}
          </h3>

          <p className="text-primary font-medium mt-1">
            {member.role}
          </p>

          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            {member.bio}
          </p>

          {/* Bottom Accent Line */}
          <div className="mt-4 h-1 w-10 mx-auto rounded-full bg-linear-to-r from-teal-400 to-blue-500 opacity-70 group-hover:w-16 transition-all duration-300"></div>
        </div>

      </motion.div>
    ))}

  </div>
</section>

{/* TEAM MODAL */}
<AnimatePresence>
  {selectedTeam && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      {/* Background Blur + Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setSelectedTeam(null)}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="relative w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/40 p-8 text-center"
      >

        {/* Close (Top Right) */}
        <button
          onClick={() => setSelectedTeam(null)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative w-28 h-28 mx-auto mb-5">
          <img
            src={selectedTeam.img}
            alt={selectedTeam.name}
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
          />

          {/* Glow Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-teal-300 scale-110 opacity-60"></div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-1 text-gray-800">
          {selectedTeam.name}
        </h3>

        <p className="text-primary mb-4 font-medium">
          {selectedTeam.role}
        </p>

        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          {selectedTeam.detail}
        </p>

        {/* CTA Button */}
        <button
          className="w-full py-3 rounded-xl bg-primary text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition"
          onClick={() => setSelectedTeam(null)}
        >
          Close
        </button>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

function Stat({ title, value, icon }) {
  return (
    <motion.div
      className="bg-linear-to-r from-teal-200 to-blue-200 rounded-xl p-6 shadow-lg text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-center mb-2 text-teal-800">{icon}</div>
      <p className="text-4xl font-bold text-teal-800">{value}</p>
      <p className="text-lg">{title}</p>
    </motion.div>
  );
}
