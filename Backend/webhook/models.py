from django.db import models


class RepoConfig(models.Model):
    TEMPLATE_CHOICES = [
        ('simple', 'Simple'),
        ('opensource', 'Open Source'),
        ('professional', 'Professional'),
    ]
    repo_full_name = models.CharField(max_length=255, unique=True)
    template = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='simple')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.repo_full_name} - {self.template}"


class PushEvent(models.Model):
    TEMPLATE_CHOICES = [
        ('simple', 'Simple'),
        ('opensource', 'Open Source'),
        ('professional', 'Professional'),
    ]
    repo_name = models.CharField(max_length=255)
    commit_message = models.TextField()
    modified_files = models.JSONField(default=list)
    generated_readme = models.TextField(blank=True)
    template = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='simple')
    suggestions = models.JSONField(default=list)
    pushed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.repo_name} - {self.pushed_at}"
