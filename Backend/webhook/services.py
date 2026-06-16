import base64
import requests
from django.conf import settings

TEMPLATE_PROMPTS = {
    'simple': "Generate a simple README.md with: title, short description, and usage.",
    'opensource': "Generate an open source README.md with: title, description, features, installation, usage, contributing, and license sections.",
    'professional': "Generate a professional README.md with: title, badges, description, features, tech stack, installation, usage, API reference, and license sections.",
}

REQUIRED_SECTIONS = ['installation', 'usage', 'description', 'features', 'license']


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


def generate_readme_with_ai(repo_name, commit_message, file_contents, template='simple'):
    from groq import Groq
    client = Groq(api_key=settings.GROQ_API_KEY)

    file_summary = "\n\n".join(
        f"### {path}\n```\n{content[:500]}\n```"
        for path, content in file_contents.items()
    )

    template_instruction = TEMPLATE_PROMPTS.get(template, TEMPLATE_PROMPTS['simple'])

    prompt = f"""You are a technical documentation expert.
Repository: {repo_name}
Commit message: {commit_message}

Changed files:
{file_summary}

{template_instruction}
Output only the markdown content."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )
    return response.choices[0].message.content


def check_missing_sections(readme_content):
    readme_lower = readme_content.lower()
    suggestions = []
    for section in REQUIRED_SECTIONS:
        if section not in readme_lower:
            suggestions.append(f"Add a '{section.capitalize()}' section to improve your README.")
    return suggestions


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
