

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
      projects: "Projects", 
      team: "Team",
      dashboard: "Dashboard",
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
            settings: "Settings"
        },
        posts: {
            all: "All",
            published: "Published",
            addNew: "Add New",
            search: "Search Posts",
            bulkActions: "Bulk Actions",
            apply: "Apply",
            filter: "Filter",
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
                view: "View"
            }
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
            { img: "https://images.unsplash.com/photo-1576091160550-2187d8002217?auto=format&fit=crop&w=800&q=80", title: "Health Systems Research", link: "#", description: "Conducted studies on the evolution, challenges, and future directions of healthcare systems, proposing policies to improve workforce capacity, financing, and infrastructure for equitable access.", tags: ["Health Policy", "Infrastructure", "Equity"]},
            { img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80", title: "COVID-19 Strategies", link: "#", description: "Analysed data and preventive measures from 44 countries to evaluate their effectiveness in reducing mortality rates.", tags: ["Epidemiology", "Data Analysis", "Global Health"]},
            { img: "https://images.unsplash.com/photo-1466617692045-3764f33b2728?auto=format&fit=crop&w=800&q=80", title: "Climate Change and Diseases", link: "#", description: "Researched the effects of climate change on disease patterns in vulnerable regions.", tags: ["Climate Change", "Environmental Health", "Research"]},
            { img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80", title: "Sexual & Reproductive Health", link: "#", description: "Investigated barriers to maternal healthcare, family planning, and protection from gender-based violence in temporary shelter settings for displaced populations.", tags: ["Women's Health", "Displacement", "Human Rights"]},
            { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", title: "Digital Governance & Sustainability", link: "#", description: "Exploring advancement of transparent governance frameworks and sustainable decision-making in health, environment, and policy through technology-driven solutions.", tags: ["Digital Health", "Governance", "Tech"]}
        ],
        achievementsTitle: "Our Impact",
        achievements: [
            { iconKey: 'publications', count: 200, suffix: '+', label: 'Media Programs Produced' },
            { iconKey: 'funded', count: 44, suffix: '', label: 'Countries Analyzed' },
            { iconKey: 'collaborations', count: 15, suffix: '+', label: 'Global Partners' },
            { iconKey: 'team', count: 12, suffix: '', label: 'Active Projects' },
            { iconKey: 'trained', count: 500, suffix: '+', label: 'Trained Professionals' }
        ],
        customersTitle: "Collaborations & Partners",
        customerLogos: [
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UN_emblem_blue.svg/200px-UN_emblem_blue.svg.png', alt: 'United Nations' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/WHO_logo.svg/200px-WHO_logo.svg.png', alt: 'World Health Organization' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bill_%26_Melinda_Gates_Foundation_logo.svg/200px-Bill_%26_Melinda_Gates_Foundation_logo.svg.png', alt: 'Gates Foundation' },
            { img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Karolinska_Institutet_seal.svg/150px-Karolinska_Institutet_seal.svg.png', alt: 'Karolinska Institutet' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/200px-Flag_of_the_Red_Cross.svg.png', alt: 'Red Cross' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Sida_Logo.svg/200px-Sida_Logo.svg.png', alt: 'Sida' },
        ],
        calendarTitle: "Latest Insights from the Field",
        latestPosts: [
            { img: "https://images.unsplash.com/photo-1581093458891-8f3086325744?auto=format&fit=crop&w=800&q=80", title: "The Role of AI in Predicting Outbreak Hotspots", date: "July 15, 2024", comments: 8, link: "#" },
            { img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", title: "Challenges in Last-Mile Medical Supply Chains", date: "June 28, 2024", comments: 12, link: "#" },
            { img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", title: "Ethical Considerations in Humanitarian Tech", date: "June 05, 2024", comments: 5, link: "#" },
            { img: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=800&q=80", title: "Case Study: A Mobile Health Clinic's Impact", date: "May 21, 2024", comments: 15, link: "#" },
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
    projectsPage: {
        title: "Our Portfolio of Work",
        subtitle: "A selection of our key projects demonstrating our commitment to science-driven humanitarian action across the globe."
    },
    teamPage: {
        title: "Meet Our Experts",
        subtitle: "A dedicated, multidisciplinary team of scientists, physicians, and specialists committed to global impact.",
        members: [
            { img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', name: 'Dr. Evelyn Reed', title: 'Founder & Lead Scientist', bio: 'A UN physician with 20+ years of field experience in epidemiology and infectious diseases. Expert in global health policy and crisis response.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80', name: 'Dr. Ben Carter', title: 'Director of Data Science', bio: 'Specializes in predictive modeling for disease outbreaks and optimizing public health interventions. Holds a PhD from Karolinska Institutet.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80', name: 'Amina El-Sayed', title: 'Head of Grant Management', bio: 'Expert in securing and managing large-scale grants from international bodies like the EU, WHO, and the Gates Foundation.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', name: 'Dr. Kenji Tanaka', title: 'Environmental Health Specialist', bio: 'Focuses on the intersection of climate change, water security, and public health. Leads our environmental science initiatives.', linkedin: '#' },
        ]
    },
    wasteToWealthPage: {
        title: "The Waste to Wealth Project",
        subtitle: "A revolutionary model turning community waste management into shared equity and sustainable prosperity.",
        introTitle: "Our Mission: Beyond Recycling",
        introText: "The 'Waste to Wealth' project is not just an environmental initiative; it's a socio-economic revolution. We're building a scalable, community-owned ecosystem where participation in waste management directly translates to ownership, rewards, and long-term value for every user.",
        modulesTitle: "Core Principles",
        modules: [
            {
                iconKey: 'community',
                title: "Community Share Model",
                text: "We believe in rewarding those who create value. 65-70% of the project's total equity is designated for our community of active users. Your participation isn't just a task; it's an investment in a shared future."
            },
            {
                iconKey: 'token',
                title: "Tokenization & Credibility",
                text: "We use a secure digital reward system, like points, that are overseen by trusted universities to make sure they have real value."
            },
            {
                iconKey: 'scalability',
                title: "Scalability & Global Credibility",
                text: "Our vision is global. Endorsed by XPRIZE, our strategy includes launching 100 pilot programs in Iran and securing funding from prestigious climate funds like COP28 / ALTÉRRA for widespread regional expansion."
            }
        ],
        ctaTitle: "Join the Movement",
        ctaText: "Become a part of the solution and earn your stake in a greener, more equitable future. Your actions today build the wealth of our community tomorrow.",
        ctaButton: "Learn More in Chat"
    },
    contentHub: {
        title: "AI Content Maker",
        subtitle: "Create trending social media posts, video scripts, and publishing strategies in seconds.",
        platformSelectorTitle: "1. Choose Platform",
        topicTitle: "2. Choose Topic",
        trendsTab: "Daily Trends",
        textTab: "Custom Text",
        searchTab: "Web Search",
        fetchingTrends: "Fetching latest trends...",
        customTextPlaceholder: "Paste your article, notes, or thoughts here...",
        selectSearchTopic: "Select a topic to search:",
        userSearchSuggestions: ["Humanitarian Crisis", "Climate Change Solutions", "Public Health Innovation", "Sustainable Development Goals"],
        generateButton: "Generate Content",
        generatingPost: "Generating...",
        resultsTitle: "3. Your Content",
        placeholder: "Select a platform and topic to generate content.",
        copyButton: "Copy Text",
        copySuccess: "Copied!",
        connectAccountToPublish: "Connect your account to publish directly (Coming Soon)",
        publishToPlatformButton: "Publish to {platform}",
        adaptForWebsiteButton: "Adapt for Website Blog",
        adaptingForWebsite: "Adapting...",
        websitePreviewTitle: "Website Blog Preview",
        publishToWebsiteButton: "Publish to Website",
        publishedSuccess: "Published to website!",
        getStrategyButton: "Get Publishing Strategy",
        fetchingStrategy: "Analyzing...",
        strategyTitle: "Publishing Strategy",
        bestTime: "Best Time to Post",
        nextPost: "Next Post Idea",
        generatingVideo: "Generating Video...",
        generateVideoButton: "Generate Video Script",
        findingTools: "Finding Tools...",
        findVideoTools: "Find AI Video Tools",
        toolName: "Tool",
        toolCost: "Cost",
        toolFarsi: "Farsi Support",
        toolFeatures: "Key Features",
        toolQuality: "Quality",
        timecode: "Time",
        visual: "Visual",
        voiceover: "Voiceover",
        emotion: "Emotion"
    },
     treePlanterPage: {
        title: "Tree Planter's Toolkit",
        subtitle: "AI-powered tools to help philanthropists plan, fund, and execute impactful reforestation projects worldwide.",
        fundingTitle: "Find Funding for Your Project",
        fundingDescriptionLabel: "Describe your reforestation project",
        fundingDescriptionPlaceholder: "e.g., A project to plant 10,000 mangrove trees on the coast of Bangladesh to prevent erosion and create a carbon sink...",
        fundingButton: "Find Reforestation Grants",
        analysisTitle: "Analyze a Planting Location",
        analysisLocationLabel: "Enter a specific location",
        analysisLocationPlaceholder: "e.g., Madaoua, Niger or 'Southern border of Sahara'",
        analysisButton: "Analyze Planting Potential",
        resultsTitle: "AI Analysis Results for",
        suitabilityTitle: "Planting Suitability & Vegetation Analysis",
        risksTitle: "Risk Assessment",
        speciesTitle: "Recommended Native Species",
        crowdfundingTitle: "Crowdfunding Campaign Pitch",
        crowdfundingButton: "Launch Campaign",
        copyPitch: "Copy Pitch",
        risks: {
            regulatory: "Regulatory & Environmental Law",
            climate: "Climate Change Impact",
            ecological: "Ecological Disturbance"
        }
    },
    reportTypes: {
        scientific_article: "Scientific Article",
        technical_report: "Technical Report",
        market_analysis: "Market Analysis",
        project_proposal: "Project Proposal",
        literature_review: "Literature Review"
    },
    blogTones: {
        professional: "Professional",
        casual: "Casual",
        academic: "Academic",
        engaging: "Engaging"
    },
    generatorForm: {
        title: "Document Assistant",
        docType: "Document Type",
        topic: "Topic / Title",
        topicPlaceholder: "e.g., Grant Proposal for Malaria Diagnostics",
        description: "Key Information & Outline",
        descriptionPlaceholder: "Provide the grant summary, project goals, key personnel, methodology, expected outcomes, budget overview, etc.",
        buttonText: "Generate Document",
        validationError: "Please fill in both topic and description.",
    },
    blogGenerator: {
        title: "AI Blog Post Generator",
        formTitle: "Create Your Blog Post",
        titleLabel: "Blog Title",
        titlePlaceholder: "e.g., The Future of AI in Humanitarian Aid",
        contentLabel: "Main Content / Outline",
        contentPlaceholder: "Provide key points, data, or a rough draft...",
        toneLabel: "Tone of Voice",
        buttonText: "Generate Post & Images",
        generatingText: "Generating Post...",
        validationError: "Please fill in both title and content."
    },
    reportDisplay: {
        title: "Generated Document",
        export: "Export",
        copy: "Copy Text",
        downloadMD: "Download (.md)",
        downloadDOCX: "Download (.docx)",
        downloadHTML: "Download (.html)",
        printPDF: "Print / Save as PDF",
        docTitle: "Generated Report",
        generating: "Generating...",
        placeholder1: "Your document will appear here.",
        placeholder2: "Fill out the form and click 'Generate' to begin."
    },
    grantFinder: {
        title: "Grant Opportunity Finder",
        searchPlaceholder: "Enter keywords (e.g., 'pediatric health Africa', 'vaccine logistics')",
        searchButton: "Find Grants",
        searching: "Searching...",
        from: "From",
        analyzeButton: "Analyze",
        error: "An error occurred while searching for grants.",
        noResults: "No grants found for these keywords. Try a broader search.",
        copyLink: "Copy Link",
        copied: "Copied!",
        viewOriginal: "View Original"
    },
    grantAnalyzer: {
        title: "AI Grant Analysis",
        close: "Close Analysis",
        loadingTitle: "Analyzing Grant...",
        loadingSubtitle: "Our AI is reviewing the grant details, requirements, and relevance to your profile.",
        viewOriginal: "View Original Grant Posting",
        relevance: "Relevance",
        deadline: "Deadline",
        amount: "Funding Amount",
        duration: "Project Duration",
        geography: "Geographic Focus",
        eligibility: "Eligibility",
        scope: "Scope & Objectives",
        howToApply: "Application Process",
        contact: "Contact Information",
        useForProposal: "Use this analysis to start a proposal",
        exportDOCX: "Export Analysis (.docx)",
        printPDF: "Print Analysis",
        export: {
            summaryTitle: "Grant Analysis Summary",
            officialLink: "Official Link",
            relevance: "Relevance Score",
            details: "Grant Details",
            fundingBody: "Funding Body",
            deadline: "Deadline",
            amount: "Amount",
            duration: "Duration",
            geography: "Geography",
            eligibility: "Eligibility",
            scope: "Scope",
            applicationProcess: "Application Process",
            contact: "Contact",
            fileName: "Grant_Analysis"
        }
    },
    videoGenerator: {
        title: "AI Video Generator",
        subtitle: "Create compelling videos for research showcases, project updates, or public awareness campaigns.",
        quotaExhaustedBanner: "Video generation quota may be limited. Some features might be unavailable.",
        errorTitle: "Error",
        step1Title: "1. Define Your Video Concept",
        videoType: "Video Purpose",
        typeGeneral: "General / Social Media",
        typeBooth: "Research / Conference",
        promptLabel: "What is the video about?",
        promptPlaceholder: "e.g., A hopeful video about our new mobile health clinic in rural Kenya, showing community impact.",
        boothPromptPlaceholder: "e.g., A technical showcase of our AI diagnostic tool, explaining the methodology and showing results.",
        negativePromptLabel: "Negative Prompt (Optional)",
        negativePromptPlaceholder: "e.g., blurry footage, text overlays, cartoons",
        imageLabel: "Inspirational Image (Optional)",
        uploadButton: "Upload an image",
        imagePrompt: "Guides the AI on visual style and mood.",
        removeImage: "Remove Image",
        addWatermark: "Add Civicavita Watermark",
        numberOfVersions: "Number of Video Versions",
        aspectRatio: "Aspect Ratio",
        durationLabel: "Approximate Video Duration",
        generateScriptButton: "Generate Script & Scenes",
        generatingScriptTitle: "Generating Script...",
        validationError: "Please provide a prompt or an image to start.",
        step2Title: "2. Review & Generate Scenes",
        progressSavedAutomatically: "Progress is saved automatically.",
        startOver: "Start Over",
        scene: "Scene",
        narration: "Narration",
        readNarration: "Read narration aloud",
        visuals: "Visuals Prompt",
        approveScene: "Approve",
        approved: "Approved",
        generateSceneVideo: "Generate Video",
        regenerateScene: "Regenerate Video",
        generateSceneImage: "Generate Image",
        regenerateSceneImage: "Regenerate Image",
        downloadVideo: "Download",
        promptRequiredError: "Visuals prompt cannot be empty.",
        quotaErrorImageFallback: "Video generation failed (Quota Exceeded). Try generating an alternative or a still image.",
        generateAlternativeVideo: "Generate Alternative Video",
        generateAnimatedScene: "Generate Animated Scene",
        askGoogleBaba: "Ask",
        askGoogleBabaFocus: "Focus your question (optional)",
        step3Title: "3. Add Music",
        musicPromptLabel: "Describe the music you want",
        generateMusicButton: "Generate Music Idea",
        generatingMusic: "Generating...",
        musicDescriptionTitle: "AI Music Suggestion",
        musicLibraryTitle: "Or Select from Library",
        select: "Select",
        selected: "Selected",
        step4Title: "4. Finalize",
        combineAndExport: "Combine & Export Video",
        approveAllToCombine: "Approve all {approvedCount}/{totalCount} scenes to enable export.",
        musicRequired: "Please select a music track to enable export.",
    },
    quotaErrorModal: {
        title: "API Quota Exceeded",
        body: "You have exceeded your current API quota. Please check your billing account or try again later. Some features may be unavailable.",
        cta: "Check Billing",
        close: "Close"
    },
    googleBabaModal: {
        title: "Insights from Google Baba",
        close: "Close",
        loading: "Searching the web for insights...",
        userFocus: "Your focus:",
        resultsTitle: "Analysis:",
        sourcesTitle: "Sources:",
    },
    chatbot: {
        welcome: "Hello! I am the AI Ambassador for the \"Waste to Wealth\" project. How can I help you today? You can ask me about our business model, rewards, or future plans.",
        placeholder: "Ask about the project...",
        suggestion1: "What is community ownership?",
        suggestion2: "How do rewards work?",
        suggestion3: "What are the future plans?"
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
      projects: "پروژه‌ها", 
      team: "تیم ما",
      dashboard: "داشبورد",
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
            settings: "تنظیمات"
        },
        posts: {
            all: "همه",
            published: "منتشر شده",
            addNew: "افزودن نوشته",
            search: "جستجوی نوشته‌ها",
            bulkActions: "کارهای دسته جمعی",
            apply: "اجرا",
            filter: "صافی",
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
                view: "نمایش"
            }
        }
    },
    hero: {
        title: "سیویکاویتا.<span class='text-orange-500'>آ</span><span class='text-emerald-500'>ب</span> <br/> <span class='text-white'>علوم سلامت جهانی و بشردوستانه</span>",
        subtitle: "سیویکاویتا (Civicavita) از کلمات لاتین 'Civic' (شهروند، جامعه) و 'Vita' (زندگی، رفاه) گرفته شده است. ما دانش علمی را با تأثیرات دنیای واقعی پیوند می‌دهیم تا سلامت عمومی، عدالت اجتماعی و پایداری محیط زیست را ارتقا دهیم.",
        button1: "کاوش در کار ما",
        button2: "تماس با ما",
        videoUrl: "https://storage.googleapis.com/civicavita-assets/hero-bg.mp4"
    },
    // ... (rest of Farsi translations omitted for brevity, but assume same structure)
    // IMPORTANT: In a real scenario, I would include the full structure to avoid breaking the file.
    // For this diff, I will include the full file content to be safe as requested.
    home: {
        introTitle: "مأموریت ما",
        introText: "در CIVICAVITA AB، ما تحقیقاتی در علوم اجتماعی و سلامت انجام می‌دهیم تا رفاه فردی و اجتماعی را ارتقا دهیم و در عین حال پایداری، مسئولیت اجتماعی و حقوق بشر را ترویج کنیم. از طریق تحقیقات مبتنی بر شواهد، محتوای آموزشی و مشارکت دیجیتال، ما با دانشگاه‌ها، سازمان‌های مردم‌نهاد و نهادهای عمومی همکاری می‌کنیم تا تصمیم‌گیری آگاهانه و تغییرات اجتماعی مثبت را پیش ببریم.",
        visionTitle: "چشم‌انداز",
        visionText: "CIVICAVITA AB آینده‌ای را متصور است که در آن تحقیقات معتبر، سیاست‌ها و ابتکاراتی را که زندگی را بهبود می‌بخشند و از محیط زیست محافظت می‌کنند، آگاه می‌سازد. با همکاری با سازمان‌های بین‌المللی، سازمان‌های مردم‌نهاد، مؤسسات دانشگاهی و شرکای خصوصی، هدف ما کمک به ایجاد جامعه‌ای عادلانه‌تر، پایدارتر و آگاه‌تر است.",
        servicesTitle: "خدمات اصلی ما",
        services: [
            { iconKey: 'science', title: 'تحقیقات بشردوستانه', text: 'انجام مطالعات علمی میدانی برای ایجاد راه‌حل‌های مبتنی بر شواهد برای بحران‌های سلامت و عدالت اجتماعی.', linkPage: 'generator' },
            { iconKey: 'grant', title: 'جذب گرنت و بودجه', text: 'تأمین و مدیریت بودجه برای پروژه‌های بشردوستانه و علمی با تأثیر بالا.', linkPage: 'grant' },
            { iconKey: 'education', title: 'آموزش و رسانه', text: 'توسعه کتاب‌های راهنما، دوره‌ها و برنامه‌های رسانه‌ای برای آموزش فعالان و عموم مردم.', linkPage: 'content-hub' },
            { iconKey: 'consulting', title: 'سیاست‌گذاری و مشاوره', text: 'مشارکت در کدهای اخلاقی و چارچوب‌های حاکمیتی برای مشارکت دموکراتیک.', linkPage: 'generator' }
        ],
        portfolioTitle: "پروژه‌های تحقیقاتی برجسته",
        portfolioItems: [
            { img: "https://images.unsplash.com/photo-1576091160550-2187d8002217?auto=format&fit=crop&w=800&q=80", title: "تحقیقات سیستم‌های سلامت", link: "#", description: "مطالعاتی در مورد تکامل، چالش‌ها و جهت‌گیری‌های آینده سیستم‌های مراقبت‌های بهداشتی انجام داد و سیاست‌هایی را برای بهبود ظرفیت نیروی کار، تأمین مالی و زیرساخت‌ها برای دسترسی عادلانه پیشنهاد کرد.", tags: ["سیاست سلامت", "زیرساخت", "عدالت"]},
            { img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80", title: "استراتژی‌های کووید-۱۹", link: "#", description: "تجزیه و تحلیل داده‌ها و اقدامات پیشگیرانه از ۴۴ کشور برای ارزیابی اثربخشی آنها در کاهش نرخ مرگ و میر.", tags: ["اپیدمیولوژی", "تحلیل داده", "سلامت جهانی"]},
            { img: "https://images.unsplash.com/photo-1466617692045-3764f33b2728?auto=format&fit=crop&w=800&q=80", title: "تغییرات اقلیمی و بیماری‌ها", link: "#", description: "تحقیق در مورد اثرات تغییرات اقلیمی بر الگوهای بیماری در مناطق آسیب‌پذیر.", tags: ["تغییر اقلیم", "سلامت محیط", "تحقیق"]},
            { img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80", title: "سلامت جنسی و باروری", link: "#", description: "بررسی موانع مراقبت‌های بهداشتی مادران، تنظیم خانواده و محافظت از خشونت‌های مبتنی بر جنسیت در پناهگاه‌های موقت برای جمعیت‌های آواره.", tags: ["سلامت زنان", "جابجایی", "حقوق بشر"]},
            { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", title: "حاکمیت دیجیتال و پایداری", link: "#", description: "بررسی پیشرفت چارچوب‌های حاکمیتی شفاف و تصمیم‌گیری پایدار در سلامت، محیط زیست و سیاست از طریق راه‌حل‌های مبتنی بر فناوری.", tags: ["سلامت دیجیتال", "حاکمیت", "فناوری"]}
        ],
        achievementsTitle: "تأثیر ما",
        achievements: [
            { iconKey: 'publications', count: 200, suffix: '+', label: 'برنامه رسانه‌ای تولید شده' },
            { iconKey: 'funded', count: 44, suffix: '', label: 'کشور تحلیل شده' },
            { iconKey: 'collaborations', count: 15, suffix: '+', label: 'شریک جهانی' },
            { iconKey: 'team', count: 12, suffix: '', label: 'پروژه فعال' },
            { iconKey: 'trained', count: 500, suffix: '+', label: 'متخصص آموزش دیده' }
        ],
        customersTitle: "همکاران و شرکا",
        customerLogos: [
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UN_emblem_blue.svg/200px-UN_emblem_blue.svg.png', alt: 'United Nations' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/WHO_logo.svg/200px-WHO_logo.svg.png', alt: 'World Health Organization' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bill_%26_Melinda_Gates_Foundation_logo.svg/200px-Bill_%26_Melinda_Gates_Foundation_logo.svg.png', alt: 'Gates Foundation' },
            { img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Karolinska_Institutet_seal.svg/150px-Karolinska_Institutet_seal.svg.png', alt: 'Karolinska Institutet' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/200px-Flag_of_the_Red_Cross.svg.png', alt: 'Red Cross' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Sida_Logo.svg/200px-Sida_Logo.svg.png', alt: 'Sida' },
        ],
        calendarTitle: "آخرین بینش‌ها از میدان",
        latestPosts: [
            { img: "https://images.unsplash.com/photo-1581093458891-8f3086325744?auto=format&fit=crop&w=800&q=80", title: "نقش هوش مصنوعی در پیش‌بینی کانون‌های شیوع", date: "۲۵ تیر ۱۴۰۳", comments: 8, link: "#" },
            { img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", title: "چالش‌های زنجیره تأمین پزشکی در آخرین مایل", date: "۸ تیر ۱۴۰۳", comments: 12, link: "#" },
            { img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", title: "ملاحظات اخلاقی در فناوری‌های بشردوستانه", date: "۱۶ خرداد ۱۴۰۳", comments: 5, link: "#" },
            { img: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=800&q=80", title: "مطالعه موردی: تأثیر یک کلینیک سلامت سیار", date: "۱ خرداد ۱۴۰۳", comments: 15, link: "#" },
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
    projectsPage: {
        title: "نمونه کارهای ما",
        subtitle: "گزیده‌ای از پروژه‌های کلیدی ما که تعهد ما به اقدامات بشردوستانه مبتنی بر علم را در سراسر جهان نشان می‌دهد."
    },
    teamPage: {
        title: "ملاقات با متخصصان ما",
        subtitle: "تیمی متعهد و چند رشته‌ای از دانشمندان، پزشکان و متخصصان که به تأثیرگذاری جهانی متعهد هستند.",
        members: [
            { img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', name: 'دکتر اولین رید', title: 'بنیان‌گذار و دانشمند ارشد', bio: 'پزشک سازمان ملل با بیش از ۲۰ سال تجربه میدانی در اپیدمیولوژی و بیماری‌های عفونی. متخصص در سیاست‌های بهداشت جهانی و پاسخ به بحران.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80', name: 'دکتر بن کارتر', title: 'مدیر علوم داده', bio: 'متخصص در مدل‌سازی پیش‌بینی‌کننده برای شیوع بیماری‌ها و بهینه‌سازی مداخلات بهداشت عمومی. دارای مدرک دکترا از موسسه کارولینسکا.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80', name: 'آمنه السید', title: 'رئیس مدیریت گرنت', bio: 'متخصص در تأمین و مدیریت گرنت‌های بزرگ از نهادهای بین‌المللی مانند اتحادیه اروپا، سازمان بهداشت جهانی و بنیاد گیتس.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', name: 'دکتر کنجی تاناکا', title: 'متخصص بهداشت محیط', bio: 'تمرکز بر تقاطع تغییرات اقلیمی، امنیت آب و بهداشت عمومی. رهبری ابتکارات علوم محیطی ما را بر عهده دارد.', linkedin: '#' },
        ]
    },
    wasteToWealthPage: {
        title: "پروژه پسماند به ثروت",
        subtitle: "مدلی انقلابی که مدیریت پسماند جامعه را به سرمایه مشترک و رفاه پایدار تبدیل می‌کند.",
        introTitle: "مأموریت ما: فراتر از بازیافت",
        introText: "پروژه 'پسماند به ثروت' فقط یک ابتکار زیست‌محیطی نیست؛ بلکه یک انقلاب اجتماعی-اقتصادی است. ما در حال ساخت یک اکوسیستم مقیاس‌پذیر و متعلق به جامعه هستیم که در آن مشارکت در مدیریت پسماند مستقیماً به مالکیت، پاداش و ارزش بلندمدت برای هر کاربر تبدیل می‌شود.",
        modulesTitle: "اصول اصلی",
        modules: [
            {
                iconKey: 'community',
                title: "مدل سهام جامعه",
                text: "ما به پاداش دادن به کسانی که ارزش خلق می‌کنند، معتقدیم. ۶۵-۷۰٪ از کل سهام پروژه برای جامعه کاربران فعال ما تعیین شده است. مشارکت شما فقط یک وظیفه نیست؛ بلکه سرمایه‌گذاری در آینده‌ای مشترک است."
            },
            {
                iconKey: 'token',
                title: "توکنیزاسیون و اعتبار",
                text: "ما از یک سیستم پاداش دیجیتال امن، مانند امتیاز، استفاده می‌کنیم که توسط دانشگاه‌های معتبر نظارت می‌شود تا اطمینان حاصل شود که ارزش واقعی دارند."
            },
            {
                iconKey: 'scalability',
                title: "مقیاس‌پذیری و اعتبار جهانی",
                text: "چشم‌انداز ما جهانی است. استراتژی ما که توسط XPRIZE تأیید شده، شامل راه‌اندازی ۱۰۰ برنامه پایلوت در ایران و تأمین بودجه از صندوق‌های معتبر اقلیمی مانند COP28 / ALTÉRRA برای گسترش منطقه‌ای گسترده است."
            }
        ],
        ctaTitle: "به جنبش بپیوندید",
        ctaText: "بخشی از راه‌حل باشید و سهم خود را در آینده‌ای سبزتر و عادلانه‌تر به دست آورید. اقدامات امروز شما ثروت فردای جامعه ما را می‌سازد.",
        ctaButton: "اطلاعات بیشتر در چت"
    },
    contentHub: {
        title: "تولید محتوا با هوش مصنوعی",
        subtitle: "ایجاد پست‌های پرطرفدار شبکه‌های اجتماعی، فیلمنامه‌های ویدیویی و استراتژی‌های انتشار در چند ثانیه.",
        platformSelectorTitle: "۱. انتخاب پلتفرم",
        topicTitle: "۲. انتخاب موضوع",
        trendsTab: "روندهای روزانه",
        textTab: "متن دلخواه",
        searchTab: "جستجوی وب",
        fetchingTrends: "در حال دریافت آخرین روندها...",
        customTextPlaceholder: "مقاله، یادداشت یا افکار خود را اینجا وارد کنید...",
        selectSearchTopic: "یک موضوع برای جستجو انتخاب کنید:",
        userSearchSuggestions: ["بحران بشردوستانه", "راه‌حل‌های تغییر اقلیم", "نوآوری در بهداشت عمومی", "اهداف توسعه پایدار"],
        generateButton: "تولید محتوا",
        generatingPost: "در حال تولید...",
        resultsTitle: "۳. محتوای شما",
        placeholder: "یک پلتفرم و موضوع را برای تولید محتوا انتخاب کنید.",
        copyButton: "کپی متن",
        copySuccess: "کپی شد!",
        connectAccountToPublish: "اتصال حساب برای انتشار مستقیم (به زودی)",
        publishToPlatformButton: "انتشار در {platform}",
        adaptForWebsiteButton: "تبدیل به پست وبلاگ",
        adaptingForWebsite: "در حال تبدیل...",
        websitePreviewTitle: "پیش‌نمایش وبلاگ سایت",
        publishToWebsiteButton: "انتشار در سایت",
        publishedSuccess: "در سایت منتشر شد!",
        getStrategyButton: "دریافت استراتژی انتشار",
        fetchingStrategy: "در حال تحلیل...",
        strategyTitle: "استراتژی انتشار",
        bestTime: "بهترین زمان پست",
        nextPost: "ایده پست بعدی",
        generatingVideo: "در حال ساخت ویدیو...",
        generateVideoButton: "تولید فیلمنامه ویدیویی",
        findingTools: "یافتن ابزارها...",
        findVideoTools: "یافتن ابزارهای هوش مصنوعی ویدیو",
        toolName: "ابزار",
        toolCost: "هزینه",
        toolFarsi: "پشتیبانی فارسی",
        toolFeatures: "ویژگی‌های کلیدی",
        toolQuality: "کیفیت",
        timecode: "زمان",
        visual: "تصویر",
        voiceover: "صداگذاری",
        emotion: "احساس"
    },
    treePlanterPage: {
        title: "جعبه ابزار درخت‌کار",
        subtitle: "ابزارهای مجهز به هوش مصنوعی برای کمک به خیرین در برنامه‌ریزی، تأمین مالی و اجرای پروژه‌های احیای جنگل تأثیرگذار در سراسر جهان.",
        fundingTitle: "یافتن بودجه برای پروژه",
        fundingDescriptionLabel: "پروژه احیای جنگل خود را توصیف کنید",
        fundingDescriptionPlaceholder: "مثلاً: پروژه‌ای برای کاشت ۱۰,۰۰۰ درخت حرا در سواحل بنگلادش برای جلوگیری از فرسایش و ایجاد مخزن کربن...",
        fundingButton: "یافتن گرنت‌های احیای جنگل",
        analysisTitle: "تحلیل مکان کاشت",
        analysisLocationLabel: "یک مکان خاص را وارد کنید",
        analysisLocationPlaceholder: "مثلاً: مادائوآ، نیجر یا 'مرز جنوبی صحرا'",
        analysisButton: "تحلیل پتانسیل کاشت",
        resultsTitle: "نتایج تحلیل هوش مصنوعی برای",
        suitabilityTitle: "تناسب کاشت و تحلیل پوشش گیاهی",
        risksTitle: "ارزیابی ریسک",
        speciesTitle: "گونه‌های بومی پیشنهادی",
        crowdfundingTitle: "متن کمپین سرمایه‌گذاری جمعی",
        crowdfundingButton: "راه‌اندازی کمپین",
        copyPitch: "کپی متن",
        risks: {
            regulatory: "قوانین زیست‌محیطی و مقرراتی",
            climate: "تأثیر تغییرات اقلیمی",
            ecological: "اختلال اکولوژیکی"
        }
    },
    reportTypes: {
        scientific_article: "مقاله علمی",
        technical_report: "گزارش فنی",
        market_analysis: "تحلیل بازار",
        project_proposal: "پروپوزال پروژه",
        literature_review: "مرور ادبیات"
    },
    blogTones: {
        professional: "حرفه‌ای",
        casual: "غیررسمی",
        academic: "آکادمیک",
        engaging: "جذاب"
    },
    generatorForm: {
        title: "دستیار اسناد",
        docType: "نوع سند",
        topic: "موضوع / عنوان",
        topicPlaceholder: "مثلاً: پروپوزال گرنت برای تشخیص مالاریا",
        description: "اطلاعات کلیدی و طرح کلی",
        descriptionPlaceholder: "خلاصه گرنت، اهداف پروژه، پرسنل کلیدی، روش‌شناسی، نتایج مورد انتظار، نمای کلی بودجه و غیره را ارائه دهید.",
        buttonText: "تولید سند",
        validationError: "لطفاً هر دو فیلد موضوع و توضیحات را پر کنید.",
    },
    blogGenerator: {
        title: "تولیدکننده پست وبلاگ با هوش مصنوعی",
        formTitle: "پست وبلاگ خود را بسازید",
        titleLabel: "عنوان وبلاگ",
        titlePlaceholder: "مثلاً: آینده هوش مصنوعی در کمک‌های بشردوستانه",
        contentLabel: "محتوای اصلی / طرح کلی",
        contentPlaceholder: "نکات کلیدی، داده‌ها یا پیش‌نویس اولیه را ارائه دهید...",
        toneLabel: "لحن صدا",
        buttonText: "تولید پست و تصاویر",
        generatingText: "در حال تولید پست...",
        validationError: "لطفاً هر دو فیلد عنوان و محتوا را پر کنید."
    },
    reportDisplay: {
        title: "سند تولید شده",
        export: "خروجی",
        copy: "کپی متن",
        downloadMD: "دانلود (.md)",
        downloadDOCX: "دانلود (.docx)",
        downloadHTML: "دانلود (.html)",
        printPDF: "چاپ / ذخیره به عنوان PDF",
        docTitle: "گزارش تولید شده",
        generating: "در حال تولید...",
        placeholder1: "سند شما در اینجا ظاهر می‌شود.",
        placeholder2: "فرم را پر کنید و برای شروع روی 'تولید' کلیک کنید."
    },
    grantFinder: {
        title: "یابنده فرصت‌های گرنت",
        searchPlaceholder: "کلمات کلیدی را وارد کنید (مثلاً: 'بهداشت کودکان آفریقا'، 'لجستیک واکسن')",
        searchButton: "یافتن گرنت‌ها",
        searching: "در حال جستجو...",
        from: "از طرف",
        analyzeButton: "تحلیل",
        error: "خطایی در هنگام جستجوی گرنت‌ها رخ داد.",
        noResults: "گرنتی برای این کلمات کلیدی یافت نشد. جستجوی وسیع‌تری را امتحان کنید.",
        copyLink: "کپی لینک",
        copied: "کپی شد!",
        viewOriginal: "مشاهده اصلی"
    },
    grantAnalyzer: {
        title: "تحلیل گرنت با هوش مصنوعی",
        close: "بستن تحلیل",
        loadingTitle: "در حال تحلیل گرنت...",
        loadingSubtitle: "هوش مصنوعی ما در حال بررسی جزئیات گرنت، الزامات و ارتباط آن با پروفایل شماست.",
        viewOriginal: "مشاهده پست اصلی گرنت",
        relevance: "ارتباط",
        deadline: "مهلت",
        amount: "مبلغ تأمین مالی",
        duration: "مدت پروژه",
        geography: "تمرکز جغرافیایی",
        eligibility: "واجدین شرایط",
        scope: "دامنه و اهداف",
        howToApply: "فرایند درخواست",
        contact: "اطلاعات تماس",
        useForProposal: "استفاده از این تحلیل برای شروع پروپوزال",
        exportDOCX: "خروجی تحلیل (.docx)",
        printPDF: "چاپ تحلیل",
        export: {
            summaryTitle: "خلاصه تحلیل گرنت",
            officialLink: "لینک رسمی",
            relevance: "امتیاز ارتباط",
            details: "جزئیات گرنت",
            fundingBody: "نهاد تأمین مالی",
            deadline: "مهلت",
            amount: "مبلغ",
            duration: "مدت",
            geography: "جغرافیا",
            eligibility: "واجدین شرایط",
            scope: "دامنه",
            applicationProcess: "فرایند درخواست",
            contact: "تماس",
            fileName: "تحلیل_گرنت"
        }
    },
    videoGenerator: {
        title: "تولیدکننده ویدیو با هوش مصنوعی",
        subtitle: "ایجاد ویدیوهای جذاب برای نمایش تحقیقات، به‌روزرسانی پروژه‌ها یا کمپین‌های آگاهی عمومی.",
        quotaExhaustedBanner: "سهمیه تولید ویدیو ممکن است محدود باشد. برخی از ویژگی‌ها ممکن است در دسترس نباشند.",
        errorTitle: "خطا",
        step1Title: "۱. مفهوم ویدیوی خود را تعریف کنید",
        videoType: "هدف ویدیو",
        typeGeneral: "عمومی / شبکه‌های اجتماعی",
        typeBooth: "تحقیق / کنفرانس",
        promptLabel: "ویدیو درباره چیست؟",
        promptPlaceholder: "مثلاً: ویدیویی امیدوارکننده درباره کلینیک سلامت سیار جدید ما در روستاهای کنیا که تأثیر جامعه را نشان می‌دهد.",
        boothPromptPlaceholder: "مثلاً: نمایش فنی ابزار تشخیص هوش مصنوعی ما، توضیح روش‌شناسی و نمایش نتایج.",
        negativePromptLabel: "پرامپت منفی (اختیاری)",
        negativePromptPlaceholder: "مثلاً: فیلم تار، متن روی تصویر، کارتون",
        imageLabel: "تصویر الهام‌بخش (اختیاری)",
        uploadButton: "آپلود تصویر",
        imagePrompt: "هوش مصنوعی را در مورد سبک بصری و حال و هوا راهنمایی می‌کند.",
        removeImage: "حذف تصویر",
        addWatermark: "افزودن واترمارک Civicavita",
        numberOfVersions: "تعداد نسخه‌های ویدیو",
        aspectRatio: "نسبت ابعاد",
        durationLabel: "مدت زمان تقریبی ویدیو",
        generateScriptButton: "تولید فیلمنامه و صحنه‌ها",
        generatingScriptTitle: "در حال تولید فیلمنامه...",
        validationError: "لطفاً برای شروع یک پرامپت یا تصویر ارائه دهید.",
        step2Title: "۲. بررسی و تولید صحنه‌ها",
        progressSavedAutomatically: "پیشرفت به صورت خودکار ذخیره می‌شود.",
        startOver: "شروع مجدد",
        scene: "صحنه",
        narration: "نریشن",
        readNarration: "خواندن نریشن با صدای بلند",
        visuals: "پرامپت تصویری",
        approveScene: "تأیید",
        approved: "تأیید شد",
        generateSceneVideo: "تولید ویدیو",
        regenerateScene: "تولید مجدد ویدیو",
        generateSceneImage: "تولید تصویر",
        regenerateSceneImage: "تولید مجدد تصویر",
        downloadVideo: "دانلود",
        promptRequiredError: "پرامپت تصویری نمی‌تواند خالی باشد.",
        quotaErrorImageFallback: "تولید ویدیو ناموفق بود (سهمیه تمام شده). سعی کنید یک جایگزین یا تصویر ثابت تولید کنید.",
        generateAlternativeVideo: "تولید ویدیوی جایگزین",
        generateAnimatedScene: "تولید صحنه متحرک",
        askGoogleBaba: "بپرس",
        askGoogleBabaFocus: "سوال خود را متمرکز کنید (اختیاری)",
        step3Title: "۳. افزودن موسیقی",
        musicPromptLabel: "موسیقی مورد نظر خود را توصیف کنید",
        generateMusicButton: "تولید ایده موسیقی",
        generatingMusic: "در حال تولید...",
        musicDescriptionTitle: "پیشنهاد موسیقی هوش مصنوعی",
        musicLibraryTitle: "یا از کتابخانه انتخاب کنید",
        select: "انتخاب",
        selected: "انتخاب شد",
        step4Title: "۴. نهایی‌سازی",
        combineAndExport: "ترکیب و خروجی ویدیو",
        approveAllToCombine: "همه {approvedCount}/{totalCount} صحنه را تأیید کنید تا خروجی فعال شود.",
        musicRequired: "لطفاً یک موسیقی انتخاب کنید تا خروجی فعال شود.",
    },
    quotaErrorModal: {
        title: "سهمیه API تمام شد",
        body: "شما از سهمیه فعلی API خود فراتر رفته‌اید. لطفاً حساب صورتحساب خود را بررسی کنید یا بعداً دوباره تلاش کنید. برخی از ویژگی‌ها ممکن است در دسترس نباشند.",
        cta: "بررسی صورتحساب",
        close: "بستن"
    },
    googleBabaModal: {
        title: "بینش‌های گوگل بابا",
        close: "بستن",
        loading: "جستجوی وب برای بینش‌ها...",
        userFocus: "تمرکز شما:",
        resultsTitle: "تحلیل:",
        sourcesTitle: "منابع:",
    },
    chatbot: {
        welcome: "سلام! من سفیر هوش مصنوعی پروژه \"پسماند به ثروت\" هستم. امروز چطور می‌توانم به شما کمک کنم؟ می‌توانید درباره مدل کسب‌وکار، پاداش‌ها یا برنامه‌های آینده از من بپرسید.",
        placeholder: "درباره پروژه بپرسید...",
        suggestion1: "مالکیت جامعه چیست؟",
        suggestion2: "پاداش‌ها چگونه کار می‌کنند؟",
        suggestion3: "برنامه‌های آینده چیست؟"
    }
  },
   ar: {
    langCode: 'ar-SA',
    langName: 'Arabic',
    nav: { 
      home: "الرئيسية", 
      about: "معلومات عنا",
      contact: "اتصل بنا",
      reportGenerator: "مساعد المستندات", 
      grantFinder: "باحث المنح", 
      videoGenerator: "صانع الفيديو", 
      blogGenerator: "مولد المدونات",
      contentHub: "صانع المحتوى",
      wasteToWealth: "من النفايات إلى الثروة",
      treePlanter: "زارع الأشجار",
      projects: "المشاريع", 
      team: "الفريق", 
      dashboard: "لوحة القيادة",
    },
    dashboard: {
        menu: {
            dashboard: "لوحة القيادة",
            posts: "المقالات",
            media: "الوسائط",
            pages: "الصفحات",
            comments: "التعليقات",
            appearance: "المظهر",
            plugins: "الإضافات",
            users: "الأعضاء",
            tools: "الأدوات",
            settings: "الإعدادات"
        },
        posts: {
            all: "الكل",
            published: "منشور",
            addNew: "أضف جديداً",
            search: "بحث في المقالات",
            bulkActions: "تحرير جماعي",
            apply: "تطبيق",
            filter: "تصفية",
            table: {
                title: "العنوان",
                author: "الكاتب",
                categories: "التصنيفات",
                tags: "الوسوم",
                date: "التاريخ"
            },
            actions: {
                edit: "تحرير",
                quickEdit: "تحرير سريع",
                trash: "سلة المهملات",
                view: "عرض"
            }
        }
    },
    hero: {
        title: "سيفيكافيتا.<span class='text-orange-500'>أ</span><span class='text-emerald-500'>ب</span> <br/> <span class='text-white'>الصحة العالمية والعلوم الإنسانية</span>",
        subtitle: "تستمد CIVICAVITA اسمها من الكلمات اللاتينية 'Civic' (مواطن، مجتمع، حياة عامة) و 'Vita' (حياة، رفاهية، استدامة). نحن نربط المعرفة العلمية بالتأثير الواقعي، لتعزيز الصحة العامة، والعدالة الاجتماعية، والاستدامة البيئية.",
        button1: "استكشف أعمالنا",
        button2: "اتصل بنا",
        videoUrl: "https://storage.googleapis.com/civicavita-assets/hero-bg.mp4"
    },
    // ... rest of Arabic
    home: {
        introTitle: "مهمتنا",
        introText: "في CIVICAVITA AB، نجري أبحاثًا في العلوم الاجتماعية والصحية لتعزيز رفاهية الأفراد والمجتمع مع تعزيز الاستدامة والمسؤولية الاجتماعية وحقوق الإنسان. من خلال الأبحاث القائمة على الأدلة والمحتوى التعليمي والمشاركة الرقمية، نتعاون مع الأوساط الأكاديمية والمنظمات غير الحكومية والمؤسسات العامة لدفع عملية صنع القرار المستنيرة والتغيير الاجتماعي الإيجابي.",
        visionTitle: "الرؤية",
        visionText: "تتخيل CIVICAVITA AB مستقبلاً تُعلم فيه الأبحاث الموثوقة السياسات والمبادرات التي تحسن الحياة وتحمي البيئة. من خلال التعاون مع المنظمات الدولية والمنظمات غير الحكومية والمؤسسات الأكاديمية والشركاء من القطاع الخاص، نهدف إلى المساهمة في مجتمع أكثر عدلاً واستدامة واستنارة.",
        servicesTitle: "خدماتنا الأساسية",
        services: [
            { iconKey: 'science', title: 'البحوث الإنسانية', text: 'إجراء دراسات علمية ميدانية لإنشاء حلول قائمة على الأدلة للأزمات الصحية والعدالة الاجتماعية.', linkPage: 'generator' },
            { iconKey: 'grant', title: 'الحصول على المنح', text: 'تأمين وإدارة التمويل للمشاريع الإنسانية والعلمية ذات التأثير العالي.', linkPage: 'grant' },
            { iconKey: 'education', title: 'التعليم والإعلام', text: 'تطوير كتيبات ودورات وبرامج إعلامية لتثقيف النشطاء والجمهور.', linkPage: 'content-hub' },
            { iconKey: 'consulting', title: 'السياسات والاستشارات', text: 'المساهمة في المواثيق الأخلاقية وأطر الحوكمة للمشاركة الديمقراطية.', linkPage: 'generator' }
        ],
        portfolioTitle: "مشاريع بحثية مميزة",
        portfolioItems: [
            { img: "https://images.unsplash.com/photo-1576091160550-2187d8002217?auto=format&fit=crop&w=800&q=80", title: "أبحاث النظم الصحية", link: "#", description: "أجريت دراسات حول تطور وتحديات واتجاهات أنظمة الرعاية الصحية المستقبلية، واقترحت سياسات لتحسين قدرة القوى العاملة والتمويل والبنية التحتية للوصول العادل.", tags: ["السياسة الصحية", "البنية التحتية", "الإنصاف"]},
            { img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80", title: "استراتيجيات كوفيد-19", link: "#", description: "تحليل البيانات والتدابير الوقائية من 44 دولة لتقييم فعاليتها في تقليل معدلات الوفيات.", tags: ["علم الأوبئة", "تحليل البيانات", "الصحة العالمية"]},
            { img: "https://images.unsplash.com/photo-1466617692045-3764f33b2728?auto=format&fit=crop&w=800&q=80", title: "تغير المناخ والأمراض", link: "#", description: "بحث في آثار تغير المناخ على أنماط الأمراض في المناطق الضعيفة.", tags: ["تغير المناخ", "الصحة البيئية", "بحث"]},
            { img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80", title: "الصحة الجنسية والإنجابية", link: "#", description: "التحقيق في الحواجز التي تحول دون رعاية صحة الأم وتنظيم الأسرة والحماية من العنف القائم على النوع الاجتماعي في أماكن الإيواء المؤقتة للسكان النازحين.", tags: ["صحة المرأة", "النزوح", "حقوق الإنسان"]},
            { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", title: "الحوكمة الرقمية والاستدامة", link: "#", description: "استكشاف تقدم أطر الحوكمة الشفافة وصنع القرار المستدام في الصحة والبيئة والسياسة من خلال الحلول القائمة على التكنولوجيا.", tags: ["الصحة الرقمية", "الحوكمة", "التكنولوجيا"]}
        ],
        achievementsTitle: "تأثيرنا",
        achievements: [
            { iconKey: 'publications', count: 200, suffix: '+', label: 'برنامج إعلامي تم إنتاجه' },
            { iconKey: 'funded', count: 44, suffix: '', label: 'دولة تم تحليلها' },
            { iconKey: 'collaborations', count: 15, suffix: '+', label: 'شريك عالمي' },
            { iconKey: 'team', count: 12, suffix: '', label: 'مشروع نشط' },
            { iconKey: 'trained', count: 500, suffix: '+', label: 'مهني تم تدريبه' }
        ],
        customersTitle: "التعاون والشركاء",
        customerLogos: [
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UN_emblem_blue.svg/200px-UN_emblem_blue.svg.png', alt: 'United Nations' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/WHO_logo.svg/200px-WHO_logo.svg.png', alt: 'World Health Organization' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bill_%26_Melinda_Gates_Foundation_logo.svg/200px-Bill_%26_Melinda_Gates_Foundation_logo.svg.png', alt: 'Gates Foundation' },
            { img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Karolinska_Institutet_seal.svg/150px-Karolinska_Institutet_seal.svg.png', alt: 'Karolinska Institutet' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/200px-Flag_of_the_Red_Cross.svg.png', alt: 'Red Cross' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Sida_Logo.svg/200px-Sida_Logo.svg.png', alt: 'Sida' },
        ],
        calendarTitle: "أحدث الرؤى من الميدان",
        latestPosts: [
            { img: "https://images.unsplash.com/photo-1581093458891-8f3086325744?auto=format&fit=crop&w=800&q=80", title: "دور الذكاء الاصطناعي في التنبؤ ببؤر تفشي الأمراض", date: "١٥ يوليو ٢٠٢٤", comments: 8, link: "#" },
            { img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", title: "التحديات في سلاسل التوريد الطبية للميل الأخير", date: "٢٨ يونيو ٢٠٢٤", comments: 12, link: "#" },
            { img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", title: "اعتبارات أخلاقية في التكنولوجيا الإنسانية", date: "٥ يونيو ٢٠٢٤", comments: 5, link: "#" },
            { img: "https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=800&q=80", title: "دراسة حالة: تأثير عيادة صحية متنقلة", date: "٢١ مايو ٢٠٢٤", comments: 15, link: "#" },
        ]
    },
    footer: {
      description: "CIVICAVITA AB: ربط المعرفة العلمية بالتأثير الواقعي لتعزيز الصحة العامة والعدالة الاجتماعية والاستدامة البيئية.",
      contactTitle: "ابق على تواصل",
      email: "smotallebi@civicavita.org",
      phone: "+46 739751973",
      address: "Lantmannagatan 6 C, Apartment 1202, 214 44 Malmö",
      socialMediaTitle: "تابع مهمتنا",
      instagram: "إنستغرام",
      linkedin: "لينكد إن",
      facebook: "فيسبوك",
      whatsapp: "واتساب",
      telegram: "تيليجرام",
      quickLinksTitle: "روابط سريعة",
      quickLinks: [
        { text: "معلومات عنا", link: "#about" },
        { text: "خدماتنا", link: "#services" },
        { text: "معرض المشاريع", link: "#portfolio" },
        { text: "وظائف", link: "#" },
        { text: "سياسة الخصوصية", link: "#" },
      ],
      addressTitle: "موقعنا",
      copyright: "© ٢٠٢٤ Civicavita AB. جميع الحقوق محفوظة. من أجل عالم أفضل.",
    },
    projectsPage: {
        title: "معرض أعمالنا",
        subtitle: "مجموعة مختارة من مشاريعنا الرئيسية التي تظهر التزامنا بالعمل الإنساني القائم على العلم في جميع أنحاء العالم."
    },
    teamPage: {
        title: "قابل خبراءنا",
        subtitle: "فريق متخصص ومتعدد التخصصات من العلماء والأطباء والمتخصصين الملتزمين بالتأثير العالمي.",
        members: [
            { img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', name: 'د. إيفلين ريد', title: 'المؤسس والعالم الرئيسي', bio: 'طبيبة في الأمم المتحدة تتمتع بخبرة ميدانية تزيد عن 20 عامًا في علم الأوبئة والأمراض المعدية. خبيرة في سياسة الصحة العالمية والاستجابة للأزمات.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80', name: 'د. بن كارتر', title: 'مدیر علوم البيانات', bio: 'متخصص في النمذجة التنبؤية لتفشي الأمراض وتحسين تدخلات الصحة العامة. حاصل على دكتوراه من معهد كارولينسكا.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80', name: 'أمينة السيد', title: 'رئيس إدارة المنح', bio: 'خبيرة في تأمين وإدارة المنح الكبيرة من الهيئات الدولية مثل الاتحاد الأوروبي ومنظمة الصحة العالمية ومؤسسة جيتس.', linkedin: '#' },
            { img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', name: 'د. كينجي تاناكا', title: 'أخصائي الصحة البيئية', bio: 'يركز على تقاطع تغير المناخ والأمن المائي والصحة العامة. يقود مبادراتنا في العلوم البيئية.', linkedin: '#' },
        ]
    },
    wasteToWealthPage: {
        title: "مشروع من النفايات إلى الثروة",
        subtitle: "نموذج ثوري يحول إدارة نفايات المجتمع إلى أسهم مشتركة وازدهار مستدام.",
        introTitle: "مهمتنا: ما بعد إعادة التدوير",
        introText: "مشروع 'من النفايات إلى الثروة' ليس مجرد مبادرة بيئية؛ إنه ثورة اجتماعية واقتصادية. نحن نبني نظامًا بيئيًا قابلاً للتطوير ومملوكًا للمجتمع حيث تترجم المشاركة في إدارة النفايات مباشرة إلى ملكية ومكافآت وقيمة طويلة الأجل لكل مستخدم.",
        modulesTitle: "المبادئ الأساسية",
        modules: [
            {
                iconKey: 'community',
                title: "نموذج حصة المجتمع",
                text: "نحن نؤمن بمكافأة أولئك الذين يخلقون القيمة. تم تخصيص 65-70٪ من إجمالي حقوق ملكية المشروع لمجتمع المستخدمين النشطين لدينا. مشاركتك ليست مجرد مهمة؛ إنها استثمار في مستقبل مشترك."
            },
            {
                iconKey: 'token',
                title: "الترميز والمصداقية",
                text: "نحن نستخدم نظام مكافآت رقمي آمن، مثل النقاط، تشرف عليه جامعات موثوقة للتأكد من أن لها قيمة حقيقية."
            },
            {
                iconKey: 'scalability',
                title: "قابلية التوسع والمصداقية العالمية",
                text: "رؤيتنا عالمية. تشمل استراتيجيتنا، المعتمدة من قبل XPRIZE، إطلاق 100 برنامج تجريبي في إيران وتأمين التمويل من صناديق المناخ المرموقة مثل COP28 / ALTÉRRA للتوسع الإقليمي الواسع."
            }
        ],
        ctaTitle: "انضم إلى الحركة",
        ctaText: "كن جزءًا من الحل واكسب حصتك في مستقبل أكثر خضرة وعدلاً. أفعالك اليوم تبني ثروة مجتمعنا غدًا.",
        ctaButton: "تعرف على المزيد في الدردشة"
    },
    contentHub: {
        title: "صانع المحتوى بالذكاء الاصطناعي",
        subtitle: "أنشئ منشورات رائجة على وسائل التواصل الاجتماعي، ونصوص فيديو، واستراتيجيات نشر في ثوانٍ.",
        platformSelectorTitle: "١. اختر المنصة",
        topicTitle: "٢. اختر الموضوع",
        trendsTab: "الاتجاهات اليومية",
        textTab: "نص مخصص",
        searchTab: "بحث الويب",
        fetchingTrends: "جاري جلب أحدث الاتجاهات...",
        customTextPlaceholder: "الصق مقالتك أو ملاحظاتك أو أفكارك هنا...",
        selectSearchTopic: "اختر موضوعًا للبحث:",
        userSearchSuggestions: ["أزمة إنسانية", "حلول تغير المناخ", "ابتكار الصحة العامة", "أهداف التنمية المستدامة"],
        generateButton: "توليد المحتوى",
        generatingPost: "جاري التوليد...",
        resultsTitle: "٣. المحتوى الخاص بك",
        placeholder: "اختر منصة وموضوعًا لتوليد المحتوى.",
        copyButton: "نسخ النص",
        copySuccess: "تم النسخ!",
        connectAccountToPublish: "ربط الحساب للنشر مباشرة (قريباً)",
        publishToPlatformButton: "نشر على {platform}",
        adaptForWebsiteButton: "تكييف لمدونة الموقع",
        adaptingForWebsite: "جاري التكييف...",
        websitePreviewTitle: "معاينة مدونة الموقع",
        publishToWebsiteButton: "نشر على الموقع",
        publishedSuccess: "تم النشر على الموقع!",
        getStrategyButton: "الحصول على استراتيجية النشر",
        fetchingStrategy: "جاري التحليل...",
        strategyTitle: "استراتيجية النشر",
        bestTime: "أفضل وقت للنشر",
        nextPost: "فكرة المنشور التالي",
        generatingVideo: "جاري إنشاء الفيديو...",
        generateVideoButton: "توليد نص الفيديو",
        findingTools: "جاري البحث عن الأدوات...",
        findVideoTools: "ابحث عن أدوات فيديو الذكاء الاصطناعي",
        toolName: "أداة",
        toolCost: "تكلفة",
        toolFarsi: "دعم العربية", // Keeping logic key but context arabic
        toolFeatures: "الميزات الرئيسية",
        toolQuality: "الجودة",
        timecode: "الوقت",
        visual: "الصورة",
        voiceover: "التعليق الصوتي",
        emotion: "العاطفة"
    },
    treePlanterPage: {
        title: "مجموعة أدوات زارع الأشجار",
        subtitle: "أدوات مدعومة بالذكاء الاصطناعي لمساعدة المحسنين في التخطيط والتمويل وتنفيذ مشاريع إعادة التشجير المؤثرة في جميع أنحاء العالم.",
        fundingTitle: "ابحث عن تمويل لمشروعك",
        fundingDescriptionLabel: "صِف مشروع إعادة التشجير الخاص بك",
        fundingDescriptionPlaceholder: "مثلاً: مشروع لزرع 10,000 شجرة مانغروف على ساحل بنغلاديش لمنع التآكل وإنشاء بالوعة كربون...",
        fundingButton: "ابحث عن منح إعادة التشجير",
        analysisTitle: "تحليل موقع الزراعة",
        analysisLocationLabel: "أدخل موقعًا محددًا",
        analysisLocationPlaceholder: "مثلاً: مادوا، النيجر أو 'الحدود الجنوبية للصحراء'",
        analysisButton: "تحليل إمكانات الزراعة",
        resultsTitle: "نتائج تحليل الذكاء الاصطناعي لـ",
        suitabilityTitle: "ملاءمة الزراعة وتحليل الغطاء النباتي",
        risksTitle: "تقييم المخاطر",
        speciesTitle: "الأنواع المحلية الموصى بها",
        crowdfundingTitle: "عرض حملة التمويل الجماعي",
        crowdfundingButton: "إطلاق الحملة",
        copyPitch: "نسخ العرض",
        risks: {
            regulatory: "القوانين البيئية والتنظيمية",
            climate: "تأثير تغير المناخ",
            ecological: "الاضطراب البيئي"
        }
    },
    reportTypes: {
        scientific_article: "مقالة علمية",
        technical_report: "تقرير تقني",
        market_analysis: "تحليل السوق",
        project_proposal: "مقترح مشروع",
        literature_review: "مراجعة الأدبيات"
    },
    blogTones: {
        professional: "محترف",
        casual: "غير رسمي",
        academic: "أكاديمي",
        engaging: "جذاب"
    },
    generatorForm: {
        title: "مساعد المستندات",
        docType: "نوع المستند",
        topic: "الموضوع / العنوان",
        topicPlaceholder: "مثلاً: مقترح منحة لتشخيص الملاريا",
        description: "المعلومات الرئيسية والمخطط التفصيلي",
        descriptionPlaceholder: "قدم ملخص المنحة، أهداف المشروع، الموظفين الرئيسيين، المنهجية، النتائج المتوقعة، نظرة عامة على الميزانية، إلخ.",
        buttonText: "توليد المستند",
        validationError: "يرجى ملء حقلي الموضوع والوصف.",
    },
    blogGenerator: {
        title: "مولد منشورات المدونة بالذكاء الاصطناعي",
        formTitle: "أنشئ منشور المدونة الخاص بك",
        titleLabel: "عنوان المدونة",
        titlePlaceholder: "مثلاً: مستقبل الذكاء الاصطناعي في المساعدات الإنسانية",
        contentLabel: "المحتوى الرئيسي / المخطط التفصيلي",
        contentPlaceholder: "قدم النقاط الرئيسية، البيانات، أو مسودة أولية...",
        toneLabel: "نبرة الصوت",
        buttonText: "توليد المنشور والصور",
        generatingText: "جاري توليد المنشور...",
        validationError: "يرجى ملء حقلي العنوان والمحتوى."
    },
    reportDisplay: {
        title: "المستند المُولد",
        export: "تصدير",
        copy: "نسخ النص",
        downloadMD: "تحميل (.md)",
        downloadDOCX: "تحميل (.docx)",
        downloadHTML: "تحميل (.html)",
        printPDF: "طباعة / حفظ كملف PDF",
        docTitle: "التقرير المُولد",
        generating: "جاري التوليد...",
        placeholder1: "سيظهر مستندك هنا.",
        placeholder2: "املأ النموذج وانقر على 'توليد' للبدء."
    },
    grantFinder: {
        title: "مكتشف فرص المنح",
        searchPlaceholder: "أدخل كلمات رئيسية (مثلاً: 'صحة الأطفال في إفريقيا'، 'لوجستيات اللقاحات')",
        searchButton: "ابحث عن المنح",
        searching: "جاري البحث...",
        from: "من",
        analyzeButton: "تحليل",
        error: "حدث خطأ أثناء البحث عن المنح.",
        noResults: "لم يتم العثور على منح لهذه الكلمات الرئيسية. جرب بحثًا أوسع.",
        copyLink: "نسخ الرابط",
        copied: "تم النسخ!",
        viewOriginal: "عرض الأصل"
    },
    grantAnalyzer: {
        title: "تحليل المنح بالذكاء الاصطناعي",
        close: "إغلاق التحليل",
        loadingTitle: "جاري تحليل المنحة...",
        loadingSubtitle: "يقوم الذكاء الاصطناعي بمراجعة تفاصيل المنحة، المتطلبات، ومدى ملاءمتها لملفك الشخصي.",
        viewOriginal: "عرض منشور المنحة الأصلي",
        relevance: "الملاءمة",
        deadline: "الموعد النهائي",
        amount: "مبلغ التمويل",
        duration: "مدة المشروع",
        geography: "التركيز الجغرافي",
        eligibility: "الأهلية",
        scope: "النطاق والأهداف",
        howToApply: "عملية التقديم",
        contact: "معلومات الاتصال",
        useForProposal: "استخدم هذا التحليل لبدء مقترح",
        exportDOCX: "تصدير التحليل (.docx)",
        printPDF: "طباعة التحليل",
        export: {
            summaryTitle: "ملخص تحليل المنحة",
            officialLink: "الرابط الرسمي",
            relevance: "درجة الملاءمة",
            details: "تفاصيل المنحة",
            fundingBody: "جهة التمويل",
            deadline: "الموعد النهائي",
            amount: "المبلغ",
            duration: "المدة",
            geography: "الجغرافيا",
            eligibility: "الأهلية",
            scope: "النطاق",
            applicationProcess: "عملية التقديم",
            contact: "الاتصال",
            fileName: "تحليل_المنحة"
        }
    },
    videoGenerator: {
        title: "مولد الفيديو بالذكاء الاصطناعي",
        subtitle: "أنشئ فيديوهات جذابة لعروض الأبحاث، تحديثات المشاريع، أو حملات التوعية العامة.",
        quotaExhaustedBanner: "قد تكون حصة توليد الفيديو محدودة. قد تكون بعض الميزات غير متاحة.",
        errorTitle: "خطأ",
        step1Title: "١. حدد مفهوم الفيديو الخاص بك",
        videoType: "الغرض من الفيديو",
        typeGeneral: "عام / وسائل التواصل الاجتماعي",
        typeBooth: "بحث / مؤتمر",
        promptLabel: "عن ماذا يدور الفيديو؟",
        promptPlaceholder: "مثلاً: فيديو مفعم بالأمل حول عيادتنا الصحية المتنقلة الجديدة في ريف كينيا، يظهر تأثير المجتمع.",
        boothPromptPlaceholder: "مثلاً: عرض تقني لأداة التشخيص بالذكاء الاصطناعي الخاصة بنا، شرح المنهجية وعرض النتائج.",
        negativePromptLabel: "موجه سلبي (اختياري)",
        negativePromptPlaceholder: "مثلاً: لقطات ضبابية، تراكب نص، رسوم متحركة",
        imageLabel: "صورة ملهمة (اختياري)",
        uploadButton: "تحميل صورة",
        imagePrompt: "يوجه الذكاء الاصطناعي حول النمط المرئي والمزاج.",
        removeImage: "إزالة الصورة",
        addWatermark: "إضافة علامة Civicavita المائية",
        numberOfVersions: "عدد نسخ الفيديو",
        aspectRatio: "نسبة العرض إلى الارتفاع",
        durationLabel: "مدة الفيديو التقريبية",
        generateScriptButton: "توليد النص والمشاهد",
        generatingScriptTitle: "جاري توليد النص...",
        validationError: "يرجى تقديم موجه أو صورة للبدء.",
        step2Title: "٢. مراجعة وتوليد المشاهد",
        progressSavedAutomatically: "يتم حفظ التقدم تلقائيًا.",
        startOver: "البدء من جديد",
        scene: "مشهد",
        narration: "السرد",
        readNarration: "قراءة السرد بصوت عالٍ",
        visuals: "الموجه البصري",
        approveScene: "موافقة",
        approved: "تمت الموافقة",
        generateSceneVideo: "توليد فيديو",
        regenerateScene: "إعادة توليد الفيديو",
        generateSceneImage: "توليد صورة",
        regenerateSceneImage: "إعادة توليد الصورة",
        downloadVideo: "تحميل",
        promptRequiredError: "لا يمكن أن يكون الموجه البصري فارغًا.",
        quotaErrorImageFallback: "فشل توليد الفيديو (تم تجاوز الحصة). حاول توليد بديل أو صورة ثابتة.",
        generateAlternativeVideo: "توليد فيديو بديل",
        generateAnimatedScene: "توليد مشهد متحرك",
        askGoogleBaba: "اسأل",
        askGoogleBabaFocus: "ركز سؤالك (اختياري)",
        step3Title: "٣. إضافة موسيقى",
        musicPromptLabel: "صف الموسيقى التي تريدها",
        generateMusicButton: "توليد فكرة موسيقية",
        generatingMusic: "جاري التوليد...",
        musicDescriptionTitle: "اقتراح موسيقى بالذكاء الاصطناعي",
        musicLibraryTitle: "أو اختر من المكتبة",
        select: "تحديد",
        selected: "محدد",
        step4Title: "٤. الانتهاء",
        combineAndExport: "دمج وتصدير الفيديو",
        approveAllToCombine: "وافق على جميع المشاهد {approvedCount}/{totalCount} لتمكين التصدير.",
        musicRequired: "يرجى اختيار مقطوعة موسيقية لتمكين التصدير.",
    },
    quotaErrorModal: {
        title: "تم تجاوز حصة API",
        body: "لقد تجاوزت حصة API الحالية الخاصة بك. يرجى التحقق من حساب الفوترة الخاص بك أو المحاولة مرة أخرى لاحقًا. قد تكون بعض الميزات غير متاحة.",
        cta: "التحقق من الفوترة",
        close: "إغلاق"
    },
    googleBabaModal: {
        title: "رؤى من Google Baba",
        close: "إغلاق",
        loading: "جاري البحث في الويب عن رؤى...",
        userFocus: "تركيزك:",
        resultsTitle: "التحليل:",
        sourcesTitle: "المصادر:",
    },
    chatbot: {
        welcome: "مرحبًا! أنا سفير الذكاء الاصطناعي لمشروع \"من النفايات إلى الثروة\". كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن نموذج العمل لدينا، المكافآت، أو الخطط المستقبلية.",
        placeholder: "اسأل عن المشروع...",
        suggestion1: "ما هي ملكية المجتمع؟",
        suggestion2: "كيف تعمل المكافآت؟",
        suggestion3: "ما هي الخطط المستقبلية؟"
    }
  },
  es: {
      langCode: 'es-ES',
      langName: 'Spanish',
      nav: {
          home: "Inicio",
          about: "Sobre Nosotros",
          contact: "Contáctenos",
          reportGenerator: "Asistente Doc",
          grantFinder: "Buscador de Becas",
          videoGenerator: "Generador de Video",
          blogGenerator: "Generador de Blog",
          contentHub: "Creador de Contenido",
          wasteToWealth: "Residuos a Riqueza",
          treePlanter: "Plantador de Árboles",
          projects: "Proyectos",
          team: "Equipo",
          dashboard: "Tablero",
      },
      dashboard: {
        menu: {
            dashboard: "Tablero",
            posts: "Entradas",
            media: "Medios",
            pages: "Páginas",
            comments: "Comentarios",
            appearance: "Apariencia",
            plugins: "Plugins",
            users: "Usuarios",
            tools: "Herramientas",
            settings: "Ajustes"
        },
        posts: {
            all: "Todo",
            published: "Publicado",
            addNew: "Añadir Nueva",
            search: "Buscar entradas",
            bulkActions: "Acciones en lote",
            apply: "Aplicar",
            filter: "Filtrar",
            table: {
                title: "Título",
                author: "Autor",
                categories: "Categorías",
                tags: "Etiquetas",
                date: "Fecha"
            },
            actions: {
                edit: "Editar",
                quickEdit: "Edición rápida",
                trash: "Papelera",
                view: "Ver"
            }
        }
    },
      // ... rest of Spanish
      hero: {
          title: "CIVICAVITA.<span class='text-orange-500'>A</span><span class='text-emerald-500'>B</span> <br/> <span class='text-white'>Salud Global y Ciencia Humanitaria</span>",
          subtitle: "CIVICAVITA deriva de palabras latinas 'Civic' (ciudadano, sociedad, vida pública) y 'Vita' (vida, bienestar, sostenibilidad). Unimos el conocimiento científico con el impacto en el mundo real.",
          button1: "Explora Nuestro Trabajo",
          button2: "Contáctenos",
          videoUrl: "https://storage.googleapis.com/civicavita-assets/hero-bg.mp4"
      },
      home: {
          introTitle: "Misión",
          introText: "En CIVICAVITA AB, realizamos investigaciones en ciencias sociales y de la salud para mejorar el bienestar individual y comunitario mientras promovemos la sostenibilidad, la responsabilidad social y los derechos humanos.",
          visionTitle: "Visión",
          visionText: "CIVICAVITA AB visualiza un futuro donde la investigación confiable informa políticas e iniciativas que mejoran vidas y protegen el medio ambiente.",
          servicesTitle: "Nuestros Servicios Principales",
          services: [
            { iconKey: 'science', title: 'Investigación Humanitaria', text: 'Realización de estudios científicos de campo para crear soluciones basadas en evidencia.', linkPage: 'generator' },
            { iconKey: 'grant', title: 'Adquisición de Becas', text: 'Asegurar y gestionar fondos para proyectos humanitarios y científicos de alto impacto.', linkPage: 'grant' },
            { iconKey: 'education', title: 'Educación y Medios', text: 'Desarrollo de manuales, cursos y programas de medios para educar a activistas y al público.', linkPage: 'content-hub' },
            { iconKey: 'consulting', title: 'Política y Asesoría', text: 'Contribuir a códigos éticos y marcos de gobernanza para la participación democrática.', linkPage: 'generator' }
        ],
         portfolioTitle: "Proyectos de Investigación Destacados",
         portfolioItems: [], // Fallback to English items if empty
         achievementsTitle: "Nuestro Impacto",
         achievements: [
            { iconKey: 'publications', count: 200, suffix: '+', label: 'Programas de Medios' },
            { iconKey: 'funded', count: 44, suffix: '', label: 'Países Analizados' },
            { iconKey: 'collaborations', count: 15, suffix: '+', label: 'Socios Globales' },
            { iconKey: 'team', count: 12, suffix: '', label: 'Proyectos Activos' },
            { iconKey: 'trained', count: 500, suffix: '+', label: 'Profesionales Capacitados' }
         ],
         customersTitle: "Colaboraciones y Socios",
         customerLogos: [], // Fallback to English
         calendarTitle: "Últimas Perspectivas",
         latestPosts: [] // Fallback to English
      },
      footer: {
           description: "CIVICAVITA AB: Uniendo el conocimiento científico con el impacto en el mundo real para avanzar en la salud pública.",
           contactTitle: "Ponerse en Contacto",
           email: "smotallebi@civicavita.org",
           phone: "+46 739751973",
           address: "Lantmannagatan 6 C, Apartment 1202, 214 44 Malmö",
           socialMediaTitle: "Siga Nuestra Misión",
           instagram: "Instagram",
           linkedin: "LinkedIn",
           facebook: "Facebook",
           whatsapp: "WhatsApp",
           telegram: "Telegram",
           quickLinksTitle: "Enlaces Rápidos",
           quickLinks: [
                { text: "Sobre Nosotros", link: "#about" },
                { text: "Nuestros Servicios", link: "#services" },
                { text: "Portafolio", link: "#portfolio" },
                { text: "Carreras", link: "#" },
                { text: "Política de Privacidad", link: "#" },
           ],
           addressTitle: "Nuestra Ubicación",
           copyright: "© 2024 Civicavita AB. Todos los derechos reservados."
      },
  }
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
    // Basic implementation for English fallback if other lang doesn't have key
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): any => {
    // Try getting translation from selected language
    let translation = getNested(translations[language], key);
    
    // If not found, fallback to English
    if (translation === undefined) {
        translation = getNested(translations.en, key);
    }

    // If still not found, return the key itself
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
    green: { // Requested default
        id: 'green',
        name: 'Nature (Green)',
        primary: '#10b981', // emerald-500
        primaryHover: '#059669', // emerald-600
        gradient: 'linear-gradient(to right, #34d399, #10b981, #064e3b)' // emerald-400 -> emerald-500 -> emerald-900
    },
    civicavita: { 
        id: 'civicavita',
        name: 'Civicavita (Pink/Purple)', 
        primary: '#ec4899', // pink-500 
        primaryHover: '#be185d', // pink-700
        gradient: 'linear-gradient(to right, #60a5fa, #a855f7, #ec4899)' // blue-400 -> purple-500 -> pink-500
    },
    red: { 
        id: 'red',
        name: 'Urgent (Red)', 
        primary: '#ef4444', // red-500
        primaryHover: '#b91c1c', // red-700
        gradient: 'linear-gradient(to right, #fb923c, #ef4444, #7f1d1d)' // orange-400 -> red-500 -> red-900
    },
    yellow: { 
        id: 'yellow',
        name: 'Solar (Yellow)', 
        primary: '#eab308', // yellow-500
        primaryHover: '#a16207', // yellow-700
        gradient: 'linear-gradient(to right, #facc15, #eab308, #713f12)' // yellow-400 -> yellow-500 -> yellow-900
    },
    blue: { 
        id: 'blue',
        name: 'Ocean (Blue)', 
        primary: '#3b82f6', // blue-500
        primaryHover: '#1d4ed8', // blue-700
        gradient: 'linear-gradient(to right, #22d3ee, #3b82f6, #1e3a8a)' // cyan-400 -> blue-500 -> blue-900
    },
    // ... add more presets
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
export type Page = 'home' | 'projects' | 'team' | 'generator' | 'grant' | 'video' | 'blog' | 'content-hub' | 'waste-to-wealth' | 'tree-planter' | 'dashboard';

export interface AppState {
  page: Page;
}

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
}

// --- Blog Post Types ---
export interface BlogPost {
  img: string;
  title: string;
  date: string;
  comments: number;
  link: string;
  isLoadingImage?: boolean;
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