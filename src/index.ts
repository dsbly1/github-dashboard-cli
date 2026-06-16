import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

const USERNAME = process.argv[2] || 'dsbly1';
const GITHUB_API = 'https://api.github.com';

interface Repo {
  name: string;
  stargazers_count: number;
  language: string | null;
  description: string | null;
  html_url: string;
}

interface GitHubUser {
  login: string;
  name: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

async function fetchGitHubStats(username: string): Promise<void> {
  const spinner = ora(`Fetching GitHub stats for ${chalk.blue(username)}...`).start();

  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get<GitHubUser>(`${GITHUB_API}/users/${username}`),
      axios.get<Repo[]>(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=stars`)
    ]);

    const user = userRes.data;
    const repos = reposRes.data;

    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    const langCount: Record<string, number> = {};
    repos.forEach(r => {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });
    const topLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang)
      .join(', ');

    spinner.succeed('Done!');

    console.log('');
    console.log(chalk.blue.bold('━'.repeat(50)));
    console.log(chalk.blue.bold(`  GitHub Dashboard: ${user.name || user.login}`));
    console.log(chalk.blue.bold('━'.repeat(50)));
    console.log(chalk.white(`  👤 Username:     ${chalk.cyan(user.login)}`));
    console.log(chalk.white(`  📦 Public Repos: ${chalk.cyan(user.public_repos)}`));
    console.log(chalk.white(`  ⭐ Total Stars:  ${chalk.yellow(totalStars)}`));
    console.log(chalk.white(`  👥 Followers:    ${chalk.cyan(user.followers)}`));
    console.log(chalk.white(`  🔤 Top Languages:${chalk.green(' ' + topLangs)}`));
    if (user.bio) console.log(chalk.white(`  💬 Bio:          ${chalk.gray(user.bio)}`));
    console.log(chalk.blue.bold('━'.repeat(50)));

    console.log('');
    console.log(chalk.blue.bold('  ⭐ Top 5 Repos by Stars'));
    console.log(chalk.blue('─'.repeat(50)));

    repos.slice(0, 5).forEach((r, i) => {
      console.log(
        chalk.white(`  ${i + 1}. ${r.name.padEnd(35)}`) +
        chalk.yellow(`${r.stargazers_count} ★`)
      );
      if (r.description) {
        console.log(chalk.gray(`     ${r.description.slice(0, 60)}`));
      }
    });

    console.log(chalk.blue.bold('━'.repeat(50)));
    console.log('');

  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      spinner.fail(chalk.red(`User "${username}" not found on GitHub.`));
    } else {
      spinner.fail(chalk.red('Failed to fetch GitHub data. Check your connection.'));
    }
    process.exit(1);
  }
}

fetchGitHubStats(USERNAME);