const PrepResource = require('../models/PrepResource');

exports.getResources = async (req, res) => {
  try {
    const { category, topic, company, search } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (topic && topic !== 'All') query.topic = topic;
    if (company && company !== 'All') query.company = company;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { topic: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await PrepResource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const resource = new PrepResource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.seedResources = async (req, res) => {
  try {
    const count = await PrepResource.countDocuments();
    if (count > 0) return res.json({ message: "Data already seeded" });

    // Initial data matching the previous local dummy data
    const seedData = [
      {
        title: "Amazon 2023 Interview Questions",
        category: "company",
        company: "Amazon",
        topic: "DSA & System Design",
        resourceType: "Sheet",
        difficulty: "Advanced",
        description: "A highly curated list of standard Amazon interview questions focusing on Graphs, Trees, and LP principles.",
        estimatedTime: "2 Weeks",
        tags: ["Amazon", "Graphs", "Leadership"],
        linkLabel: "Open Sheet",
        linkUrl: "#",
      },
      {
        title: "React Fundamentals Sheet",
        category: "skill",
        company: "Any",
        topic: "Frontend Web",
        resourceType: "PDF",
        difficulty: "Beginner",
        description: "Core concepts of React including Hooks, Context API, and standard lifecycle methods.",
        estimatedTime: "3 Days",
        tags: ["React", "JavaScript", "Frontend"],
        linkLabel: "View PDF",
        linkUrl: "#",
      },
      {
        title: "Aptitude Mock Test 1",
        category: "mock",
        company: "Generic",
        topic: "Quantitative & Logical",
        resourceType: "Test",
        difficulty: "Intermediate",
        description: "Full length timed mock test covering 60 standard aptitude and logical reasoning questions.",
        estimatedTime: "60 Mins",
        tags: ["Aptitude", "Mock", "Timed Test"],
        linkLabel: "Start Test",
        linkUrl: "#",
      },
      {
        title: "DBMS Interview Notes",
        category: "skill",
        company: "Any",
        topic: "Database",
        resourceType: "PDF",
        difficulty: "Intermediate",
        description: "Fast-track revision notes covering Normalization, ACID properties, and transaction indexing logic.",
        estimatedTime: "2 Days",
        tags: ["DBMS", "SQL", "Theory"],
        linkLabel: "Download PDF",
        linkUrl: "#",
      },
      {
        title: "Microsoft OA Experience",
        category: "experience",
        company: "Microsoft",
        topic: "Online Assessment",
        resourceType: "Experience",
        difficulty: "Intermediate",
        description: "Detailed step-by-step breakdown of questions asked in Microsoft India's recent Online Assessment.",
        estimatedTime: "15 Mins read",
        tags: ["Microsoft", "OA", "Arrays"],
        linkLabel: "Read Experience",
        linkUrl: "#",
      }
    ];

    await PrepResource.insertMany(seedData);
    res.json({ message: "Data seeded successfully", count: seedData.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
