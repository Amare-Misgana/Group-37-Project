import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setAssignments([
      {
        id: 1,
        title: "Blockchain #3",
        description: "Complete exercises 1-15 from Chapter 5",
        subject: "crypto",
        dueDate: "2024-01-15",
        status: "active",
        submissions: 18,
        totalStudents: 24,
        createdAt: "2024-01-10",
      },
      {
        id: 2,
        title: "react",
        description: "Write a detailed report on the titration experiment",
        subject: "react",
        dueDate: "2024-01-20",
        status: "active",
        submissions: 12,
        totalStudents: 24,
        createdAt: "2024-01-12",
      },
      {
        id: 3,
        title: "python Quiz",
        description: "Online quiz covering Newton's Laws",
        subject: "Python",
        dueDate: "2024-01-18",
        status: "completed",
        submissions: 24,
        totalStudents: 24,
        createdAt: "2024-01-08",
      },
    ]);
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    status: "active",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAssignment) {
      // Update existing assignment
      setAssignments(
        assignments.map((assignment) =>
          assignment.id === editingAssignment.id
            ? { ...assignment, ...formData }
            : assignment
        )
      );
      setEditingAssignment(null);
    } else {
      // Add new assignment
      const newAssignment = {
        id: Date.now(),
        ...formData,
        submissions: 0,
        totalStudents: 24,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setAssignments([...assignments, newAssignment]);
    }
    setShowForm(false);
    setFormData({
      title: "",
      description: "",
      subject: "",
      dueDate: "",
      status: "active",
    });
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData(assignment);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "completed":
        return "status-completed";
      case "draft":
        return "status-draft";
      default:
        return "";
    }
  };

  return (
    <div className="assignments">
      <div className="page-header">
        <h1>Assignments</h1>
        <button className="add-button" onClick={() => setShowForm(true)}>
          <FiPlus />
          New Assignment
        </button>
      </div>

      {/* Assignment Form */}
      {showForm && (
        <div className="assignment-form-section">
          <h2>
            {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
          </h2>
          <form onSubmit={handleSubmit} className="assignment-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingAssignment ? "Update Assignment" : "Create Assignment"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAssignment(null);
                  setFormData({
                    title: "",
                    description: "",
                    subject: "",
                    dueDate: "",
                    status: "active",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="assignments-grid">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <h3>{assignment.title}</h3>
              <span
                className={`status-badge ${getStatusColor(assignment.status)}`}
              >
                {assignment.status}
              </span>
            </div>

            <div className="assignment-meta">
              <span className="subject">{assignment.subject}</span>
              <span className="due-date">Due: {assignment.dueDate}</span>
            </div>

            <p className="assignment-description">{assignment.description}</p>

            <div className="assignment-stats">
              <div className="stat-item">
                <span className="stat-label">Submissions:</span>
                <span className="stat-value">
                  {assignment.submissions}/{assignment.totalStudents}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Progress:</span>
                <span className="stat-value">
                  {Math.round(
                    (assignment.submissions / assignment.totalStudents) * 100
                  )}
                  %
                </span>
              </div>
            </div>

            <div className="assignment-actions">
              <button
                className="action-button view"
                onClick={() => console.log("View assignment:", assignment.id)}
              >
                <FiEye />
                View
              </button>
              <button
                className="action-button edit"
                onClick={() => handleEdit(assignment)}
              >
                <FiEdit />
                Edit
              </button>
              <button
                className="action-button delete"
                onClick={() => handleDelete(assignment.id)}
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="no-assignments">
          <p>No assignments created yet. Create your first assignment!</p>
        </div>
      )}
    </div>
  );
};

export default Assignments;
