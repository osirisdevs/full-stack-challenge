import React from "react";

const EmployeeView = ({ employeeData, modalCb }) => (
  <div>
    <h4>PERFORMANCE REVIEWS</h4>
    <table className="table table-dark">
      <thead>
        <tr>
          <th className="text-center" scope="col">
            Reviewee
          </th>
          <th className="text-center" scope="col">
            Completed
          </th>
          <th className="text-center" scope="col">
            Edit
          </th>
        </tr>
      </thead>
      <tbody>
        {employeeData.map((reviewFeedback, i) => (
          <tr key={i}>
            <td>{reviewFeedback.performanceReview.reviewee.username}</td>
            <td>{!!reviewFeedback.feedback ? "Y" : "N"}</td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => {
                  modalCb({
                    model: "ReviewFeedback",
                    data: {
                      feedback: reviewFeedback.feedback,
                      reviewer: reviewFeedback.reviewer.username,
                      performanceReview: reviewFeedback.performanceReview.reviewee.username,
                      url: reviewFeedback.url,
                    },
                  });
                }}
              >
                EDIT
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EmployeeView;
