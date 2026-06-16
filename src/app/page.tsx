"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import Lenis from "lenis";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpRight, 
  Award, 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle, 
  ChevronDown, 
  Send
} from "lucide-react";

// Project Showcase details
const PROJECTS = [
  {
    id: 1,
    title: "واحة الحدود السكنية",
    category: "مشاريع سكنية",
    description: "فلل وقصور فاخرة تجمع بين التصميم المستدام والخصوصية المطلقة في قلب دبي.",
    image: "/project_residential.png",
    details: ["توفير طاقة بنسبة 40%", "أنظمة ذكاء اصطناعي متكاملة", "إطلالات بانورامية"],
  },
  {
    id: 2,
    title: "برج الحدود للأعمال",
    category: "مشاريع تجارية",
    description: "مقر استثنائي للشركات العالمية بتجهيزات ذكية وتصميم هندسي أيقوني.",
    image: "/project_commercial.png",
    details: ["شهادة LEED الذهبية", "مساحات عمل مرنة", "مهبط طائرات عامودي"],
  },
  {
    id: 3,
    title: "الحدود رزيدنس & سبا",
    category: "فرص استثمارية",
    description: "منتجع سكني استثماري يضمن عوائد استثنائية مع خدمات فندقية 7 نجوم.",
    image: "/project_investment.png",
    details: ["عائد استثماري مضمون 8%", "شاطئ خاص بالكامل", "إدارة فندقية متكاملة"],
  },
  {
    id: 4,
    title: "ضواحي الحدود الذكية",
    category: "تطوير مجتمعات متكاملة",
    description: "مجتمع مستدام متكامل يضم مدارس، مستشفيات، ومناطق ترفيهية ذكية صديقة للبيئة.",
    image: "/community_aerial_view.png",
    details: ["مساحات خضراء 60%", "مسارات ذكية للدراجات", "شحن سيارات كهربائية"],
  }
];

