import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Page } from './types';
// FIX: Import Transition type from framer-motion to correctly type the pageTransition object.
import type { Variants, Transition } from 'framer-motion';
import { MessageSquare, ArrowLeft, Send, User, Phone, MapPin, Calendar, Users, Star, Plus, X, Hotel, Globe, BedDouble, Heart, Plane, Headset, Award, Briefcase, LifeBuoy, Mail } from 'lucide-react';

// --- ANIMATION VARIANTS --- //

const pageVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 },
};

// FIX: Explicitly type pageTransition with the Transition type to prevent TypeScript from inferring 'tween' as a generic string.
const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.7,
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const slideUp: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// --- DUMMY DATA --- //

const hotels = [
  { id: 1, name: 'فندق قصر مكة رافلز', location: 'مكة المكرمة', image: 'https://images.unsplash.com/photo-1590124310033-6f810a950794?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'فندق دار التوحيد انتركونتيننتال', location: 'مكة المكرمة', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbb5b9?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'فندق أنوار المدينة موڤنبيك', location: 'المدينة المنورة', image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'فندق أوبروي المدينة', location: 'المدينة المنورة', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
  { id: 5, name: 'فندق فورسيزونز الرياض', location: 'الرياض', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' },
  { id: 6, name: 'فندق الريتز-كارلتون جدة', location: 'جدة', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=800&auto=format&fit=crop' },
];

const teamMembers = [
  { id: 1, name: 'أحمد عبدالله', role: 'المدير العام', image: 'https://picsum.photos/seed/team1/400/400' },
  { id: 2, name: 'فاطمة محمد', role: 'مديرة الحجوزات', image: 'https://picsum.photos/seed/team2/400/400' },
  { id: 3, name: 'علي حسن', role: 'خبير رحلات', image: 'https://picsum.photos/seed/team3/400/400' },
];

const testimonials = [
    { id: 1, name: 'منى عبد الله', text: "كانت رحلتي مع دار الأبرار من أجمل التجارب في حياتي، كل شيء منظم باحتراف!", avatar: 'https://picsum.photos/seed/avatar1/100/100' },
    { id: 2, name: 'أحمد سعيد', text: "خدمة ممتازة واهتمام بالتفاصيل الصغيرة اللي بتفرق فعلًا 👌", avatar: 'https://picsum.photos/seed/avatar2/100/100' },
    { id: 3, name: 'سارة محمد', text: "شكر خاص لفريق دار الأبرار على رحلتي المميزة إلى دبي، أكيد مش آخر مرة ❤️", avatar: 'https://picsum.photos/seed/avatar3/100/100' },
    { id: 4, name: 'خالد يوسف', text: "تجربة فاخرة بكل المقاييس. أنصح بهم بشدة لكل من يبحث عن التميز.", avatar: 'https://picsum.photos/seed/avatar4/100/100' },
    { id: 5, name: 'نورة علي', text: "فريق عمل متعاون جدًا وصبور، ساعدوني في التخطيط لكل تفاصيل رحلة شهر العسل.", avatar: 'https://picsum.photos/seed/avatar5/100/100' },
];


// --- REUSABLE COMPONENTS --- //

const WhatsAppCTA: React.FC<{ position?: string; text?: string }> = ({ position = 'fixed bottom-6 end-6', text }) => {
  return (
    <motion.a
      href="https://wa.me/201150548477" // Replace with actual WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className={`${position} z-50 flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-lg font-semibold`}
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <MessageSquare size={24} />
      {text && <span className="hidden sm:inline">{text}</span>}
    </motion.a>
  );
};

const LoadingScreen: React.FC = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F5EBDD]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.5 } }}
      >
        <motion.h1
          className="font-tajawal text-5xl md:text-7xl font-extrabold text-[#142b21]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
        >
          دار الأبرار
        </motion.h1>
      </motion.div>
    </AnimatePresence>
  );
};

