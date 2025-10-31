import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AddConsole.css'

function AddConsole() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    releaseDate: '',
    condition: 'excellent',
    notes: '',
    image: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement console addition logic
    console.log('Adding console:', formData)
    // After successful addition, navigate to collection
    navigate('/collection')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="add-console">
      <div className="form-header">
        <h1>Add New Console</h1>
        <p>Add a console to your collection</p>
      </div>

      <form onSubmit={handleSubmit} className="console-form">
        <div className="form-note">
          <span className="note-icon">💡</span>
          <span>Tip: Collectors often own multiple versions of the same console (different colors, special editions, etc.). Feel free to add each one separately!</span>
        </div>
        <div className="form-group">
          <label htmlFor="name">Console Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., PlayStation 5, Xbox Series X"
          />
        </div>

        <div className="form-group">
          <label htmlFor="manufacturer">Manufacturer *</label>
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
            placeholder="e.g., Sony, Microsoft, Nintendo"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="releaseDate">Release Date</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="excellent">Excellent</option>
              <option value="very-good">Very Good</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Console Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/console-image.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Any additional notes about this console..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/collection')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Console
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddConsole

