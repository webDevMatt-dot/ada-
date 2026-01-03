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

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='updates/')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    team = models.CharField(max_length=100, choices=TEAM_CHOICES, default='HQ')
    is_approved = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Auto-assign team based on UserProfile department
        if self.created_by:
            if hasattr(self.created_by, 'profile'):
                self.team = self.created_by.profile.department
            
            # Auto-approve if Superuser or HQ
            if self.created_by.is_superuser or self.team == 'HQ':
                self.is_approved = True

        elif not self.team: # Fallback
            self.team = 'HQ'
            self.is_approved = True # System/Fallback updates auto-approved
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
