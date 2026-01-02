from django.db import models

class PrayerRequest(models.Model):
    CATEGORY_CHOICES = [
        ('Healing', 'Healing'),
        ('Family', 'Family'),
        ('Employment', 'Employment'),
        ('Spiritual Growth', 'Spiritual Growth'),
        ('Health', 'Health'),
        ('Guidance', 'Guidance'),
        ('Other', 'Other'),
    ]

    author = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    likes = models.PositiveIntegerField(default=0)
    is_viral = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.author} - {self.category}"
