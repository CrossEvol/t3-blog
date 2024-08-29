import { env } from "@/env";
import { format } from "date-fns";
import { Octokit } from "octokit";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: env.GITHUB_STORE_TOKEN,
});

export const getImageFromGithub = async (file: File) => {
  try {
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: env.GITHUB_STORE_OWNER,
        repo: env.GITHUB_STORE_REPO,
        path: `${env.GITHUB_STORE_PATH_PREFIX}${format(
          new Date(),
          "yyyy-MM-dd",
        )}/${file.name}`,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    return (res.data as GitGetRepoResponse).download_url;
  } catch (error) {
    return undefined;
  }
};

export const upload2Github = async (file: File) => {
  const fileBuffer = await file.arrayBuffer();
  // Convert the file buffer to a Buffer object
  const buffer = Buffer.from(fileBuffer);

  // Encode the buffer to Base64
  const base64Encoded = buffer.toString("base64");

  try {
    const res = await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: env.GITHUB_STORE_OWNER,
        repo: env.GITHUB_STORE_REPO,
        path: `${env.GITHUB_STORE_PATH_PREFIX}${format(
          new Date(),
          "yyyy-MM-dd",
        )}/${file.name}`,
        message: "my commit message",
        committer: {
          name: "Monalisa Octocat",
          email: "octocat@github.com",
        },
        content: base64Encoded,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    return res.data.content?.download_url;
  } catch (error) {
    throw error;
  }
};

type GitGetRepoResponse = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  _links: Links;
};

type Links = {
  self: string;
  git: string;
  html: string;
};
