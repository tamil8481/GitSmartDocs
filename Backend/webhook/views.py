from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import PushEvent
from .services import fetch_file_contents, generate_readme_with_ai, update_github_readme


@api_view(['POST'])
def github_webhook(request):
    data = request.data
    repo = data.get('repository', {})
    head_commit = data.get('head_commit', {})

    repo_name = repo.get('name', '')
    repo_full_name = repo.get('full_name', '')
    commit_message = head_commit.get('message', '')
    modified_files = head_commit.get('modified', []) + head_commit.get('added', [])

    print(f"\n===== GitSmart Docs =====")
    print(f"Repo: {repo_full_name} | Commit: {commit_message}")
    print(f"Files: {modified_files}")

    token = settings.GITHUB_TOKEN
    file_contents = fetch_file_contents(repo_full_name, modified_files, token)
    readme = generate_readme_with_ai(repo_name, commit_message, file_contents)
    update_github_readme(repo_full_name, readme, token)

    PushEvent.objects.create(
        repo_name=repo_full_name,
        commit_message=commit_message,
        modified_files=modified_files,
        generated_readme=readme,
    )

    return Response({"message": "README updated successfully"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def push_history(request):
    events = PushEvent.objects.order_by('-pushed_at')[:20]
    data = [
        {
            "id": e.id,
            "repo_name": e.repo_name,
            "commit_message": e.commit_message,
            "modified_files": e.modified_files,
            "generated_readme": e.generated_readme,
            "pushed_at": e.pushed_at,
        }
        for e in events
    ]
    return Response(data)
