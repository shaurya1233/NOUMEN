/* ============================================================
   SHAURYA MITTAL
   TYPESCRIPT DEVELOPMENT SHOWCASE
   ============================================================

   File        : example.ts
   Version     : 1.0.0
   Language    : TypeScript
   Category    : Software Development

   Demonstrates:
   - TypeScript interfaces
   - Custom types
   - Classes and encapsulation
   - Generics
   - Type-safe functions
   - Data validation
   - Project management
   - Search and filtering
   - Utility functions
   - Error handling

   ============================================================ */


/* ============================================================
   01. APPLICATION CONFIGURATION
   ============================================================ */

const CONFIG = {
    applicationName: "Shaurya Developer Profile",
    version: "1.0.0",
    developer: "Shaurya Mittal",
    username: "shaurya1233",
    environment: "development"
} as const;


/* ============================================================
   02. CUSTOM TYPES
   ============================================================ */

type ProjectCategory =
    | "portfolio"
    | "web-development"
    | "software"
    | "business"
    | "web-experiment";

type ProjectStatus =
    | "published"
    | "development"
    | "archived";

type SocialPlatform =
    | "github"
    | "linkedin"
    | "instagram"
    | "leetcode"
    | "codepen"
    | "mastodon"
    | "bluesky";


/* ============================================================
   03. DEVELOPER INTERFACE
   ============================================================ */

interface Developer {
    readonly name: string;
    readonly username: string;
    readonly title: string;
    readonly location: string;

    interests: string[];

    website?: string;
    github?: string;
}


/* ============================================================
   04. PROJECT INTERFACE
   ============================================================ */

interface Project {
    readonly id: string;
    name: string;
    description: string;

    category: ProjectCategory;
    status: ProjectStatus;

    url: string;
    technologies: string[];

    featured?: boolean;
}


/* ============================================================
   05. SOCIAL LINK INTERFACE
   ============================================================ */

interface SocialLink {
    platform: SocialPlatform;
    label: string;
    url: string;
}


/* ============================================================
   06. DEVELOPER PROFILE
   ============================================================ */

const developer: Developer = {
    name: "Shaurya Mittal",

    username: "shaurya1233",

    title: "Student Developer · AI-Assisted Digital Creator",

    location: "Lucknow, Uttar Pradesh, India",

    interests: [
        "Web Development",
        "Software Development",
        "Artificial Intelligence",
        "Frontend Development",
        "Creative Technology",
        "Digital Product Creation"
    ],

    website: "https://shaurya1233.github.io/NOUMEN/",

    github: "https://github.com/shaurya1233"
};


/* ============================================================
   07. PROJECT DATABASE
   ============================================================ */

const projects: Project[] = [

    {
        id: "noumen",

        name: "NOUMEN",

        description:
            "Personal portfolio and digital development showcase.",

        category: "portfolio",

        status: "published",

        url: "https://shaurya1233.github.io/NOUMEN/",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript"
        ],

        featured: true
    },

    {
        id: "mittal-reserve",

        name: "Mittal Reserve",

        description:
            "Premium digital property and hospitality concept.",

        category: "web-development",

        status: "published",

        url: "https://mittal-reserve.vercel.app/",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript"
        ],

        featured: true
    },

    {
        id: "aurex",

        name: "AUREX Calculator",

        description:
            "Browser-based calculator project.",

        category: "software",

        status: "published",

        url:
            "https://shaurya1233.github.io/AUREX-MITTAL-CALCULATOR/",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript"
        ]
    },

    {
        id: "obsidian-developers",

        name: "Obsidian Developers",

        description:
            "Digital development and website creation initiative.",

        category: "business",

        status: "published",

        url: "https://obsidian-developers.vercel.app/",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript"
        ]
    },

    {
        id: "windows-11",

        name: "Windows 11 SHAURYA OS",

        description:
            "Browser-based desktop interface experiment.",

        category: "web-experiment",

        status: "published",

        url:
            "https://shaurya1233.github.io/WINDOWS-11-Ultimate/",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript"
        ]
    }

];


/* ============================================================
   08. SOCIAL DIRECTORY
   ============================================================ */

const socialLinks: SocialLink[] = [

    {
        platform: "github",
        label: "GitHub",
        url: "https://github.com/shaurya1233"
    },

    {
        platform: "instagram",
        label: "Instagram",
        url: "https://www.instagram.com/shaurya_mittal31/"
    },

    {
        platform: "leetcode",
        label: "LeetCode",
        url: "https://leetcode.com/u/Qlk0uRwuTh/"
    },

    {
        platform: "codepen",
        label: "CodePen",
        url: "https://codepen.io/SHAURYA-MITTAL-the-bashful"
    },

    {
        platform: "mastodon",
        label: "Mastodon",
        url: "https://mastodon.social/@shaurya_dev"
    },

    {
        platform: "bluesky",
        label: "Bluesky",
        url:
            "https://bsky.app/profile/mittalshaurya66-06.bsky.social"
    }

];


/* ============================================================
   09. GENERIC API RESPONSE
   ============================================================ */

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

function createResponse<T>(
    data: T,
    message: string
): ApiResponse<T> {

    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
}


/* ============================================================
   10. PROFILE SERVICE
   ============================================================ */

class ProfileService {

    private readonly profile: Developer;

    constructor(profile: Developer) {
        this.profile = profile;
    }

    getProfile(): Developer {
        return this.profile;
    }

    getName(): string {
        return this.profile.name;
    }

    getInterests(): string[] {
        return [...this.profile.interests];
    }

    getWebsite(): string | undefined {
        return this.profile.website;
    }

