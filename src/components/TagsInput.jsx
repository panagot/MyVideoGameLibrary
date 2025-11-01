import { useState, useRef, useEffect } from 'react'
import './TagsInput.css'

function TagsInput({ tags = [], allTags = [], onChange, placeholder = "Add tags..." }) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const filtered = allTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && 
        !tags.includes(tag)
      ).slice(0, 5)
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
      setFilteredSuggestions([])
    }
  }, [inputValue, allTags, tags])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    } else if (e.key === 'ArrowDown' && filteredSuggestions.length > 0) {
      e.preventDefault()
      // Could implement arrow navigation here
    }
  }

  const addTag = (tag) => {
    const normalizedTag = tag.toLowerCase().trim()
    if (normalizedTag && !tags.includes(normalizedTag)) {
      onChange([...tags, normalizedTag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index)
    onChange(newTags)
  }

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion)
  }

  return (
    <div className="tags-input-container" ref={containerRef}>
      <div className="tags-input-wrapper">
        {tags.map((tag, index) => (
          <span key={index} className="tag-item">
            {tag}
            <button
              type="button"
              className="tag-remove"
              onClick={() => removeTag(index)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="tags-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="tags-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="tags-suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagsInput

