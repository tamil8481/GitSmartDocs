import base64
import requests
from django.conf import settings


def fetch_file_contents(repo_full_name, file_paths, token):
    headers = {"Authorization": f"token {token}"}
    contents = {}
    for path in file_paths[:5]:
        url = f"https://api.github.com/repos/{repo_full_name}/contents/{path}"
        res = requests.get(url, headers=headers)
        if res.status_code == 200:
            data = res.json()
            if data.get("encoding") == "base64":
                contents[path] = base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    return contents


def generate_readme_with_ai(repo_name, commit_message, file_contents):
    from groq import Groq
    client = Groq(api_key=settings.GROQ_API_KEY)

    file_summary = "\n\n".join(
        f"### {path}\n```\n{content[:500]}\n```"
        for path, content in file_contents.items()
    )

    prompt = f"""You are a technical documentation expert.
A developer just pushed code to the repository: {repo_name}
Commit message: {commit_message}

Changed files:
{file_summary}

Generate a concise, professional README.md for this repository based on the above changes.
Include: Project title, description, features, setup instructions, and usage.
Output only the markdown content."""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )
    return response.choices[0].message.content


def update_github_readme(repo_full_name, new_content, token):
    headers = {"Authorization": f"token {token}"}
    url = f"https://api.github.com/repos/{repo_full_name}/contents/README.md"

    res = requests.get(url, headers=headers)
    sha = res.json().get("sha") if res.status_code == 200 else None

    encoded = base64.b64encode(new_content.encode()).decode()
    payload = {
        "message": "docs: auto-update README via GitSmart Docs",
        "content": encoded,
    }
    if sha:
        payload["sha"] = sha

    requests.put(url, json=payload, headers=headers)