const Header: React.FC<{ currentPage: Page; setCurrentPage: (page: Page) => void }> = ({ currentPage, setCurrentPage }) => {
  const navItems: { name: string; page: Page }[] = [
    { name: 'الرئيسية', page: 'Home' },
    { name: 'من نحن', page: 'About' },
    { name: 'الحجز', page: 'Booking' },
    { name: 'الفنادق', page: 'Hotels' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="container mx-auto flex justify-between items-center p-4 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-white/20"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mix-blend-difference">دار الأبرار</h1>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className="relative text-lg font-medium text-white mix-blend-difference"
            >
              {item.name}
              {currentPage === item.page && (
                <motion.div
                  className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#142b21]"
                  layoutId="underline"
                />
              )}
            </button>
          ))}
        </nav>
        <div className="md:hidden">
            <WhatsAppCTA position="relative" />
        </div>
      </motion.div>
    </header>
  );
};

const ParallaxSection: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className, style }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section ref={ref} className={`relative overflow-hidden ${className}`} style={style}>
            <motion.div style={{ y }}>
                {children}
            </motion.div>
        </section>
    );
};

// --- NEW FLOATING ACTION BUTTONS COMPONENT --- //
const FloatingActionButtons: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuVariants: Variants = {
        closed: { transition: { when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 } },
        open: { transition: { when: "beforeChildren", staggerChildren: 0.1 } },
    };

    const itemVariants: Variants = {
        closed: { y: 20, opacity: 0, scale: 0.5 },
        open: { y: 0, opacity: 1, scale: 1 },
    };

    const actions = [
        {
            label: 'تواصل واتساب',
            icon: <MessageSquare size={24} />,
            color: 'bg-[#25D366]',
            action: () => { window.open('https://wa.me/201150548477', '_blank'); }
        },
        {
            label: 'احجز الآن',
            icon: <Calendar size={24} />,
            color: 'bg-[#142b21]',
            action: () => setCurrentPage('Booking')
        },
        {
            label: 'الفنادق',
            icon: <Hotel size={24} />,
            color: 'bg-[#142b21]',
            action: () => setCurrentPage('Hotels')
        },
    ];

    return (
        <div className="fixed bottom-4 start-4 sm:bottom-6 sm:start-6 z-[60]">
            <motion.div
                className="relative flex flex-col items-center"
                initial={false}
                animate={isOpen ? "open" : "closed"}
            >
                {/* Sub-buttons container */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            variants={menuVariants}
                            className="flex flex-col gap-4 mb-4"
                        >
                            {actions.map((action, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => { action.action(); setIsOpen(false); }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <span className="bg-white/80 backdrop-blur-sm text-[#142b21] text-sm font-semibold px-3 py-1 rounded-md shadow-sm">
                                        {action.label}
                                    </span>
                                    <div className={`${action.color} text-white p-2.5 sm:p-3 rounded-full shadow-lg`}>
                                        {action.icon}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main FAB */}
                <motion.button
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-[#142b21] rounded-full flex items-center justify-center text-white shadow-xl"
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isOpen ? 'x' : 'plus'}
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isOpen ? <X size={32} /> : <Plus size={32} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
            </motion.div>
        </div>
    );
};

// --- PAGE COMPONENTS --- //

const HomePage: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start']
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
    
    const heroImages = [
        'https://images.unsplash.com/photo-1590124310033-6f810a950794?q=80&w=2592&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2592&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2592&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1562790351-d273a9d1e1fd?q=80&w=2592&auto=format&fit=crop',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 7000);

        return () => {
            clearInterval(imageInterval);
        };
    }, [heroImages.length]);

    const services = [
      { icon: <Globe size={40} className="mx-auto text-[#142b21]" />, title: 'رحلات سياحية شاملة', description: 'نرتب كل التفاصيل نيابةً عنك من اللحظة الأولى حتى العودة.' },
      { icon: <BedDouble size={40} className="mx-auto text-[#142b21]" />, title: 'حجوزات فنادق فاخرة', description: 'اختياراتنا تجمع بين الفخامة، الراحة، والموقع المثالي.' },
      { icon: <Heart size={40} className="mx-auto text-[#142b21]" />, title: 'تنظيم رحلات شهر العسل', description: 'نخلق لك أجواءً ساحرة لا تُنسى في وجهات رومانسية.' },
      { icon: <Plane size={40} className="mx-auto text-[#142b21]" />, title: 'سياحة داخلية وخارجية', description: 'استكشف جمال العالم معنا، سواء داخل بلدك أو خارجه.' },
      { icon: <Headset size={40} className="mx-auto text-[#142b21]" />, title: 'خدمة العملاء 24/7', description: 'فريقنا جاهز لمساعدتك في أي وقت لضمان راحتك.' },
    ];
    
    const whyUsPoints = [
      { icon: <Award size={24} />, text: 'أكثر من 10 سنوات خبرة في مجال السفر والسياحة.' },
      { icon: <Users size={24} />, text: 'فريق محترف يهتم بأدق التفاصيل.' },
      { icon: <Plane size={24} />, text: 'شراكات قوية مع أفخم الفنادق وشركات الطيران.' },
      { icon: <Briefcase size={24} />, text: 'خدمات شاملة تشمل الإقامة، التنقل، والأنشطة.' },
      { icon: <LifeBuoy size={24} />, text: 'دعم فني ومتابعة مستمرة قبل وأثناء وبعد الرحلة.' },
    ];

  
    return (
        <div className="text-[#142b21]">
            
            {/* Hero Section */}
            <div ref={ref} className="relative w-full h-screen overflow-hidden">
                <AnimatePresence>
                    <motion.div
                        key={currentImageIndex}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ 
                            backgroundImage: `url(${heroImages[currentImageIndex]})`,
                            y: backgroundY
                        }}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: 2, ease: 'easeInOut' } }}
                        exit={{ opacity: 0, transition: { duration: 2, ease: 'easeInOut' } }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#F5EBDD] via-[#F5EBDD]/60 to-transparent"/>
                <motion.div 
                    style={{ y: textY }}
                    className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4"
                >
                    <h2 className="text-4xl sm:text-5xl md:text-8xl font-extrabold" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.7)' }}>دار الأبرار</h2>
                    <p className="mt-4 text-lg sm:text-xl md:text-3xl font-medium max-w-3xl" style={{ textShadow: '1px 1px 5px rgba(0,0,0,0.7)' }}>حيث تبدأ رحلتك نحو الراحة والرفاهية. ✨</p>
                    <motion.p 
                         className="mt-4 text-base sm:text-lg md:text-xl font-light max-w-2xl" 
                         style={{ textShadow: '1px 1px 5px rgba(0,0,0,0.7)' }}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: 'easeInOut' } }}
                    >
                         مع دار الأبرار، السفر مش مجرد وجهة… دي تجربة بتعيشها ❤️
                    </motion.p>
                    <motion.div 
                         className="mt-8 flex flex-col sm:flex-row gap-4"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8, ease: 'easeInOut' } }}
                    >
                        <motion.button onClick={() => setCurrentPage('Booking')} className="px-8 py-3 bg-[#142b21] text-white font-semibold rounded-lg shadow-lg" whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>احجز الآن</motion.button>
                        <motion.button onClick={() => setCurrentPage('Hotels')} className="px-8 py-3 bg-black/30 backdrop-blur-sm text-white font-semibold rounded-lg shadow-lg" whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>الفنادق</motion.button>
                        <motion.button onClick={() => window.open('https://wa.me/201150548477', '_blank')} className="px-8 py-3 bg-[#25D366] text-white font-semibold rounded-lg shadow-lg" whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>تواصل واتساب</motion.button>
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Services Section */}
            <div className="py-16 sm:py-24 bg-[#F5EBDD]">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                    >
                        <motion.h2 variants={slideUp} className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#142b21]">خدماتنا المميزة</motion.h2>
                        <motion.p variants={slideUp} className="max-w-3xl mx-auto mt-6 text-lg sm:text-xl text-[#142b21]/90">
                            في دار الأبرار، نعرف أن كل مسافر له ذوقه الخاص، وعلشان كده وفرنا خدمات متنوعة تلبي كل الرغبات:
                        </motion.p>
                    </motion.div>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 mt-12"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {services.map((service, index) => (
                            <motion.div key={index} variants={slideUp} className="p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-center">
                                {service.icon}
                                <h3 className="text-xl font-bold mt-4">{service.title}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Featured Hotels Section */}
            <div className="py-16 sm:py-24 bg-[#F5EBDD]/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={slideUp}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#142b21]">اكتشف فنادقنا</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-lg sm:text-xl text-[#142b21]/90">
                            نؤمن أن الراحة الحقيقية تبدأ من مكان الإقامة، لذلك اخترنا لك مجموعة من الفنادق بعناية فائقة. ✨ كل فندق قصة... وكل إقامة تجربة جديدة تستحق الاكتشاف.
                        </p>
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {hotels.slice(0, 3).map(hotel => (
                             <motion.div 
                                key={hotel.id}
                                variants={slideUp}
                                className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/20 group"
                            >
                                <div className="overflow-hidden h-56">
                                    <motion.img 
                                        src={hotel.image} 
                                        alt={hotel.name}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-[#142b21]">{hotel.name}</h3>
                                    <p className="text-md text-[#142b21]/80 mt-1">{hotel.location}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-12">
                        <motion.button onClick={() => setCurrentPage('Hotels')} className="px-10 py-4 bg-[#142b21] text-white font-bold rounded-lg shadow-lg text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            تصفح الفنادق الآن 🏨
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Booking Section */}
            <ParallaxSection className="py-20 sm:py-32 bg-cover bg-center" style={{backgroundImage: `url(https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2670&auto=format&fit=crop)`}}>
                <div className="absolute inset-0 bg-[#142b21]/70"></div>
                <div className="container mx-auto px-4 relative text-center text-white">
                     <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={staggerContainer}
                    >
                        <motion.h2 variants={slideUp} className="text-3xl sm:text-4xl md:text-6xl font-extrabold">لأن الوقت أثمن ما تملك</motion.h2>
                        <motion.p variants={slideUp} className="max-w-2xl mx-auto mt-6 text-lg sm:text-xl">
                            جعلنا عملية الحجز معنا في غاية السهولة. ✨ فقط املأ بياناتك، واختَر وجهتك، والباقي علينا. رحلتك معنا مش خطوة... دي تجربة كاملة من الثقة والمتعة.
                        </motion.p>
                        <motion.div variants={slideUp} className="mt-8">
                            <motion.button 
                                className="px-12 py-5 bg-white/20 backdrop-blur-lg text-white font-bold rounded-2xl shadow-2xl text-xl border border-white/30"
                                onClick={() => setCurrentPage('Booking')}
                                whileHover={{ scale: 1.1, y: -5, transition: { type: 'spring', stiffness: 300 } }}
                                whileTap={{ scale: 0.95 }}
                            >
                                احجز رحلتك الآن عبر واتساب 💬
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </ParallaxSection>
            
            {/* Why Choose Us Section */}
            <div className="py-16 sm:py-24 bg-[#F5EBDD]">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={staggerContainer}>
                        <motion.h2 variants={slideUp} className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#142b21]">لماذا تختار دار الأبرار؟</motion.h2>
                        <motion.div variants={slideUp} className="space-y-4 mt-8">
                          {whyUsPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className="flex-shrink-0 text-[#142b21] mt-1">{point.icon}</div>
                              <p className="text-base sm:text-lg text-[#142b21]">{point.text}</p>
                            </div>
                          ))}
                        </motion.div>
                        <motion.p variants={slideUp} className="mt-8 text-lg sm:text-xl font-semibold border-r-4 border-[#142b21] pr-4">
                            نحن لا نعدك برحلة عادية، بل نمنحك تجربة فريدة تحمل توقيع دار الأبرار. 🌿
                        </motion.p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                         <img src="https://images.unsplash.com/photo-1582221639987-5e63df81639d?q=80&w=1287&auto=format&fit=crop" alt="مسجد فخم" className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/5]"/>
                    </motion.div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-16 sm:py-24 bg-[#F5EBDD]/50">
              <div className="container mx-auto px-4">
                 <motion.h2 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }} 
                    variants={slideUp} 
                    className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#142b21] mb-12 text-center"
                >
                    آراء عملائنا
                </motion.h2>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                  {testimonials.map((testimonial) => (
                    <motion.div 
                      key={testimonial.id}
                      variants={slideUp}
                      className="p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg border border-white/20 h-full flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center mb-4">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#142b21]"/>
                                <p className="font-bold mr-4 text-lg">{testimonial.name}</p>
                            </div>
                            <p className="text-[#142b21]/90 text-base">"{testimonial.text}"</p>
                        </div>
                        <div className="flex justify-end mt-4">
                           <Star className="text-yellow-500 fill-yellow-500" />
                           <Star className="text-yellow-500 fill-yellow-500" />
                           <Star className="text-yellow-500 fill-yellow-500" />
                           <Star className="text-yellow-500 fill-yellow-500" />
                           <Star className="text-yellow-500 fill-yellow-500" />
                        </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="py-16 sm:py-24 bg-[#F5EBDD]">
                <div className="container mx-auto px-4 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={staggerContainer}>
                        <motion.h2 variants={slideUp} className="text-3xl sm:text-4xl md:text-6xl font-extrabold">تواصل معنا</motion.h2>
                        <motion.p variants={slideUp} className="max-w-2xl mx-auto mt-6 text-lg sm:text-xl text-[#142b21]/90">
                           مستنيين مكالمتك أو رسالتك 👋 فريقنا متواجد طول اليوم علشان يجاوب على كل استفساراتك.
                        </motion.p>
                        <motion.div variants={slideUp} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-lg">
                            <div className="flex items-center justify-center gap-3"><MapPin/> <span>أسيوط – مصر</span></div>
                            <div className="flex items-center justify-center gap-3"><Phone/> <a href="tel:+201150548477">01150548477</a></div>
                            <div className="flex items-center justify-center gap-3"><Mail/> <a href="mailto:info@daralabrar.com">info@daralabrar.com</a></div>
                        </motion.div>
                        <motion.div variants={slideUp} className="mt-12">
                             <WhatsAppCTA position="relative inline-flex" text="تواصل الآن عبر واتساب 💬" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const AboutPage: React.FC = () => {
    const aboutContent = [
      {
        text: "في دار الأبرار، نؤمن أن السفر ليس مجرد انتقال من مكان إلى آخر، بل هو تجربة تُغني الروح وتُنعش القلب. منذ انطلاقتنا، سعينا إلى أن نكون الوجهة الأولى لكل من يبحث عن رحلة مريحة، آمنة، ومليئة بالتجارب المميزة. بفضل فريق عملنا المحترف وشراكاتنا الواسعة مع أفضل الفنادق وشركات السياحة، أصبحنا نوفّر لعملائنا تجربة لا تُنسى من الراحة والرفاهية. هدفنا أن نجعل كل رحلة تبدأ بابتسامة وتنتهي بذكرى جميلة تبقى للأبد 🌸",
        image: "https://picsum.photos/seed/journey1/800/600",
      },
      {
        text: "دار الأبرار ليست مجرد مكتب سياحي، بل عالم متكامل من الفخامة والتميز. نحن نعمل بشغف لنحوّل أحلام السفر إلى واقع ينبض بالجمال والراحة. نُقدّم خدماتنا بروحٍ تجمع بين الاحترافية والدفء الإنساني، لتشعر أنك بين أيدٍ تُقدّر التفاصيل وتفهم رغباتك جيدًا. سواء كنت تبحث عن رحلة استجمام في أجمل الفنادق، أو مغامرة جديدة تملؤها اللحظات، فدار الأبرار هو عنوانك الأول للتميز. 🌍",
        image: "https://picsum.photos/seed/journey2/800/600",
      },
      {
        text: "نحن في دار الأبرار نؤمن أن كل رحلة تحمل قصة، وكل وجهة تخبئ لحظة تنتظر أن تُروى. نرافقك بخطواتك من الحلم إلى الذكرى، نرتّب تفاصيل رحلتك بدقة، ونُضيف لمستنا الخاصة لتكون كل تجربة مختلفة عن الأخرى. في عالم مليء بالسرعة، نمنحك فرصة للتوقف قليلًا... لتستمتع بالجمال، وتستعيد ذاتك، وتكتشف العالم بعين جديد. ✈️",
        image: "https://picsum.photos/seed/prayer/800/600",
      },
      {
        text: "تأسست دار الأبرار لتكون علامة فارقة في عالم السياحة والسفر، حيث نُقدّم حلولًا مبتكرة وخدمات متكاملة تلبي تطلعات عملائنا بأعلى معايير الجودة. نعتمد على خبرة فريقنا المتخصص وشركائنا الموثوقين لتوفير رحلات متكاملة تشمل الإقامة، النقل، والأنشطة الترفيهية، بما يتناسب مع جميع الأذواق والميزانيات. رؤيتنا أن نكون الوجهة الأولى لكل مسافر يبحث عن الراحة، الثقة، والتميز. في دار الأبرار، نسعى لأن يكون كل عميل ضيفًا عزيزًا... وكل رحلة تجربة استثنائية تُروى بفخر. 🌿",
        image: "https://picsum.photos/seed/journey4/800/600",
      },
    ];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 bg-[#F5EBDD] text-[#142b21] px-4">
      <div className="container mx-auto">
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideUp}
        >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-center">قصتنا</h2>
            <p className="max-w-3xl mx-auto mt-6 text-lg sm:text-xl text-center text-[#142b21]/90">
                في دار الأبرار، نؤمن بأن السفر ليس مجرد انتقال من مكان لآخر، بل هو تجربة تثري الروح وتصنع ذكريات تدوم. تأسسنا بشغف لتقديم أرقى خدمات السياحة الدينية والترفيهية، مع التركيز على أدق التفاصيل لضمان راحة ورفاهية عملائنا.
            </p>
        </motion.div>
        
        <div className="space-y-24 my-24">
            {aboutContent.map((item, index) => (
            <motion.div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                <motion.div 
                variants={slideUp}
                className={` ${index % 2 === 0 ? 'md:order-last' : ''}`}
                >
                <img src={item.image} alt={`About us section ${index + 1}`} className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3]" />
                </motion.div>
                <motion.div variants={slideUp}>
                <p className="text-lg sm:text-xl text-[#142b21] leading-relaxed">
                    {item.text}
                </p>
                </motion.div>
            </motion.div>
            ))}
        </div>

        <ParallaxSection className="my-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={staggerContainer}
                >
                    <motion.h3 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-4">فريقنا المحترف</motion.h3>
                    <motion.p variants={slideUp} className="text-base sm:text-lg text-[#142b21]/90">
                        فريقنا مكون من خبراء متخصصين في مجال السفر والسياحة، يعملون بتفانٍ لتقديم استشارات مخصصة وتصميم برامج سياحية تلبي تطلعاتكم وتتجاوز توقعاتكم. نحن هنا لخدمتكم على مدار الساعة.
                    </motion.p>
                </motion.div>
                <motion.div 
                    className="grid grid-cols-2 gap-4"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {teamMembers.map((member, i) => (
                        <motion.div 
                            key={member.id} 
                            className="relative rounded-lg overflow-hidden shadow-xl"
                            variants={fadeIn}
                            style={{paddingTop: '100%'}}
                        >
                            <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4 text-white">
                                <h4 className="font-bold text-lg">{member.name}</h4>
                                <p className="text-sm">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </ParallaxSection>
      </div>
    </div>
  );
};

const InputField: React.FC<{ icon: React.ReactNode; placeholder: string; type?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; }> = ({ icon, placeholder, type = 'text', name, value, onChange, required = false }) => (
    <motion.div variants={slideUp} className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[#142b21]/50">
            {icon}
        </div>
        <input 
            type={type} 
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-white/50 border border-white/30 text-[#142b21] text-sm rounded-lg focus:ring-[#142b21] focus:border-[#142b21] block ps-10 p-3.5 placeholder-[#142b21]/80"
        />
    </motion.div>
);

const BookingPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        destination: '',
        date: '',
        count: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const companyPhone = '201150548477'; // Replace with actual company WhatsApp number
        const message = `
طلب حجز جديد من دار الأبرار ✨
-------------------------
👤 الاسم: ${formData.name}
📱 الجوال: ${formData.phone}
📍 الوجهة: ${formData.destination}
🗓️ التاريخ: ${formData.date}
👨‍👩‍👧‍👦 عدد الأفراد: ${formData.count}
-------------------------
نرجو تأكيد الحجز في أقرب وقت.
        `.trim().replace(/\n/g, '%0A');

        const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
    <div className="min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-16 bg-[#F5EBDD] px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <motion.h2 variants={slideUp} className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-[#142b21]">
                احجز رحلتك الآن
            </motion.h2>
            <motion.p variants={slideUp} className="mt-4 text-lg sm:text-xl text-[#142b21]/90">
                املأ النموذج أدناه ودعنا نخطط لرحلة أحلامك.
            </motion.p>

            <form className="mt-12 space-y-6" onSubmit={handleBookingSubmit}>
                <InputField icon={<User size={18} />} placeholder="الاسم الكامل" name="name" value={formData.name} onChange={handleInputChange} required />
                <InputField icon={<Phone size={18} />} placeholder="رقم الجوال" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                <InputField icon={<MapPin size={18} />} placeholder="الوجهة المطلوبة" name="destination" value={formData.destination} onChange={handleInputChange} required />
                <InputField icon={<Calendar size={18} />} placeholder="تاريخ السفر" type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                <InputField icon={<Users size={18} />} placeholder="عدد الأفراد" type="number" name="count" value={formData.count} onChange={handleInputChange} required />
                
                <motion.button
                    type="submit"
                    variants={slideUp}
                    whileHover={{ 
                        scale: 1.05,
                        background: 'linear-gradient(145deg, rgba(20, 43, 33, 1), rgba(31, 66, 51, 1))',
                        boxShadow: '0px 10px 20px rgba(20, 43, 33, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 text-lg font-bold bg-[#142b21] text-[#F5EBDD] py-4 px-6 rounded-lg shadow-lg"
                >
                    إرسال الطلب
                    <ArrowLeft size={22}/>
                </motion.button>
            </form>
            <motion.div variants={slideUp} className="mt-8">
                <p className="text-lg">أو تواصل معنا مباشرة عبر واتساب!</p>
                <WhatsAppCTA position="relative inline-flex mt-4" text="تواصل فوري" />
            </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const HotelsPage: React.FC = () => {
    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-16 bg-[#F5EBDD] text-[#142b21] px-4">
            <div className="container mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={slideUp}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold">فنادقنا المختارة</h2>
                    <p className="max-w-2xl mx-auto mt-4 text-lg sm:text-xl text-[#142b21]/90">
                        اخترنا لكم مجموعة من أفخم الفنادق لضمان إقامة مريحة وفاخرة.
                    </p>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {hotels.map(hotel => (
                        <motion.div 
                            key={hotel.id}
                            variants={slideUp}
                            className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/20 group"
                        >
                            <div className="overflow-hidden h-56">
                                <motion.img 
                                    src={hotel.image} 
                                    alt={hotel.name}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                />
                            </div>
                            <div className="p-6">
                                <motion.h3 
                                    className="text-2xl font-bold text-[#142b21] group-hover:text-[#1f4233] transition-colors"
                                >
                                    {hotel.name}
                                </motion.h3>
                                <p className="text-md text-[#142b21]/80 mt-1">{hotel.location}</p>
                                <motion.a
                                    href="https://wa.me/201150548477"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-[#142b21] text-[#F5EBDD] rounded-lg shadow-md"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <MessageSquare size={18}/>
                                    حجز عبر واتساب
                                </motion.a>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                <WhatsAppCTA position="fixed bottom-6 end-6" text="للمساعدة"/>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT --- //

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('Home');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'About':
        return <AboutPage />;
      case 'Booking':
        return <BookingPage />;
      case 'Hotels':
        return <HotelsPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="font-tajawal bg-[#F5EBDD]">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
          <footer className="bg-[#142b21] text-[#F5EBDD] py-8 text-center px-4">
             <div className="container mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold">دار الأبرار</h3>
                <p className="mt-2 max-w-md mx-auto text-sm sm:text-base">✨ نأخذك إلى العالم... وأنت مرتاح البال.</p>
                <div className="flex justify-center gap-4 mt-4">
                     <WhatsAppCTA position="relative" text="تواصل معنا"/>
                </div>
                <p className="mt-6 text-xs sm:text-sm opacity-70">&copy; {new Date().getFullYear()} دار الأبرار للسفر والسياحة. جميع الحقوق محفوظة.</p>
             </div>
          </footer>
          <FloatingActionButtons setCurrentPage={setCurrentPage} />
        </>
      )}
    </div>
  );
}
