import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type SidebarItem = {
  name: string;
  icon: string;
  href: string;
  section?: string;
};

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", icon: "dashboard-line", href: "/" },
  { name: "Collections", icon: "database-2-line", href: "/mongodb/collections", section: "MongoDB" },
  { name: "Queries", icon: "code-line", href: "/mongodb/queries", section: "MongoDB" },
  { name: "Aggregations", icon: "bar-chart-2-line", href: "/mongodb/aggregations", section: "MongoDB" },
  { name: "Graphs", icon: "share-circle-line", href: "/neo4j/graphs", section: "Neo4j" },
  { name: "Relationships", icon: "git-branch-line", href: "/neo4j/relationships", section: "Neo4j" },
  { name: "Cypher", icon: "terminal-line", href: "/neo4j/cypher", section: "Neo4j" },
  { name: "Data Bridge", icon: "link", href: "/integration/data-bridge", section: "Integration" },
  { name: "Sync History", icon: "history-line", href: "/integration/sync-history", section: "Integration" },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();

  // Group items by section
  const groupedItems: Record<string, SidebarItem[]> = {};
  sidebarItems.forEach(item => {
    if (item.section) {
      if (!groupedItems[item.section]) {
        groupedItems[item.section] = [];
      }
      groupedItems[item.section].push(item);
    }
  });

  // Get non-sectioned items
  const regularItems = sidebarItems.filter(item => !item.section);

  return (
    <div className={cn("relative", sidebarOpen ? "w-64" : "w-16")}>
      <div className={cn("h-full flex flex-col bg-neutral-dark text-white transition-all duration-300 ease-in-out", sidebarOpen ? "w-64" : "w-16")}>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/10">
          <svg className="h-8 w-8" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M127.979 6C138.156 18.4623 146.498 30.9247 152.006 44.7438C156.346 55.2493 159.518 66.1116 159.518 77.3308C159.518 93.9863 152.845 108.978 140.26 123.134C133.069 131.476 124.727 138.248 115.718 144.174C103.551 152.098 91.8046 159.708 90.5471 178.144C90.1276 182.484 90.1276 186.824 89.708 191.165L88.4506 203.751H88.0311V196.142C88.0311 183.741 90.1276 171.76 97.3189 162.333C100.071 158.411 103.551 154.904 107.054 151.26C118.889 140.345 133.907 132.003 142.497 117.428C145.52 111.921 147.616 105.994 148.455 100.066C149.704 90.8177 148.874 81.5692 147.197 72.4576C145.659 64.1152 141.738 56.5069 138.156 49.0828C130.232 33.8596 117.414 21.9673 106.215 8.98486C105.796 8.56533 104.958 7.30788 104.539 6.41926H99.7797L98.5222 47.767L96.4257 47.3475L96.8452 6.41926H92.0856V47.767H89.2885V6.41926H84.5288L84.9483 47.3475L82.8518 47.767L81.1748 6H78.1824L67.2582 34.6972L65.581 34.2776L72.7724 6H68.0127L62.5054 25.8864V6.41926H58.5854L48.9178 42.6472L46.8213 42.2277L56.4889 6H51.7293L44.7249 31.7633V6H25.8707L16.6221 43.0668L14.5256 42.6472L24.1932 6H19.4336L10.185 43.0668L8.50805 42.6472L17.0416 6H13.1216L3.32945 53.9311L7.66942 54.7697L13.8446 26.7255L15.5215 27.1451L9.76611 54.7697L14.1061 55.6084L20.2813 27.1451L21.9583 27.5647L15.3646 55.6084L19.7045 56.4471L26.2992 27.9843L28.0018 28.4038L22.3778 56.4471L26.7177 57.2857L33.3124 29.2425L35.015 29.6621L29.3909 57.2857L33.7309 58.1244C33.7309 58.1244 37.5247 60.0651 38.2612 60.2209C39.1313 60.3766 39.9229 59.6982 39.9229 58.8282C39.9229 58.4087 39.6424 57.1298 39.6424 57.1298L40.7813 29.6621L42.4583 30.0817L40.9034 57.1298C40.9034 57.1298 40.3622 59.4549 41.0217 60.2209C41.8137 61.143 42.7593 60.8468 43.4373 60.2209C44.2038 59.5265 47.9169 57.2857 47.9169 57.2857L52.2569 58.1244L58.8516 30.9204L60.5542 31.3399L54.9301 58.1244L59.27 58.9631L65.8647 31.7595L67.5673 32.179L61.9432 58.9631L66.2832 59.8017L72.8779 33.0183L74.5805 33.4378L68.9564 59.8017L73.2963 60.6404L79.8911 34.2766L81.5937 34.6972L75.9695 60.6404L80.3095 61.479L87.8042 36.2316C87.8042 36.2316 88.6443 51.9915 89.2885 61.479C90.1276 74.0095 88.8702 86.5399 88.0311 99.0704C87.1921 105.415 86.2052 111.503 83.2713 117.428C82.4322 119.106 81.1748 120.363 80.3357 122.041C77.4019 127.894 73.8962 132.841 70.3906 138.258C66.4706 144.593 62.9649 150.929 60.0311 157.683C57.3582 164.424 55.8075 171.423 55.8075 178.991C55.8075 183.731 55.8075 188.914 56.7354 193.621C57.1354 196.142 57.5356 198.496 58.0156 201.654C58.4352 204.174 60.1122 203.751 59.2731 206.271H95.5878C96.0073 206.271 96.8464 209.357 96.8464 206.69V203.751H168.109C168.529 206.271 169.368 209.21 170.626 211.731C176.962 224.131 184.048 236.112 194.216 246.28C194.636 246.699 195.894 248.377 196.333 248.801H205.762C197.179 239.624 184.779 226.644 180.44 215.237C179.292 212.384 178.383 209.435 177.801 206.69H197.153L196.753 205.012L182.117 198.657C181.698 193.061 181.917 187.399 181.917 181.854C181.917 171.348 184.438 161.261 189.196 151.665C193.797 142.598 200.15 134.674 207.341 127.474C214.532 120.283 222.456 113.092 228.801 104.444C235.146 95.7971 240.335 85.2916 241.173 74.3681C242.012 63.0266 240.335 51.2646 236.833 40.3408C222.875 0.0123291 172.723 0.0123291 166.378 0.0123291C162.038 0.0123291 159.109 0.0123291 154.769 0.0123291C150.429 0.0123291 142.089 2.5329 138.575 4.62946C133.816 6.72601 133.397 10.2317 127.979 6.00001V6Z" fill="#00684A"/>
          </svg>
          {sidebarOpen && <span className="ml-2 font-bold text-xl">NoSQL Hub</span>}
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto pt-4">
          <ul>
            {/* Main Nav Items (without section) */}
            {regularItems.map((item) => (
              <li key={item.name} className="mb-1">
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center py-2 px-4 text-white hover:bg-mongodb-primary/30 rounded-r transition-colors",
                    location === item.href && "bg-mongodb-primary/20"
                  )}
                >
                  <i className={`ri-${item.icon} text-xl`}></i>
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
            
            {/* Sectioned Nav Items */}
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                {sidebarOpen && (
                  <li className="mt-6 mb-2 px-4">
                    <h3 className="text-xs uppercase text-white/60 font-semibold">{section}</h3>
                  </li>
                )}
                {items.map((item) => (
                  <li key={item.name} className="mb-1">
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center py-2 px-4 text-white rounded-r transition-colors",
                        location === item.href 
                          ? section === "MongoDB" 
                            ? "bg-mongodb-primary/20 hover:bg-mongodb-primary/30" 
                            : section === "Neo4j" 
                              ? "bg-neodb-primary/20 hover:bg-neodb-primary/30"
                              : "bg-white/10 hover:bg-white/20"
                          : section === "MongoDB" 
                            ? "hover:bg-mongodb-primary/30" 
                            : section === "Neo4j" 
                              ? "hover:bg-neodb-primary/30"
                              : "hover:bg-white/10"
                      )}
                    >
                      <i className={`ri-${item.icon} text-xl`}></i>
                      {sidebarOpen && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                ))}
              </div>
            ))}
          </ul>
        </nav>
        
        {/* Bottom Controls */}
        <div className="p-4 border-t border-white/10">
          <button 
            className="w-full flex items-center justify-center py-2 text-white hover:bg-white/10 rounded transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="ri-arrow-left-right-line text-xl"></i>
            {sidebarOpen && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
