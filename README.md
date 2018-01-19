# Full Stack Developer Challenge
This is Oasis Vali's submission for the Paytm Labs interview challenge.

## Assumptions

1. Authentication system is required, as well as basic support for permissions to differentiate
between standard employee and admin user types.
2. Admin accounts creation can be handled outside the scope of the web application.
3. Employee account creation (and management) is handled via the Admin interface. Authentication
details (username, password) are provided by the Admin creating the account. This is an insecure
practice for a real-world application, but simplifies the project for the scope of the challenge (
especially since we do not have to implement a signup workflow).
4. Each performance review collects feedback on only one employee.
5. 1 or more employees can be assigned to provide feedback on another employee as part of a single
performance review.
6. The employee whose performance is being reviewed cannot be assigned to provide feedback for their
own performance review. However, the same employee can be asked to submit multiple reviews for another employee,
either as part of the same review or under seperate reviews.
7. Once feedback is submitted as part of a performance review, it can only be updated by an Admin.
8. There is no due date for the submission of a performance review (Although this would be a
probable enhancement). Similarly, more reviewers can be added to an existing performance review at
any time.
9. Using a development server for serving static resources and an embedded database is sufficient
for the challenge use-case as it simplifies the development setup.
10. Since this is a challenge, nice-to-haves such as unit testing, error handling etc. are not
prioritized
11. Since this is a challenge, with the focus being on development speed, certain performance
improvements are not prioritized such as paging, delta updates to redux state etc.
12. In case of concurrent updates, a last-write-wins approach will be used.
13. When an employee is deleted, all of their performance reviews are also deleted, as well as their
assigned reviews.
14. Browser support is not a major concern so we can use newer features of the spec without worrying
about backwards compatibility.

## Tech Choices

1. Django (with Python3) as backend framework - I have prior development experience with it. It also
has a batteries-included approach which will make it easier to get to an MVP for the challenge (e.g.
It provides an inbuilt authentication application with user and admin models).
2. Django REST framework is used on top of Django as it makes it easier to build a REST web API with
Django while enforcing best practices.
3. Django REST framework JWT provides JWT authentication support for the web API. It plugs into the
Django authentication application and extends the Django REST framework so that client-side requests
can be reliably authenticated.
4. Sqlite embedded database for the persistent store. It is lightweight, simple to setup and
integrates well with the Django ORM.
5. pip3 for managing python package dependencies
6. Create-React-App for bootstrapping the client-side Web App. It enforces industry best practices
and allows us to quickly prototype and iterate on the MVP. (Includes webpack, babel etc. for module
bundling)
7. Axios for making calls to the REST API from client side. It is a widely used library for AJAX
with a clean, readable Promise-based syntax.
8. Redux (with react-redux bindings) for state management on the Frontend.
9. Bootstrap paper for theming.
10. React-Router for client-side routing since we will be building a SPA.
11. React-Jsonschema-Form for building forms quickly.
12. React-modal for providing access to forms without requiring navigation.
13. Redux-thunk middleware for dispatching async actions.

## Design Decisions

1. Database structure (ORM models):
  * User - username, email, password (hashed)
  * Admin - username, email, password (hashed)
  * PerformanceReview - reviewee (fk to User)
  * ReviewFeedback - performanceReview (fk to PerformanceReview), reviewer (fk  to User), feedback

2. Redux state structure:
  * authReducer - tracks user authenticated state (JWT is also persisted in the localStorage)
  * adminReducer - keeps list of employees and performance reviews
  * employeeReducer - keeps list of performance reviews

3. REST API Routing:
  * POST `/login` { username, password } -> token
  * GET `/users` { token }
  * POST `/users/` { token, { username, email, password } }
  * PUT `/users/{userId}` { token, { email, password } }
  * DELETE `/users/{userId}` { token }
  * GET `/performance-reviews` { token }
  * POST `/performance-reviews/` { token, reviewee }
  * DELETE `/performance-reviews/{performanceReviewId}` { token }
  * GET `/review-feedbacks/` { token }
  * POST `/review-feedbacks/` { token, reviewer, performanceReviewId }
  * PUT `/review-feedbacks/{reviewFeedbackId}` { token, feedback }
  * DELETE `/review-feedbacks/{reviewFeedbackId}` { token }

4. SPA Router structure:
  * `/` - root, redirect to /login if not authenticated, otherwise redirect to /home
  * `/login` - show login form. If already authenticated, redirect to /home
  * `/home` - employee or admin home page. If not authenticated, redirect to /login

5. Client-side Data flow: To keep things simple and consistent, the data being displayed on the page
will be completely refreshed after any change is submitted. This is bad for performance but we can
assume that the number of employees and reviews in the system will not be extremely high for the MVP
. In any case, the Data flow can be optimized to incorporate delta updates in the future.

6. An easy mechanism for syncing and refreshing client-side app state is achieved by reloading then
entire app on any data update. This is very bad for performance and scalability, but makes the code
easier to reason about for an MVP.

## Quickstart

**Prerequisites**: node, npm, python3, pip3, sqlite3
(Ideally development should be taking place inside virtual environments. See **virtualenv** for
python3 and **nvm** for node)

1. Install dependencies
```
cd backend/
pip3 install -r requirements.txt
cd ../frontend/
npm install
cd ..
```

2. Run the frontend server
```
cd frontend/
npm run start
```

3. In a new terminal, create initial admin account
```
cd backend/api/
python3 manage.py migrate
python3 manage.py createsuperuser --email {SOME_EMAIL} --username {SOME_USERNAME}
cd ../..
```

3. Run the backend server (which is the django development server):
```
cd backend/api/
python3 manage.py runserver
```

4. Access the app on localhost:3000 and the api on localhost:8000
