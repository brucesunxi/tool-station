export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <span className="font-bold">ToolStation</span>
            </div>
            <p className="text-sm text-gray-500">
              Free online tools powered by AI. Process images, PDFs, and more in your browser.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Tools</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Image Compress</li>
              <li>Background Remover</li>
              <li>PDF Merge</li>
              <li>Format Converter</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ToolStation. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
