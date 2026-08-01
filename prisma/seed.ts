import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with Manish Mishra's profile...");

  // ──────────────────────────────────────────────────────────────
  // Admin User
  // ──────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { username: "manish" },
    update: {},
    create: {
      username: "manish",
      password: hashedPassword,
      email: "manishmishra2604@gmail.com",
    },
  });
  console.log("✅ Admin user created (username: manish, password: admin123)");

  // ──────────────────────────────────────────────────────────────
  // Hero Section
  // ──────────────────────────────────────────────────────────────
  await prisma.hero.deleteMany();
  await prisma.hero.create({
    data: {
      name: "Manish Mishra",
      titles: [
        "AI Engineer",
        "Data Engineer",
        "Python Developer",
        "Machine Learning Engineer",
        "Backend Engineer",
        "DevOps Engineer",
        "Cloud Engineer",
        "Generative AI Engineer",
        "Business Analyst",
      ],
      tagline: "Building intelligent systems that matter.",
      description:
        "Computer Science Engineer specializing in AI & Data Engineering. I build production-ready intelligent systems — from ML models and LLM pipelines to enterprise data platforms and cloud infrastructure.",
      ctaPrimary: "Explore Projects",
      ctaSecondary: "Download Resume",
      ctaTertiary: "Contact Me",
    },
  });
  console.log("✅ Hero section seeded");

  // ──────────────────────────────────────────────────────────────
  // Stats
  // ──────────────────────────────────────────────────────────────
  await prisma.stat.deleteMany();
  const stats = [
    { label: "Projects Built", value: "15", suffix: "+", icon: "FolderCode", order: 1 },
    { label: "Years of Experience", value: "2", suffix: "+", icon: "Calendar", order: 2 },
    { label: "Technologies", value: "30", suffix: "+", icon: "Layers", order: 3 },
    { label: "Internships", value: "3", suffix: "", icon: "Briefcase", order: 4 },
    { label: "Certifications", value: "2", suffix: "", icon: "Award", order: 5 },
    { label: "GitHub Contributions", value: "500", suffix: "+", icon: "Github", order: 6 },
  ];
  await prisma.stat.createMany({ data: stats });
  console.log("✅ Stats seeded");

  // ──────────────────────────────────────────────────────────────
  // Technologies
  // ──────────────────────────────────────────────────────────────
  const techList = [
    { name: "Python", color: "#3776ab" },
    { name: "SQL", color: "#336791" },
    { name: "Java", color: "#ed8b00" },
    { name: "TypeScript", color: "#3178c6" },
    { name: "FastAPI", color: "#009688" },
    { name: "Next.js", color: "#000000" },
    { name: "React", color: "#61dafb" },
    { name: "Node.js", color: "#339933" },
    { name: "Docker", color: "#2496ed" },
    { name: "Jenkins", color: "#d24939" },
    { name: "GitHub Actions", color: "#2088ff" },
    { name: "SonarQube", color: "#4e9bcd" },
    { name: "Trivy", color: "#1904da" },
    { name: "AWS S3", color: "#ff9900" },
    { name: "Databricks", color: "#ff3621" },
    { name: "Apache Spark", color: "#e25a1c" },
    { name: "PySpark", color: "#e25a1c" },
    { name: "Hadoop", color: "#66ccff" },
    { name: "Delta Lake", color: "#00add8" },
    { name: "PostgreSQL", color: "#336791" },
    { name: "Scikit-learn", color: "#f7931e" },
    { name: "TensorFlow", color: "#ff6f00" },
    { name: "PyTorch", color: "#ee4c2c" },
    { name: "Hugging Face", color: "#ffd21e" },
    { name: "LangChain", color: "#1c3c3c" },
    { name: "OpenAI API", color: "#74aa9c" },
    { name: "BERT", color: "#764abc" },
    { name: "LSTM", color: "#9b59b6" },
    { name: "Pandas", color: "#150458" },
    { name: "NumPy", color: "#013243" },
    { name: "Matplotlib", color: "#11557c" },
    { name: "Git", color: "#f05032" },
    { name: "Linux", color: "#fcc624" },
    { name: "Prisma", color: "#2d3748" },
    { name: "Cloudinary", color: "#3448c5" },
    { name: "Microsoft Azure", color: "#0078d4" },
    { name: "Nexus", color: "#1b2a3b" },
    { name: "Streamlit", color: "#ff4b4b" },
  ];

  for (const tech of techList) {
    await prisma.technology.upsert({
      where: { name: tech.name },
      update: {},
      create: tech,
    });
  }
  console.log("✅ Technologies seeded");

  // Helper to get technology IDs
  const getTech = async (names: string[]) => {
    const techs = await prisma.technology.findMany({
      where: { name: { in: names } },
    });
    return techs.map((t) => ({ id: t.id }));
  };

  // ──────────────────────────────────────────────────────────────
  // Projects
  // ──────────────────────────────────────────────────────────────
  await prisma.project.deleteMany();

  const projects = [
    {
      slug: "medireporter",
      title: "MediReporter",
      shortDescription:
        "AI-powered clinical documentation system that converts medical reports into structured clinical summaries using NLP and transformer models.",
      description: `MediReporter is an enterprise-grade medical NLP platform that automates clinical documentation. It combines state-of-the-art transformer models (BioBERT, BART) with an LSTM-based sequence processor to extract named entities, summarize findings, and generate structured clinical reports from unstructured medical texts and PDFs.`,
      overview: `MediReporter addresses the significant burden of clinical documentation that consumes 30-40% of a physician's time. By leveraging cutting-edge biomedical NLP models, it automates the conversion of free-form medical text into structured, actionable clinical summaries with reduced false positive rates.`,
      problem: `Physicians spend an enormous amount of time on documentation. Manual transcription introduces errors, and existing solutions are either too expensive or insufficiently accurate for clinical deployment. There was a clear need for an open, modular NLP pipeline that could handle diverse medical document formats.`,
      solution: `Built a multi-stage NLP pipeline: (1) PDF ingestion and preprocessing, (2) Named Entity Recognition using BioBERT fine-tuned on medical corpora, (3) Abstractive summarization with BART, (4) LSTM-based temporal sequence modeling for longitudinal patient records, (5) Structured JSON output via FastAPI endpoints.`,
      architecture: `\`\`\`mermaid
graph TD
    A[PDF / Text Input] --> B[Document Preprocessor]
    B --> C[BioBERT NER Engine]
    B --> D[BART Summarizer]
    C --> E[Entity Aggregator]
    D --> E
    E --> F[LSTM Temporal Modeler]
    F --> G[FastAPI Backend]
    G --> H[Structured Clinical Report]
    G --> I[REST API Consumers]
\`\`\``,
      challenges: `- Fine-tuning BioBERT on limited labeled medical data required careful augmentation strategies\n- Balancing recall vs precision for clinical NER (false negatives are dangerous)\n- PDF parsing across diverse medical document formats\n- Latency optimization for real-time clinical workflows`,
      decisions: `Chose BioBERT over general BERT because of its pre-training on PubMed and clinical notes. Selected BART for summarization due to its strong abstractive capabilities. FastAPI was chosen over Flask for async support and automatic OpenAPI documentation generation.`,
      performance: `- 87% F1 score on clinical NER benchmarks\n- 40% reduction in documentation time in simulated workflows\n- Sub-500ms response time for standard clinical note processing\n- 23% lower false positive rate compared to baseline rule-based systems`,
      lessons: `Domain-specific pre-training matters enormously in medical NLP. General-purpose models consistently underperformed BioBERT by 15-20% on clinical tasks. Data quality trumps data quantity for fine-tuning.`,
      futureWork: `- HIPAA-compliant cloud deployment\n- Integration with EHR systems (Epic, Cerner)\n- Multi-language support for non-English medical records\n- Real-time streaming inference pipeline`,
      githubUrl: "https://github.com/manish26m/MediReporter",
      status: "PUBLISHED" as const,
      featured: true,
      order: 1,
      category: ["AI", "Machine Learning", "Python", "LLMs"],
      techNames: ["Python", "FastAPI", "BERT", "LSTM", "Hugging Face", "Pandas", "NumPy"],
    },
    {
      slug: "boarduniverse",
      title: "BoardUniverse",
      shortDescription:
        "Enterprise-grade CI/CD automation platform with Docker, Jenkins, SonarQube, Nexus, and Trivy for secure, production-ready deployments.",
      description: `BoardUniverse is a complete DevOps automation ecosystem demonstrating enterprise-grade deployment workflows. It implements security-first CI/CD pipelines with automated code quality gates, vulnerability scanning, artifact management, and containerized deployment — the kind of infrastructure used by Fortune 500 engineering teams.`,
      overview: `Designed to showcase full DevOps lifecycle management, BoardUniverse automates everything from code commit to production deployment while enforcing security and quality at every stage.`,
      problem: `Most student projects lack production deployment infrastructure. Teams manually deploy applications, skip security scanning, and have no artifact versioning — leading to inconsistent, insecure deployments.`,
      solution: `Built a complete CI/CD pipeline: Jenkins orchestrates the workflow, SonarQube enforces code quality gates (80% coverage minimum), Trivy scans Docker images for CVEs, Nexus manages versioned artifacts, and Docker Compose handles multi-service deployment.`,
      architecture: `\`\`\`mermaid
graph LR
    A[Git Push] --> B[Jenkins Pipeline]
    B --> C[SonarQube Analysis]
    C --> D{Quality Gate}
    D -->|Pass| E[Docker Build]
    D -->|Fail| Z[Notify & Stop]
    E --> F[Trivy Security Scan]
    F --> G{CVE Check}
    G -->|Clean| H[Push to Nexus]
    G -->|Vulnerable| Z
    H --> I[Docker Compose Deploy]
    I --> J[Production Environment]
\`\`\``,
      challenges: `- Configuring SonarQube quality gates to balance strictness with development velocity\n- Trivy integration in air-gapped environments\n- Jenkins pipeline-as-code with parameterized builds\n- Managing secrets across pipeline stages`,
      decisions: `Chose Jenkins over GitHub Actions for its extensibility and self-hosted control. SonarQube was selected for its deep Java/Python analysis capabilities. Nexus provides a private registry for both Docker images and JAR artifacts.`,
      performance: `- Zero-downtime deployments with Docker rolling updates\n- Average pipeline execution: 8 minutes end-to-end\n- 100% of deployments pass security scanning\n- Automated rollback on health check failure`,
      lessons: `Security must be built into the pipeline, not bolted on. Shifting security left with Trivy scanning before deployment prevents costly production incidents. Quality gates force teams to maintain code standards.`,
      futureWork: `- Kubernetes orchestration with Helm charts\n- Multi-environment promotion (dev → staging → prod)\n- Automated performance testing integration\n- GitOps with ArgoCD`,
      githubUrl: "https://github.com/manish26m/BoardUniverse",
      status: "PUBLISHED" as const,
      featured: true,
      order: 2,
      category: ["DevOps", "Backend", "Cloud"],
      techNames: ["Docker", "Jenkins", "SonarQube", "Trivy", "GitHub Actions", "Linux", "Git"],
    },
    {
      slug: "dataforge",
      title: "DataForge",
      shortDescription:
        "Enterprise data lakehouse platform implementing Medallion Architecture on AWS + Databricks with real-time AI/BI dashboards.",
      description: `DataForge is a production-grade enterprise data lakehouse that demonstrates modern data engineering at scale. Built during the Futurense Technologies internship, it implements the full Bronze → Silver → Gold Medallion Architecture on AWS S3 + Databricks, with PySpark data quality validation, star-schema dimensional modeling, and AI-powered business intelligence dashboards.`,
      overview: `DataForge solves the challenge of ingesting, transforming, and serving large-scale enterprise data for analytical workloads. It provides a single source of truth across the data lifecycle.`,
      problem: `Enterprise data was siloed across multiple systems with no unified platform for analytics. Raw data quality was poor, transformation logic was duplicated, and business teams had no self-serve analytics capability.`,
      solution: `Designed a three-layer lakehouse: Bronze layer ingests raw data from AWS S3 with full audit trails; Silver layer applies PySpark-based validation, deduplication, and enrichment; Gold layer builds star-schema dimensional marts optimized for BI consumption. Delta Lake provides ACID transactions across all layers.`,
      architecture: `\`\`\`mermaid
graph TD
    A[Source Systems] --> B[AWS S3 Raw Zone]
    B --> C[Bronze Layer - Delta Lake]
    C --> D[PySpark Validation Engine]
    D --> E[Silver Layer - Cleansed Data]
    E --> F[Star Schema Builder]
    F --> G[Gold Layer - Dimensional Marts]
    G --> H[AI/BI Dashboards]
    G --> I[FastAPI Data APIs]
    I --> J[Business Applications]
\`\`\``,
      challenges: `- Handling schema evolution across ingestion runs without pipeline failures\n- Optimizing PySpark jobs for cost efficiency on Databricks clusters\n- Implementing exactly-once semantics for streaming ingestion\n- Building incremental processing for tables with 100M+ records`,
      decisions: `Delta Lake was chosen over plain Parquet for its ACID guarantees and time-travel capability. Databricks workflows provided managed orchestration without the overhead of Apache Airflow. FastAPI exposed the Gold layer for downstream consumers.`,
      performance: `- Processes 50GB+ of daily data ingestion\n- 90% reduction in data preparation time for analysts\n- Sub-10 second query response on Gold layer marts\n- 99.5% pipeline success rate with automated retry logic`,
      lessons: `The Medallion Architecture's clear separation of concerns makes debugging and reprocessing dramatically easier. Investing in data quality at the Bronze layer prevents exponential rework downstream.`,
      futureWork: `- Real-time streaming with Apache Kafka\n- Data mesh architecture for domain ownership\n- ML Feature Store integration\n- Data catalog with Apache Atlas`,
      githubUrl: "https://github.com/manish26m/DataForge",
      status: "PUBLISHED" as const,
      featured: true,
      order: 3,
      category: ["Data Engineering", "Cloud", "Python", "Analytics"],
      techNames: ["Python", "PySpark", "Apache Spark", "AWS S3", "Databricks", "Delta Lake", "FastAPI", "SQL", "Pandas"],
    },
    {
      slug: "lead-intelligence-engine",
      title: "Lead Intelligence Engine",
      shortDescription:
        "ML-powered enrollment prediction system analyzing 20,000+ leads with funnel analytics and precision-recall optimized scoring models.",
      description: `Built during the Futurense Technologies Business Analyst internship, this system applies machine learning to lead prioritization for educational admissions. It processes 20,000+ lead records, engineers features from behavioral signals, and outputs enrollment probability scores to help admissions teams focus on high-conversion prospects.`,
      overview: `The Lead Intelligence Engine transforms raw CRM data into actionable admissions intelligence, enabling teams to prioritize outreach and improve enrollment rates.`,
      problem: `Admissions teams were manually reviewing thousands of leads with no systematic prioritization. High-value prospects received the same attention as unlikely conversions, resulting in poor conversion rates and wasted resources.`,
      solution: `Engineered a feature-rich ML pipeline: extracted behavioral features from CRM data (response time, touchpoints, source channel), trained ensemble models (Random Forest + XGBoost) with precision-recall optimization, and built a scoring API for real-time lead ranking.`,
      challenges: `- Class imbalance (5% enrollment rate) required SMOTE and weighted loss functions\n- Feature engineering from messy, inconsistent CRM data\n- Calibrating model thresholds for business-appropriate precision/recall tradeoff`,
      decisions: `Optimized for recall (capturing all likely enrollees) rather than precision, aligned with business requirement to not miss potential students. Ensemble approach outperformed single models by 12% on F1.`,
      performance: `- 78% precision, 85% recall on enrollment prediction\n- 35% improvement in sales team conversion rate\n- Reduced lead review time by 60%\n- Analyzed 20,000+ lead records`,
      lessons: `Business context must drive model optimization choices. A technically "better" model optimized for accuracy was worse for the actual business problem.`,
      futureWork: `- Real-time scoring API integration with CRM\n- NLP analysis of lead communication quality\n- A/B testing framework for outreach strategies`,
      githubUrl: "https://github.com/manish26m",
      status: "PUBLISHED" as const,
      featured: false,
      order: 4,
      category: ["Machine Learning", "Analytics", "Python", "AI"],
      techNames: ["Python", "Scikit-learn", "Pandas", "NumPy", "SQL", "Matplotlib"],
    },
    {
      slug: "llm-document-qa",
      title: "LLM Document Q&A System",
      shortDescription:
        "RAG-based document intelligence system using LangChain, OpenAI, and vector embeddings for enterprise knowledge retrieval.",
      description: `A Retrieval-Augmented Generation (RAG) system that enables natural language querying over large document collections. Built with LangChain orchestration, OpenAI embeddings, and FAISS vector storage, it demonstrates production patterns for enterprise LLM deployment.`,
      overview: `Enables organizations to query their document repositories using natural language, with accurate, cited responses grounded in source documents rather than model hallucinations.`,
      problem: `Organizations have vast knowledge repositories (PDFs, docs, wikis) that are difficult to search and synthesize. Traditional keyword search fails to understand semantic meaning and cannot synthesize answers from multiple sources.`,
      solution: `Implemented a full RAG pipeline: documents chunked and embedded with OpenAI's text-embedding-ada-002, stored in FAISS for efficient similarity search, retrieved with MMR diversity ranking, and synthesized with GPT-4 with source citations. FastAPI exposes the Q&A endpoint.`,
      challenges: `- Optimizing chunk size and overlap for retrieval quality\n- Preventing hallucination with strict grounding prompts\n- Handling multi-hop reasoning across document sections\n- Managing API costs for large document collections`,
      decisions: `FAISS over Pinecone for zero-cost self-hosting during development. MMR retrieval prevents returning redundant document chunks. Streaming responses improve perceived latency.`,
      performance: `- 92% answer accuracy on curated evaluation set\n- Sub-2 second end-to-end response time\n- Supports document collections up to 10,000 pages\n- 40% cost reduction vs naive full-context approaches`,
      lessons: `Prompt engineering is as important as retrieval quality. The best retrieved context is useless with a poorly designed synthesis prompt.`,
      futureWork: `- Multi-modal support (images, tables)\n- Hybrid BM25 + semantic search\n- Fine-tuned domain-specific embeddings`,
      githubUrl: "https://github.com/manish26m",
      status: "PUBLISHED" as const,
      featured: false,
      order: 5,
      category: ["AI", "LLMs", "Python", "Backend"],
      techNames: ["Python", "LangChain", "OpenAI API", "FastAPI", "Pandas"],
    },
  ];

  for (const project of projects) {
    const { techNames, ...projectData } = project;
    const techConnects = await getTech(techNames);
    await prisma.project.create({
      data: {
        ...projectData,
        technologies: { connect: techConnects },
      },
    });
  }
  console.log("✅ Projects seeded");

  // ──────────────────────────────────────────────────────────────
  // Experience
  // ──────────────────────────────────────────────────────────────
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        company: "Futurense Technologies",
        role: "Data Engineering Intern",
        type: "Internship",
        location: "Remote, India",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-31"),
        current: false,
        description:
          "Built DataForge, an enterprise data lakehouse platform implementing Medallion Architecture on AWS S3 + Databricks. Designed end-to-end ETL pipelines processing 50GB+ of daily data with PySpark validation and star-schema dimensional modeling.",
        achievements: [
          "Built Bronze→Silver→Gold Medallion Architecture on Databricks",
          "Reduced data preparation time for analysts by 90%",
          "Implemented PySpark validation engine with 99.5% pipeline success rate",
          "Designed star-schema marts serving AI/BI dashboards",
        ],
        technologies: ["Python", "PySpark", "AWS S3", "Databricks", "Delta Lake", "FastAPI", "SQL"],
        order: 1,
      },
      {
        company: "Futurense Technologies",
        role: "Business Analyst Intern",
        type: "Internship",
        location: "Remote, India",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-05-31"),
        current: false,
        description:
          "Developed an ML-powered lead intelligence system analyzing 20,000+ enrollment leads. Engineered features from CRM data, trained precision-recall optimized models, and delivered a scoring system that improved sales conversion rates by 35%.",
        achievements: [
          "Analyzed 20,000+ lead records for enrollment prediction",
          "Improved sales team conversion rate by 35%",
          "Achieved 85% recall on enrollment prediction model",
          "Reduced lead review time by 60% through automated prioritization",
        ],
        technologies: ["Python", "Scikit-learn", "Pandas", "SQL", "Matplotlib"],
        order: 2,
      },
      {
        company: "Indian Institute of Development Research (IIDR)",
        role: "Research Intern",
        type: "Research",
        location: "Mumbai, India",
        startDate: new Date("2023-05-01"),
        endDate: new Date("2023-07-31"),
        current: false,
        description:
          "Conducted quantitative analysis on healthcare and social datasets involving 5,000+ participants. Contributed to policy-oriented research on healthcare accessibility, applying statistical methods and data visualization to derive insights.",
        achievements: [
          "Analyzed healthcare datasets with 5,000+ participants",
          "Contributed to policy-oriented research publications",
          "Applied advanced statistical methods for social impact analysis",
          "Developed data visualization dashboards for research findings",
        ],
        technologies: ["Python", "Pandas", "Matplotlib", "SQL", "NumPy"],
        order: 3,
      },
    ],
  });
  console.log("✅ Experience seeded");

  // ──────────────────────────────────────────────────────────────
  // Skills
  // ──────────────────────────────────────────────────────────────
  await prisma.skill.deleteMany();
  const skillsData = [
    // AI & ML
    { category: "AI & Machine Learning", name: "Machine Learning", proficiency: 90, order: 1 },
    { category: "AI & Machine Learning", name: "Deep Learning", proficiency: 85, order: 2 },
    { category: "AI & Machine Learning", name: "Natural Language Processing", proficiency: 88, order: 3 },
    { category: "AI & Machine Learning", name: "Large Language Models", proficiency: 85, order: 4 },
    { category: "AI & Machine Learning", name: "Computer Vision", proficiency: 75, order: 5 },
    { category: "AI & Machine Learning", name: "Reinforcement Learning", proficiency: 70, order: 6 },
    // Data Engineering
    { category: "Data Engineering", name: "ETL Pipeline Design", proficiency: 92, order: 1 },
    { category: "Data Engineering", name: "Apache Spark / PySpark", proficiency: 88, order: 2 },
    { category: "Data Engineering", name: "Medallion Architecture", proficiency: 90, order: 3 },
    { category: "Data Engineering", name: "Data Warehousing", proficiency: 85, order: 4 },
    { category: "Data Engineering", name: "Stream Processing", proficiency: 78, order: 5 },
    { category: "Data Engineering", name: "Delta Lake", proficiency: 85, order: 6 },
    // Programming
    { category: "Programming Languages", name: "Python", proficiency: 95, order: 1 },
    { category: "Programming Languages", name: "SQL", proficiency: 90, order: 2 },
    { category: "Programming Languages", name: "Java", proficiency: 75, order: 3 },
    { category: "Programming Languages", name: "TypeScript", proficiency: 78, order: 4 },
    // DevOps & Cloud
    { category: "DevOps & Cloud", name: "Docker & Containerization", proficiency: 88, order: 1 },
    { category: "DevOps & Cloud", name: "CI/CD Pipelines", proficiency: 87, order: 2 },
    { category: "DevOps & Cloud", name: "AWS", proficiency: 82, order: 3 },
    { category: "DevOps & Cloud", name: "Jenkins", proficiency: 85, order: 4 },
    { category: "DevOps & Cloud", name: "Linux", proficiency: 85, order: 5 },
    { category: "DevOps & Cloud", name: "Kubernetes", proficiency: 70, order: 6 },
    // Frameworks & Tools
    { category: "Frameworks & Tools", name: "FastAPI", proficiency: 90, order: 1 },
    { category: "Frameworks & Tools", name: "LangChain", proficiency: 85, order: 2 },
    { category: "Frameworks & Tools", name: "Hugging Face", proficiency: 87, order: 3 },
    { category: "Frameworks & Tools", name: "Databricks", proficiency: 85, order: 4 },
    { category: "Frameworks & Tools", name: "Streamlit", proficiency: 80, order: 5 },
    { category: "Frameworks & Tools", name: "Next.js", proficiency: 78, order: 6 },
  ];
  await prisma.skill.createMany({ data: skillsData });
  console.log("✅ Skills seeded");

  // ──────────────────────────────────────────────────────────────
  // Social Links
  // ──────────────────────────────────────────────────────────────
  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { platform: "GitHub", url: "https://github.com/manish26m", username: "manish26m", icon: "Github", order: 1 },
      { platform: "LinkedIn", url: "https://linkedin.com/in/manishmishra2604", username: "manishmishra2604", icon: "Linkedin", order: 2 },
      { platform: "Twitter", url: "https://twitter.com/manish26m", username: "manish26m", icon: "Twitter", order: 3 },
    ],
  });
  console.log("✅ Social links seeded");

  // ──────────────────────────────────────────────────────────────
  // Settings
  // ──────────────────────────────────────────────────────────────
  await prisma.settings.deleteMany();
  await prisma.settings.create({
    data: {
      siteTitle: "Manish Mishra — AI Engineer & Data Engineer",
      siteDescription:
        "Portfolio of Manish Mishra — AI Engineer, Data Engineer, and Full-Stack Developer specializing in production-grade intelligent systems, LLM pipelines, and enterprise data platforms.",
      email: "manishmishra2604@gmail.com",
      location: "Lovely Professional University, Punjab, India",
      metaKeywords: "AI Engineer, Data Engineer, Machine Learning, Python, LangChain, FastAPI, DevOps, LLM",
    },
  });
  console.log("✅ Settings seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("📝 Admin credentials: username=manish, password=admin123");
  console.log("⚠️  Please change the admin password after first login!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
