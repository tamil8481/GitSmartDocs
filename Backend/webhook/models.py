from django.db import models


class PushEvent(models.Model):
    repo_name = models.CharField(max_length=255)
    commit_message = models.TextField()
    modified_files = models.JSONField(default=list)
    generated_readme = models.TextField(blank=True)
    pushed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.repo_name} - {self.pushed_at}"
