# Apollo Quotes

### Progress Checklist

#### Client

- [x] Set up Apollo Client
- [x] Set up Apollo Cache
- [x] Set up global styles
- [x] User login
- [x] User sign up
- [ ] User can:
  - [ ] Submit quote
  - [ ] Edit submitted quote
  - [x] Like a quote
  - [ ] Delete a quote
  - [ ] View quotes liked
  - [ ] View quotes submitted
- [ ] Restrict editting, deleting and submitting to authorised users
- [x] View feed of quotes
- [x] View feed of quotes by tag
- [x] View individual quote
- [ ] Set up routing
- [ ] Set up dark theme
- [x] Set up light theme
- [ ] Responsive Design
- [ ] Password reset
- [ ] Deploy

#### Server

- [x] Set up Apollo Server + Express
- [x] Set up Mongo DB connection
- [x] Create Mongoose models
- [x] Define GraphQL schema
- [x] Set up JWT authentication
- [x] Create seed file and function
- [x] Set up to store JWT in Cookies
- [ ] Mutations
  - [ ] Quotes
    - [x] Create quote
      - [x] Create slug for when quote is being created to allow sharing on client
      - [x] Set up Cloudinary to allow image uploads when creating quotes
    - [x] Update quote
    - [x] Delete quote
    - [x] Like a quote
    - [x] Unlike a quote
  - [ ] User
    - [x] Create user
    - [x] Login
- [ ] Queries
  - [x] Feed
  - [x] Feed by Tag
  - [x] User information including quotes liked and quotes submitted
  - [x] Set up cursor-based pagination
- [ ] Subscription
  - [ ] Subscribe to new quotes
  - [ ] Subscribe to new likes
- [ ] Password reset
- [ ] Deploy
