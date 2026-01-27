import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const translations: Record<string, any> = {
  en: {
    langCode: 'en-US',
    langName: 'English',
    nav: { 
      home: "Home", 
      about: "About Us",
      contact: "Contact Us",
      reportGenerator: "Doc Assistant", 
      grantFinder: "Grant Finder", 
      videoGenerator: "Video Generator", 
      blogGenerator: "Blog Generator",
      contentHub: "Content Maker",
      wasteToWealth: "Waste to Wealth",
      treePlanter: "Tree Planter",
      mediaArchive: "Media Archive",
      projects: "Projects", 
      team: "Team",
      dashboard: "Dashboard",
    },
    common: {
      readMore: "Read More",
      readLess: "Read Less",
      retry: "Retry Image Generation",
      failed: "Image Generation Failed"
    },
    projectsPage: {
        badge: "Our Portfolio",
        titleMain: "Research with",
        titleAccent: "Real World Impact",
        subtitle: "At Civicavita AB, we bridge the gap between academic rigor and humanitarian action. Explore our ongoing and completed scientific investigations across the globe.",
        noProjects: "No Projects Found in the Registry",
        ctaTitle: "Want to collaborate on research?",
        ctaText: "Our teams are always looking for academic and NGO partners to expand our impact in global health.",
        ctaButton: "Partner With Us"
    },
    dashboard: {
        menu: {
            dashboard: "Dashboard",
            posts: "Posts",
            media: "Media",
            pages: "Pages",
            comments: "Comments",
            appearance: "Appearance",
            plugins: "Plugins",
            users: "Users",
            tools: "Tools",
            settings: "Settings",
            database: "Sosobel SQL",
            allPosts: "All Posts",
            addNew: "Add New",
            categories: "Categories",
            tags: "Tags"
        },
        posts: {
            all: "All",
            published: "Published",
            draft: "Draft",
            trash: "Trash",
            addNew: "Add New",
            search: "Search Posts",
            bulkActions: "Bulk Actions",
            apply: "Apply",
            filter: "Filter",
            items: "items",
            table: {
                title: "Title",
                author: "Author",
                categories: "Categories",
                tags: "Tags",
                date: "Date"
            },
            actions: {
                edit: "Edit",
                quickEdit: "Quick Edit",
                trash: "Trash",
                view: "View",
                restore: "Restore",
                deletePermanently: "Delete Permanently",
                update: "Update",
                cancel: "Cancel"
            }
        },
        database: {
            title: "Sosobel MySQL Database",
            status: "Connection Status",
            connected: "Connected to MySQL",
            disconnected: "Disconnected",
            syncing: "Syncing with Sosobel Cloud...",
            tables: "Database Tables",
            schema: "sosobel_db",
            query: "Run SQL Query",
            execute: "Execute",
            recentActivity: "Recent Database Transactions"
        },
        comments: {
            author: "Author",
            comment: "Comment",
            inResponseTo: "In Response To",
            submittedOn: "Submitted On",
            approve: "Approve",
            reply: "Reply",
            spam: "Spam"
        }
    },
    hero: {
        title: "CIVICAVITA.<span class='text-orange-500'>A</span><span class='text-emerald-500'>B</span> <br/> <span class='text-white'>Global Health & Humanitarian Science</span>",
        subtitle: "CIVICAVITA derives from Latin-rooted words 'Civic' (citizen, society, public life) and 'Vita' (life, well-being, sustainability). We bridge scientific knowledge with real-world impact, advancing public health, social equity, and environmental sustainability.",
        button1: "Explore Our Work",
        button2: "Contact Us",
        videoUrl: "https://storage.googleapis.com/civicavita-assets/hero-bg.mp4"
    },
    home: {
        introTitle: "Mission",
        introText: "At CIVICAVITA AB, we conduct research in social and health sciences to enhance individual and community well-being while promoting sustainability, social responsibility, and human rights. Through evidence-based research, educational content, and digital engagement, we collaborate with academia, NGOs, and public institutions to drive informed decision-making and positive social change.",
        visionTitle: "Vision",
        visionText: "CIVICAVITA AB envisions a future where reliable research informs policies and initiatives that enhance lives and protect the environment. By collaborating with international organizations, NGOs, academic institutions, and private partners, we aim to contribute to a more just, sustainable, and informed society.",
        servicesTitle: "Our Core Services",
        services: [
            { iconKey: 'science', title: 'Humanitarian Research', text: 'Conducting field-based scientific studies to create evidence-based solutions for health crises and social equity.', linkPage: 'generator' },
            { iconKey: 'grant', title: 'Grant Acquisition', text: 'Securing and managing funding for high-impact humanitarian and scientific projects.', linkPage: 'grant' },
            { iconKey: 'education', title: 'Education & Media', text: 'Developing handbooks, courses, and media programs to educate activists and the public.', linkPage: 'content-hub' },
            { iconKey: 'consulting', title: 'Policy & Advisory', text: 'Contributing to ethical codes and governance frameworks for democratic engagement.', linkPage: 'generator' }
        ],
        portfolioTitle: "Featured Research Projects",
        portfolioItems: [
            { img: "https://images.unsplash.com/photo-1573164060897-425941c302ba?auto=format&fit=crop&w=800&q=80", title: "People-Centric Intelligent Response", link: "https://rentry.co/s4s6af3p", description: "Developing a novel model for community empowerment and strengthening opposition through intelligent, people-focused response strategies in humanitarian contexts.", tags: ["Empowerment", "Strategy", "Humanitarian"]},
            { img: "https://images.unsplash.com/photo-1466617692045-3764f33b2728?auto=format&fit=crop&w=800&q=80", title: "Citizen Rights & Environmental Education", link: "https://rentry.co/p27k4gkr", description: "An initiative aimed at bridging the gap between civic legal awareness and environmental stewardship through comprehensive educational modules.", tags: ["Education", "Environment", "Rights"]},
            { img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", title: "Transformative Power of Cooperation", link: "https://rentry.co/zohzg8ge", description: "Analyzing how sacrifice, love, and international cooperation serve as scientific pillars for addressing the most pressing global health and social challenges.", tags: ["Global Challenges", "Cooperation", "Research"]},
            { img: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=800&q=80", title: "Economic Feminism & Global Movements", link: "https://rentry.co/5tighzc3", description: "A comparative study of economic feminism and its impact on the sustainability and success of global social justice movements.", tags: ["Gender Equity", "Economics", "Sociology"]},
            { img: "", title: "Climate-Resilient Health Infrastructures", link: "https://rentry.co/civicavita_climate", description: "Analyzing architectural and systemic adaptations required to maintain public health services in regions most affected by extreme weather events.", tags: ["Climate", "Infrastructure", "Health"]},
            { img: "", title: "Digital Equity in Rural Healthcare", link: "https://rentry.co/civicavita_digital", description: "Bridging the technological divide to provide specialized medical consultations to remote populations via low-latency satellite networks.", tags: ["Digital", "Rural", "Healthcare"]},
            { img: "", title: "Bio-Ethics in Crisis Response", link: "https://rentry.co/civicavita_ethics", description: "Developing an international framework for ethical decision-making during fast-onset humanitarian emergencies.", tags: ["Ethics", "Crisis", "Policy"]},
            { img: "", title: "Mobile Health Units in War Zones", link: "https://rentry.co/civicavita_warzone", description: "Logistical and medical research on deploying rapid-response mobile clinics in high-conflict areas to ensure surgical continuity.", tags: ["War Zones", "Logistics", "Surgery"]},
            { img: "", title: "Sustainable Urban Sanitation Models", link: "https://rentry.co/civicavita_sanitation", description: "Designing scalable, waste-to-energy sanitation systems for high-density informal settlements in Southeast Asia.", tags: ["Urban", "Sanitation", "Sustainability"]},
            { img: "", title: "AI-Driven Epidemic Forecasting", link: "https://rentry.co/civicavita_epidemic", description: "Utilizing machine learning to analyze environmental and mobility data for early warning signals of zoonotic diseases.", tags: ["AI", "Epidemiology", "Prediction"]}
        ],
        achievementsTitle: "Our Impact",
        achievements: [
            { iconKey: 'publications', count: 200, suffix: '+', label: 'Media Programs Produced' },
            { iconKey: 'funded', count: 44, suffix: '', label: 'Countries Analyzed' },
            { iconKey: 'collaborations', count: 15, suffix: '+', label: 'Global Partners' },
            { iconKey: 'team', count: 12, suffix: '', label: 'Active Projects' },
            { iconKey: 'trained', count: 500, suffix: '+', label: 'Trained Professionals' }
        ],
        customersTitle: "Partners & Strategic Collaborators",
        customerLogos: [
            { img: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Linnaeus_University_logo.svg/1200px-Linnaeus_University_logo.svg.png', alt: 'Linnaeus University' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/UNFPA_logo.svg/1200px-UNFPA_logo.svg.png', alt: 'UNFPA' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/WHO_logo.svg/1200px-WHO_logo.svg.png', alt: 'WHO' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/UNICEF_logo.svg/2560px-UNICEF_logo.svg.png', alt: 'UNICEF' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sida_logo.svg/1200px-Sida_logo.svg.png', alt: 'Sida' },
            { img: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/IPPF_logo.svg/1200px-IPPF_logo.svg.png', alt: 'IPPF' },
        ],
        calendarTitle: "Latest Insights & Research",
        latestPosts: [
            { img: "https://images.unsplash.com/photo-1581093458891-8f3086325744?auto=format&fit=crop&w=800&q=80", title: "Improving Health Systems in Underdeveloped Regions", date: "July 15, 2024", comments: 8, link: "https://www.linkedin.com/in/sahar-motallebi/" },
            { img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", title: "The Role of Technology in Healthcare Access", date: "June 28, 2024", comments: 12, link: "https://www.linkedin.com/in/sahar-motallebi/" },
            { img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", title: "Management of International Health Programs", date: "June 05, 2024", comments: 5, link: "https://www.linkedin.com/in/sahar-motallebi/" },
            { img: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=800&q=80", title: "Scientific Research and Global Policy Impacts", date: "May 21, 2024", comments: 15, link: "https://www.linkedin.com/in/sahar-motallebi/" },
        ]
    },
    footer: {
      description: "CIVICAVITA AB: Bridging scientific knowledge with real-world impact to advance public health, social equity, and environmental sustainability.",
      contactTitle: "Get in Touch",
      email: "smotallebi@civicavita.org",
      phone: "+46 739751973",
      address: "Lantmannagatan 6 C, Apartment 1202, 214 44 Malmö",
      socialMediaTitle: "Follow Our Mission",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      facebook: "Facebook",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      quickLinksTitle: "Quick Links",
      quickLinks: [
        { text: "About Us", link: "#about" },
        { text: "Our Services", link: "#services" },
        { text: "Projects Portfolio", link: "#portfolio" },
        { text: "Careers", link: "#" },
        { text: "Privacy Policy", link: "#" },
      ],
      addressTitle: "Our Location",
      copyright: "© 2024 Civicavita AB. All Rights Reserved. For a better world.",
    },
    mediaArchive: {
        title: "Media Archive",
        searchPlaceholder: "Search programs (e.g., 'History Calendar')",
        featuredProgram: "Featured Program",
        programTitle: "History Calendar (Taqvim Tarikh)",
        network: "Channel 1",
        airTime: "Daily at 07:00 AM",
        views: "174K+ Views",
        episodes: "Episodes",
        clips: "Clips",
        play: "Play",
        duration: "Duration"
    },
    blogGenerator: {
        title: "AI Blog Writer",
        formTitle: "Post Details",
        titleLabel: "Blog Title",
        titlePlaceholder: "e.g., The Future of Sustainable Housing",
        contentLabel: "Content Outline / Key Points",
        contentPlaceholder: "List the main points you want to cover...",
        toneLabel: "Writing Tone",
        buttonText: "Generate Blog Post",
        generatingText: "Writing & Designing...",
        validationError: "Please provide a title and content outline."
    },
    blogTones: {
        professional: "Professional",
        casual: "Casual",
        academic: "Academic",
        engaging: "Engaging"
    }
  },
  fa: {
    langCode: 'fa-IR',
    langName: 'Persian',
    nav: { 
      home: "خانه", 
      about: "درباره ما",
      contact: "تماس با ما",
      reportGenerator: "دستیار اسناد", 
      grantFinder: "گرنت یاب", 
      videoGenerator: "سازنده ویدیو", 
      blogGenerator: "وبلاگ نویس",
      contentHub: "تولید محتوا",
      wasteToWealth: "پسماند به ثروت",
      treePlanter: "درخت‌کار",
      mediaArchive: "آرشیو رسانه",
      projects: "پروژه‌ها", 
      team: "تیم ما",
      dashboard: "داشبورد",
    },
    common: {
      readMore: "ادامه مطلب",
      readLess: "بستن",
      retry: "تلاش مجدد ساخت تصویر",
      failed: "خطا در ساخت تصویر"
    },
    projectsPage: {
        badge: "نمونه کارهای ما",
        titleMain: "تحقیق با",
        titleAccent: "تأثیر دنیای واقعی",
        subtitle: "در Civicavita AB، ما شکاف بین دقت آکادمیک و اقدامات بشردوستانه را پر می‌کنیم. تحقیقات علمی در حال انجام و تکمیل شده ما را در سراسر جهان کاوش کنید.",
        noProjects: "هیچ پروژه‌ای در سامانه یافت نشد",
        ctaTitle: "آیا مایل به همکاری در تحقیق هستید؟",
        ctaText: "تیم‌های ما همیشه به دنبال شرکای دانشگاهی و سازمان‌های مردم‌نهاد هستند تا تأثیر ما را در سلامت جهانی گسترش دهند.",
        ctaButton: "با ما همکاری کنید"
    },
    dashboard: {
        menu: {
            dashboard: "داشبورد",
            posts: "نوشته‌ها",
            media: "رسانه",
            pages: "برگه‌ها",
            comments: "دیدگاه‌ها",
            appearance: "نمایش",
            plugins: "افزونه‌ها",
            users: "کاربران",
            tools: "ابزارها",
            settings: "تنظیمات",
            database: "پایگاه داده MySQL",
            allPosts: "همه نوشته‌ها",
            addNew: "افزودن نوشته",
            categories: "دسته‌ها",
            tags: "برچسب‌ها"
        },
        posts: {
            all: "همه",
            published: "منتشر شده",
            draft: "پیش‌نویس",
            trash: "زباله‌دان",
            addNew: "افزودن نوشته",
            search: "جستجوی نوشته‌ها",
            bulkActions: "کارهای دسته جمعی",
            apply: "اجرا",
            filter: "صافی",
            items: "مورد",
            table: {
                title: "عنوان",
                author: "نویسنده",
                categories: "دسته‌ها",
                tags: "برچسب‌ها",
                date: "تاریخ"
            },
            actions: {
                edit: "ویرایش",
                quickEdit: "ویرایش سریع",
                trash: "زباله‌دان",
                view: "نمایش",
                restore: "بازیافت",
                deletePermanently: "حذف دائم",
                update: "بروزرسانی",
                cancel: "لغو"
            }
        },
        database: {
            title: "پایگاه داده MySQL سوسوبل",
            status: "وضعیت اتصال",
            connected: "متصل به MySQL",
            disconnected: "قطع شده",
            syncing: "در حال همگام‌سازی...",
            tables: "جداول پایگاه داده",
            schema: "sosobel_db",
            query: "اجرای کوئری SQL",
            execute: "اجرا",
            recentActivity: "آخرین تراکنش‌ها"
        },
        comments: {
            author: "نویسنده",
            comment: "دیدگاه",
            inResponseTo: "در پاسخ به",
            submittedOn: "فرستاده شده در",
            approve: "پذیرفتن",
            reply: "پاسخ",
            spam: "جفنگ"
        }
    },
    hero: {
        title: "سیویکاویتا <span class='text-orange-500'>ا</span>.<span class='text-emerald-500'>ب</span> <br/> <span class='text-white'>علوم سلامت جهانی و بشردوستانه</span>",
        subtitle: "سیویکاویتا (Civicavita) از کلمات لاتین 'Civic' (شهروند، جامعه) و 'Vita' (زندگی، رفاه) گرفته شده است. ما دانش علمی را با تأثیرات دنیای واقعی پیوند می‌دهیم تا سلامت عمومی، عدالت اجتماعی و پایداری محیط زیست را ارتقا دهیم.",
        button1: "کاوش در کار ما",
        button2: "تماس با ما",
        videoUrl: "https://storage.googleapis.com/civicavita-assets/hero-bg.mp4"
    },
    home: {
        introTitle: "مأموریت ما",
        introText: "در CIVICAVITA AB، ما تحقیقاتی در علوم اجتماعی و سلامت انجام می‌دهیم تا رفاه فردی و اجتماعی را ارتقا دهیم و در عین حال پایداری، مسئولیت اجتماعی و حقوق بشر را ترویج کنیم. از طریق تحقیقات مبتنی بر شواهد، محتوای آموزشی و مشارکت دیجیتال، ما با دانشگاه‌ها، سازمان‌های مردم‌نهاد و نهادهای عمومی همکاری می‌کنیم تا تصمیم‌گیری آگاهانه و تغییرات اجتماعی مثبت را پیش ببریم.",
        visionTitle: "چشم‌انداز",
        visionText: "CIVICAVITA AB آینده‌ای را متصور است که در آن تحقیقات معتبر، سیاست‌ها و ابتکاراتی را که زندگی را بهبود می‌سازند و از محیط زیست محافظت می‌کنند، آگاه می‌سازد. با همکاری با سازمان‌های بین‌المللی، سازمان‌های مردم‌نهاد، مؤسسات دانشگاهی و شرکای خصوصی، هدف ما کمک به ایجاد جامعه‌ای عادلانه‌تر، پایدارتر و آگاه‌تر است.",
        servicesTitle: "خدمات اصلی ما",
        services: [
            { iconKey: 'science', title: 'تحقیقات بشردوستانه', text: 'انجام مطالعات علمی میدانی برای ایجاد راه‌حل‌های مبتنی بر شواهد برای بحران‌های سلامت و عدالت اجتماعی.', linkPage: 'generator' },
            { iconKey: 'grant', title: 'جذب گرنت و بودجه', text: 'تأمین و مدیریت بودجه برای پروژه‌های بشردوستانه و علمی با تأثیر بالا.', linkPage: 'grant' },
            { iconKey: 'education', title: 'آموزش و رسانه', text: 'توسعه کتاب‌های راهنما، دوره‌ها و برنامه‌های رسانه‌ای برای آموزش فعالان و عموم مردم.', linkPage: 'content-hub' },
            { iconKey: 'consulting', title: 'سیاست‌گذاری و مشاوره', text: 'مشارکت در کدهای اخلاقی و چارچوب‌های حاکمیتی برای مشارکت دموکراتیک.', linkPage: 'generator' }
        ],
        portfolioTitle: "پروژه‌های تحقیقاتی برجسته",
        portfolioItems: [
            { img: "https://images.unsplash.com/photo-1573164060897-425941c302ba?auto=format&fit=crop&w=800&q=80", title: "پاسخ هوشمند مردم‌محور", link: "https://rentry.co/s4s6af3p", description: "توسعه مدل جدیدی برای توانمندسازی جامعه و تقویت اپوزیسیون از طریق استراتژی‌های پاسخ هوشمند و متمرکز بر مردم در بافت‌های بشردوستانه.", tags: ["توانمندسازی", "استراتژی", "بشردوستانه"]},
            { img: "https://images.unsplash.com/photo-1466617692045-3764f33b2728?auto=format&fit=crop&w=800&q=80", title: "حقوق شهروندی و آموزش محیط زیست", link: "https://rentry.co/p27k4gkr", description: "ابتکاری با هدف پر کردن شکاف بین آگاهی حقوقی مدنی و نظارت بر محیط زیست از طریق ماژول‌های آموزشی جامع.", tags: ["آموزش", "محیط زیست", "حقوق"]},
            { img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", title: "قدرت تحول‌آفرین همکاری", link: "https://rentry.co/zohzg8ge", description: "تحلیل چگونگی عملکرد ایثار، عشق و همکاری بین‌المللی به عنوان ستون‌های علمی برای مقابله با مبرم‌ترین چالش‌های سلامت و اجتماعی جهانی.", tags: ["چالش‌های جهانی", "همکاری", "تحقیق"]},
            { img: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=800&q=80", title: "فمینیسم اقتصادی و جنبش‌های جهانی", link: "https://rentry.co/5tighzc3", description: "مطالعه‌ای تطبیقی بر فمینیسم اقتصادی و تأثیر آن بر پایداری و موفقیت جنبش‌های جهانی عدالت اجتماعی.", tags: ["عدالت جنسیتی", "اقتصاد", "جامعه‌شناسی"]},
            { img: "", title: "زیرساخت‌های سلامت مقاوم در برابر اقلیم", link: "https://rentry.co/civicavita_climate", description: "تحلیل سازگاری‌های معماری و سیستمی مورد نیاز برای حفظ خدمات بهداشت عمومی در مناطق بیشتر تحت تأثیر رویدادهای شدید آب و هوایی.", tags: ["اقلیم", "زیرساخت", "سلامت"]},
            { img: "", title: "عدالت دیجیتال در مراقبت‌های بهداشتی روستایی", link: "https://rentry.co/civicavita_digital", description: "پر کردن شکاف تکنولوژیکی برای ارائه مشاوره‌های پزشکی تخصصی به جمعیت‌های دورافتاده از طریق شبکه‌های ماهواره‌ای با تاخیر کم.", tags: ["دیجیتال", "روستایی", "سلامت"]},
            { img: "", title: "اخلاق زیستی در پاسخ به بحران", link: "https://rentry.co/civicavita_ethics", description: "توسعه یک چارچوب بین‌المللی برای تصمیم‌گیری اخلاقی در طول فوریت‌های بشردوستانه با شروع سریع.", tags: ["اخلاق", "بحران", "سیاست"]},
            { img: "", title: "واحدهای سلامت سیار در مناطق جنگی", link: "https://rentry.co/civicavita_warzone", description: "تحقیقات لجستیکی و پزشکی در مورد استقرار کلینیک‌های سیار واکنش سریع در مناطق با درگیری بالا.", tags: ["جنگ", "لجستیک", "پزشکی"]},
            { img: "", title: "مدل‌های بهداشت شهری پایدار", link: "https://rentry.co/civicavita_sanitation", description: "طراحی سیستم‌های بهداشتی مقیاس‌پذیر برای سکونتگاه‌های غیررسمی با تراکم بالا در جنوب شرق آسیا.", tags: ["شهری", "بهداشت", "پایداری"]},
            { img: "", title: "پیش‌بینی اپیدمی مبتنی بر هوش مصنوعی", link: "https://rentry.co/civicavita_epidemic", description: "استفاده از یادگیری ماشین برای تحلیل داده‌های محیطی و جابجایی برای سیگنال‌های هشدار زودهنگام بیماری‌های مشترک بین انسان و دام.", tags: ["هوش مصنوعی", "اپیدمیولوژی", "پیش‌بینی"]}
        ],
        achievementsTitle: "تأثیر ما",
        achievements: [
            { iconKey: 'publications', count: 200, suffix: '+', label: 'برنامه رسانه‌ای تولید شده' },
            { iconKey: 'funded', count: 44, suffix: '', label: 'کشور تحلیل شده' },
            { iconKey: 'collaborations', count: 15, suffix: '+', label: 'شریک جهانی' },
            { iconKey: 'team', count: 12, suffix: '', label: 'پروژه فعال' },
            { iconKey: 'trained', count: 500, suffix: '+', label: 'متخصص آموزش دیده' }
        ],
        customersTitle: "همکاران و شرکای استراتژیک",
        customerLogos: [
            { img: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Linnaeus_University_logo.svg/1200px-Linnaeus_University_logo.svg.png', alt: 'دانشگاه لینائوس' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/UNFPA_logo.svg/1200px-UNFPA_logo.svg.png', alt: 'UNFPA' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/WHO_logo.svg/1200px-WHO_logo.svg.png', alt: 'WHO' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/UNICEF_logo.svg/2560px-UNICEF_logo.svg.png', alt: 'UNICEF' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sida_logo.svg/1200px-Sida_logo.svg.png', alt: 'Sida' },
            { img: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/IPPF_logo.svg/1200px-IPPF_logo.svg.png', alt: 'IPPF' },
        ],
        calendarTitle: "آخرین بینش‌ها و تحقیقات",
        latestPosts: [
            { img: "https://images.unsplash.com/photo-1581093458891-8f3086325744?auto=format&fit=crop&w=800&q=80", title: "بهبود سیستم‌های بهداشتی در مناطق کم‌توسعه", date: "۲۵ تیر ۱۴۰۳", comments: 8, link: "https://www.linkedin.com/in/sahar-motallebi/" },
            { img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", title: "نقش فناوری در دسترسی به مراقبت‌های بهداشتی", date: "۸ تیر ۱۴۰۳", comments: 12, link: "https://www.linkedin.com/in/sahar-motallebi/" },
            { img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", title: "مدیریت برنامه‌های بین‌المللی سلامت", date: "۱۶ خرداد ۱۴۰۳", comments: 5, link: "https://www.linkedin.com/in/sahar-motallebi/" },
            { img: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=800&q=80", title: "تحقیقات علمی و تأثیرات سیاست‌گذاری جهانی", date: "۱ خرداد ۱۴۰۳", comments: 15, link: "https://www.linkedin.com/in/sahar-motallebi/" },
        ]
    },
    footer: {
      description: "CIVICAVITA AB: پیوند دانش علمی با تأثیرات دنیای واقعی برای پیشبرد سلامت عمومی، عدالت اجتماعی و پایداری محیط زیست.",
      contactTitle: "تماس با ما",
      email: "smotallebi@civicavita.org",
      phone: "+46 739751973",
      address: "Lantmannagatan 6 C, Apartment 1202, 214 44 Malmö",
      socialMediaTitle: "مأموریت ما را دنبال کنید",
      instagram: "اینستاگرام",
      linkedin: "لینکدین",
      facebook: "فیس‌بوک",
      whatsapp: "واتس‌اپ",
      telegram: "تلگرام",
      quickLinksTitle: "لینک‌های سریع",
      quickLinks: [
        { text: "درباره ما", link: "#about" },
        { text: "خدمات ما", link: "#services" },
        { text: "نمونه کارها", link: "#portfolio" },
        { text: "فرصت‌های شغلی", link: "#" },
        { text: "حریم خصوصی", link: "#" },
      ],
      addressTitle: "موقعیت ما",
      copyright: "© ۲۰۲۴ Civicavita AB. تمامی حقوق محفوظ است. برای دنیایی بهتر.",
    },
    mediaArchive: {
        title: "آرشیو رسانه",
        searchPlaceholder: "جستجوی برنامه (مثلاً: 'تقویم تاریخ')",
        featuredProgram: "برنامه ویژه",
        programTitle: "تقویم تاریخ",
        network: "شبکه ۱",
        airTime: "هر روز ساعت ۰۷:۰۰",
        views: "۱۷۴ هزار بازدید",
        episodes: "قسمت‌ها",
        clips: "کلیپ‌ها",
        play: "پخش",
        duration: "مدت"
    },
    blogGenerator: {
        title: "AI Blog Writer",
        formTitle: "جزئیات پست",
        titleLabel: "عنوان پست",
        titlePlaceholder: "مثلاً: آینده مسکن پایدار",
        contentLabel: "محتوا و نکات کلیدی",
        contentPlaceholder: "توضیح دهید پست درباره چه چیزی باشد...",
        toneLabel: "لحن نوشته",
        buttonText: "تولید پست همراه با تصویر",
        generatingText: "در حال نوشتن...",
        validationError: "لطفاً عنوان و محتوا را وارد کنید."
    },
    blogTones: {
        professional: "حرفه‌ای",
        casual: "دوستانه",
        academic: "آکادمیک",
        engaging: "جذاب"
    }
  },
};

type Language = 'en' | 'fa' | 'ar' | 'es' | 'fr' | 'hi' | 'ru' | 'zh';

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'fa', name: 'فارسی' },
  { code: 'ar', name: 'العربية' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文 (简体)' },
];


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => any;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// A helper function for nested object access
const getNested = (obj: any, path: string): any => {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): any => {
    let translation = getNested(translations[language], key);
    if (translation === undefined) {
        translation = getNested(translations.en, key);
    }
    return translation !== undefined ? translation : key;
  };

  const direction = ['fa', 'ar'].includes(language) ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t, direction } }, children);
};


// --- Theme System ---

export interface Theme {
    id: string;
    name: string;
    primary: string;
    primaryHover: string;
    gradient: string;
}

export const THEMES: Record<string, Theme> = {
    green: { 
        id: 'green',
        name: 'Nature (Green)',
        primary: '#10b981',
        primaryHover: '#059669',
        gradient: 'linear-gradient(to right, #34d399, #10b981, #064e3b)'
    },
    civicavita: { 
        id: 'civicavita',
        name: 'Civicavita (Blue/Emerald)', 
        primary: '#0e7490', 
        primaryHover: '#0891b2',
        gradient: 'linear-gradient(to right, #06b6d4, #0e7490, #164e63)'
    },
    red: { 
        id: 'red',
        name: 'Urgent (Red)', 
        primary: '#ef4444',
        primaryHover: '#b91c1c',
        gradient: 'linear-gradient(to right, #fb923c, #ef4444, #7f1d1d)'
    },
    yellow: { 
        id: 'yellow',
        name: 'Solar (Yellow)', 
        primary: '#eab308',
        primaryHover: '#a16207',
        gradient: 'linear-gradient(to right, #facc15, #eab308, #713f12)'
    },
    blue: { 
        id: 'blue',
        name: 'Ocean (Blue)', 
        primary: '#3b82f6',
        primaryHover: '#1d4ed8',
        gradient: 'linear-gradient(to right, #22d3ee, #3b82f6, #1e3a8a)'
    },
};

const adjustBrightness = (hex: string, percent: number) => {
    let num = parseInt(hex.replace("#",""),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

interface ThemeContextType {
    currentTheme: Theme;
    setTheme: (themeId: string) => void;
    setCustomTheme: (hexColor: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.green);

    const setTheme = (themeId: string) => {
        const theme = THEMES[themeId];
        if (theme) {
            setCurrentTheme(theme);
        }
    };

    const setCustomTheme = (hexColor: string) => {
        const primary = hexColor;
        const primaryHover = adjustBrightness(hexColor, -20);
        const gradientStart = adjustBrightness(hexColor, 30);
        const gradientEnd = adjustBrightness(hexColor, -30);
        
        const gradient = `linear-gradient(to right, ${gradientStart}, ${primary}, ${gradientEnd})`;

        const customTheme: Theme = {
            id: 'custom',
            name: 'Custom',
            primary,
            primaryHover,
            gradient
        };
        setCurrentTheme(customTheme);
    };

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', currentTheme.primary);
        root.style.setProperty('--theme-primary-hover', currentTheme.primaryHover);
        root.style.setProperty('--theme-gradient', currentTheme.gradient);
    }, [currentTheme]);

  return React.createElement(ThemeContext.Provider, { value: { currentTheme, setTheme, setCustomTheme } }, children);
};

// --- App State ---
export type Page = 'home' | 'projects' | 'team' | 'generator' | 'grant' | 'video' | 'blog' | 'content-hub' | 'waste-to-wealth' | 'tree-planter' | 'dashboard' | 'media-archive';

export interface AppState {
  page: Page;
}

// --- MySQL Related Types ---
export interface SQLTable {
    name: string;
    rows: number;
    lastUpdated: string;
    columns: string[];
}

export type MySQLStatus = 'Connected' | 'Disconnected' | 'Syncing' | 'Error';

// --- Grant Related Types ---
export interface Grant {
  grantTitle: string;
  fundingBody: string;
  summary: string;
  deadline: string;
  link: string;
}

export interface GrantSummary {
  grantTitle: string;
  fundingBody: string;
  deadline: string;
  amount: string;
  duration: string;
  geography: string;
  eligibility: string;
  scope: string;
  howToApply: string;
  contact: string;
  relevancePercentage: number;
}

// --- Video Generator Types ---
export interface VideoScene {
    id: string;
    description: string;
    narration: string;
    videoUrls: string[];
    imageUrl: string | null;
    isGenerating: boolean;
    isApproved: boolean;
    error: string | null;
}

// --- Project Types ---
export interface Project {
  img: string;
  title: string;
  link: string;
  description: string;
  tags: string[];
  isLoadingImage?: boolean;
  isGenerationFailed?: boolean;
}

// --- Blog Post Types ---
export interface BlogPost {
  img: string;
  title: string;
  date: string;
  comments: number;
  link: string;
  isLoadingImage?: boolean;
  isGenerationFailed?: boolean;
}

// --- Chatbot Types ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
}

// --- Tree Planter Types ---
export interface RiskItem {
    name: 'regulatory' | 'climate' | 'ecological';
    warningPercentage: number;
    description: string;
    
}

export interface PlantingAnalysis {
    plantingSuggestion: string;
    vegetationAnalysis: string;
    riskAnalysis: RiskItem[];
    suggestedTrees: string[];
    crowdfundingPitch: string;
}

// --- Content Hub Types ---
export interface DailyTrend {
    title: string;
    summary: string;
    contentIdea?: string;
}

export interface GeneratedPost {
    text: string;
    platform: string;
    imageUrl?: string;
}

export interface VideoSceneScript {
    timecode: string;
    visual: string;
    voiceover: string;
    emotion: string;
    audio_cues: string;
}

export interface VideoScript {
    title: string;
    hook: string;
    scenes: VideoSceneScript[];
    cta: string;
    caption: string;
    hashtags: string[];
}

export interface PublishingStrategy {
    bestTime: string;
    reasoning: string;
    algorithmTip: string;
    nextPostIdea: string;
}

export interface VideoTool {
    name: string;
    cost: string;
    farsiSupport: string;
    features: string;
    qualityRating: string;
}