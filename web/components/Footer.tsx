import SocialIcon from "@/icons/SocialIcon";


export default function Footer() {
  return (
    <footer className="bg-white flex-shrink-0 ">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mt-6 border-t border-gray-900/10 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex gap-x-6 md:order-2">
            <a href="github.com/#" className="text-gray-600 hover:text-gray-800" title="Github">
              <span className="sr-only">Github</span>
              <SocialIcon network="github" className="size-7 rounded-full" />
            </a>
            <a href="substack.com/scotthendrix" className="text-gray-600 hover:text-gray-800" title="Substack">
              <span className="sr-only">Substack</span>
              <SocialIcon network="substack" className="size-7 rounded-full" />
            </a>
            <a href="medium.com/#" className="text-gray-600 hover:text-gray-800" title="Medium">
              <span className="sr-only">Medium</span>
              <SocialIcon network="medium" className="size-7 rounded-full" />
            </a>
          </div>
          <p className="mt-8 text-sm/6 text-gray-600 md:order-1 md:mt-0">
            &copy; 2025 Grocery Basket Demo, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}