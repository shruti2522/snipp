import { FaRegFolderOpen } from "react-icons/fa6";
import { TiCloudStorage } from "react-icons/ti";
import { MdAssistantNavigation } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { FaShare } from "react-icons/fa";

export default function Features() {
  return (
    <section
      id="features"
      className="w-full py-20 bg-gradient-to-br from-[#1A1D29] via-[#222637] to-[#1A1D29] text-white"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold sm:text-5xl">
          Everything you need in one platform
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Best-in-class tools to keep your snippets organized, accessible, and in sync.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <FaRegFolderOpen size={30} />,
              title: "Workspace and Collection Management",
              text: "Create, organize workspaces and collections for efficient project and code management."
            },
            {
              icon: <TiCloudStorage size={30} />,
              title: "Effortless Snippet Storage",
              text: "Unlimited code snippets saved per collection for easy access."
            },
            {
              icon: <MdAssistantNavigation size={30} />,
              title: "Intuitive Navigation",
              text: "Smooth transition between workspaces and collections for streamlined management."
            },
            {
              icon: <FaSearch size={30} />,
              title: "Global Search Functionality",
              text: "Powerful search across all workspaces and collections for quick code retrieval."
            },
            {
              icon: <CiShare2 size={30} />,
              title: "Collaborative Workspace Sharing",
              text: "Share workspaces with team members for seamless project collaboration."
            },
            {
              icon: <FaShare size={30} />,
              title: "Flexible Sharing Options",
              text: "Share snippets via links or email for easy collaboration."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 space-y-4 bg-black/20 rounded-lg border border-transparent hover:border-indigo-400 hover:bg-black/30 hover:scale-[1.02] transition-all"
            >
              <div className="text-indigo-400">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-center text-sm text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