    hasInterest(interest: string): boolean {

        return this.profile.interests.some(
            item =>
                item.toLowerCase() === interest.toLowerCase()
        );
    }
}


/* ============================================================
   11. PROJECT SERVICE
   ============================================================ */

class ProjectService {

    private readonly projectList: Project[];

    constructor(initialProjects: Project[]) {
        this.projectList = [...initialProjects];
    }

    getAll(): Project[] {
        return [...this.projectList];
    }

    getById(id: string): Project | undefined {

        return this.projectList.find(
            project => project.id === id
        );
    }

    getByCategory(
        category: ProjectCategory
    ): Project[] {

        return this.projectList.filter(
            project => project.category === category
        );
    }

    getByStatus(
        status: ProjectStatus
    ): Project[] {

        return this.projectList.filter(
            project => project.status === status
        );
    }

    getFeatured(): Project[] {

        return this.projectList.filter(
            project => project.featured === true
        );
    }

    search(query: string): Project[] {

        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return [];
        }

        return this.projectList.filter(project => {

            const searchableContent = [
                project.name,
                project.description,
                project.category,
                ...project.technologies
            ].join(" ").toLowerCase();

            return searchableContent.includes(normalizedQuery);
        });
    }

    getTotalCount(): number {
        return this.projectList.length;
    }
}


/* ============================================================
   12. SOCIAL SERVICE
   ============================================================ */

class SocialService {

    private readonly links: SocialLink[];

    constructor(links: SocialLink[]) {
        this.links = [...links];
    }

    getAll(): SocialLink[] {
        return [...this.links];
    }

    getByPlatform(
        platform: SocialPlatform
    ): SocialLink | undefined {

        return this.links.find(
            link => link.platform === platform
        );
    }
}


/* ============================================================
   13. URL VALIDATION
   ============================================================ */

function isValidUrl(value: string): boolean {

    try {

        const url = new URL(value);

        return (
            url.protocol === "https:" ||
            url.protocol === "http:"
        );

    } catch {

        return false;
    }
}


/* ============================================================
   14. TEXT UTILITIES
   ============================================================ */

const TextUtils = {

    capitalize(value: string): string {

        if (!value) return "";

        return (
            value.charAt(0).toUpperCase() +
            value.slice(1)
        );
    },

    slugify(value: string): string {

        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    },

    wordCount(value: string): number {

        const trimmed = value.trim();

        if (!trimmed) return 0;

        return trimmed.split(/\s+/).length;
    },

    truncate(
        value: string,
        maximumLength: number
    ): string {

        if (maximumLength < 0) {
            throw new Error(
                "Maximum length cannot be negative."
            );
        }

        if (value.length <= maximumLength) {
            return value;
        }

        return value.slice(0, maximumLength) + "...";
    }
};


/* ============================================================
   15. COLLECTION UTILITIES
   ============================================================ */

function uniqueValues<T>(values: T[]): T[] {

    return [...new Set(values)];
}

function groupBy<T, K extends string | number>(
    items: T[],
    getKey: (item: T) => K
): Map<K, T[]> {

    const groups = new Map<K, T[]>();

    for (const item of items) {

        const key = getKey(item);

        const existing = groups.get(key) ?? [];

        existing.push(item);

        groups.set(key, existing);
    }

    return groups;
}


/* ============================================================
   16. STATISTICS
   ============================================================ */

interface ProjectStatistics {
    total: number;
    featured: number;
    published: number;
    categories: number;
}

function getProjectStatistics(
    projectList: Project[]
): ProjectStatistics {

    const categories = new Set(
        projectList.map(project => project.category)
    );

    return {
        total: projectList.length,

        featured: projectList.filter(
            project => project.featured === true
        ).length,

        published: projectList.filter(
            project => project.status === "published"
        ).length,

        categories: categories.size
    };
}


/* ============================================================
   17. APPLICATION INITIALIZATION
   ============================================================ */

const profileService = new ProfileService(developer);

const projectService = new ProjectService(projects);

const socialService = new SocialService(socialLinks);


/* ============================================================
   18. APPLICATION DATA
   ============================================================ */

const applicationData = {

    configuration: CONFIG,

    developer: profileService.getProfile(),

    projects: projectService.getAll(),

    social: socialService.getAll(),

    statistics: getProjectStatistics(
        projectService.getAll()
    )

};


/* ============================================================
   19. APPLICATION DEMONSTRATION
   ============================================================ */

function runDemonstration(): void {

    console.log("================================");

    console.log(
        CONFIG.applicationName
    );

    console.log(
        `Version: ${CONFIG.version}`
    );

    console.log("================================");

    console.log(
        "Developer:",
        profileService.getName()
    );

    console.log(
        "Website:",
        profileService.getWebsite()
    );

    console.log(
        "Total projects:",
        projectService.getTotalCount()
    );

    console.log(
        "Featured projects:",
        projectService.getFeatured()
    );

    console.log(
        "Project statistics:",
        getProjectStatistics(
            projectService.getAll()
        )
    );

    console.log(
        "Search results:",
        projectService.search("web")
    );

    console.log(
        "API response:",
        createResponse(
            applicationData,
            "Developer information loaded."
        )
    );

    console.log("================================");
}


/* ============================================================
   20. EXPORTS
   ============================================================ */

export {
    CONFIG,

    developer,

    projects,

    socialLinks,

    applicationData,

    ProfileService,

    ProjectService,

    SocialService,

    TextUtils,

    createResponse,

    isValidUrl,

    uniqueValues,

    groupBy,

    getProjectStatistics,

    runDemonstration
};


/* ============================================================
   END OF TYPESCRIPT DEMONSTRATION
   SHAURYA MITTAL
   ============================================================ */
