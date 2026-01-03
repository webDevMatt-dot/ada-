from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    DEPARTMENT_CHOICES = [
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

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    department = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES, default='HQ')

    def __str__(self):
        return f"{self.user.username} - {self.department}"
