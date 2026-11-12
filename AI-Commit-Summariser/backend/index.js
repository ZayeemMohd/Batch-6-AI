import genAISummary from "./lib/genAISummary.js";
import generateDiff from "./lib/generateDiff.js";
import getCommits from "./lib/getCommits.js";

export async function main(githubURL) {
  // step 1
  // commits fetch
 
  const commitsArray = await getCommits(githubURL);
  console.log("Commits for GithubURL fetched successfully...")


  // step 2: generate diff for each commit in commit array
  // find the diff of each commit
  // [Promise, Promise, Promise]
  const diffArrayPromise = commitsArray.map(async (commitObj, index) => {
    console.log("Generating Diff for commit: ", index)
    const diff = await generateDiff(githubURL, commitObj.sha);
    return diff;
  });

  const finalDiffArray = await Promise.all(diffArrayPromise);



  // Step 3: generate summary for each diff
  // generate the summary

  const summaryArrayPromise = finalDiffArray.map(async (diffString, index) => {
    console.log("Generating summary for commit: ", index)
    const summary = await genAISummary(diffString);
    return summary;
  });

  const FinalSummaryArray = await Promise.all(summaryArrayPromise);
  console.log("summary array generated", FinalSummaryArray.length);


  // step 4: on summary array attach the meta data of that commit
  // finalDataArray
  const FinalDataArray = FinalSummaryArray.map((summaryText, index) => {
    return {
      summary: summaryText,
      commitHash: commitsArray[index]?.sha,
      commitMessage: commitsArray[index]?.commit?.message,
      commitAuthorName: commitsArray[index]?.commit?.author?.name,
      commitAuthorImg: commitsArray[index]?.author?.avatar_url,
      commitDate: commitsArray[index]?.commit?.author?.date,
    };
  });

  return FinalDataArray;
}

// main("https://github.com/ZayeemMohd/small-test");
