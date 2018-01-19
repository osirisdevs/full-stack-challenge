import React from 'react';
import Form from 'react-jsonschema-form';
import Modal from 'react-modal';

const getSchemaForModel = model => {
  if (model === 'User') {
    return {
      type: 'object',
      'properties': {
        username: {
          type: 'string',
          title: 'Username'
        },
        password: {
          type: 'string',
          title: 'Password',
        },
        email: {
          type: 'string',
          title: 'Email',
          format: 'email'
        }
      },
      required: ['username', 'password', 'email'],
    }
  } else if (model === 'ReviewFeedback') {
    return {
      type: 'object',
      'properties': {
        feedback: {
          type: 'string',
          title: 'Feedback'
        },
        reviewer: {
          type: 'string',
          title: 'Reviewer',
        },
        performanceReview: {
          type: 'string',
          title: 'Performance Review For',
        }
      },
      required: ['reviewer', 'performanceReview'],
    }
  } else if (model === 'PerformanceReview') { // will always be new instance
    return {
      type: 'object',
      'properties': {
        reviewee: {
          type: 'string',
          title: 'For (username of reviewee)'
        },
      },
      required: ['reviewee'],
    }
  }
  return null
};

const getUiSchemaForModel = (model, newInstance) => {
  if (model === 'User') {
    if (newInstance) {
      return {
        'ui:order': ['username', 'email', 'password'],
        password: {
          'ui:widget': 'password',
        }
      };
    } else {
      return {
        'ui:order': ['username', 'email', 'password'],
        password: {
          'ui:widget': 'password',
        },
        username: { 'ui:disabled': true }
      };
    }
  } else if (model === 'ReviewFeedback') {
    if (newInstance) {
      return {
        'ui:order': ['performanceReview', 'reviewer', 'feedback'],
        feedback: {
          'ui:widget': 'hidden',
        },
        'performanceReview': { 'ui:disabled': true }
      };
    } else {
      return {
        'ui:order': ['performanceReview', 'reviewer', 'feedback'],
        feedback: {
          'ui:widget': 'textarea',
        },
        'reviewer': { 'ui:disabled': true },
        'performanceReview': { 'ui:disabled': true }
      };
    }
  } else if (model === 'PerformanceReview') { // will always be new instance
    return {};
  }
  return null
};

const AppModal = ({ model, closeModal, newInstance, data, submitHandler }) => (
  <Modal
    isOpen={!!model}
    onRequestClose={closeModal}
    style={{
      content: {
        position: 'fixed',
        top: '10%',
        bottom: '15%',
        maxHeight: '65%',
        padding: 0,
        maxWidth: 850,
        marginLeft: 'auto',
        marginRight: 'auto',

        border: '1px solid rgba(0, 0, 0, 0.3)',
        boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
      },
  }}
    parentSelector={() => document.querySelector('.App')}
  >
    {model && <Form
      schema={getSchemaForModel(model)}
      uiSchema={getUiSchemaForModel(model, newInstance)}
      formData={data}
      onSubmit={submitHandler}
    />}
  </Modal>
);

export default AppModal;
