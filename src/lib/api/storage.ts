export let asked: Array<any> = [];


export const sampleResponses = [
  "The Architecture Review Board is a formal entity responsible for evaluating and approving architectural designs and plans, ensuring compliance with established standards and regulations.",
  "GitHub is a web-based platform for version control and collaboration that allows developers to host, review, and manage code repositories. It facilitates efficient teamwork and enhances the overall software development process.",
  "Docker is a containerization platform that allows developers to package and deploy applications in a portable and efficient manner. It provides a lightweight and flexible environment for running applications, enabling faster development and deployment cycles. Docker has become a popular tool in the software development industry due to its ease of use and scalability.",
  "The cities in California are diverse and offer a wide range of opportunities for residents and visitors alike. From the bustling metropolis of Los Angeles to the scenic beauty of San Francisco, each city has its own unique character and charm. Additionally, California cities are known for their innovation and progressive attitudes, making them a hub for technology, entertainment, and culture. Overall, the cities in California are a testament to the state's rich history and bright future.",
  "In order to construct a desk, it is necessary to have a set of tools that are specifically designed for woodworking. These tools include a saw, a drill, a hammer, a measuring tape, a level, a square, a chisel, a plane, and sandpaper. It is important to ensure that these tools are of high quality and in good condition, as they will greatly affect the outcome of the project. Additionally, it is recommended to have a workbench or a sturdy surface to work on, as well as appropriate safety gear such as goggles and gloves. With these tools and precautions, one can successfully build a desk."
];


export const samplePrompt = `Answer the question based on the context below. If the question cannot be answered using the information provided, answer with "I don't know".

Context: <context>

Question: <question>

Answer: `;


export const sampleSources = [
  {
    id: 15,
    source_name: "ARB Docs",
    content: "The Architecture Review Board (ARB) is a formal entity responsible for evaluating and assessing architectural designs and plans. Its primary objective is to ensure that proposed architectural projects adhere to established standards, guidelines, and regulations. The ARB plays a crucial role in maintaining the integrity and quality of architectural developments within a given jurisdiction. Its decisions and recommendations are based on a thorough analysis of the proposed designs, taking into account factors such as aesthetics, functionality, sustainability, and compatibility with the surrounding environment. The ARB's expertise and authority contribute to the overall enhancement and preservation of the architectural landscape."
  },
  {
    id: 45,
    source_name: "Github Docs",
    content: "GitHub is a web-based platform that facilitates collaborative software development projects. It provides a centralized location for version control, allowing multiple developers to work on a project simultaneously. GitHub offers various features such as issue tracking, code review, and project management tools, making it an efficient and effective platform for software development teams. Additionally, GitHub allows for easy integration with other development tools and services, further enhancing its functionality. Overall, GitHub is a valuable resource for developers, enabling them to collaborate, track changes, and manage projects in a streamlined and organized manner."
  },
  {
    id: 6,
    source_name: "Docker Docs",
    content: "Docker is a containerization platform that enables developers to package applications and their dependencies into lightweight, portable containers. These containers can be easily deployed and run on any system that has Docker installed, regardless of the underlying operating system or hardware. Docker provides a consistent and reproducible environment for software development, allowing developers to build, test, and deploy applications with ease. Additionally, Docker offers a range of tools and features to manage and orchestrate containers, making it a valuable tool for both individual developers and large-scale enterprise deployments."
  },
  {
    id: 9,
    source_name: "California Docs",
    content: "San Francisco is a city located in the state of California, in the United States of America. It is known for its iconic landmarks such as the Golden Gate Bridge and Alcatraz Island. The city is also recognized for its diverse culture, vibrant nightlife, and thriving tech industry.",
  },
  {
    id: 24,
    source_name: "How to Build a Desk",
    content: `
    1. Begin by gathering all the necessary materials and tools required for the construction of the desk. These may include wood boards, screws, a screwdriver, a saw, a measuring tape, and sandpaper.
    
    2. Measure and mark the desired dimensions for the desk on the wood boards. Ensure accuracy and precision in these measurements to guarantee a well-constructed desk.
    
    3. Using the saw, carefully cut the wood boards according to the marked measurements. Take caution to maintain straight and clean cuts.
    
    4. Once the boards are cut, use sandpaper to smooth any rough edges or surfaces. This step is crucial for achieving a polished and professional appearance.
    
    5. Assemble the desk by aligning the cut boards in the desired configuration. Utilize screws and a screwdriver to securely fasten the boards together. Ensure that the screws are tightened adequately to guarantee stability.
    
    6. Double-check the alignment and stability of the desk structure. Make any necessary adjustments or reinforcements to ensure a sturdy and durable final product.
    
    7. Finally, inspect the desk for any imperfections or rough areas. Utilize sandpaper to further smoothen the surface, if needed.
    
    8. Once satisfied with the construction and finishing of the desk, it is ready for use. Place it in the desired location and enjoy the benefits of your newly constructed desk.
    
    Note: It is recommended to follow proper safety precautions, such as wearing protective gear and using tools correctly, throughout the construction process.
    `
  }
];