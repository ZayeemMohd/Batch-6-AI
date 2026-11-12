PROMPT: Hey AI, I am building frontend for my application "AI-COMMIT-SUMMARISER". I have already created backend for it and the backend is fully functional. Now, I want to creat frontend for that application, I have already initialized empty vite project, create a frontend in this folder. Use taiwind css. Keep the theme simple, use github inspired UI. Don't use generic fonts, import fonts from google. Since my project is realed to Github I want the UI to look close to the github UI. Add both dark and light theme.

FRONTEND IMPORTANT TASKS:

- Create a beautiful Home Page with an attaractive Hero Section with GITHUB inspired UI Design theme
- Create Singin and Singup Pages, for data you can take reference from the API Documentation From the attached README.md.
- Create "Generate summary page" where there should be an input box where user gives the githubURL and there should be a "send/generate commit summary" button. When user clicks the button the API call should send at backend, backend will generate summary/data, until it reaches the frontend show a beautiful shimmer based on the Summary commit component.
- For Smmary Commit Component I have attached a png image you can refer that design for inspiration.
- As soon as backend respond with the summary data, create these components and show them below the input box in a beautiful way. NOTE: Keep the previously generated commits below the input box at this page until the user submits and generates a new githubURL and summary. you can save that it localstorage or you can fetch from db and show the lastest.

- Create another page to show history or to show all the previously generated commits with their corresponding GITHUBURL, use accordian for this, add the GITHUBURL in the accordian body and the commits in the accordian UI, you should fetch the backend for this data, and backend is designed to serve this usecase.

- backend folder is the sibling of frontend folder, you can look at it if you need or if you want to update anything.