export default function LuxuryRealEstatePage() {
  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = 300;

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Pre-load sequential frame images
  useEffect(() => {
    let loaded = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames) {
          setTimeout(() => {
            setLoading(false);
          }, 800);
        }
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames) {
          setTimeout(() => {
            setLoading(false);
          }, 800);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, []);

  // Track window scroll progress for Zoom effect
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = window.scrollY / docHeight;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver for navbar highlighting
  useEffect(() => {
    if (loading) return;
    const sections = ["hero", "about", "vision", "values", "projects", "stats", "quote", "community", "contact"];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      }, { rootMargin: "-30% 0px -40% 0px" }); // Triggers when section occupies the center third of viewport
      observer.observe(el);
      return { el, observer };
    });

    return () => {
      observers.forEach(o => {
        if (o) o.observer.unobserve(o.el);
      });
    };
  }, [loading]);

  // Handle Resize and draw canvas frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      drawFrame();
    };

    const drawFrame = () => {
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(scrollProgress * totalFrames))
      );
      const img = imagesRef.current[frameIndex];
      
      if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, drawX, drawY;

        if (imgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial setup and draw

    drawFrame();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollProgress, loadedCount]);

  // Form submission simulation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 5000);
  };

  // Scroll smoothly to any element by ID
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Stagger wrapper for standard animation cards
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative bg-navy-900 overflow-hidden text-ivory-100 min-h-screen">
      
      {/* 1. Preloader Screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-900">
          <div className="text-center space-y-6 max-w-md px-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-gold-500/30 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-t border-gold-500 animate-spin" style={{ animationDuration: '3s' }} />
                <Building2 className="w-8 h-8 text-gold-500" />
              </div>
              <h2 className="font-cairo text-3xl font-extrabold tracking-widest text-gold-500 mb-2">الحدود</h2>
              <h3 className="font-tajawal text-sm uppercase tracking-[0.2em] text-ivory-300/60">للعقارات</h3>
            </div>

            <div className="w-64 h-[1px] bg-navy-800 relative mt-8 overflow-hidden rounded-full mx-auto">
              <div
                className="absolute left-0 top-0 h-full bg-gold-500 transition-all duration-100"
                style={{ width: `${(loadedCount / totalFrames) * 100}%` }}
              />
            </div>

            <p className="font-tajawal text-xs text-gold-500/60 uppercase tracking-widest mt-2 animate-pulse">
              جاري تحميل التجربة السينمائية... {Math.round((loadedCount / totalFrames) * 100)}%
            </p>
          </div>
        </div>
      )}

      {/* 2. Floating Premium Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 md:px-12 flex justify-between items-center bg-gradient-to-b from-navy-900/90 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("hero")}>
          <div className="w-10 h-10 rounded-full border border-gold-500/40 flex items-center justify-center bg-navy-900/50">
            <Building2 className="w-5 h-5 text-gold-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-cairo text-lg font-black tracking-wider text-gold-500">الحدود</span>
            <span className="font-tajawal text-[10px] tracking-widest text-ivory-200/50 -mt-1.5">للعقارات</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["hero", "about", "vision", "values", "projects", "community", "contact"].map((sec) => (
            <button 
              key={sec}
              onClick={() => scrollToSection(sec)} 
              className={`transition-colors font-tajawal cursor-pointer ${
                activeSection === sec ? "text-gold-500 font-bold" : "text-ivory-100/70 hover:text-gold-500"
              }`}
            >
              {sec === "hero" && "الرئيسية"}
              {sec === "about" && "من نحن"}
              {sec === "vision" && "رؤيتنا"}
              {sec === "values" && "قيمنا"}
              {sec === "projects" && "مشاريعنا"}
              {sec === "community" && "مجتمعاتنا"}
              {sec === "contact" && "تواصل معنا"}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => scrollToSection("contact")}
          className="border border-gold-500/50 hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 font-tajawal text-xs px-5 py-2.5 rounded-full uppercase tracking-wider text-gold-500 flex items-center gap-2 cursor-pointer"
        >
          طلب استشارة
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 3. Fixed Canvas Backdrop Container */}
      <div className="fixed inset-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-navy-900/65 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0a0f1c_90%)] z-10 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/40 z-10" />
        
        <FrameCanvasPlayerWrapper progress={scrollProgress} loadedCount={loadedCount} canvasRef={canvasRef} />
      </div>

      {/* 4. Side Progress Bar Indicator */}
      <div className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-4">
        <div className="h-48 w-[2px] bg-navy-800 relative rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-gold-500 transition-all duration-200" 
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-mono tracking-widest text-gold-500/50 transform -rotate-90 origin-left translate-y-3">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>

      {/* 5. Vertically Stacked Sections Layer (Immediate, Zero Delay Viewport Transitions) */}
      <div className="relative z-20 w-full flex flex-col">
        
        {/* HERO SECTION */}
        <section id="hero" className="min-h-screen w-full flex items-center justify-center px-6 md:px-24 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl text-center space-y-8 mt-12"
          >
            <div className="space-y-4">
              <span className="text-gold-500 font-tajawal text-xs uppercase tracking-[0.25em] font-semibold block">
                الحدود للعقارات
              </span>
              <h1 className="font-cairo text-4xl sm:text-6xl md:text-8xl font-black leading-tight text-white select-none">
                نبني الرؤية <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-200">ونصنع المستقبل</span>
              </h1>
            </div>
            
            <p className="font-tajawal text-ivory-200/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              في الحدود للعقارات نؤمن أن كل مشروع عظيم يبدأ بفكرة واضحة ورؤية طموحة، ثم يتحول إلى واقع يضيف قيمة حقيقية للمجتمع والاستثمار.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => scrollToSection("projects")}
                className="w-full sm:w-auto bg-gradient-to-r from-gold-600 to-gold-400 text-navy-900 font-tajawal font-bold text-sm px-8 py-4 rounded-full shadow-lg shadow-gold-500/10 hover:shadow-gold-500/30 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
              >
                استكشف مشاريعنا
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all duration-300 text-white font-tajawal text-sm px-8 py-4 rounded-full cursor-pointer"
              >
                تعرف علينا
              </button>
            </div>

            <div 
              className="pt-16 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100"
              onClick={() => scrollToSection("about")}
            >
              <span className="text-[10px] text-ivory-300/50 tracking-[0.2em] font-light">اسحب لأسفل للاستكشاف</span>
              <ChevronDown className="w-4 h-4 text-gold-500 animate-bounce" />
            </div>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="min-h-screen w-full flex items-center justify-center px-6 md:px-24 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl text-center space-y-8"
          >
            <div className="space-y-3">
              <span className="text-gold-500/80 font-tajawal text-xs uppercase tracking-widest font-medium">قصتنا وهويتنا</span>
              <h2 className="font-cairo text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                من الرؤية إلى الواقع
              </h2>
              <div className="w-20 h-[1px] bg-gold-500 mx-auto mt-4" />
            </div>
            
            <div className="space-y-6 text-ivory-200/80 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              <p className="font-bold text-white">
                في الحدود للعقارات نؤمن أن كل مشروع عظيم يبدأ بفكرة واضحة ورؤية طموحة.
              </p>
              <p className="font-light text-ivory-100/90">
                نعمل على تطوير وإدارة الفرص العقارية وفق أعلى معايير الجودة والاحترافية، مع التركيز على خلق قيمة حقيقية للمستثمرين والعملاء والمجتمعات التي نخدمها.
              </p>
              <p className="hidden md:block text-sm text-gold-500/70 font-light max-w-xl mx-auto border-r-2 border-gold-500/20 pr-4 mt-8">
                نحن لا نبني عقارات فحسب، بل نعمل على صناعة بيئات متكاملة تجمع بين الجودة والاستدامة والتصميم العصري لتواكب احتياجات الحاضر وتطلعات المستقبل.
              </p>
            </div>
          </motion.div>
        </section>

        {/* VISION CARDS SECTION */}
        <section id="vision" className="min-h-screen w-full flex items-center justify-center px-6 md:px-24 py-24">
          <div className="w-full max-w-6xl space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-2"
            >
              <span className="text-gold-500/80 text-xs font-semibold tracking-widest">فلسفة العمل</span>
              <h2 className="font-cairo text-3xl md:text-4xl font-extrabold text-white">نهجنا الريادي</h2>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {/* Card 1 */}
              <motion.div 
                variants={itemVariants}
                className="relative group bg-navy-800/35 border border-white/5 hover:border-gold-500/30 rounded-2xl p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20 group-hover:bg-gold-500 group-hover:text-navy-900 transition-all duration-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-cairo text-2xl font-bold text-white group-hover:text-gold-500 transition-colors">الرؤية</h3>
                  <p className="font-tajawal text-sm text-ivory-200/70 leading-relaxed">
                    نؤمن بأن التطوير العقاري هو صناعة مستقبل أفضل للأفراد والمجتمعات.
                  </p>
                </div>
                <div className="text-gold-500/20 text-5xl font-mono text-left font-black tracking-tighter select-none">01</div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                variants={itemVariants}
                className="relative group bg-navy-800/35 border border-white/5 hover:border-gold-500/30 rounded-2xl p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20 group-hover:bg-gold-500 group-hover:text-navy-900 transition-all duration-300">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-cairo text-2xl font-bold text-white group-hover:text-gold-500 transition-colors">التخطيط</h3>
                  <p className="font-tajawal text-sm text-ivory-200/70 leading-relaxed">
                    نحوّل الأفكار إلى خطط مدروسة تعتمد على الجودة والابتكار والاستدامة.
                  </p>
                </div>
                <div className="text-gold-500/20 text-5xl font-mono text-left font-black tracking-tighter select-none">02</div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                variants={itemVariants}
                className="relative group bg-navy-800/35 border border-white/5 hover:border-gold-500/30 rounded-2xl p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20 group-hover:bg-gold-500 group-hover:text-navy-900 transition-all duration-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-cairo text-2xl font-bold text-white group-hover:text-gold-500 transition-colors">التنفيذ</h3>
                  <p className="font-tajawal text-sm text-ivory-200/70 leading-relaxed">
                    نلتزم بتنفيذ المشاريع بأعلى معايير الجودة لتحقيق قيمة حقيقية تدوم.
                  </p>
                </div>
                <div className="text-gold-500/20 text-5xl font-mono text-left font-black tracking-tighter select-none">03</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section id="values" className="min-h-screen w-full flex items-center justify-center px-6 md:px-24 py-24">
          <div className="w-full max-w-6xl space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-2"
            >
              <span className="text-gold-500/80 text-xs font-semibold tracking-widest">قيمنا الأساسية</span>
              <h2 className="font-cairo text-3xl md:text-4xl font-extrabold text-white">الركائز التي نستند عليها</h2>
              <div className="w-16 h-[2px] bg-gold-500 mx-auto mt-2" />
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6"
            >
              {/* Value 1 */}
              <motion.div variants={itemVariants} className="bg-navy-800/40 border border-white/5 hover:border-gold-500/35 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 text-center space-y-3 group">
                <div className="text-gold-500 text-xl font-bold font-cairo">الثقة</div>
                <p className="text-xs text-ivory-200/70 leading-relaxed">
                  نبني علاقات طويلة الأمد تقوم على المصداقية والشفافية.
                </p>
              </motion.div>

              {/* Value 2 */}
              <motion.div variants={itemVariants} className="bg-navy-800/40 border border-white/5 hover:border-gold-500/35 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 text-center space-y-3 group">
                <div className="text-gold-500 text-xl font-bold font-cairo">الجودة</div>
                <p className="text-xs text-ivory-200/70 leading-relaxed">
                  نلتزم بأعلى المعايير في جميع مراحل العمل والتصميم.
                </p>
              </motion.div>

              {/* Value 3 */}
              <motion.div variants={itemVariants} className="bg-navy-800/40 border border-white/5 hover:border-gold-500/35 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 text-center space-y-3 group">
                <div className="text-gold-500 text-xl font-bold font-cairo">الابتكار</div>
                <p className="text-xs text-ivory-200/70 leading-relaxed">
                  نبحث دائماً عن حلول أكثر ذكاءً وتطوراً واستشرافاً.
                </p>
              </motion.div>

              {/* Value 4 */}
              <motion.div variants={itemVariants} className="bg-navy-800/40 border border-white/5 hover:border-gold-500/35 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 text-center space-y-3 group">
                <div className="text-gold-500 text-xl font-bold font-cairo">الالتزام</div>
                <p className="text-xs text-ivory-200/70 leading-relaxed">
                  نفي بوعودنا ونحقق تطلعات عملائنا ومستثمرينا بالكامل.
                </p>
              </motion.div>

              {/* Value 5 */}
              <motion.div variants={itemVariants} className="bg-navy-800/40 border border-white/5 hover:border-gold-500/35 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 text-center space-y-3 group col-span-2 md:col-span-1">
                <div className="text-gold-500 text-xl font-bold font-cairo">الاستدامة</div>
                <p className="text-xs text-ivory-200/70 leading-relaxed">
                  نبني مشاريع ذكية تراعي احتياجات الحاضر وتستدام للمستقبل.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FEATURED PROJECTS SECTION */}
        <section id="projects" className="min-h-screen w-full flex items-center justify-center px-6 md:px-24 py-24">
          <div className="w-full max-w-6xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="space-y-1 text-center md:text-right">
                <span className="text-gold-500/80 text-xs font-semibold tracking-widest">إبداعنا المعماري</span>
                <h2 className="font-cairo text-3xl md:text-4xl font-extrabold text-white">مشاريعنا الأيقونية</h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center items-center gap-2 bg-navy-800/40 p-1 rounded-full border border-white/5 backdrop-blur-md">
                {["all", "مشاريع سكنية", "مشاريع تجارية", "فرص استثمارية", "تطوير مجتمعات متكاملة"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-tajawal text-xs px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                      (tab === "all" && activeTab === "all") || activeTab === tab
                        ? "bg-gold-500 text-navy-900 font-bold"
                        : "text-ivory-200/70 hover:text-white"
                    }`}
                  >
                    {tab === "all" ? "الكل" : tab}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Projects Showcase Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROJECTS.filter(p => activeTab === "all" || p.category === activeTab).map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5 }}
                  className="group relative rounded-2xl overflow-hidden bg-navy-800/20 border border-white/5 backdrop-blur-md flex flex-col h-[420px] transition-all duration-500 hover:border-gold-500/40"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
                    <span className="absolute top-4 right-4 bg-gold-500/90 backdrop-blur-sm text-navy-900 text-[10px] font-bold py-1 px-3 rounded-full">
                      {project.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-cairo text-lg font-bold text-white group-hover:text-gold-500 transition-colors">
                        {project.title}
                      </h3>
                      <p className="font-tajawal text-xs text-ivory-200/70 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="space-y-1">
                        {project.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] text-ivory-300/80">
                            <span className="w-1 h-1 rounded-full bg-gold-500" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full flex items-center justify-center gap-2 border border-gold-500/20 hover:border-gold-500/60 bg-gold-500/5 hover:bg-gold-500 text-gold-500 hover:text-navy-900 transition-all duration-300 text-xs py-2 rounded-lg font-semibold cursor-pointer">
                        التفاصيل الكاملة
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section id="stats" className="min-h-screen w-full flex items-center justify-center px-6 md:px-24 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl"
          >
            <div className="bg-navy-900/60 border border-white/5 backdrop-blur-lg rounded-3xl p-10 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full filter blur-3xl pointer-events-none" />
              
              {/* Stat 1 */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mx-auto mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-cairo text-4xl md:text-5xl font-black text-gold-500">
                  <AnimatedCounter value={500} suffix="+" />
                </h3>
                <p className="font-tajawal text-sm text-ivory-300/80">وحدة عقارية فاخرة</p>
              </div>

              {/* Stat 2 */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mx-auto mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-cairo text-4xl md:text-5xl font-black text-gold-500">
                  <AnimatedCounter value={120} suffix="+" />
                </h3>
                <p className="font-tajawal text-sm text-ivory-300/80">مشروع عقاري متكامل</p>
              </div>

              {/* Stat 3 */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mx-auto mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-cairo text-4xl md:text-5xl font-black text-gold-500">
                  <AnimatedCounter value={20} suffix="+" />
                </h3>
                <p className="font-tajawal text-sm text-ivory-300/80">عاماً من الخبرة والريادة</p>
              </div>

              {/* Stat 4 */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mx-auto mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-cairo text-4xl md:text-5xl font-black text-gold-500">
                  <AnimatedCounter value={98} suffix="%" />
                </h3>
                <p className="font-tajawal text-sm text-ivory-300/80">نسبة رضا العملاء</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CINEMATIC QUOTE SECTION */}
        <section id="quote" className="min-h-screen w-full flex items-center justify-center px-6 md:px-24 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 1.0 }}
            className="max-w-4xl text-center space-y-6"
          >
            <div className="space-y-4 font-cairo font-light text-2xl sm:text-4xl md:text-5xl text-ivory-200/90 leading-relaxed select-none">
              <p>كل مشروع يبدأ بفكرة</p>
              <p className="text-gold-500/70 font-normal">وكل فكرة تحتاج إلى رؤية</p>
              <p>وكل رؤية تستحق التنفيذ</p>
            </div>

            <div className="w-24 h-[1px] bg-gold-500 mx-auto my-8" />

            <h3 className="font-cairo text-3xl sm:text-5xl md:text-6xl font-black text-white">
              لنصنع مستقبلاً يتجاوز الحدود
            </h3>
          </motion.div>
        </section>

        {/* COMMUNITY SECTION */}
        <section id="community" className="min-h-screen w-full flex items-center justify-center px-6 md:px-24 py-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl"
          >
            <div className="bg-navy-900/40 border border-white/5 backdrop-blur-lg rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 relative">
              
              {/* Description Box */}
              <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <span className="text-gold-500/80 text-xs font-semibold tracking-widest">التطوير المجتمعي</span>
                  <h2 className="font-cairo text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    مجتمعات تصنع المستقبل
                  </h2>
                </div>
                <p className="font-tajawal text-sm md:text-base text-ivory-200/80 leading-relaxed">
                  نطمح إلى تطوير مشاريع تساهم in بناء مجتمعات متكاملة تجمع بين جودة الحياة والاستثمار المستدام والتصميم العصري. 
                </p>
                <p className="font-tajawal text-xs text-gold-500/60 font-light border-r border-gold-500/30 pr-3">
                  مجتمعاتنا توفر شبكة طرق متطورة ومساحات خضراء شاسعة وبنية تحتية صديقة للبيئة.
                </p>
              </div>

              {/* Render Visual */}
              <div className="md:col-span-7 h-64 md:h-[400px] relative overflow-hidden">
                <img 
                  src="/community_aerial_view.png" 
                  alt="Aerial city rendering" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-transparent to-transparent hidden md:block" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* CONTACT & FOOTER SECTION */}
        <section id="contact" className="min-h-screen w-full flex flex-col justify-between px-6 md:px-24 pt-32 pb-12">
          
          {/* Contact Content Container */}
          <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8 }}
              className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Details */}
              <div className="md:col-span-5 space-y-8">
                <div className="space-y-3">
                  <span className="text-gold-500/80 text-xs font-semibold tracking-widest">تواصل استشاري</span>
                  <h2 className="font-cairo text-3xl md:text-4xl font-extrabold text-white">تواصل معنا</h2>
                  <p className="font-tajawal text-sm text-ivory-200/70 leading-relaxed">
                    دع مستشارينا العقاريين يساعدونك في اتخاذ الخطوة التالية نحو منزلك المستقبلي أو استثمارك الناجح.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-800/60 border border-white/5 flex items-center justify-center text-gold-500 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-cairo text-sm font-bold text-white">العنوان رئيسي</h4>
                      <p className="font-tajawal text-xs text-ivory-200/70">شارع الشيخ زايد، برج العروبة، الطابق 42، دبي، الإمارات العربية المتحدة</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-800/60 border border-white/5 flex items-center justify-center text-gold-500 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-cairo text-sm font-bold text-white">رقم الهاتف</h4>
                      <p className="font-tajawal text-xs text-ivory-200/70" dir="ltr">+971 4 555 1234</p>
                    </div>
                  </div>

                  {/* Mail */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-800/60 border border-white/5 flex items-center justify-center text-gold-500 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-cairo text-sm font-bold text-white">البريد الإلكتروني</h4>
                      <p className="font-tajawal text-xs text-ivory-200/70">info@elhoodod.ae</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Form */}
              <div className="md:col-span-7 bg-navy-800/30 border border-white/5 backdrop-blur-md p-8 rounded-2xl space-y-6 relative overflow-hidden">
                
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-500">
                      <CheckCircle className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="font-cairo text-xl font-bold text-white">تم استلام طلبك بنجاح</h3>
                    <p className="font-tajawal text-sm text-ivory-200/70 max-w-sm mx-auto leading-relaxed">
                      شكراً لتواصلك مع الحدود للعقارات. سيقوم أحد مستشارينا المختصين بالاتصال بك خلال الـ 24 ساعة القادمة.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="font-tajawal text-xs text-ivory-300/80">الاسم الكامل</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="أدخل اسمك"
                          className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-tajawal focus:outline-none focus:border-gold-500 transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="font-tajawal text-xs text-ivory-300/80">البريد الإلكتروني</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="example@mail.com"
                          className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-tajawal focus:outline-none focus:border-gold-500 transition-colors text-right"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="font-tajawal text-xs text-ivory-300/80">رقم الهاتف</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 50 123 4567"
                        className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-tajawal focus:outline-none focus:border-gold-500 transition-colors text-right"
                        dir="ltr"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                      <label className="font-tajawal text-xs text-ivory-300/80">الرسالة أو الاستفسار</label>
                      <textarea 
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="كيف يمكننا مساعدتك في تحقيق رؤيتك الاستثمارية؟"
                        className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-tajawal focus:outline-none focus:border-gold-500 transition-colors resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 font-tajawal font-bold text-sm py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      إرسال الرسالة
                      <Send className="w-4 h-4 transform rotate-180" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

          {/* Footer Component */}
          <footer className="w-full max-w-6xl mx-auto border-t border-white/5 pt-8 mt-16">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Footer Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center bg-navy-900/40">
                  <Building2 className="w-5 h-5 text-gold-500" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-cairo text-lg font-black text-gold-500 leading-none">الحدود للعقارات</span>
                  <span className="font-tajawal text-xs text-ivory-300/60 mt-1">نبني قيمة تدوم</span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-6 text-sm font-medium">
                <button onClick={() => scrollToSection("hero")} className="text-ivory-300/80 hover:text-gold-500 transition-colors cursor-pointer">الرئيسية</button>
                <button onClick={() => scrollToSection("about")} className="text-ivory-300/80 hover:text-gold-500 transition-colors cursor-pointer">من نحن</button>
                <button onClick={() => scrollToSection("projects")} className="text-ivory-300/80 hover:text-gold-500 transition-colors cursor-pointer">مشاريعنا</button>
                <button onClick={() => scrollToSection("contact")} className="text-ivory-300/80 hover:text-gold-500 transition-colors cursor-pointer">تواصل معنا</button>
              </div>

              {/* Copyright */}
              <div className="font-tajawal text-xs text-ivory-300/50">
                © جميع الحقوق محفوظة - الحدود للعقارات
              </div>
            </div>
          </footer>
        </section>

      </div>
    </div>
  );
}

// Separate component for canvas drawing to avoid re-rendering layout components when scroll progresses
interface FramePlayerProps {
  progress: number;
  loadedCount: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const FrameCanvasPlayerWrapper = React.memo(function FrameCanvasPlayerWrapper({ progress, loadedCount, canvasRef }: FramePlayerProps) {
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover transition-opacity duration-300 opacity-90"
      style={{
        display: "block",
      }}
    />
  );
});

// Simple animated counter for stats
function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds animation
    const stepTime = Math.abs(Math.floor(duration / value));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 10));

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}
