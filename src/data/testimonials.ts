export type FullTestimonial = {
  name: string;
  /** Role/title and company, when the person gave one. */
  role?: string;
  /** What they built, for the handful of testimonials that included it. */
  context?: string;
  quote: string;
  program: "SnapCamp" | "SnapSprint";
};

/**
 * Sourced verbatim from the "Marketplace - Testimonials" doc. Anyone who
 * only gave a first name or no role in the doc is kept that way here rather
 * than inventing details.
 */
export const ALL_TESTIMONIALS: FullTestimonial[] = [
  {
    name: "Daniel LeSieur",
    role: "Founder, FamilyJournal.ai",
    context:
      "Built FamilyJournal.ai, a private platform for families to capture and preserve memories across generations.",
    quote:
      "I tested five different low-code and vibe-coding platforms and was still stuck. SnapDev didn't try to take over the product, they came alongside me. SnapCamp completely changed how I think about building software.",
    program: "SnapCamp",
  },
  {
    name: "Jane Alexander",
    role: "Founder/CEO, Emma Advisor",
    context: "Built Emma Advisor, an AI platform that helps high school families navigate college admissions.",
    quote:
      "As a non-technical founder I was facing $250K quotes and six-month timelines just to get a prototype built. SnapDev was a turning point. I shipped a dual-user beta myself at a fraction of the cost.",
    program: "SnapCamp",
  },
  {
    name: "Frederick Li",
    role: "CPO, Stipulate.work",
    context: "Built Stipulate, an embedded Slack tool that helps B2B onboarding teams cut project admin time by 70%.",
    quote:
      "As someone building an AI-first, backend-centric application in 2025, I hadn't heard of any vibe coding solutions for non-'SaaS' apps. SnapCamp gave me the confidence and engineering support to take the first steps.",
    program: "SnapCamp",
  },
  {
    name: "Akhil Gupta",
    quote:
      "Excellent product and support. The key differentiator is the responsiveness of engineering support, which when paired with the coding assistant makes it a super powerful value prop!",
    program: "SnapSprint",
  },
  {
    name: "Mary Ku",
    quote:
      "I was AMAZED at how quickly I was able to get something that worked. I had tried other AI coding tools and basically got stuck, but the combination of live engineering help and the SnapDev extensions really made it possible to progress.",
    program: "SnapSprint",
  },
  {
    name: "Philip Levinson",
    quote:
      "This was an invaluable experience with thoughtful, diligent and systematic help and insights from the amazing team and coaches every step of the way.",
    program: "SnapCamp",
  },
  {
    name: "Wilbur Vale",
    quote:
      "SnapDev really is the Shopify for aspiring founders who want to build their own SaaS business. In just 2.5 weeks, I took an idea I'd been sitting on for years and turned it into a working prototype, despite having limited software engineering experience.",
    program: "SnapCamp",
  },
  {
    name: "Xilin Zhang",
    quote:
      "This is an incredible experience. I'd never imagine that I could turn an idea into an actual product over a weekend. The learning is cool and support is hands on and really helpful.",
    program: "SnapSprint",
  },
  {
    name: "Sam",
    quote:
      "As a product designer, I always felt I was limiting myself by not knowing how to code and build the apps I was designing. Over a couple of the quickest weeks, I took an idea I'd been thinking about for a while from nothing to deployed app. I couldn't have done it without the support of the SnapDev team and the reassurance that the 1:1 engineering calls provided.",
    program: "SnapCamp",
  },
  {
    name: "Sharon Plasser",
    quote:
      "This was the most fun I've had in years. The ability to take an idea from concept to production in days is liberating and addictive. It opened up ideas I once thought were too complex or costly to pursue. As a non-technical person, the engineering support is the best part, as there's always someone to explain things to me.",
    program: "SnapCamp",
  },
  {
    name: "Krista Gambrel",
    quote:
      "The SnapDev team of engineers was helpful in getting me set up with GitHub, VS Code and the SnapDev app, which illustrated to me an entirely new way of vibe coding a product while learning new skills.",
    program: "SnapSprint",
  },
  {
    name: "Pavan Singh",
    quote: "It was amazing and helped me tremendously in my founder journey.",
    program: "SnapSprint",
  },
  {
    name: "Tamara",
    quote: "I was able to make real progress! Engineering support is priceless.",
    program: "SnapSprint",
  },
  {
    name: "Gloria Tang",
    quote:
      "I've learned so much about leveraging AI to deliver a product from zero to one, and the reward is an actual MVP in the real world.",
    program: "SnapCamp",
  },
  {
    name: "Nate Le",
    quote:
      "It was very insightful to see the pros and cons of using AI to build an end-to-end workflow, and see how much I can build and iterate in 5-6 hours over weekends.",
    program: "SnapSprint",
  },
  {
    name: "Susan Liao",
    quote:
      "I started this journey with no \"vibe code\" experience, nor any experience with AI build tools. It was like a black box. Two weeks later, I feel 300% empowered and inspired to continue my product build journey, to demo my product and to co-design with my ecosystem of folks seeking to make meaningful progress and to honor the ebb and flow of life.",
    program: "SnapCamp",
  },
  {
    name: "Krishna Srinivasan",
    quote: "What an amazing experience. Started out with a load of curiosity and finished with confidence.",
    program: "SnapSprint",
  },
  {
    name: "Carter Trout",
    quote: "What a transformational learning experience! Dramatically boosted my ability and confidence!",
    program: "SnapCamp",
  },
  {
    name: "Fabian Sy",
    quote: "As someone without a technical background, the support and guidance were truly invaluable.",
    program: "SnapSprint",
  },
  {
    name: "Paige Yim",
    quote:
      "It's incredible to think I brought an idea to life in under three weeks. The support along the way was unreal. Doing this with people who truly care about helping you build and ship something that matters. I'm coming out of this with a whole new level of confidence and a community that feels like we moved mountains together. It pushed me in the best way. I haven't felt my brain stretch like that in ages.",
    program: "SnapCamp",
  },
  {
    name: "Deeptiv",
    quote:
      "Finally built my idea and it's live just in a weekend. I got vibe coding thanks to Snapdev. There is no way I could have done this so quickly without the support of community, the tools and Eng whiteglove. Highly recommend!!!",
    program: "SnapSprint",
  },
  {
    name: "Anthony Basilio",
    quote:
      "As someone with no technical experience, SnapDev's facilitators and engineers were great at providing me with the support I needed to launch a working prototype of my AI app.",
    program: "SnapCamp",
  },
  {
    name: "Christine Rimer",
    quote:
      "I've been an AI enthusiast and vibe coding prototypes for months but like so many, I get stuck on anything backend: login, database, data scraping, etc. SnapDev's platform and engineering team supports you through a deep dive into the world of coding, github, databases, API keys and debugging.",
    program: "SnapSprint",
  },
  {
    name: "Dhruv Suri",
    quote: "The best way to get up and running to build your product or just get familiar with vibe coding.",
    program: "SnapSprint",
  },
  {
    name: "Steven McClelland",
    quote:
      "I started dreaming about my app. From product thinking, integration, endless debugging, and even devops this is hands on learning with new tools and timely advice that you need to understand how you can become the builder you dream of being.",
    program: "SnapCamp",
  },
  {
    name: "Rachna Sethi",
    quote:
      "It was confidence building to be able to build and deploy something from scratch in 2 days. A few years ago that same thing would have taken months and multiple resources. Just getting familiar with how it comes together with multiple tools using AI itself was worth it.",
    program: "SnapSprint",
  },
  {
    name: "Bryan Haas",
    quote:
      "Amazing way to get hands-on experience with all the tools required to build end-to-end. I learned so much and have come to truly appreciate even more, all the engineers and QA staff I've worked with to-date. The staff have been top-notch, absolutely amazing and incredibly patient.",
    program: "SnapCamp",
  },
  {
    name: "Lisa O'Malley",
    quote:
      "Powerful! Spent a fun weekend building an app with my family. SnapDev's platform enabled collaborative and iterative idea refinement, easy UI prototyping and transitioned seamlessly to backend build, complete with 3rd party API calls... all in a simple, natural language interface.",
    program: "SnapSprint",
  },
  {
    name: "Jennifer Fong",
    quote:
      "I still can't believe I was able to bring my idea to life in 2 days! Having been around developers and startups for many years, I have always been curious about the build process but had never built anything on my own.",
    program: "SnapSprint",
  },
  {
    name: "Gene Alston",
    quote:
      "While I've had exposure to launching products from a go-to-market perspective, this was my first time getting hands-on with the full end-to-end process of building a product. For a non-technical person, that can be intimidating, but the SnapDev team made it feel completely achievable.",
    program: "SnapCamp",
  },
  {
    name: "Aida Bryce",
    quote:
      "It was truly empowering for a non-tech product manager. Seeing my 12-year-old product idea come to life, jumping into VS Code, GitHub, etc. and learning quickly with amazing support was exhilarating.",
    program: "SnapCamp",
  },
  {
    name: "Chris Selle",
    quote:
      "I have been playing with these tools off and on; having the engineers and the guidance to get set up and connect everything really let me hit the ground running and leap frogged me way past previous forays.",
    program: "SnapSprint",
  },
  {
    name: "Gal Goffer",
    quote:
      "I've learned to build an idea to a full working platform in less than two weeks, thanks to the best possible support you could ask for.",
    program: "SnapCamp",
  },
  {
    name: "Shri Iyer",
    quote:
      "As a non-engineer, I've always been intrigued by vibe coding but hesitant to dive in. Most tools require endless hours of debugging. Without knowing what to look for, it's easy to get stuck and abandon the project altogether. From day one, the SnapDev team guided me step by step.",
    program: "SnapCamp",
  },
  {
    name: "Vibha Rathi",
    quote: "It was a wonderful experience building with SnapDev.",
    program: "SnapCamp",
  },
  {
    name: "Brian Li",
    quote:
      "Truly an immersive experience (even for non tech/prod folks) to get your feet wet with using AI development tools. Build cool stuff with no code experience!",
    program: "SnapCamp",
  },
  {
    name: "Mark Tan",
    quote:
      "This is one of the most thoughtfully structured and energizing communities I've been part of. From day one, it created a safe, supportive space where I felt free to share raw ideas without hesitation and always got thoughtful feedback in return.",
    program: "SnapCamp",
  },
  {
    name: "Zhe Liu",
    quote:
      "I've built analytics products at Amazon and other companies, but it had been a long time since I coded an app from scratch myself. Today, I'm shipping a working product backed by LLM! The SnapDev team created something special. The support was exceptional from day one.",
    program: "SnapCamp",
  },
];
