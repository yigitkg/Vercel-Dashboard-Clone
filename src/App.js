import React, { useEffect, useState } from 'react'

/**
 * React component that renders a form to input key-value pairs
 * with the ability to add, remove, and paste multiple pairs at once
 * @returns {JSX.Element} The rendered component
 */
function App() {
  // State hook to store the key-value pairs
  const [items, setItems] = useState([
    {
      key: '',
      value: '',
    },
  ])

  // Effect hook to ensure there is always at least one pair
  useEffect(() => {
    if (items.length === 0) {
      setItems([
        {
          key: '',
          value: '',
        },
      ])
    }
  }, [items])

  /**
   * Handler function for pasting multiple key-value pairs at once
   * @param {ClipboardEvent} e - The paste event
   * @param {number} index - The index of the input field that triggered the paste event
   */
  const pasteHandle = (e, index) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    if (pastedData) {
      const arr = pastedData
        .split('\n')
        .map((text) => {
          if (/([\w]+)=(.+?)/.test(text)) {
            let [key, value] = text.split('=')
            let find = items.find((i) => i.key === key)
            if (!find || find?.key === items[index].key) {
              return {
                key,
                value,
              }
            }
          }
        })
        .filter(Boolean)
      if (arr.length) {
        setItems((items) => [...items.slice(0, index), ...arr, ...items.slice(index + 1)])
      }
    }
  }

  return (
    <div className="h-[100vh] bg-black">
      <div className="container mx-auto py-4">
        <div className="grid gap-y-4">
          {items.map((item, index) => (
            <div className="flex gap-x-4">
              <input
                onPaste={(e) => pasteHandle(e, index)}
                onChange={(e) => {
                  setItems((items) =>
                    items.map((item, i) => {
                      if (i === index) {
                        item.key = e.target.value
                      }
                      return item
                    })
                  )
                }}
                placeholder="Ex: API_URL"
                className="flex-1 h-10 placeholder:text-white/50 bg-white/5 border rounded border-white/20 text-sm px-3 text-white outline-none"
                type="text"
                value={item.key}
              />
              <input
                onChange={(e) => {
                  setItems((items) =>
                    items.map((item, i) => {
                      if (i === index) {
                        item.value = e.target.value
                      }
                      return item
                    })
                  )
                }}
                className="flex-1 h-10 placeholder:text-white/50 bg-white/5 border rounded border-white/20 text-sm px-3 text-white outline-none"
                type="text"
                value={item.value}
              />
              {items.length > 1 && (
                <button
                  onClick={() => setItems((items) => items.filter((_, key) => key !== index))}
                  className="h-10 w-10 bg-red-500 rounded text-white text-sm"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setItems((items) => [...items, { key: '', value: '' }])}
          className="h-10 px-4 rounded border border-blue-500 text-blue-500 flex items-center text-sm mt-4"
        >
          Add New
        </button>
        <pre className="bg-white/10 p-4 rounded text-white mt-4">
          {JSON.stringify(items, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default App
