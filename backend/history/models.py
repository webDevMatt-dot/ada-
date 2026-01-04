from django.db import models

from django.utils import timezone

class HistoryEvent(models.Model):
    year = models.IntegerField(help_text="Year of the event (e.g. 1990)", null=True, blank=True)
    date = models.DateField(default=timezone.now, help_text="Specific date of the event")
    title = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if self.date:
            self.year = self.date.year
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.year} - {self.title}"
