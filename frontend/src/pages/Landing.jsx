import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Dashboard from "../components/Dashboard"
import Steps from "../components/Steps"
import FAQS from "../components/FAQS"
import Footer from "../components/Footer"
import { Helmet } from "react-helmet-async";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-['Outfit'] text-[#1A1A1A] dark:text-slate-100 selection:bg-blue-100 selection:text-blue-600 transition-colors duration-200">
        <Helmet>
          <title>Digital Ledger for Modern Bharat | PaySphere</title>
          <meta name="description" content="Automate your payroll, manage employees, and generate reports in minutes. Experience the simplest payroll tool for small businesses." />
        </Helmet>
        <Navbar />
        <Hero />
        <Dashboard />
        <Steps />
        <FAQS />
        <Footer />
    </div>
  )
}