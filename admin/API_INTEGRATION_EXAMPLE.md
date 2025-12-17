# API Integration & Confirmation Modal Usage Guide

## Overview
This guide shows how to use the API services and Confirmation Modal component in your React application.

## Files Created

### 1. API Service (`src/services/apiservices.js`)
- `createCompetition(data)` - POST request to create competition
- `getFieldById(fieldId)` - GET request to retrieve field details

### 2. Confirmation Modal (`src/components/ConfirmationModal.jsx`)
- Reusable modal component with success/error states
- Smooth animations and backdrop blur
- Keyboard support (Escape to close)

## Usage Examples

### Example 1: Using `createCompetition` in CreateCompetitionStep4

```jsx
import { createCompetition } from '../services/apiservices';
import ConfirmationModal from './ConfirmationModal';

const CreateCompetitionStep4 = ({ onBack, onSubmit, competitionData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    details: ''
  });

  const handlePublish = async () => {
    setIsSubmitting(true);
    
    try {
      const apiData = {
        competitionName: competitionData.competitionName,
        level: competitionData.level,
        sport: competitionData.sport,
        maxTeams: parseInt(competitionData.maxTeams),
        entryFee: parseFloat(competitionData.entryFee),
        startDate: competitionData.startDate,
        endDate: competitionData.endDate,
        // ... other fields
      };
      
      const result = await createCompetition(apiData);
      
      if (result.success) {
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Competition Created!',
          message: result.message,
          details: `Competition "${competitionData.competitionName}" is now live.`
        });
      } else {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Failed to Create Competition',
          message: result.message,
          details: result.error
        });
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred.',
        details: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        details={modalState.details}
        onConfirm={() => setModalState({ ...modalState, isOpen: false })}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        confirmText="OK"
        closeText="Close"
      />
      {/* Your form JSX */}
    </>
  );
};
```

### Example 2: Using `getFieldById` to Fetch Field Details

```jsx
import { getFieldById } from '../services/apiservices';
import { useState, useEffect } from 'react';

const VenueSelector = ({ fieldId }) => {
  const [fieldData, setFieldData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchField = async () => {
      if (!fieldId) return;
      
      setLoading(true);
      setError(null);
      
      const result = await getFieldById(fieldId);
      
      if (result.success) {
        setFieldData(result.data);
      } else {
        setError(result.message);
      }
      
      setLoading(false);
    };

    fetchField();
  }, [fieldId]);

  if (loading) return <div>Loading field details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!fieldData) return null;

  return (
    <div>
      <h3>{fieldData.name}</h3>
      <p>{fieldData.location}</p>
      {/* Render other field details */}
    </div>
  );
};
```

### Example 3: Confirmation Modal with Custom Actions

```jsx
import ConfirmationModal from './ConfirmationModal';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    setShowModal({
      isOpen: true,
      type: 'error',
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this competition?',
      details: 'This action cannot be undone.'
    });
  };

  const handleConfirmDelete = async () => {
    // Perform deletion
    await deleteCompetition();
    setShowModal({ ...showModal, isOpen: false });
    // Redirect or refresh
  };

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      
      <ConfirmationModal
        isOpen={showModal.isOpen}
        type={showModal.type}
        title={showModal.title}
        message={showModal.message}
        details={showModal.details}
        onConfirm={handleConfirmDelete}
        onClose={() => setShowModal({ ...showModal, isOpen: false })}
        confirmText="Yes, Delete"
        closeText="Cancel"
      />
    </>
  );
};
```

## API Response Format

### Success Response
```javascript
{
  success: true,
  data: { /* API response data */ },
  message: "Competition created successfully!"
}
```

### Error Response
```javascript
{
  success: false,
  error: { /* Error details */ },
  message: "Error message",
  status: 400 // HTTP status code (if available)
}
```

## Confirmation Modal Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | boolean | Yes | - | Controls modal visibility |
| `type` | string | No | 'success' | 'success' or 'error' |
| `title` | string | No | Auto | Modal title |
| `message` | string | Yes | - | Main message |
| `details` | string | No | - | Additional details |
| `onConfirm` | function | No | - | Confirm button callback |
| `onClose` | function | Yes | - | Close button callback |
| `confirmText` | string | No | 'Confirm' | Confirm button text |
| `closeText` | string | No | 'Close' | Close button text |

## Error Handling

The API service handles three types of errors:

1. **Server Error** (4xx, 5xx): Returns error response with status code
2. **Network Error**: No response received from server
3. **Request Error**: Error in request setup

All errors are caught and returned in a consistent format for easy handling.

## Notes

- The API service uses `axios` for HTTP requests
- Timeout is set to 30 seconds for POST requests and 15 seconds for GET requests
- The modal prevents body scroll when open
- Modal can be closed with Escape key
- All animations use Tailwind CSS classes

