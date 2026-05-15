'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

interface NamedColor {
  name: string
  hex: string
  r: number
  g: number
  b: number
}

// CSS named colors (subset of well-known ones)
const CSS_COLORS: NamedColor[] = [
  { name: 'AliceBlue', hex: '#F0F8FF', r: 240, g: 248, b: 255 },
  { name: 'AntiqueWhite', hex: '#FAEBD7', r: 250, g: 235, b: 215 },
  { name: 'Aqua', hex: '#00FFFF', r: 0, g: 255, b: 255 },
  { name: 'Aquamarine', hex: '#7FFFD4', r: 127, g: 255, b: 212 },
  { name: 'Azure', hex: '#F0FFFF', r: 240, g: 255, b: 255 },
  { name: 'Beige', hex: '#F5F5DC', r: 245, g: 245, b: 220 },
  { name: 'Bisque', hex: '#FFE4C4', r: 255, g: 228, b: 196 },
  { name: 'Black', hex: '#000000', r: 0, g: 0, b: 0 },
  { name: 'BlanchedAlmond', hex: '#FFEBCD', r: 255, g: 235, b: 205 },
  { name: 'Blue', hex: '#0000FF', r: 0, g: 0, b: 255 },
  { name: 'BlueViolet', hex: '#8A2BE2', r: 138, g: 43, b: 226 },
  { name: 'Brown', hex: '#A52A2A', r: 165, g: 42, b: 42 },
  { name: 'BurlyWood', hex: '#DEB887', r: 222, g: 184, b: 135 },
  { name: 'CadetBlue', hex: '#5F9EA0', r: 95, g: 158, b: 160 },
  { name: 'Chartreuse', hex: '#7FFF00', r: 127, g: 255, b: 0 },
  { name: 'Chocolate', hex: '#D2691E', r: 210, g: 105, b: 30 },
  { name: 'Coral', hex: '#FF7F50', r: 255, g: 127, b: 80 },
  { name: 'CornflowerBlue', hex: '#6495ED', r: 100, g: 149, b: 237 },
  { name: 'Crimson', hex: '#DC143C', r: 220, g: 20, b: 60 },
  { name: 'Cyan', hex: '#00FFFF', r: 0, g: 255, b: 255 },
  { name: 'DarkBlue', hex: '#00008B', r: 0, g: 0, b: 139 },
  { name: 'DarkCyan', hex: '#008B8B', r: 0, g: 139, b: 139 },
  { name: 'DarkGoldenRod', hex: '#B8860B', r: 184, g: 134, b: 11 },
  { name: 'DarkGray', hex: '#A9A9A9', r: 169, g: 169, b: 169 },
  { name: 'DarkGreen', hex: '#006400', r: 0, g: 100, b: 0 },
  { name: 'DarkKhaki', hex: '#BDB76B', r: 189, g: 183, b: 107 },
  { name: 'DarkMagenta', hex: '#8B008B', r: 139, g: 0, b: 139 },
  { name: 'DarkOliveGreen', hex: '#556B2F', r: 85, g: 107, b: 47 },
  { name: 'DarkOrange', hex: '#FF8C00', r: 255, g: 140, b: 0 },
  { name: 'DarkOrchid', hex: '#9932CC', r: 153, g: 50, b: 204 },
  { name: 'DarkRed', hex: '#8B0000', r: 139, g: 0, b: 0 },
  { name: 'DarkSalmon', hex: '#E9967A', r: 233, g: 150, b: 122 },
  { name: 'DarkSeaGreen', hex: '#8FBC8F', r: 143, g: 188, b: 143 },
  { name: 'DarkSlateBlue', hex: '#483D8B', r: 72, g: 61, b: 139 },
  { name: 'DarkSlateGray', hex: '#2F4F4F', r: 47, g: 79, b: 79 },
  { name: 'DarkTurquoise', hex: '#00CED1', r: 0, g: 206, b: 209 },
  { name: 'DarkViolet', hex: '#9400D3', r: 148, g: 0, b: 211 },
  { name: 'DeepPink', hex: '#FF1493', r: 255, g: 20, b: 147 },
  { name: 'DeepSkyBlue', hex: '#00BFFF', r: 0, g: 191, b: 255 },
  { name: 'DimGray', hex: '#696969', r: 105, g: 105, b: 105 },
  { name: 'DodgerBlue', hex: '#1E90FF', r: 30, g: 144, b: 255 },
  { name: 'FireBrick', hex: '#B22222', r: 178, g: 34, b: 34 },
  { name: 'FloralWhite', hex: '#FFFAF0', r: 255, g: 250, b: 240 },
  { name: 'ForestGreen', hex: '#228B22', r: 34, g: 139, b: 34 },
  { name: 'Fuchsia', hex: '#FF00FF', r: 255, g: 0, b: 255 },
  { name: 'Gainsboro', hex: '#DCDCDC', r: 220, g: 220, b: 220 },
  { name: 'GhostWhite', hex: '#F8F8FF', r: 248, g: 248, b: 255 },
  { name: 'Gold', hex: '#FFD700', r: 255, g: 215, b: 0 },
  { name: 'GoldenRod', hex: '#DAA520', r: 218, g: 165, b: 32 },
  { name: 'Gray', hex: '#808080', r: 128, g: 128, b: 128 },
  { name: 'Green', hex: '#008000', r: 0, g: 128, b: 0 },
  { name: 'GreenYellow', hex: '#ADFF2F', r: 173, g: 255, b: 47 },
  { name: 'HotPink', hex: '#FF69B4', r: 255, g: 105, b: 180 },
  { name: 'IndianRed', hex: '#CD5C5C', r: 205, g: 92, b: 92 },
  { name: 'Indigo', hex: '#4B0082', r: 75, g: 0, b: 130 },
  { name: 'Ivory', hex: '#FFFFF0', r: 255, g: 255, b: 240 },
  { name: 'Khaki', hex: '#F0E68C', r: 240, g: 230, b: 140 },
  { name: 'Lavender', hex: '#E6E6FA', r: 230, g: 230, b: 250 },
  { name: 'LawnGreen', hex: '#7CFC00', r: 124, g: 252, b: 0 },
  { name: 'LightBlue', hex: '#ADD8E6', r: 173, g: 216, b: 230 },
  { name: 'LightCoral', hex: '#F08080', r: 240, g: 128, b: 128 },
  { name: 'LightCyan', hex: '#E0FFFF', r: 224, g: 255, b: 255 },
  { name: 'LightGray', hex: '#D3D3D3', r: 211, g: 211, b: 211 },
  { name: 'LightGreen', hex: '#90EE90', r: 144, g: 238, b: 144 },
  { name: 'LightPink', hex: '#FFB6C1', r: 255, g: 182, b: 193 },
  { name: 'LightSalmon', hex: '#FFA07A', r: 255, g: 160, b: 122 },
  { name: 'LightSeaGreen', hex: '#20B2AA', r: 32, g: 178, b: 170 },
  { name: 'LightSkyBlue', hex: '#87CEFA', r: 135, g: 206, b: 250 },
  { name: 'LightSlateGray', hex: '#778899', r: 119, g: 136, b: 153 },
  { name: 'LightSteelBlue', hex: '#B0C4DE', r: 176, g: 196, b: 222 },
  { name: 'LightYellow', hex: '#FFFFE0', r: 255, g: 255, b: 224 },
  { name: 'Lime', hex: '#00FF00', r: 0, g: 255, b: 0 },
  { name: 'LimeGreen', hex: '#32CD32', r: 50, g: 205, b: 50 },
  { name: 'Linen', hex: '#FAF0E6', r: 250, g: 240, b: 230 },
  { name: 'Magenta', hex: '#FF00FF', r: 255, g: 0, b: 255 },
  { name: 'Maroon', hex: '#800000', r: 128, g: 0, b: 0 },
  { name: 'MediumAquaMarine', hex: '#66CDAA', r: 102, g: 205, b: 170 },
  { name: 'MediumBlue', hex: '#0000CD', r: 0, g: 0, b: 205 },
  { name: 'MediumOrchid', hex: '#BA55D3', r: 186, g: 85, b: 211 },
  { name: 'MediumPurple', hex: '#9370DB', r: 147, g: 112, b: 219 },
  { name: 'MediumSeaGreen', hex: '#3CB371', r: 60, g: 179, b: 113 },
  { name: 'MediumSlateBlue', hex: '#7B68EE', r: 123, g: 104, b: 238 },
  { name: 'MediumSpringGreen', hex: '#00FA9A', r: 0, g: 250, b: 154 },
  { name: 'MediumTurquoise', hex: '#48D1CC', r: 72, g: 209, b: 204 },
  { name: 'MediumVioletRed', hex: '#C71585', r: 199, g: 21, b: 133 },
  { name: 'MidnightBlue', hex: '#191970', r: 25, g: 25, b: 112 },
  { name: 'MintCream', hex: '#F5FFFA', r: 245, g: 255, b: 250 },
  { name: 'MistyRose', hex: '#FFE4E1', r: 255, g: 228, b: 225 },
  { name: 'Moccasin', hex: '#FFE4B5', r: 255, g: 228, b: 181 },
  { name: 'NavajoWhite', hex: '#FFDEAD', r: 255, g: 222, b: 173 },
  { name: 'Navy', hex: '#000080', r: 0, g: 0, b: 128 },
  { name: 'OldLace', hex: '#FDF5E6', r: 253, g: 245, b: 230 },
  { name: 'Olive', hex: '#808000', r: 128, g: 128, b: 0 },
  { name: 'OliveDrab', hex: '#6B8E23', r: 107, g: 142, b: 35 },
  { name: 'Orange', hex: '#FFA500', r: 255, g: 165, b: 0 },
  { name: 'OrangeRed', hex: '#FF4500', r: 255, g: 69, b: 0 },
  { name: 'Orchid', hex: '#DA70D6', r: 218, g: 112, b: 214 },
  { name: 'PaleGoldenRod', hex: '#EEE8AA', r: 238, g: 232, b: 170 },
  { name: 'PaleGreen', hex: '#98FB98', r: 152, g: 251, b: 152 },
  { name: 'PaleTurquoise', hex: '#AFEEEE', r: 175, g: 238, b: 238 },
  { name: 'PaleVioletRed', hex: '#DB7093', r: 219, g: 112, b: 147 },
  { name: 'PapayaWhip', hex: '#FFEFD5', r: 255, g: 239, b: 213 },
  { name: 'PeachPuff', hex: '#FFDAB9', r: 255, g: 218, b: 185 },
  { name: 'Peru', hex: '#CD853F', r: 205, g: 133, b: 63 },
  { name: 'Pink', hex: '#FFC0CB', r: 255, g: 192, b: 203 },
  { name: 'Plum', hex: '#DDA0DD', r: 221, g: 160, b: 221 },
  { name: 'PowderBlue', hex: '#B0E0E6', r: 176, g: 224, b: 230 },
  { name: 'Purple', hex: '#800080', r: 128, g: 0, b: 128 },
  { name: 'RebeccaPurple', hex: '#663399', r: 102, g: 51, b: 153 },
  { name: 'Red', hex: '#FF0000', r: 255, g: 0, b: 0 },
  { name: 'RosyBrown', hex: '#BC8F8F', r: 188, g: 143, b: 143 },
  { name: 'RoyalBlue', hex: '#4169E1', r: 65, g: 105, b: 225 },
  { name: 'SaddleBrown', hex: '#8B4513', r: 139, g: 69, b: 19 },
  { name: 'Salmon', hex: '#FA8072', r: 250, g: 128, b: 114 },
  { name: 'SandyBrown', hex: '#F4A460', r: 244, g: 164, b: 96 },
  { name: 'SeaGreen', hex: '#2E8B57', r: 46, g: 139, b: 87 },
  { name: 'SeaShell', hex: '#FFF5EE', r: 255, g: 245, b: 238 },
  { name: 'Sienna', hex: '#A0522D', r: 160, g: 82, b: 45 },
  { name: 'Silver', hex: '#C0C0C0', r: 192, g: 192, b: 192 },
  { name: 'SkyBlue', hex: '#87CEEB', r: 135, g: 206, b: 235 },
  { name: 'SlateBlue', hex: '#6A5ACD', r: 106, g: 90, b: 205 },
  { name: 'SlateGray', hex: '#708090', r: 112, g: 128, b: 144 },
  { name: 'Snow', hex: '#FFFAFA', r: 255, g: 250, b: 250 },
  { name: 'SpringGreen', hex: '#00FF7F', r: 0, g: 255, b: 127 },
  { name: 'SteelBlue', hex: '#4682B4', r: 70, g: 130, b: 180 },
  { name: 'Tan', hex: '#D2B48C', r: 210, g: 180, b: 140 },
  { name: 'Teal', hex: '#008080', r: 0, g: 128, b: 128 },
  { name: 'Thistle', hex: '#D8BFD8', r: 216, g: 191, b: 216 },
  { name: 'Tomato', hex: '#FF6347', r: 255, g: 99, b: 71 },
  { name: 'Turquoise', hex: '#40E0D0', r: 64, g: 224, b: 208 },
  { name: 'Violet', hex: '#EE82EE', r: 238, g: 130, b: 238 },
  { name: 'Wheat', hex: '#F5DEB3', r: 245, g: 222, b: 179 },
  { name: 'White', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { name: 'WhiteSmoke', hex: '#F5F5F5', r: 245, g: 245, b: 245 },
  { name: 'Yellow', hex: '#FFFF00', r: 255, g: 255, b: 0 },
  { name: 'YellowGreen', hex: '#9ACD32', r: 154, g: 205, b: 50 },
]

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.trim()
  if (h.startsWith('#')) h = h.slice(1)
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
}

function colorDistance(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  )
}

function findClosestName(rgb: { r: number; g: number; b: number }): NamedColor {
  let closest = CSS_COLORS[0]
  let minDist = Infinity
  for (const c of CSS_COLORS) {
    const dist = colorDistance(rgb, { r: c.r, g: c.g, b: c.b })
    if (dist < minDist) {
      minDist = dist
      closest = c
    }
  }
  return closest
}

export default function ColorNamesPage() {
  const [input, setInput] = useState('#663399')
  const [matchedColor, setMatchedColor] = useState<{ inputHex: string; named: NamedColor; inputRgb: { r: number; g: number; b: number } } | null>(null)

  const match = () => {
    const rgb = hexToRgb(input)
    if (!rgb) return
    const hex = '#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('')
    const named = findClosestName(rgb)
    setMatchedColor({ inputHex: hex.toUpperCase(), named, inputRgb: rgb })
  }

  const isLight = matchedColor
    ? (matchedColor.inputRgb.r * 299 + matchedColor.inputRgb.g * 587 + matchedColor.inputRgb.b * 114) / 1000 > 128
    : false

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Color Name Finder Free Online — Find Color Names</h1>
      <p className="text-gray-500 mb-6">Free online color name finder. Enter any HEX or RGB color and find its closest named CSS color. Browse common color names with previews.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex gap-2 mb-6">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter HEX (e.g., #663399 or 663399)"
            className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono" />
          <button onClick={match}
            className="px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Find Name
          </button>
        </div>

        {matchedColor && (
          <div className="space-y-4">
            {/* Preview */}
            <div className="h-32 rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: matchedColor.inputHex }}>
              <span className={`text-xl font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>
                {matchedColor.inputHex}
              </span>
            </div>

            {/* Result */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Color</div>
                <div className="font-mono font-semibold">{matchedColor.inputHex}</div>
                <div className="text-sm text-gray-500">rgb({matchedColor.inputRgb.r}, {matchedColor.inputRgb.g}, {matchedColor.inputRgb.b})</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Closest Named Color</div>
                <div className="font-bold text-lg">{matchedColor.named.name}</div>
                <div className="font-mono text-sm">{matchedColor.named.hex}</div>
                <div className="flex gap-1 mt-2 justify-center">
                  <div className="w-6 h-6 rounded border" style={{ backgroundColor: matchedColor.inputHex }} />
                  <div className="w-6 h-6 rounded border" style={{ backgroundColor: matchedColor.named.hex }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {!matchedColor && input.length > 0 && (
          <p className="text-red-500 text-sm text-center">Please enter a valid HEX color code (e.g., #FF5733 or FF5733).</p>
        )}
      </div>

      {/* Color Name Browser */}
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Common CSS Color Names</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {CSS_COLORS.map(c => (
            <div key={c.name}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
              onClick={() => { setInput(c.hex.replace('#', '')); setTimeout(match, 0) }}>
              <div className="w-6 h-6 rounded border flex-shrink-0" style={{ backgroundColor: c.hex }} />
              <span className="text-xs truncate">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Enter a HEX color code (with or without the # prefix) in the input field.</li>
          <li>Click &ldquo;Find Name&rdquo; to see the closest named CSS color.</li>
          <li>View your input color alongside the matched color name with preview.</li>
          <li>Browse the list of common CSS color names below for reference.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>The color matching uses Euclidean distance in RGB space to find the closest named color.</li>
          <li>Use CSS named colors in your stylesheets for better code readability (e.g., <code>color: rebeccapurple</code>).</li>
          <li>Click any color name in the browser to instantly look up its match.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>How does the color name matching work?</h3>
          <p>The tool calculates the Euclidean distance between your input color and all 148 CSS named colors in RGB space, returning the closest match.</p>
          <h3>Can I use RGB input instead of HEX?</h3>
          <p>Currently the tool accepts HEX input. You can easily convert RGB to HEX using online converters or our color converter tool.</p>
          <h3>Are all CSS named colors included?</h3>
          <p>Yes, all 148 standard CSS named colors are included in the lookup database, from AliceBlue to YellowGreen.</p>
        </div>
      </section>
    </div>
  )
}
