document.addEventListener("DOMContentLoaded", function() {
  const searchButton = document.getElementById('search-btn');
  const userNameInput = document.getElementById('user-input');
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".card-stats-container");

  // Event listener for the search button click event
  searchButton.addEventListener("click", function() {
    const username = userNameInput.value;
    console.log("Logging username:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username); // Call fetchUserDetails with the username
    }
  });

  // Function to validate username input
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_]{4,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid username");
    }
    return isMatching;
  }

  // Function to fetch user details from LeetCode using GraphQL
  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching..."; // Show loading state
      searchButton.disabled = true;

      // Proxy URL and target URL for the request
      const proxyUrl = 'https://corsp-anywhere.herokuapp.com/';
      const targetUrl = 'https://leetcode.com/graphql/';

      // Set headers for the request
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // GraphQL query to fetch user's progress and submission stats
      const graphql = JSON.stringify({
        query: `
          query userSessionProgress($username: String!) {
            allQuestionsCount {
              difficulty
              count
            }
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
                totalSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
            }
          }
        `,
        variables: { "username": username }
      });

      // Fetch request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
      };

      // Fetch response from LeetCode GraphQL API
      const response = await fetch(proxyUrl + targetUrl, requestOptions);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unable to fetch user details: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const parseData = await response.json();
      console.log("Logging data:", parseData);

      // Call the display function to show fetched data
      displayUserData(parseData);

    } catch (error) {
      statsContainer.innerHTML = '<p>Error displaying stats. Please try again.</p>'; // Show error message
      console.error("Error in fetching data:", error);
    } finally {
      searchButton.textContent = "Search"; // Reset button state
      searchButton.disabled = false; // Re-enable button
    }
  }

  // Function to display user data (progress and submission stats)
  function displayUserData(parseData) {
    // Extract total and solved questions from the response
    const totalQues = parseData.data.allQuestionsCount[0].count;
    const totalEasyQues = parseData.data.allQuestionsCount[1].count;
    const totalMediumQues = parseData.data.allQuestionsCount[2].count;
    const totalHardQues = parseData.data.allQuestionsCount[3].count;

    const solvedTotalQues = parseData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQues = parseData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQues = parseData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQues = parseData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    // Update progress circles for each difficulty level
    updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

    // Prepare and render data for total submissions
    const cardData = [
      { label: "Overall Submissions", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
      { label: "Overall Easy Submissions", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
      { label: "Overall Medium Submissions", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
      { label: "Overall Hard Submissions", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions }
    ];

    // Render card stats in the card-stats-container
    cardStatsContainer.innerHTML = cardData.map(data => `
      <div class="card">
        <h3>${data.label}</h3>
        <p>${data.value}</p>
      </div>
    `).join("");
  }

  // Function to update the progress bar for each difficulty level
  function updateProgress(solved, total, label, circle) {
    // Calculate the percentage and update the progress bar
    const progressPercentage = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressPercentage}%`);
    label.textContent = `${solved}/${total}`;
  }
});
