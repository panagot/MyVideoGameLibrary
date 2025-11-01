import { useState, useRef } from 'react'
import './PhotoUpload.css'

function PhotoUpload({ photos = [], onChange, maxPhotos = 10 }) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    const remainingSlots = maxPhotos - photos.length
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxPhotos} photos allowed`)
      return
    }

    const filesArray = Array.from(files).slice(0, remainingSlots)
    
    filesArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // In production, upload to server and get URL
          // For now, use data URL
          onChange([...photos, e.target.result])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onChange(newPhotos)
  }

  const movePhoto = (fromIndex, toIndex) => {
    const newPhotos = [...photos]
    const [removed] = newPhotos.splice(fromIndex, 1)
    newPhotos.splice(toIndex, 0, removed)
    onChange(newPhotos)
  }

  return (
    <div className="photo-upload-container">
      <div className="photos-grid">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo} alt={`Photo ${index + 1}`} />
            <button
              type="button"
              className="photo-remove"
              onClick={() => removePhoto(index)}
              aria-label="Remove photo"
            >
              ×
            </button>
            {index > 0 && (
              <button
                type="button"
                className="photo-move photo-move-left"
                onClick={() => movePhoto(index, index - 1)}
                aria-label="Move left"
              >
                ←
              </button>
            )}
            {index < photos.length - 1 && (
              <button
                type="button"
                className="photo-move photo-move-right"
                onClick={() => movePhoto(index, index + 1)}
                aria-label="Move right"
              >
                →
              </button>
            )}
          </div>
        ))}
      </div>

      {photos.length < maxPhotos && (
        <div
          className={`photo-upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          <div className="upload-icon">📸</div>
          <p className="upload-text">
            {dragActive ? 'Drop photos here' : 'Click or drag photos here'}
          </p>
          <p className="upload-hint">
            {photos.length}/{maxPhotos} photos • Supports JPG, PNG, WebP
          </p>
        </div>
      )}

      {photos.length > 0 && (
        <div className="photo-url-input">
          <label htmlFor="photoUrl">Or add photo by URL:</label>
          <input
            type="url"
            id="photoUrl"
            placeholder="https://example.com/photo.jpg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                if (photos.length < maxPhotos) {
                  onChange([...photos, e.target.value.trim()])
                  e.target.value = ''
                }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

export default PhotoUpload

