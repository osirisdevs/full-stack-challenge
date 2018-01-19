import React from "react";

const AdminView = ({
  adminDataUsers,
  adminDataPerformanceReviews,
  modalCb,
  deleteUserCb,
  deletePerformanceReviewCb,
  deleteReviewFeedbackCb,
}) => (
  <div>
    <h4>USERS</h4>
    <table className="table table-dark">
      <thead>
        <tr>
          <th scope="col">
            Username
          </th>
          <th scope="col">
            Edit
          </th>
          <th scope="col">
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {adminDataUsers.map(user => (
          <tr key={user.username}>
            <td>{user.username}</td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => {
                  modalCb({
                    model: "User",
                    data: { ...user, password: "" }, // make password blank so it has to be re-entered (since stored password is hashed form)
                  });
                }}
              >
                EDIT
              </button>
            </td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteUserCb(user.url).then(() => window.location.reload());
                }}
              >
                X
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button
      className="btn btn-primary"
      onClick={() => {
        modalCb({
          model: "User",
          data: {},
          newInstance: true,
        });
      }}
    >
      New User
    </button>
    <h4 style={{ marginTop: 60 }}>PERFORMANCE REVIEWS</h4>
    <table className="table table-dark">
      <thead>
        <tr>
          <th scope="col">
            For
          </th>
          <th scope="col">
            Reviewers
          </th>
          <th scope="col">
            Add Reviewer
          </th>
          <th scope="col">
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {adminDataPerformanceReviews.map((performanceReview, i) => (
          <tr key={i}>
            <td>{performanceReview.reviewee.username}</td>
            <td>
              {performanceReview.reviewfeedback_set.map((review, j) => (
                <div key={j}>
                  <button
                    className={`btn btn-sm btn-${review.feedback ? 'success' : 'default'}`}
                    style={{ textTransform: "none" }}
                    onClick={() => {
                      modalCb({
                        model: "ReviewFeedback",
                        data: {
                          feedback: review.feedback,
                          reviewer: review.reviewer.username,
                          performanceReview: performanceReview.reviewee.username,
                          url: review.url,
                        },
                      });
                    }}
                  >
                    {review.reviewer.username}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      deleteReviewFeedbackCb(review.url).then(() => window.location.reload());
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => {
                  modalCb({
                    model: "ReviewFeedback",
                    data: {
                      performanceReview: performanceReview.reviewee.username,
                      performanceReviewId: performanceReview.pk,
                    },
                    newInstance: true,
                  });
                }}
              >
                +
              </button>
            </td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deletePerformanceReviewCb(performanceReview.url).then(() =>
                    window.location.reload(),
                  );
                }}
              >
                X
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button
      className="btn btn-primary"
      onClick={() => {
        modalCb({
          model: "PerformanceReview",
          data: {},
          newInstance: true,
        });
      }}
    >
      New Review
    </button>
  </div>
);

export default AdminView;
