from django.db import models
from django.contrib.auth.models import User

class Update(models.Model):
    CATEGORY_CHOICES = [
        ('video', 'Video'),
        ('announcement', 'Announcement'),
        ('newsletter', 'Newsletter'),
        ('gallery', 'Gallery'),
        ('apostle', "Apostle's Update"),
    ]

    # Department choices to match UserProfile
    TEAM_CHOICES = [
        ('HQ', 'HQ'),
        ('Youth Ministry', 'Youth Ministry'),
        ('BOT', 'BOT'),
        ('GOQ', 'GOQ'),
        ('Men of Integrity', 'Men of Integrity'),
        ('Go-Quickly', 'Go-Quickly'),
        ('Child Evangelism', 'Child Evangelism'),
        ('Apostle\'s Update Team', 'Apostle\'s Update Team'),
        ('FABM Team', 'FABM Team'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('live', 'Live'),
        ('review', 'Resent for Review'),
        ('inactive', 'Inactive'),
        ('deleted', 'Deleted'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='updates/')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    team = models.CharField(max_length=100, choices=TEAM_CHOICES, default='HQ')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Auto-assign team based on UserProfile department
        if self.created_by:
            if hasattr(self.created_by, 'profile'):
                self.team = self.created_by.profile.department
            
            # Auto-approve (Live) if Superuser or HQ, ONLY if it's a new instance or currently pending
            # logic: if it's new, set based on user. if existing, don't override unless specific transition needed.
            # simpler approach: if it is pending and user is superuser/HQ, make it live.
            if not self.pk and (self.created_by.is_superuser or self.team == 'HQ'):
                self.status = 'live'

        elif not self.team: # Fallback
            self.team = 'HQ'
            if not self.pk:
                self.status = 'live' # System/Fallback updates auto-approved
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
